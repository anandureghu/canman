import { generateYearsArray } from "@/lib/utils";
import { IDeliveryService } from "@/services/interfaces/delivery.services";
import { DeliveryService } from "@/services/supabase/delivery.service";
import { AnalyticsResponse } from "@/types/analytics.type";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import InfoCard from "./infocard";

const YearlyAnalytics = () => {
  const deliveryService: IDeliveryService = useMemo(
    () => new DeliveryService(),
    []
  );
  const years = useMemo(() => generateYearsArray(), []);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
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
  }, [selectedYear]);

  return (
    <View>
      <View className="p-4 border border-gray-300 rounded-lg mb-4">
        <Dropdown
          data={years}
          value={selectedYear}
          onChange={(item) => setSelectedYear(item.value)}
          labelField="label"
          valueField="value"
        />
      </View>
      <View>
        <InfoCard
          title="Delivered"
          info={data?.delivered.toString() || "0"}
          description="" // Replace with actual delivered value
        />
        <InfoCard
          title="Stock Collected"
          info={data?.supplied.toString() || "0"}
          description="" // Replace with actual delivered value
        />
        <InfoCard
          title="Distributed"
          info={data?.distributed.toString() || "0"}
          description="" // Replace with actual delivered value
        />
      </View>
    </View>
  );
};

export default YearlyAnalytics;

const styles = StyleSheet.create({});
