class Routes {
  Routes._();
  static const String customersPage = '/customers';
  static const String supplyPage = '/supply';
  static const String distributePage = '/distribute';
  static const String customerDetailPage = '/customers/:id';

  static String getCustomerDetailPageWithId(String id) => '/customers/$id';
}
