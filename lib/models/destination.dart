import 'package:flutter/material.dart';

class Destination {
  const Destination({required this.label, required this.icon});

  final String label;
  final IconData icon;
}

const destinations = [
  Destination(label: 'Customers', icon: Icons.person_outline),
  Destination(label: 'Supply', icon: Icons.inventory_2_outlined),
  Destination(label: 'Distribute', icon: Icons.inventory_2_outlined),
];
