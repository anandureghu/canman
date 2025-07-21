import FormInput from "@/components/forminput";
import {
  IClientService,
  TClientTypes,
} from "@/services/interfaces/client.services";
import { ClientService } from "@/services/supabase/client.services";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InfoCard from "./infocard";

interface Props {
  type: TClientTypes;
}

export default function ClientListing({ type }: Props) {
  const router = useRouter();
  const clientService: IClientService = useMemo(() => new ClientService(), []);

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const searchClients = async () => {
      try {
        const clients = await clientService.searchClients(search, type);

        setClients(clients);
      } catch (error) {
        console.error(`Error fetching ${type}s: `, error);
      }
    };
    setTimeout(() => {
      searchClients();
    }, 500); // Debounce search input
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      const fetchClients = async () => {
        try {
          const clients = await clientService.getClients(type);
          setClients(clients);
        } catch (error) {
          console.error(`Error fetching ${type}s: `, error);
        }
      };
      fetchClients();

      return () => {}; // Optional cleanup
    }, [])
  );

  return (
    <SafeAreaView className="p-[20px] max-h-full h-full">
      {/* Search Bar */}

      <View className="flex-row gap-3 px-[20px] items-center">
        <FormInput
          placeholder="Search"
          onChangeText={(value) => setSearch(value)}
          value={search}
          className="flex-1 mt-3"
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-lg justify-center items-center px-5 h-[40px]"
          onPress={() => {
            setSearch("");
          }}
        >
          <Text className="text-neutral-50">Search</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View className="items-end w-full px-[20px]">
        <TouchableOpacity
          className="p-4 py-1 rounded-lg"
          onPress={() => {
            router.push(`/add-client?type=${type}`);
          }}
        >
          <Text className="text-blue-500 text-lg font-medium text-center capitalize">
            Add {type}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Listing */}
      {/* <View className=""> */}
      <FlatList
        data={clients}
        overScrollMode="auto"
        scrollToOverflowEnabled
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => {
          return (
            <InfoCard
              title={item.name}
              description={item.phone}
              info={item?.supplyQuantity || "0"}
              onPress={() => {
                router.push(`/client/${item.id}?type=${type}`);
              }}
              {...(type === "client"
                ? {
                    infoStyle: "bg-red-50 border border-red-200",
                    infoTextStyle: "text-red-500",
                    subinfoStyle: "bg-green-50 border border-green-600",
                    subinfoTextStyle: "text-green-700",
                    subinfo: item.collectQuantity || "0",
                  }
                : {})}
            />
          );
        }}
        className="w-full p-[20px] mb-10"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-500">No {type}s found.</Text>
        }
      />
      {/* </View> */}
    </SafeAreaView>
  );
}
