import ClientListing from "@/components/clientlisting";
import React from "react";
import { SafeAreaView } from "react-native";

const suppliers = () => {
  return (
    <SafeAreaView className="p-[20px]">
      <ClientListing type="supplier" />
    </SafeAreaView>
  );
};

export default suppliers;
