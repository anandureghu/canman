import { colors } from "@/constants/colors";
import {
  ClientTypes,
  IClientService,
} from "@/services/interfaces/client.services";
import { IDeliveryService } from "@/services/interfaces/delivery.services";
import { ClientService } from "@/services/supabase/client.services";
import { DeliveryService } from "@/services/supabase/delivery.service";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import FormInput from "./forminput";
import InfoCard from "./infocard";

const ClientDetail = () => {
  const clientService: IClientService = useMemo(() => new ClientService(), []);
  const deliveryService: IDeliveryService = useMemo(
    () => new DeliveryService(),
    []
  );

  const { id, type }: { id: string; type: ClientTypes } =
    useLocalSearchParams();

  const [client, setClient] = React.useState<any>(null);
  const [deliveries, setDeliveries] = useState<any>([]);

  const [openModal, setOpenModal] = useState(false);

  const [quantity, setQuantity] = useState<any>(null);

  const handleAddDelivery = async (quantity: string) => {
    const deliveryData = {
      userId: client.id,
      quantity: Number(quantity),
    };

    try {
      const delivery = await deliveryService.createDelivery(deliveryData);
      setDeliveries((prevDeliveries: any) => [delivery, ...prevDeliveries]);
    } catch (error) {
      console.error("Error creating delivery: ", error);
    }
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await clientService.getClientById(id as string);
        setClient(clientData);
      } catch (error) {
        console.error("Error fetching client: ", error);
      }
    };

    const fetchDeliveries = async () => {
      try {
        const deliveries = await deliveryService.getDeliveriesByUserId(
          id as string
        );
        setDeliveries(deliveries);
      } catch (error) {
        console.error("Error fetching deliveries: ", error);
      }
    };

    fetchDeliveries();
    fetchClient();
  }, []);

  return (
    <>
      <View className="p-[20px] h-full max-h-full">
        {/* Header */}
        <View className="">
          <Link
            href={type === "client" ? "/" : `/${type}s`}
            className="border w-[70px] text-center border-gray-200 px-5 py-2 rounded-md"
          >
            <Icon name="arrowleft" size={24} />
          </Link>
        </View>

        {/* Details */}
        <View className="border border-gray-200 rounded-lg p-5 mt-5">
          <View className="flex-row items-center gap-5">
            <View className="bg-gray-300 w-[50px] h-[50px] rounded-full justify-center items-center">
              <Text className="text-3xl font-semibold text-gray-400">
                {client?.name[0]}
              </Text>
            </View>
            <View>
              <Text className="text-xl font-semibold">{client?.name}</Text>
              <Text className="text-sm text-gray-400">{client?.phone}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-5 mt-5">
            <Text className="text-sm text-gray-400 flex-[0.5]">Location</Text>
            <Text className="text-lg font-semibold flex-[1]">
              {client?.address}
            </Text>
          </View>
          <View className="flex-row items-center gap-5 mt-5">
            <Text className="text-sm text-gray-400 flex-[0.5]">
              Current Holding
            </Text>
            <Text className="text-lg font-semibold flex-[1]">
              {deliveries[0]?.quantity || 0}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between w-full mt-5">
          <Text className="text-lg text-gray-500 font-semibold mb-2">
            Recent{" "}
            {type === "client"
              ? "Deliveries"
              : type === "supplier"
              ? "Supplys"
              : "Distributions"}
          </Text>
          <TouchableOpacity
            className="p-4 py-1 rounded-lg"
            onPress={() => {
              setOpenModal(true);
            }}
          >
            <Text className="text-blue-500 text-lg font-medium text-center">
              {type === "client"
                ? "New Delivery"
                : type === "supplier"
                ? "Get Supply"
                : "New Distribute"}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={deliveries}
          horizontal={false}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => (
            <InfoCard
              icon={
                <Icon name="checkcircle" size={50} color={colors.green[500]} />
              }
              title={"Delivered"}
              description={new Date(item?.created_at).toLocaleDateString()}
              info={item?.quantity}
              onPress={() => {}}
            />
          )}
          className="w-full h-full"
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-neutral-950/0 bg-opacity-50 shadow-md shadow-gray-400/30">
          <View className="bg-white rounded-lg p-5 w-[90%]">
            <View className="flex-row justify-end mb-5">
              <TouchableOpacity
                onPress={() => {
                  setOpenModal(false);
                }}
              >
                <Icon name="close" size={20} />
              </TouchableOpacity>
            </View>
            <FormInput
              placeholder="Quantity"
              label="Quantity"
              onChangeText={(value) => setQuantity(value)}
              value={quantity}
              className="mb-5"
              keyboardType="numeric"
              autoFocus={true}
            />
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                className="flex-1"
                onPress={() => {
                  setOpenModal(false);
                }}
              >
                <Text className="text-lg font-semibold text-gray-900 border border-l-gray-900 text-center rounded-lg py-3">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                onPress={() => {
                  handleAddDelivery(quantity);
                  setOpenModal(false);
                  setQuantity(null);
                }}
              >
                <Text className="text-lg font-semibold text-neutral-50 bg-primary border border-primary text-center rounded-lg py-3">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ClientDetail;
