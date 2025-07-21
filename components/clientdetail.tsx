import { colors } from "@/constants/colors";
import {
  ClientTypes,
  IClientService,
} from "@/services/interfaces/client.services";
import {
  DeliveryTypes,
  IDelivery,
  IDeliveryService,
  TDeliveryTypes,
} from "@/services/interfaces/delivery.services";
import { ClientService } from "@/services/supabase/client.services";
import { DeliveryService } from "@/services/supabase/delivery.service";
import { TDeliveryResponse } from "@/types/delivery.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import FAIcon from "react-native-vector-icons/FontAwesome";
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
  const [deliveries, setDeliveries] = useState<TDeliveryResponse | null>(null);

  const [selectedDelivery, setSelectedDelivery] = useState<IDelivery | null>(
    null
  );

  const router = useRouter();

  const [openSupplyModal, setOpenSupplyModal] = useState(false);
  const [openCollectModal, setOpenCollectModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [quantity, setQuantity] = useState<any>(null);

  const handleAddDelivery = async (quantity: string, type: TDeliveryTypes) => {
    const deliveryData = {
      userId: client.id,
      quantity: Number(quantity),
      type,
    };

    try {
      const delivery = await deliveryService.createDelivery(deliveryData);
      setDeliveries(
        (prevDeliveries) =>
          ({
            deliveries: [delivery, ...(prevDeliveries?.deliveries || [])],
            totalSupply:
              type === "supply"
                ? deliveries?.totalSupply + quantity
                : deliveries?.totalSupply,
            totalCollect:
              type === "collect"
                ? deliveries?.totalCollect + quantity
                : deliveries?.totalCollect,
          } as TDeliveryResponse)
      );
      // toast.success(
      //   `Delivery ${
      //     type === DeliveryTypes.SUPPLY ? "supplied" : "collected"
      //   } successfully`
      // );
    } catch (error) {
      console.error("Error creating delivery: ", error);
      // toast.error("Error creating delivery", {
      //   description: error instanceof Error ? error.message : "Unknown error",
      // });
    }
  };

  const handleUpdateDelivery = async () => {
    const delivery = { ...selectedDelivery, quantity };

    try {
      await deliveryService.updateDelivery(selectedDelivery?.id!, delivery);
      const deliveries = await deliveryService.getDeliveriesByUserId(
        id as string
      );
      setDeliveries(deliveries);
      // toast.success("Delivery updated successfully");
    } catch (error) {
      console.error("Error updating delivery");
      // toast.error("Error updating delivery", {
      //   description: error instanceof Error ? error.message : "Unknown error",
      // });
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

  const handleDelete = () => {
    clientService
      .deleteClient(id as string)
      .then(() => {
        // After deletion, redirect to the appropriate page based on type);
        if (type === "client") {
          router.push("/");
        } else {
          router.push(`/${type}s`);
        }
      })
      .catch((error) => {
        console.error("Error deleting client: ", error);
      });
  };

  return (
    <>
      <View className="p-[20px] h-full max-h-full">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="border w-[70px] text-center border-gray-200 px-5 py-2 rounded-md"
          >
            <Icon name="arrowleft" size={24} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className=""
              onPress={() => {
                setOpenDeleteModal(true);
              }}
            >
              <Icon name="delete" size={24} color={colors.red[500]} />
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-3"
              onPress={() => {
                router.push(`/edit/${id}?type=${type}`);
              }}
            >
              <Icon name="edit" size={24} color={colors.blue[500]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Details */}
        <View className="border border-gray-200 rounded-lg p-5 mt-5">
          <View className="flex-row items-center gap-5 justify-between">
            <View className="flex-row items-center gap-5 flex-1">
              <View className="bg-gray-300 w-[50px] h-[50px] rounded-full justify-center items-center">
                <Text className="text-3xl font-semibold text-gray-400">
                  {client?.name[0]}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold ">{client?.name}</Text>
                <Text className="text-sm text-gray-400">{client?.phone}</Text>
              </View>
            </View>
            {client?.phone && (
              <View className="flex flex-row gap-5 items-center">
                <FAIcon
                  name="whatsapp"
                  size={24}
                  color={colors.green[500]}
                  onPress={async () => {
                    const whatsappUrl = `whatsapp://send?phone=${client?.phone}&text=`;
                    const waBusinessUrl = `https://wa.me/${client?.phone}?text`;

                    try {
                      const canOpen = await Linking.canOpenURL(whatsappUrl);
                      if (canOpen) {
                        await Linking.openURL(whatsappUrl);
                      } else {
                        // Fallback to wa.me link, which works in browser and supports Business
                        await Linking.openURL(waBusinessUrl);
                      }
                    } catch (err) {
                      Alert.alert(
                        "Error",
                        "WhatsApp is not installed or cannot be opened."
                      );
                      console.error("WhatsApp error:", err);
                    }
                  }}
                />
                <FAIcon
                  name="phone"
                  size={24}
                  color={colors.blue[500]}
                  onPress={() => {
                    Linking.openURL(`tel:${client?.phone}`);
                  }}
                />
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-5 mt-5">
            <Text className="text-sm text-gray-400 flex-[0.5]">Location</Text>
            <Text className="text-lg font-semibold flex-[1]">
              {client?.address}
            </Text>
          </View>
          {type === "client" && (
            <>
              <View className="flex-row items-center gap-5 mt-1">
                <Text className="text-sm text-gray-400 flex-[0.5]">
                  Remaining
                </Text>
                <View className="flex-[1]">
                  <Text className="text-lg font-semibold bg-yellow-200 w-[70px] px-3 text-center rounded-full text-yellow-800 border border-yellow-500">
                    {(deliveries?.totalSupply || 0) -
                      (deliveries?.totalCollect || 0)}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-5 mt-1">
                <Text className="text-sm text-gray-400 flex-[0.5]">
                  Total Collected
                </Text>
                <Text className="text-lg font-semibold flex-[1]">
                  {deliveries?.totalCollect || 0}
                </Text>
              </View>
            </>
          )}
          <View className="flex-row items-center gap-5 mt-1">
            <Text className="text-sm text-gray-400 flex-[0.5]">
              {type === "client" ? "Total Supplied" : "Distributed"}
            </Text>
            <Text className="text-lg font-semibold flex-[1]">
              {deliveries?.totalSupply || 0}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between w-full mt-5">
          <Text className="text-lg text-gray-500 font-semibold mb-2">
            Recent {type === "client" ? "Deliveries" : "Distributions"}
          </Text>
          <View className="flex items-center flex-row gap-[20px] p-4 py-1">
            <TouchableOpacity
              className="rounded-lg"
              onPress={() => {
                setOpenSupplyModal(true);
              }}
            >
              <Text className="text-blue-500 text-lg font-medium text-center">
                {type === "client" ? "Supply" : "New Distribute"}
              </Text>
            </TouchableOpacity>
            {type === "client" && (
              <TouchableOpacity
                className="rounded-lg"
                onPress={() => {
                  setOpenCollectModal(true);
                }}
              >
                <Text className="text-blue-500 text-lg font-medium text-center">
                  Collect
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <FlatList
          data={deliveries?.deliveries}
          horizontal={false}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item: any) => item.id.toString()}
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
              title={
                item.type === DeliveryTypes.SUPPLY ? "Delivered" : "Collected"
              }
              description={new Date(item?.created_at).toLocaleDateString()}
              info={item?.quantity}
              onPress={() => {
                setQuantity(item?.quantity);
                setSelectedDelivery(item);
              }}
            />
          )}
          className="w-full h-full"
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={openSupplyModal}
        onRequestClose={() => {
          setOpenSupplyModal(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-neutral-950/0 bg-opacity-50 shadow-md shadow-gray-400/30">
          <View className="bg-white rounded-lg p-5 w-[90%]">
            <View className="flex-row justify-end mb-5">
              <TouchableOpacity
                onPress={() => {
                  setOpenSupplyModal(false);
                }}
              >
                <Icon name="close" size={20} />
              </TouchableOpacity>
            </View>
            <FormInput
              placeholder="Quantity"
              label="Supply Quantity"
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
                  setOpenSupplyModal(false);
                }}
              >
                <Text className="text-lg font-semibold text-gray-900 border border-l-gray-900 text-center rounded-lg py-3">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                onPress={() => {
                  handleAddDelivery(quantity, DeliveryTypes.SUPPLY);
                  setOpenSupplyModal(false);
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={openCollectModal}
        onRequestClose={() => {
          setOpenCollectModal(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-neutral-950/0 bg-opacity-50 shadow-md shadow-gray-400/30">
          <View className="bg-white rounded-lg p-5 w-[90%]">
            <View className="flex-row justify-end mb-5">
              <TouchableOpacity
                onPress={() => {
                  setOpenCollectModal(false);
                }}
              >
                <Icon name="close" size={20} />
              </TouchableOpacity>
            </View>
            <FormInput
              placeholder="Quantity"
              label="Collect Quantity"
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
                  setOpenCollectModal(false);
                }}
              >
                <Text className="text-lg font-semibold text-gray-900 border border-l-gray-900 text-center rounded-lg py-3">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                onPress={() => {
                  handleAddDelivery(quantity, DeliveryTypes.COLLECT);
                  setOpenCollectModal(false);
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={openDeleteModal}
        onRequestClose={() => {
          setOpenDeleteModal(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-neutral-950/0 bg-opacity-50 shadow-md shadow-gray-400/30">
          <View className="bg-white rounded-lg p-[20px] w-[90%]">
            <Text className="text-2xl font-bold">Confirm?</Text>
            <Text className="mt-3 text-gray-500">
              Are you sure to delete this {type}
            </Text>
            <View className="flex-row items-center gap-3 mt-5">
              <TouchableOpacity
                className="flex-1 bg-gray-300 rounded-lg justify-center items-center px-5 h-[40px]"
                onPress={() => {
                  setOpenDeleteModal(false);
                }}
              >
                <Text className="text-neutral-900">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-lg justify-center items-center px-5 h-[40px]"
                onPress={() => {
                  handleDelete();
                  setOpenDeleteModal(false);
                }}
              >
                <Text className="text-neutral-50">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedDelivery != null}
        onRequestClose={() => {
          setSelectedDelivery(null);
        }}
      >
        <View className="flex-1 justify-center items-center bg-neutral-950/0 bg-opacity-50 shadow-md shadow-gray-400/30">
          <View className="bg-white rounded-lg p-5 w-[90%]">
            <View className="flex-row justify-end mb-5">
              <TouchableOpacity
                onPress={() => {
                  setSelectedDelivery(null);
                }}
              >
                <Icon name="close" size={20} />
              </TouchableOpacity>
            </View>
            <FormInput
              placeholder="Quantity"
              label="Update Quantity"
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
                  setSelectedDelivery(null);
                }}
              >
                <Text className="text-lg font-semibold text-gray-900 border border-l-gray-900 text-center rounded-lg py-3">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                onPress={() => {
                  handleUpdateDelivery();
                  setSelectedDelivery(null);
                  setQuantity(null);
                }}
              >
                <Text className="text-lg font-semibold text-neutral-50 bg-primary border border-primary text-center rounded-lg py-3">
                  Update
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
