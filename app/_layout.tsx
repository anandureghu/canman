import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />

      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.neutral[50],
            },
          }}
        />
        <Stack.Screen
          name="(forms)"
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.neutral[50],
            },
          }}
        />
      </Stack>
    </>
  );
}
