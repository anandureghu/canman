import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  description?: string;
  info?: string;
  subinfo?: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  infoStyle?: string;
  infoTextStyle?: string;
  subinfoStyle?: string;
  subinfoTextStyle?: string;
}

const InfoCard = ({
  title,
  description,
  info,
  onPress,
  icon,
  subinfo,
  infoStyle = "",
  subinfoStyle = "",
  infoTextStyle = "",
  subinfoTextStyle = "",
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between items-center w-dvw bg-neutral-50 rounded-lg p-4 mb-4 gap-3">
        <View className="flex-row items-center gap-5 flex-1 overflow-hidden">
          <View className="bg-gray-300 w-[50px] h-[50px] rounded-full justify-center items-center">
            {icon ? (
              icon
            ) : (
              <Text className="text-3xl font-semibold text-gray-400">
                {title[0]}
              </Text>
            )}
          </View>
          <View>
            <Text
              className={`text-xl font-semibold overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {title}
            </Text>
            {description && (
              <Text className="text-sm text-gray-400">{description}</Text>
            )}
          </View>
        </View>
        <View className="flex flex-row gap-3">
          {info && (
            <View
              className={`bg-blue-50 border border-blue-100 min-w-[40px] h-[40px] p-3 rounded-lg items-center justify-center ${infoStyle}`}
            >
              <Text className={`text-blue-500 font-bold ${infoTextStyle}`}>
                {info || "0"}
              </Text>
            </View>
          )}
          {subinfo && (
            <View
              className={`bg-blue-50 border border-blue-100 min-w-[40px] h-[40px] p-3 rounded-lg items-center justify-center ${subinfoStyle}`}
            >
              <Text className={`text-blue-500 font-bold ${subinfoTextStyle}`}>
                {subinfo || "0"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InfoCard;
