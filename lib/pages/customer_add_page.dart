import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:canman/components/input_field.dart';

class AddCustomerPage extends StatefulWidget {
  const AddCustomerPage({super.key});

  @override
  State<AddCustomerPage> createState() => _AddCustomerPageState();
}

class _AddCustomerPageState extends State<AddCustomerPage> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _locationController = TextEditingController();
  final _holdingController = TextEditingController();

  static const int _availableVolume = 96;

  String? _nameError;
  String? _phoneError;
  String? _locationError;
  String? _holdingError;

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

  void _validatePhone(String value) {
    if (value.isEmpty) {
      setState(() => _phoneError = 'Phone number is required');
    } else if (value.length != 10) {
      setState(() => _phoneError = 'Phone number must be 10 digits');
    } else {
      setState(() => _phoneError = null);
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

  void _handleSubmit() {
    if (_isFormValid()) {
      final formData = {
        'name': _nameController.text,
        'phone': _phoneController.text,
        'location': _locationController.text,
        'holding': _holdingController.text,
      };
      print('Form Data: $formData');
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
                      onPressed: _handleSubmit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
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
