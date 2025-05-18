import FormInput from "@/components/forminput";
import { supabase } from "@/db/supabase";
import { IClientService } from "@/services/interfaces/client.services";
import { ClientService } from "@/services/supabase/client.services";
import { Link, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";

const AddUser = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const clientService: IClientService = useMemo(
    () => new ClientService(supabase),
    []
  );

  const router = useRouter();

  const handleSubmit = async () => {
    const clientData = {
      name,
      phone,
      address: location,
    };
    try {
      await clientService.createClient(clientData);
      router.push("/"); // Redirect to home after fetching clients
    } catch (error) {
      console.error("Error creating client: ", error);
    }
  };

  return (
    <SafeAreaView className="p-[20px]">
      {/* Header */}
      <View>
        <Link
          href="/"
          className="border w-[70px] text-center border-gray-200 px-5 py-2 rounded-md"
        >
          <Icon name="arrowleft" size={30} />
        </Link>
        <Text className="text-2xl font-bold mt-4">Add New User</Text>
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
          <Text className="text-white text-lg font-bold text-center">
            Add User
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddUser;
