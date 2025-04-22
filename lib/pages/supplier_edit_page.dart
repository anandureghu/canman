import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:canman/components/input_field.dart';
import 'package:canman/services/firebase_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class SupplierEditPage extends StatefulWidget {
  final String id;

  const SupplierEditPage({super.key, required this.id});

  @override
  State<SupplierEditPage> createState() => _SupplierEditPageState();
}

class _SupplierEditPageState extends State<SupplierEditPage> {
  final _firebaseService = FirebaseService();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _supplyCountController = TextEditingController();
  bool _isLoading = false;
  bool _isValidatingPhone = false;

  String? _nameError;
  String? _phoneError;
  String? _supplyCountError;

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
      final exists = await _firebaseService.isSupplierPhoneExists(value);
      if (mounted) {
        setState(() {
          _isValidatingPhone = false;
          if (exists) {
            _phoneError = 'A supplier with this phone number already exists';
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

  void _validateSupplyCount(String value) {
    if (value.isEmpty) {
      setState(() => _supplyCountError = 'Supply count is required');
    } else if (int.tryParse(value) == null) {
      setState(() => _supplyCountError = 'Please enter a valid number');
    } else if (int.parse(value) <= 0) {
      setState(() => _supplyCountError = 'Please enter a value greater than 0');
    } else {
      setState(() => _supplyCountError = null);
    }
  }

  bool _isFormValid() {
    _validateField(
      _nameController.text,
      'Name',
      (error) => setState(() => _nameError = error),
    );
    _validatePhone(_phoneController.text);
    _validateSupplyCount(_supplyCountController.text);

    return _nameError == null &&
        _phoneError == null &&
        _supplyCountError == null;
  }

  Future<void> _handleSubmit() async {
    if (_isFormValid()) {
      setState(() => _isLoading = true);
      try {
        await _firebaseService.updateSupplier(
          supplierId: widget.id,
          name: _nameController.text,
          phone: _phoneController.text,
          supplyCount: int.parse(_supplyCountController.text),
        );
        if (mounted) {
          context.pop();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Supplier updated successfully')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to update supplier: $e')),
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
    _supplyCountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: StreamBuilder<DocumentSnapshot>(
          stream:
              FirebaseFirestore.instance
                  .collection('suppliers')
                  .doc(widget.id)
                  .snapshots(),
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            }

            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }

            final data = snapshot.data?.data() as Map<String, dynamic>?;
            if (data == null) {
              return const Center(child: Text('Supplier not found'));
            }

            // Update controllers if they're empty (first load)
            if (_nameController.text.isEmpty) {
              _nameController.text = data['name'] ?? '';
            }
            if (_phoneController.text.isEmpty) {
              _phoneController.text = data['phone'] ?? '';
            }
            if (_supplyCountController.text.isEmpty) {
              _supplyCountController.text =
                  (data['supplyCount'] ?? '').toString();
            }

            return Column(
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
                        'Edit Supplier',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 24),
                      InputField(
                        label: 'Name',
                        hintText: 'Enter supplier name',
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
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                  ),
                                )
                                : null,
                      ),
                      InputField(
                        label: 'Supply Count',
                        hintText: 'Enter supply count',
                        controller: _supplyCountController,
                        keyboardType: TextInputType.number,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        isRequired: true,
                        errorText: _supplyCountError,
                        onChanged: _validateSupplyCount,
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
                                    'Update Supplier',
                                    style: TextStyle(fontSize: 16),
                                  ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
