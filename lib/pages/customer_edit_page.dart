import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:canman/services/firebase_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:canman/components/input_field.dart';

class CustomerEditPage extends StatefulWidget {
  final String id;

  const CustomerEditPage({super.key, required this.id});

  @override
  State<CustomerEditPage> createState() => _CustomerEditPageState();
}

class _CustomerEditPageState extends State<CustomerEditPage> {
  final _firebaseService = FirebaseService();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _locationController = TextEditingController();
  final _holdingController = TextEditingController();
  bool _isLoading = false;
  bool _isInitialized = false;
  bool _isValidatingPhone = false;

  String? _nameError;
  String? _phoneError;
  String? _locationError;
  String? _holdingError;

  static const int _availableVolume = 96;

  @override
  void initState() {
    super.initState();
    _loadCustomerData();
  }

  Future<void> _loadCustomerData() async {
    if (_isInitialized) return;

    setState(() => _isLoading = true);

    try {
      final doc =
          await FirebaseFirestore.instance
              .collection('customers')
              .doc(widget.id)
              .get();

      if (!doc.exists) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(const SnackBar(content: Text('Customer not found')));
          context.pop();
        }
        return;
      }

      final data = doc.data()!;
      _nameController.text = data['name'] ?? '';
      _phoneController.text = data['phone'] ?? '';
      _locationController.text = data['location'] ?? '';
      _holdingController.text = data['holding']?.toString() ?? '0';
      _isInitialized = true;
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to load customer data: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

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
          if (exists && value != _phoneController.text) {
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
      setState(() => _holdingError = 'Holding is required');
    } else if (int.tryParse(value) == null) {
      setState(() => _holdingError = 'Please enter a valid number');
    } else if (int.parse(value) < 0) {
      setState(
        () => _holdingError = 'Please enter a value greater than or equal to 0',
      );
    } else if (int.parse(value) > _availableVolume) {
      setState(() => _holdingError = 'Holding cannot exceed available volume');
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
        await _firebaseService.updateCustomer(
          customerId: widget.id,
          name: _nameController.text.trim(),
          phone: _phoneController.text.trim(),
          location: _locationController.text.trim(),
          holding: int.parse(_holdingController.text),
        );
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Customer updated successfully')),
          );
          context.pop();
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to update customer: $e'),
              backgroundColor: Colors.red,
            ),
          );
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
        child:
            _isLoading && !_isInitialized
                ? const Center(child: CircularProgressIndicator())
                : Column(
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
                                    color:
                                        isOnline ? Colors.green : Colors.grey,
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
                            'Edit Customer',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 24),
                          InputField(
                            label: 'Name',
                            hintText: 'Enter customer name',
                            controller: _nameController,
                            textCapitalization: TextCapitalization.words,
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
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                      ),
                                    )
                                    : null,
                          ),
                          InputField(
                            label: 'Location',
                            hintText: 'Enter location',
                            controller: _locationController,
                            textCapitalization: TextCapitalization.words,
                            isRequired: true,
                            errorText: _locationError,
                            onChanged:
                                (value) => _validateField(
                                  value,
                                  'Location',
                                  (error) =>
                                      setState(() => _locationError = error),
                                ),
                          ),
                          InputField(
                            label: 'Holding',
                            hintText: 'Enter holding',
                            controller: _holdingController,
                            keyboardType: TextInputType.number,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly,
                            ],
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
                                          valueColor:
                                              AlwaysStoppedAnimation<Color>(
                                                Colors.white,
                                              ),
                                        ),
                                      )
                                      : const Text(
                                        'Save Changes',
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
