import React from "react";
import { SafeAreaView, Text, View } from "react-native";

const suppliers = () => {
  return (
    <SafeAreaView className=" flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <Text className="text-gray-500 text-base">Suppliers</Text>
      </View>
    </SafeAreaView>
  );
};

export default suppliers;
