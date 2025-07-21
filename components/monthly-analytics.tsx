import { IDeliveryService } from "@/services/interfaces/delivery.services";
import { DeliveryService } from "@/services/supabase/delivery.service";
import { AnalyticsResponse } from "@/types/analytics.type";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import InfoCard from "./infocard";

const MonthlyAnalytics = () => {
  const deliveryService: IDeliveryService = useMemo(
    () => new DeliveryService(),
    []
  );
  const months = useMemo(
    () => [
      { label: "January", value: 0 },
      { label: "February", value: 1 },
      { label: "March", value: 2 },
      { label: "April", value: 3 },
      { label: "May", value: 4 },
      { label: "June", value: 5 },
      { label: "July", value: 6 },
      { label: "August", value: 7 },
      { label: "September", value: 8 },
      { label: "October", value: 9 },
      { label: "November", value: 10 },
      { label: "December", value: 11 },
    ],
    []
  );
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()].value
  );
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        // Fetch monthly data based on selectedMonth
        const data = await deliveryService.getMonthlyAnalytics(
          new Date().getFullYear(),
          selectedMonth + 1 // Adjust for 0-based month index
        );

        setData(data);
      } catch (error) {
        console.error("Error fetching monthly data: ", error);
      }
    };

    fetchMonthlyData();
  }, [selectedMonth]);

  return (
    <View>
      <View className="p-4 border border-gray-300 rounded-lg mb-4">
        <Dropdown
          data={months}
          value={selectedMonth}
          onChange={(item) => setSelectedMonth(item.value)}
          labelField="label"
          valueField="value"
        />
      </View>
      <View>
        <InfoCard
          title="Delivered"
          info={data?.collected.toString() || "0"}
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

export default MonthlyAnalytics;

const styles = StyleSheet.create({});
