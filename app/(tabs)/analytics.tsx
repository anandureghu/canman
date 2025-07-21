import YearlyAnalytics from "@/components/yearly-analytics";
import { IDeliveryService } from "@/services/interfaces/delivery.services";
import { DeliveryService } from "@/services/supabase/delivery.service";
import { GetInactiveUsersResponse } from "@/types/delivery.types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Analytics = () => {
  const router = useRouter();
  const [inactiveUsers, setInactiveUsers] = useState<
    GetInactiveUsersResponse[]
  >([]);
  const deliveryService: IDeliveryService = useMemo(
    () => new DeliveryService(),
    []
  );

  useFocusEffect(
    useCallback(() => {
      const fetchInactiveUsers = async () => {
        try {
          const users = await deliveryService.getInactiveUsers(30); // Fetch inactive users for the last 30 days
          setInactiveUsers(users);
        } catch (error) {
          console.error(`Error Fetching Inactive users: `, error);
        }
      };
      fetchInactiveUsers();

      return () => {}; // Optional cleanup
    }, [])
  );

  return (
    <SafeAreaView className="pb-[60px] max-h-full h-full">
      {/* <View>
        <Tab
          items={tabItems}
          onTabChange={handleTabChange}
          activeTab={activeTab}
        />
      </View> */}
      <ScrollView>
        <View className="px-[20px] pt-[20px]">
          <Text className="text-2xl font-bold my-4 capitalize">Analytics</Text>
          <YearlyAnalytics />
          <Text className="text-2xl font-bold my-4 capitalize">
            InActive Users
          </Text>
          {inactiveUsers.length > 0 ? (
            <View className="flex gap-1">
              {inactiveUsers.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  className="bg-red-50/30 border-red-200 border py-3 px-5 rounded-lg relative"
                  onPress={() => {
                    router.push(`/client/${user.id}?type=${user.type}`);
                  }}
                >
                  <View className="mb-4">
                    <Text className="text-xl font-semibold">{user.name}</Text>
                    <Text className="text-gray-600">{user.phone}</Text>
                    <Text className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-full">
                      {user.type}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-2">
                      <Text className="text-gray-400">Last Delivered At: </Text>
                      <Text className="font-semibold">
                        {user.lastDeliveredAt
                          ? `${new Date(
                              user.lastDeliveredAt
                            ).toLocaleTimeString()}, ${new Date(
                              user.lastDeliveredAt
                            ).toLocaleDateString()}`
                          : "Never delivered"}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center mt-2">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-gray-400">Quantity:</Text>
                        <Text className="font-semibold">
                          {user.lastQuantity || "N/A"}
                        </Text>
                      </View>
                      <Text className="flex-row items-center gap-2">
                        <Text className="text-gray-400">Inactive Since:</Text>
                        <Text className="font-semibold">
                          {user.inactiveSince}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className="text-center">No inactive users found.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analytics;

const styles = StyleSheet.create({});
