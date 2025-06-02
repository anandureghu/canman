import FormInput from "@/components/forminput";
import {
  ClientTypes,
  IClientService,
} from "@/services/interfaces/client.services";
import { ClientService } from "@/services/supabase/client.services";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InfoCard from "./infocard";

interface Props {
  type: ClientTypes;
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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await clientService.getClients(type);
        if (search) {
          const filteredClients = clients.filter((client: any) =>
            client.name.toLowerCase().includes(search.toLowerCase())
          );
          setClients(filteredClients);
        } else {
          setClients(clients);
        }
      } catch (error) {
        console.error(`Error fetching ${type}s: `, error);
      }
    };
    fetchClients();
  }, [search]);

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
        renderItem={({ item }: any) => (
          <InfoCard
            title={item.name}
            description={item.phone}
            info={item?.quantity || "0"}
            onPress={() => {
              router.push(`/client/${item.id}?type=${type}`);
            }}
          />
        )}
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
