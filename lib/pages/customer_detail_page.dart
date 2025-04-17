import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CustomerDetailPage extends StatelessWidget {
  final String id;
  const CustomerDetailPage({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => context.pop(),
                    icon: const Icon(Icons.arrow_back),
                  ),
                ],
              ),
            ),
            Text('Customer $id'),
            // Padding(
            //   padding: const EdgeInsets.symmetric(horizontal: 16.0),
            //   child: TextField(
            //     decoration: InputDecoration(
            //       contentPadding: const EdgeInsets.symmetric(
            //         horizontal: 16,
            //         vertical: 12,
            //       ),
            //       border: OutlineInputBorder(
            //         borderRadius: BorderRadius.circular(8),
            //       ),
            //       hintText: 'Enter customer name',
            //       isDense: true,
            //     ),
            //   ),
            // ),
          ],
        ),
      ),
    );
  }
}
