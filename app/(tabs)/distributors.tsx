import React from "react";
import { SafeAreaView, Text, View } from "react-native";

const distributors = () => {
  return (
    <SafeAreaView className=" flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <Text className="text-gray-500 text-base">Distributors</Text>
      </View>
    </SafeAreaView>
  );
};

export default distributors;
