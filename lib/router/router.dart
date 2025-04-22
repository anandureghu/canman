import 'package:canman/pages/customer_detail_page.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:canman/router/routes.dart';
import 'package:canman/layout/layout_scaffold.dart';
import 'package:canman/pages/customers_page.dart';
import 'package:canman/pages/supply_page.dart';
import 'package:canman/pages/distribute_page.dart';
import 'package:canman/pages/customer_add_page.dart';
import 'package:canman/pages/supplier_add_page.dart';
import 'package:canman/pages/supplier_detail_page.dart';
import 'package:canman/pages/supplier_edit_page.dart';
import 'package:canman/pages/distribute_add_page.dart';
import 'package:canman/pages/distribute_detail_page.dart';
import 'package:canman/pages/distribute_edit_page.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');

final router = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: Routes.customersPage,
  redirect: (context, state) {
    if (state.matchedLocation == '/') {
      return Routes.customersPage;
    }
    return null;
  },
  routes: [
    StatefulShellRoute.indexedStack(
      builder:
          (context, state, navigationShell) =>
              LayoutScaffold(navigationShell: navigationShell),
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: Routes.customersPage,
              builder: (context, state) => const CustomersPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: Routes.supplyPage,
              builder: (context, state) => const SupplyPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: Routes.distributePage,
              builder: (context, state) => const DistributePage(),
            ),
          ],
        ),
      ],
    ),
    GoRoute(
      path: Routes.customerDetailPage,
      builder:
          (context, state) =>
              CustomerDetailPage(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: Routes.addCustomerPage,
      builder: (context, state) => const AddCustomerPage(),
    ),
    GoRoute(
      path: Routes.addSupplierPage,
      builder: (context, state) => const AddSupplierPage(),
    ),
    GoRoute(
      path: Routes.supplierDetailPage,
      builder:
          (context, state) =>
              SupplierDetailPage(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: Routes.supplierEditPage,
      builder:
          (context, state) => SupplierEditPage(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: Routes.addDistributePage,
      builder: (context, state) => const DistributeAddPage(),
    ),
    GoRoute(
      path: Routes.distributeDetailPage,
      builder:
          (context, state) =>
              DistributeDetailPage(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: Routes.distributeEditPage,
      builder:
          (context, state) =>
              DistributeEditPage(id: state.pathParameters['id']!),
    ),
  ],
);
