import React from "react";
import { Text, View } from "react-native";

interface Props {
  title: string;
  description: string;
  info: string;
  onPress: () => void;
}

const InfoCard = ({ title, description, info, onPress }: Props) => {
  return (
    <View className="flex-row justify-between items-center w-dvw bg-neutral-50 rounded-lg p-4 mb-4">
      <View className="flex-row items-center gap-5">
        <View className="bg-gray-300 w-[50px] h-[50px] rounded-full justify-center items-center">
          <Text className="text-3xl font-semibold text-gray-400">
            {title[0]}
          </Text>
        </View>
        <View>
          <Text className="text-xl font-semibold">{title}</Text>
          <Text className="text-sm text-gray-400">{description}</Text>
        </View>
      </View>
      <View className="bg-blue-500 w-[40px] h-[40px] p-3 rounded-lg items-center justify-center">
        <Text className="text-neutral-50 font-bold">{info || "0"}</Text>
      </View>
    </View>
  );
};

export default InfoCard;
