import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TabProps {
  items: {
    id: string;
    name: string;
  }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const Tab = ({ items, activeTab, onTabChange }: TabProps) => {
  return (
    <View className="flex w-[90%] flex-row justify-around bg-blue-100 mx-auto rounded-lg p-2 select-none">
      {items.map((item) => (
        <View key={item.id} className="flex-1 rounded-lg select-none">
          <Text
            style={{
              fontWeight: activeTab === item.id ? "bold" : "normal",
              padding: 10,
            }}
            className={`${
              activeTab === item.id
                ? "bg-blue-600 text-white rounded-lg"
                : "text-gray-500"
            }
            text-center select-none
            `}
            onPress={() => onTabChange(item.id)}
          >
            {item.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default Tab;

const styles = StyleSheet.create({});
