import React from "react";
import { Text, TextInput, View } from "react-native";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const FormInput: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChangeText,
}) => {
  return (
    <View className="mb-5">
      <Text>{label}</Text>
      <TextInput
        placeholder={placeholder ? placeholder : label}
        onChangeText={onChangeText}
        value={value}
        className="border border-gray-200 rounded-md p-3 mt-2"
      />
    </View>
  );
};

export default FormInput;
