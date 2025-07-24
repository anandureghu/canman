import { generateYearsArray } from "@/lib/utils";
import { ClientTypes } from "@/services/interfaces/client.services";
import {
  DeliveryTypes,
  IDeliveryService,
} from "@/services/interfaces/delivery.services";
import { DeliveryService } from "@/services/supabase/delivery.service";
import { AnalyticsResponse } from "@/types/analytics.type";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import InfoCard from "./infocard";

const YearlyAnalytics = () => {
  const deliveryService: IDeliveryService = useMemo(
    () => new DeliveryService(),
    []
  );
  const router = useRouter();
  const years = useMemo(() => generateYearsArray(), []);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchYearlyData = async () => {
        try {
          // Fetch monthly data based on selectedMonth
          const data = await deliveryService.getYearlyAnalytics(
            new Date().getFullYear()
          );

          setData(data);
        } catch (error) {
          console.error("Error fetching yearly data: ", error);
        }
      };

      fetchYearlyData();

      return () => {}; // Optional cleanup
    }, [selectedYear])
  );

  return (
    <View>
      {/* <View className="p-4 border border-gray-300 rounded-lg mb-4">
        <Dropdown
          data={years}
          value={selectedYear}
          onChange={(item) => setSelectedYear(item.value)}
          labelField="label"
          valueField="value"
        />
      </View> */}

      <View>
        <InfoCard
          title="Delivered"
          info={data?.supplied.toString() || "0"}
          description="" // Replace with actual delivered value
          infoStyle="bg-red-50 border border-red-200"
          infoTextStyle="text-red-500"
          onPress={() => {
            router.push({
              pathname: "/analytics_detail",
              params: {
                clientType: ClientTypes.CLIENT,
                deliveryType: DeliveryTypes.SUPPLY,
                page: "Delivered",
              },
            });
          }}
        />
        <InfoCard
          title="Stock Collected"
          info={data?.collected.toString() || "0"}
          description="" // Replace with actual delivered value
          infoStyle="bg-green-50 border border-green-500"
          infoTextStyle="text-green-700"
          onPress={() => {
            router.push({
              pathname: "/analytics_detail",
              params: {
                clientType: ClientTypes.CLIENT,
                deliveryType: DeliveryTypes.COLLECT,
                page: "Stock Collected",
              },
            });
          }}
        />
        <InfoCard
          title="Distributed"
          info={data?.distributed.toString() || "0"}
          description="" // Replace with actual delivered value
          infoStyle="border-blue-500"
          onPress={() => {
            router.push({
              pathname: "/analytics_detail",
              params: {
                clientType: ClientTypes.DISTRIBUTOR,
                deliveryType: DeliveryTypes.SUPPLY,
                page: "Distributed",
              },
            });
          }}
        />

        <InfoCard
          title="Stock In-Hand"
          info={data?.stock.toString() || "0"}
          description="" // Replace with actual delivered value
          infoStyle="border-blue-500"
        />
      </View>
    </View>
  );
};

export default YearlyAnalytics;

const styles = StyleSheet.create({});
