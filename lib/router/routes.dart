class Routes {
  Routes._();
  static const String customersPage = '/customers';
  static const String supplyPage = '/supply';
  static const String distributePage = '/distribute';
  static const String customerDetailPage = '/customers/:id';
  static const String addCustomerPage = '/add-customer';
  static const String customerEditPage = '/customers/:id/edit';
  static const String supplierDetailPage = '/suppliers/:id';
  static const String addSupplierPage = '/add-supplier';
  static const String supplierEditPage = '/suppliers/:id/edit';
  static const String distributeDetailPage = '/distribute/:id';
  static const String addDistributePage = '/add-distribute';
  static const String distributeEditPage = '/distribute/:id/edit';

  static String getCustomerDetailPageWithId(String id) => '/customers/$id';
  static String getCustomerEditPageWithId(String id) => '/customers/$id/edit';
  static String getSupplierDetailPageWithId(String id) => '/suppliers/$id';
  static String getSupplierEditPageWithId(String id) => '/suppliers/$id/edit';
  static String getDistributeDetailPageWithId(String id) => '/distribute/$id';
  static String getDistributeEditPageWithId(String id) =>
      '/distribute/$id/edit';
}
