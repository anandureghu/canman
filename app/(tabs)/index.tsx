import ClientListing from "@/components/clientlisting";
import { SafeAreaView } from "react-native";

export default function Index() {
  return (
    <SafeAreaView className="p-[20px]">
      <ClientListing type="client" />
    </SafeAreaView>
  );
}
