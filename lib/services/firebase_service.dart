import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  bool _initialized = false;

  factory FirebaseService() {
    return _instance;
  }

  FirebaseService._internal();

  Future<void> initialize() async {
    if (!_initialized) {
      await _firestore
          .enablePersistence(const PersistenceSettings(synchronizeTabs: true))
          .catchError((e) {
            if (kDebugMode) {
              print("Failed to enable persistence: $e");
            }
          });
      _firestore.settings = const Settings(
        persistenceEnabled: true,
        cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
      );
      _initialized = true;
    }
  }

  Future<void> addCustomer({
    required String name,
    required String phone,
    required String location,
    required int holding,
  }) async {
    try {
      final docRef = _firestore.collection('customers').doc();
      final timestamp = FieldValue.serverTimestamp();

      // Create the customer data
      final customerData = {
        'id': docRef.id,
        'name': name,
        'phone': phone,
        'location': location,
        'holding': holding,
        'createdAt': timestamp,
        'updatedAt': timestamp,
        'syncStatus': 'pending',
      };

      // Add to Firestore with offline support
      await docRef.set(customerData);

      // Update sync status when online
      await docRef.update({'syncStatus': 'synced'}).catchError((e) {
        if (kDebugMode) {
          print("Failed to update sync status: $e");
        }
      });
    } catch (e) {
      throw Exception('Failed to add customer: $e');
    }
  }

  Future<void> updateCustomer({
    required String customerId,
    String? name,
    String? phone,
    String? location,
    int? holding,
  }) async {
    try {
      final docRef = _firestore.collection('customers').doc(customerId);

      final updates = <String, dynamic>{
        'updatedAt': FieldValue.serverTimestamp(),
        'syncStatus': 'pending',
      };

      if (name != null) updates['name'] = name;
      if (phone != null) updates['phone'] = phone;
      if (location != null) updates['location'] = location;
      if (holding != null) updates['holding'] = holding;

      // Update the document
      await docRef.update(updates);

      // Update sync status when online
      await docRef.update({'syncStatus': 'synced'}).catchError((e) {
        if (kDebugMode) {
          print("Failed to update sync status: $e");
        }
      });
    } catch (e) {
      throw Exception('Failed to update customer: $e');
    }
  }

  Stream<QuerySnapshot> getCustomers() {
    return _firestore
        .collection('customers')
        .orderBy('updatedAt', descending: true)
        .snapshots();
  }

  Stream<bool> get onlineStatus {
    return _firestore
        .snapshotsInSync()
        .map((_) => true)
        .handleError(
          (_) => false,
          test:
              (e) => e is FirebaseException && e.code == 'failed-precondition',
        );
  }

  Future<bool> isPhoneNumberExists(String phone) async {
    try {
      final querySnapshot =
          await _firestore
              .collection('customers')
              .where('phone', isEqualTo: phone)
              .limit(1)
              .get();
      return querySnapshot.docs.isNotEmpty;
    } catch (e) {
      if (kDebugMode) {
        print("Failed to check phone number: $e");
      }
      return false;
    }
  }

  Future<void> addSupplier({
    required String name,
    required String phone,
    required int supplyCount,
  }) async {
    try {
      final docRef = _firestore.collection('suppliers').doc();
      final timestamp = FieldValue.serverTimestamp();

      final supplierData = {
        'id': docRef.id,
        'name': name,
        'phone': phone,
        'supplyCount': supplyCount,
        'createdAt': timestamp,
        'updatedAt': timestamp,
        'syncStatus': 'pending',
      };

      await docRef.set(supplierData);

      await docRef.update({'syncStatus': 'synced'}).catchError((e) {
        if (kDebugMode) {
          print("Failed to update sync status: $e");
        }
      });
    } catch (e) {
      throw Exception('Failed to add supplier: $e');
    }
  }

  Stream<QuerySnapshot> getSuppliers() {
    return _firestore
        .collection('suppliers')
        .orderBy('updatedAt', descending: true)
        .snapshots();
  }

  Future<bool> isSupplierPhoneExists(String phone) async {
    try {
      final querySnapshot =
          await _firestore
              .collection('suppliers')
              .where('phone', isEqualTo: phone)
              .limit(1)
              .get();
      return querySnapshot.docs.isNotEmpty;
    } catch (e) {
      if (kDebugMode) {
        print("Failed to check supplier phone number: $e");
      }
      return false;
    }
  }

  Future<void> updateSupplier({
    required String supplierId,
    String? name,
    String? phone,
    int? supplyCount,
  }) async {
    try {
      final docRef = _firestore.collection('suppliers').doc(supplierId);

      final updates = <String, dynamic>{
        'updatedAt': FieldValue.serverTimestamp(),
        'syncStatus': 'pending',
      };

      if (name != null) updates['name'] = name;
      if (phone != null) updates['phone'] = phone;
      if (supplyCount != null) updates['supplyCount'] = supplyCount;

      await docRef.update(updates);

      await docRef.update({'syncStatus': 'synced'}).catchError((e) {
        if (kDebugMode) {
          print("Failed to update sync status: $e");
        }
      });
    } catch (e) {
      throw Exception('Failed to update supplier: $e');
    }
  }

  Future<void> addDistribute({
    required String name,
    required String phone,
    required int distributeCount,
    required String location,
  }) async {
    try {
      final docRef = _firestore.collection('distributes').doc();
      final timestamp = FieldValue.serverTimestamp();

      final distributeData = {
        'id': docRef.id,
        'name': name,
        'phone': phone,
        'distributeCount': distributeCount,
        'location': location,
        'createdAt': timestamp,
        'updatedAt': timestamp,
        'syncStatus': 'pending',
      };

      await docRef.set(distributeData);

      await docRef.update({'syncStatus': 'synced'}).catchError((e) {
        if (kDebugMode) {
          print("Failed to update sync status: $e");
        }
      });
    } catch (e) {
      throw Exception('Failed to add distribute: $e');
    }
  }

  Stream<QuerySnapshot> getDistributes() {
    return _firestore
        .collection('distributes')
        .orderBy('updatedAt', descending: true)
        .snapshots();
  }

  Future<bool> isDistributePhoneExists(String phone) async {
    try {
      final querySnapshot =
          await _firestore
              .collection('distributes')
              .where('phone', isEqualTo: phone)
              .limit(1)
              .get();
      return querySnapshot.docs.isNotEmpty;
    } catch (e) {
      if (kDebugMode) {
        print("Failed to check distribute phone number: $e");
      }
      return false;
    }
  }

  Future<void> updateDistribute({
    required String distributeId,
    String? name,
    String? phone,
    int? distributeCount,
    String? location,
  }) async {
    try {
      final docRef = _firestore.collection('distributes').doc(distributeId);

      final updates = <String, dynamic>{
        'updatedAt': FieldValue.serverTimestamp(),
        'syncStatus': 'pending',
      };

      if (name != null) updates['name'] = name;
      if (phone != null) updates['phone'] = phone;
      if (distributeCount != null) updates['distributeCount'] = distributeCount;
      if (location != null) updates['location'] = location;

      await docRef.update(updates);

      await docRef.update({'syncStatus': 'synced'}).catchError((e) {
        if (kDebugMode) {
          print("Failed to update sync status: $e");
        }
      });
    } catch (e) {
      throw Exception('Failed to update distribute: $e');
    }
  }
}
