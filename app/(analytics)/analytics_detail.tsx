import InfoCard from "@/components/infocard";
import { colors } from "@/constants/colors";
import {
  ClientTypes,
  TClientTypes,
} from "@/services/interfaces/client.services";
import {
  DeliveryTypes,
  IDeliveryService,
  TDeliveryTypes,
} from "@/services/interfaces/delivery.services";
import { DeliveryService } from "@/services/supabase/delivery.service";
import { GetRecentDeliveriesByUserTypeResponse } from "@/types/delivery.types";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

interface Props {
  type: TClientTypes;
}

export default function AnalyticsDetail({ type }: Props) {
  const router = useRouter();
  const {
    clientType,
    deliveryType,
    page,
  }: {
    clientType: TClientTypes;
    deliveryType: TDeliveryTypes;
    page: string;
  } = useLocalSearchParams();

  const deliveryService: IDeliveryService = useMemo(
    () => new DeliveryService(),
    []
  );

  const [recent, setRecent] = useState<GetRecentDeliveriesByUserTypeResponse[]>(
    []
  );

  useFocusEffect(
    useCallback(() => {
      const fetchRecent = async () => {
        try {
          const recent = await deliveryService.getRecentDeliveriesByUserType(
            clientType,
            { deliveryType }
          );
          setRecent(recent);
        } catch (error) {
          console.error(`Error fetching ${type}s: `, error);
        }
      };
      fetchRecent();

      return () => {}; // Optional cleanup
    }, [])
  );

  return (
    <SafeAreaView className="max-h-full h-full">
      {/* Listing */}
      {/* <View className=""> */}
      <View className="p-[20px] pb-[80px]">
        <View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="border w-[70px] text-center border-gray-200 px-5 py-2 rounded-md"
          >
            <Icon name="arrowleft" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold mt-4 capitalize">{page}</Text>
        </View>
        <FlatList
          data={recent}
          horizontal={false}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item: GetRecentDeliveriesByUserTypeResponse, i) =>
            item.name + i
          }
          renderItem={({ item }: any) => (
            <InfoCard
              icon={
                <View
                  className={`${
                    item.type === DeliveryTypes.SUPPLY
                      ? "bg-red-50 border border-red-200"
                      : "bg-green-50 border border-green-200"
                  } w-full h-full rounded-full flex items-center justify-center`}
                >
                  <Icon
                    name="checkcircle"
                    size={20}
                    color={
                      item.type === DeliveryTypes.SUPPLY
                        ? colors.red[500]
                        : colors.green[500]
                    }
                  />
                </View>
              }
              title={item.name}
              description={new Date(item?.created_at).toLocaleDateString()}
              info={item?.quantity}
              onPress={() => {
                router.push(
                  `/client/${item.id}?type=${
                    page === "Delivered" || page === "Stock Collected"
                      ? ClientTypes.CLIENT
                      : ClientTypes.DISTRIBUTOR
                  }`
                );
              }} // Navigate to client detail
            />
          )}
          className="w-full h-full"
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* </View> */}
    </SafeAreaView>
  );
}
