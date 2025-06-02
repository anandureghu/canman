import MonthlyAnalytics from "@/components/monthly-analytics";
import Tab from "@/components/tab";
import YearlyAnalytics from "@/components/yearly-analytics";
import { TabItems } from "@/types/tab.types";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("monthly");

  const tabItems = useMemo<TabItems[]>(
    () => [
      { id: "monthly", name: "Monthly" },
      { id: "yearly", name: "Yearly" },
    ],
    []
  );

  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  return (
    <SafeAreaView>
      <View>
        <Tab
          items={tabItems}
          onTabChange={handleTabChange}
          activeTab={activeTab}
        />
      </View>
      <View className="px-[8%] py-[30px]">
        {activeTab === "monthly" ? <MonthlyAnalytics /> : <YearlyAnalytics />}
      </View>
    </SafeAreaView>
  );
};

export default Analytics;

const styles = StyleSheet.create({});
