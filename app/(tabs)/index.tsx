import InfoCard from "@/components/infocard";
import { supabase } from "@/db/supabase";
import { IClientService } from "@/services/interfaces/client.services";
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

export default function Index() {
  const router = useRouter();
  const clientService: IClientService = useMemo(
    () => new ClientService(supabase),
    []
  );

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await clientService.getClients();

        setClients(clients);
      } catch (error) {
        console.error("Error fetching clients: ", error);
      }
    };
    fetchClients();
  }, []);

  return (
    <SafeAreaView className="p-[20px]">
      <View className="justify-center items-center w-full">
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg w-1/2 mx-auto "
          onPress={() => {
            router.push("/adduser");
          }}
        >
          <Text className="text-white text-lg font-bold text-center">
            Add User
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          data={clients}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => (
            <InfoCard
              title={item.name}
              description={item.phone}
              onPress={() => {}}
              info={item?.delivery?.quantity}
            />
          )}
          className="w-full p-[20px]"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500">No clients found.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}
