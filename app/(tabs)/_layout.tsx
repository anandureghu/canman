import CustomTabBar from "@/components/CustomTabBar";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Users",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="distributors"
        options={{
          title: "Distributors",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
