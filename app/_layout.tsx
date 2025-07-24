import "react-native-url-polyfill/auto";

import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <GestureHandlerRootView>
        {/* <StatusBar hidden={true} /> */}
        {/* <Toaster richColors position="bottom-center" closeButton /> */}
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
            name="(forms)/edit/[id]"
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
          <Stack.Screen
            name="(analytics)/analytics_detail"
            options={{
              headerShown: false,
              contentStyle: {
                backgroundColor: colors.neutral[50],
              },
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </>
  );
}
