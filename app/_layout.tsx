import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      {/* <StatusBar hidden={true} /> */}

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
        <Stack.Screen
          name="(forms)/add-client"
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.neutral[50],
            },
          }}
        />
        <Stack.Screen
          name="(detail)"
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.neutral[50],
            },
          }}
        />
        <Stack.Screen
          name="(detail)/client/[id]"
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
