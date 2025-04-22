class Routes {
  Routes._();
  static const String customersPage = '/customers';
  static const String supplyPage = '/supply';
  static const String distributePage = '/distribute';
  static const String customerDetailPage = '/customers/:id';
  static const String addCustomerPage = '/add-customer';

  static String getCustomerDetailPageWithId(String id) => '/customers/$id';
}
