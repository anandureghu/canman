import ClientListing from "@/components/clientlisting";
import React from "react";
import { SafeAreaView } from "react-native";

const distributors = () => {
  return (
    <SafeAreaView className="p-[20px]">
      <ClientListing type="distributor" />
    </SafeAreaView>
  );
};

export default distributors;
