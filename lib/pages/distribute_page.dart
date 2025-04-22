import 'package:flutter/material.dart';
import 'package:canman/router/routes.dart';
import 'package:go_router/go_router.dart';
import 'package:canman/services/firebase_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:canman/components/info_card.dart';

class DistributePage extends StatefulWidget {
  const DistributePage({super.key});

  @override
  State<DistributePage> createState() => _DistributePageState();
}

class _DistributePageState extends State<DistributePage> {
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
                  'Total Distribution',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                StreamBuilder<QuerySnapshot>(
                  stream: FirebaseService().getDistributes(),
                  builder: (context, snapshot) {
                    if (snapshot.hasError || !snapshot.hasData) {
                      return const Text(
                        '0',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      );
                    }

                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const SizedBox(
                        height: 32,
                        child: Center(child: CircularProgressIndicator()),
                      );
                    }

                    final distributes = snapshot.data!.docs;
                    final totalDistribution = distributes.fold<int>(
                      0,
                      (sum, doc) =>
                          sum +
                          ((doc.data()
                                  as Map<String, dynamic>)['distributeCount']
                              as int),
                    );

                    return Text(
                      totalDistribution.toString(),
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
                'Distributors',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
              ),
              TextButton(
                onPressed: () => context.push(Routes.addDistributePage),
                child: const Text('Add Distributor'),
              ),
            ],
          ),
        ),
        Expanded(
          child: StreamBuilder<QuerySnapshot>(
            stream: FirebaseService().getDistributes(),
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.error_outline,
                        size: 48,
                        color: Colors.red,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to load distributors',
                        style: TextStyle(color: Colors.grey.shade600),
                      ),
                      const SizedBox(height: 8),
                      TextButton(
                        onPressed: () => setState(() {}),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                );
              }

              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              final distributes = snapshot.data?.docs ?? [];

              if (distributes.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.people_outline,
                        size: 48,
                        color: Colors.grey.shade400,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No distributors found',
                        style: TextStyle(color: Colors.grey.shade600),
                      ),
                      const SizedBox(height: 8),
                      TextButton(
                        onPressed: () => context.push(Routes.addDistributePage),
                        child: const Text('Add Distributor'),
                      ),
                    ],
                  ),
                );
              }

              return ListView.builder(
                itemCount: distributes.length,
                itemBuilder: (context, index) {
                  final distribute =
                      distributes[index].data() as Map<String, dynamic>;
                  return GestureDetector(
                    onTap:
                        () => context.push(
                          Routes.getDistributeDetailPageWithId(
                            distribute['id'],
                          ),
                        ),
                    child: InfoCard(
                      id: distribute['id'],
                      title: distribute['name'],
                      subtitle: distribute['phone'],
                      count: distribute['distributeCount'] as int,
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
