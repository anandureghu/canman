import { SafeAreaView, Text, View } from "react-native";

export default function Index() {
  return (
    <SafeAreaView className=" flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <Text className="text-gray-500 text-base">users</Text>
      </View>
    </SafeAreaView>
  );
}
