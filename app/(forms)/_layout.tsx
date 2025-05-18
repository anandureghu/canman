import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="adduser"
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
};

export default _layout;
