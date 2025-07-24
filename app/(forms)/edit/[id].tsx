import FormInput from "@/components/forminput";
import {
  ClientTypes,
  IClientService,
} from "@/services/interfaces/client.services";
import { ClientService } from "@/services/supabase/client.services";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";

const EditClient = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const clientService: IClientService = useMemo(() => new ClientService(), []);

  const router = useRouter();
  const { id, type }: { id: string; type: ClientTypes } =
    useLocalSearchParams();

  const handleSubmit = async () => {
    const clientData = {
      name,
      phone,
      address: location,
      type,
    };
    try {
      await clientService.updateClient(id, clientData);
      router.push(`/client/${id}?type=${type}`); // Redirect to detail after updating details
      // toast.success("Client updated successfully");
    } catch (error) {
      console.error("Error updating client: ", error);
      // toast.error("Failed to update client. Please try again.", {
      //   description: Error instanceof Error ? Error.message : "Unknown error",
      // });
    }
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await clientService.getClientById(id as string);
        setName(clientData.name);
        setPhone(clientData.phone);
        setLocation(clientData.address);
      } catch (error) {
        console.error("Error fetching client: ", error);
      }
    };

    fetchClient();
  }, []);

  return (
    <SafeAreaView className="p-[20px]">
      {/* Header */}
      <View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="border w-[70px] text-center border-gray-200 px-5 py-2 rounded-md"
        >
          <Icon name="arrowleft" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold mt-4 capitalize">Edit {type}</Text>
      </View>

      {/* Form */}
      <View className="mt-5">
        <FormInput
          label="Name"
          placeholder="John Doe"
          onChangeText={(value) => setName(value)}
          value={name}
        />
        <FormInput
          label="Phone No."
          placeholder="+91 1234567890"
          onChangeText={(value) => setPhone(value)}
          value={phone}
        />
        <FormInput
          label="Location"
          placeholder="Koratty, Thrissur"
          onChangeText={(value) => setLocation(value)}
          value={location}
        />
        <TouchableOpacity
          className="bg-blue-500 p-2 rounded-lg w-full mt-5"
          onPress={() => handleSubmit()}
        >
          <Text className="text-white text-lg font-bold text-center capitalize">
            Update {type}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditClient;
