import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:canman/components/input_field.dart';
import 'package:canman/services/firebase_service.dart';

class AddCustomerPage extends StatefulWidget {
  const AddCustomerPage({super.key});

  @override
  State<AddCustomerPage> createState() => _AddCustomerPageState();
}

class _AddCustomerPageState extends State<AddCustomerPage> {
  final _firebaseService = FirebaseService();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _locationController = TextEditingController();
  final _holdingController = TextEditingController();
  bool _isLoading = false;

  static const int _availableVolume = 96;

  String? _nameError;
  String? _phoneError;
  String? _locationError;
  String? _holdingError;
  bool _isValidatingPhone = false;

  void _validateField(
    String value,
    String fieldName,
    void Function(String?) setError,
  ) {
    if (value.trim().isEmpty) {
      setError('$fieldName is required');
    } else {
      setError(null);
    }
  }

  void _validatePhone(String value) async {
    if (value.isEmpty) {
      setState(() => _phoneError = 'Phone number is required');
      return;
    }

    if (value.length != 10) {
      setState(() => _phoneError = 'Phone number must be 10 digits');
      return;
    }

    setState(() {
      _isValidatingPhone = true;
      _phoneError = null;
    });

    try {
      final exists = await _firebaseService.isPhoneNumberExists(value);
      if (mounted) {
        setState(() {
          _isValidatingPhone = false;
          if (exists) {
            _phoneError = 'A customer with this phone number already exists';
          }
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isValidatingPhone = false;
          _phoneError = 'Failed to validate phone number';
        });
      }
    }
  }

  void _validateHolding(String value) {
    if (value.isEmpty) {
      setState(() => _holdingError = 'Current holding is required');
    } else if (int.tryParse(value) == null) {
      setState(() => _holdingError = 'Please enter a valid number');
    } else if (int.parse(value) > _availableVolume) {
      setState(
        () =>
            _holdingError =
                'Cannot exceed available volume of $_availableVolume',
      );
    } else if (int.parse(value) <= 0) {
      setState(() => _holdingError = 'Please enter a value greater than 0');
    } else {
      setState(() => _holdingError = null);
    }
  }

  bool _isFormValid() {
    _validateField(
      _nameController.text,
      'Name',
      (error) => setState(() => _nameError = error),
    );
    _validateField(
      _locationController.text,
      'Location',
      (error) => setState(() => _locationError = error),
    );
    _validatePhone(_phoneController.text);
    _validateHolding(_holdingController.text);

    return _nameError == null &&
        _phoneError == null &&
        _locationError == null &&
        _holdingError == null;
  }

  Future<void> _handleSubmit() async {
    if (_isFormValid()) {
      setState(() => _isLoading = true);
      try {
        await _firebaseService.addCustomer(
          name: _nameController.text,
          phone: _phoneController.text,
          location: _locationController.text,
          holding: int.parse(_holdingController.text),
        );
        if (mounted) {
          context.pop();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Customer added successfully')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Failed to add customer: $e')));
        }
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _locationController.dispose();
    _holdingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                IconButton(
                  onPressed: () => context.pop(),
                  icon: const Icon(Icons.arrow_back),
                ),
                const Spacer(),
                StreamBuilder<bool>(
                  stream: _firebaseService.onlineStatus,
                  builder: (context, snapshot) {
                    final isOnline = snapshot.data ?? false;
                    return Row(
                      children: [
                        Icon(
                          Icons.circle,
                          size: 12,
                          color: isOnline ? Colors.green : Colors.grey,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          isOnline ? 'Online' : 'Offline',
                          style: TextStyle(
                            color: isOnline ? Colors.green : Colors.grey,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(width: 16),
                      ],
                    );
                  },
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Add Customer',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 24),
                  InputField(
                    label: 'Name',
                    hintText: 'Enter customer name',
                    controller: _nameController,
                    isRequired: true,
                    errorText: _nameError,
                    onChanged:
                        (value) => _validateField(
                          value,
                          'Name',
                          (error) => setState(() => _nameError = error),
                        ),
                  ),
                  InputField(
                    label: 'Phone No.',
                    hintText: 'Enter phone number',
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(10),
                    ],
                    isRequired: true,
                    errorText: _phoneError,
                    onChanged: _validatePhone,
                    suffix:
                        _isValidatingPhone
                            ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                            : null,
                  ),
                  InputField(
                    label: 'Location',
                    hintText: 'Enter location',
                    controller: _locationController,
                    isRequired: true,
                    errorText: _locationError,
                    onChanged:
                        (value) => _validateField(
                          value,
                          'Location',
                          (error) => setState(() => _locationError = error),
                        ),
                  ),
                  InputField(
                    label: 'Current Holding',
                    hintText: 'Enter current holding',
                    controller: _holdingController,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    isRequired: true,
                    errorText: _holdingError,
                    onChanged: _validateHolding,
                    helperText: 'Available volume: $_availableVolume',
                  ),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _handleSubmit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child:
                          _isLoading
                              ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    Colors.white,
                                  ),
                                ),
                              )
                              : const Text(
                                'Add User',
                                style: TextStyle(fontSize: 16),
                              ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
