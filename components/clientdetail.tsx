import { colors } from "@/constants/colors";
import { generatePdf } from "@/lib/invoice";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Asset } from "expo-asset";
import { ImageResult, useImageManipulator } from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Linking,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import FAIcon from "react-native-vector-icons/FontAwesome";
import FormInput from "./forminput";
import InfoCard from "./infocard";

const deleteDelivery = process.env.EXPO_PUBLIC_DELETE_DELIVERY === "true";

const IMAGE = Asset.fromModule(require("@/assets/logo-filled.png"));

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

  const [imageResult, setImageResult] = useState<ImageResult | null>();
  const context = useImageManipulator(IMAGE.uri);
  const router = useRouter();

  const [openSupplyModal, setOpenSupplyModal] = useState(false);
  const [openCollectModal, setOpenCollectModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeliveryDeleteModal, setOpenDeliveryDeleteModal] = useState<
    null | string
  >(null);
  // const [invoiceOpen, setInvoiceOpen] = useState(false);

  const [quantity, setQuantity] = useState<any>(null);
  const [date, setDate] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);

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
    const delivery = { ...selectedDelivery, quantity, updatedAt: date };

    try {
      await deliveryService.updateDelivery(selectedDelivery?.id!, delivery);
      const deliveries = await deliveryService.getDeliveriesByUserId(
        id as string
      );
      setDeliveries(deliveries);
      // toast.success("Delivery updated successfully");
    } catch (error) {
      console.error("Error updating delivery: ", error);
      // toast.error("Error updating delivery", {
      //   description: error instanceof Error ? error.message : "Unknown error",
      // });
    }
  };

  const handleDeleteDelivery = async () => {
    try {
      await deliveryService.deleteDelivery(openDeliveryDeleteModal!);
      const deliveries = await deliveryService.getDeliveriesByUserId(
        id as string
      );
      setDeliveries(deliveries);
    } catch (error) {
      console.error("Error deleting delivery: ", error);
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

  const setLogo = async () => {
    await IMAGE.downloadAsync();
    const manipulatedImage = await context.renderAsync();
    const result = await manipulatedImage.saveAsync({ base64: true });
    setImageResult(result);
  };

  useEffect(() => {
    setLogo();
  }, []);

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
                    const phone =
                      client?.phone.length === 10
                        ? `+91${client?.phone}`
                        : client.phone;
                    const whatsappUrl = `whatsapp://send?phone=${phone}&text=`;
                    const waBusinessUrl = `https://wa.me/${phone}?text`;

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

          <View className="flex-row items-center gap-5 mt-1">
            <Text className="text-sm text-gray-400 flex-[0.5]">Remaining</Text>
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

          <View className="flex-row items-center gap-5 mt-1">
            <Text className="text-sm text-gray-400 flex-[0.5]">
              {type === "client" ? "Total Supplied" : "Distributed"}
            </Text>
            <Text className="text-lg font-semibold flex-[1]">
              {deliveries?.totalSupply || 0}
            </Text>
          </View>

          <View>
            <TouchableOpacity
              className="mt-5 bg-blue-500 rounded-lg px-5 py-3 flex-row items-center justify-center gap-3"
              onPress={() => {
                generatePdf(client, deliveries!, imageResult!);
              }}
            >
              <FAIcon
                name="file-text-o"
                size={14}
                className="font-bold"
                color={colors.neutral[50]}
              />
              <Text className="text-neutral-50 text-center">
                Generate Invoice
              </Text>
            </TouchableOpacity>
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
                {type === "client" ? "Supply" : "Distribute"}
              </Text>
            </TouchableOpacity>

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
          </View>
        </View>
        <FlatList
          data={deliveries?.deliveries}
          horizontal={false}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => {
            return (
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
                description={`${new Date(
                  item?.updatedAt
                ).toLocaleDateString()} ${
                  item?.updatedAt !== item?.created_at ? "- updated" : ""
                }`}
                subinfo={item?.quantity}
                onPress={() => {
                  setQuantity(item?.quantity);
                  setDate(item?.updatedAt);
                  setSelectedDelivery(item);
                }}
              />
            );
          }}
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

      {/* Delete delivery */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!openDeliveryDeleteModal}
        onRequestClose={() => {
          setOpenDeliveryDeleteModal(null);
        }}
      >
        <View className="flex-1 justify-center items-center bg-neutral-950/0 bg-opacity-50 shadow-md shadow-gray-400/30">
          <View className="bg-white rounded-lg p-[20px] w-[90%]">
            <Text className="text-2xl font-bold">Confirm?</Text>
            <Text className="mt-3 text-gray-500">
              Are you sure to delete this delivery?
            </Text>
            <View className="flex-row items-center gap-3 mt-5">
              <TouchableOpacity
                className="flex-1 bg-gray-300 rounded-lg justify-center items-center px-5 h-[40px]"
                onPress={() => {
                  setOpenDeliveryDeleteModal(null);
                }}
              >
                <Text className="text-neutral-900">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-lg justify-center items-center px-5 h-[40px]"
                onPress={() => {
                  handleDeleteDelivery();
                  setOpenDeliveryDeleteModal(null);
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
        visible={quantity != null}
        onRequestClose={() => {
          setQuantity(null);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View className="flex-1 justify-center items-center bg-neutral-950/0 bg-opacity-50 shadow-md shadow-gray-400/30">
            <View className="bg-white rounded-lg p-5 w-[90%]">
              <View className="flex-row justify-end mb-5">
                <TouchableOpacity
                  onPress={() => {
                    setQuantity(null);
                  }}
                >
                  <Icon name="close" size={20} />
                </TouchableOpacity>
              </View>

              <FormInput
                placeholder="Quantity"
                label="Update Quantity"
                onChangeText={(value) => setQuantity(value)}
                value={quantity || selectedDelivery?.quantity}
                className="mb-5"
                keyboardType="numeric"
                // autoFocus={true}
              />
              <View className="mb-5">
                {/* <Text className="mb-2">Update Date</Text> */}
                {showPicker ? (
                  <View>
                    <DateTimePicker
                      value={new Date(date)}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate: any) => {
                        if (event.type === "set") {
                          const currentDate = selectedDate || new Date(date);
                          setDate(currentDate.toISOString().split("T")[0]);

                          if (Platform.OS === "android") {
                            setShowPicker(false);
                          }
                        } else {
                          setShowPicker(false);
                        }
                      }}
                    />
                    {Platform.OS === "ios" && (
                      <TouchableOpacity
                        className="mt-2 bg-blue-500 rounded-lg px-5 py-3"
                        onPress={() => {
                          setShowPicker(false);
                        }}
                      >
                        <Text className="text-neutral-50 text-center">
                          Done
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View>
                    <Text>Update Date</Text>
                    <View className="flex-row items-center gap-3 py-2 max-w-full">
                      <Text className="p-3 border border-gray-200 rounded-md">
                        {date?.split("T")[0]}
                      </Text>
                      <TouchableOpacity
                        className=""
                        onPress={() => {
                          setShowPicker(true);
                        }}
                      >
                        <Text className="text-primary text-center">Change</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
              <View className="flex-row items-center gap-3 mt-3">
                <TouchableOpacity
                  className="flex-1"
                  onPress={() => {
                    setQuantity(null);
                  }}
                >
                  <Text className="text-lg font-semibold text-gray-900 border border-l-gray-900 text-center rounded-lg py-3">
                    Cancel
                  </Text>
                </TouchableOpacity>

                {deleteDelivery && (
                  <TouchableOpacity
                    className="flex-1"
                    onPress={() => {
                      const id = selectedDelivery?.id!;
                      setSelectedDelivery(null);
                      setQuantity(null);
                      setDate(null);
                      setOpenDeliveryDeleteModal(id);
                    }}
                  >
                    <Text className="text-lg font-semibold text-neutral-50 bg-red-500 border border-red-600 text-center rounded-lg py-3">
                      Delete
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  className="flex-1"
                  onPress={() => {
                    handleUpdateDelivery();
                    setSelectedDelivery(null);
                    setQuantity(null);
                    setDate(null);
                  }}
                >
                  <Text className="text-lg font-semibold text-neutral-50 bg-primary border border-primary text-center rounded-lg py-3">
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default ClientDetail;
