import 'package:flutter/material.dart';
import 'package:canman/router/routes.dart';
import 'package:go_router/go_router.dart';
import 'package:canman/services/firebase_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:canman/components/info_card.dart';

class SupplyPage extends StatelessWidget {
  const SupplyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  'Total Stock Available',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                StreamBuilder<QuerySnapshot>(
                  stream: FirebaseService().getSuppliers(),
                  builder: (context, snapshot) {
                    if (snapshot.hasError || !snapshot.hasData) {
                      return const Text('1000');
                    }

                    final suppliers = snapshot.data!.docs;
                    final totalStock = suppliers.fold<int>(
                      0,
                      (sum, doc) =>
                          sum +
                                  (doc.data()
                                      as Map<String, dynamic>)['supplyCount']
                              as int,
                    );

                    return Text(
                      totalStock.toString(),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Suppliers',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
              ),
              TextButton(
                onPressed: () => context.push(Routes.addSupplierPage),
                child: const Text('Add Supplier'),
              ),
            ],
          ),
        ),
        Expanded(
          child: StreamBuilder<QuerySnapshot>(
            stream: FirebaseService().getSuppliers(),
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                return Center(child: Text('Error: ${snapshot.error}'));
              }

              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              final suppliers = snapshot.data?.docs ?? [];

              if (suppliers.isEmpty) {
                return const Center(child: Text('No suppliers found'));
              }

              return ListView.builder(
                itemCount: suppliers.length,
                itemBuilder: (context, index) {
                  final supplier =
                      suppliers[index].data() as Map<String, dynamic>;
                  return GestureDetector(
                    onTap:
                        () => context.push(
                          Routes.getSupplierDetailPageWithId(supplier['id']),
                        ),
                    child: InfoCard(
                      id: supplier['id'],
                      title: supplier['name'],
                      subtitle: supplier['phone'],
                      count: supplier['supplyCount'] as int,
                    ),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
