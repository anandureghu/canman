import React from "react";
import { Text, TextInput, View } from "react-native";

interface Props extends React.ComponentProps<typeof TextInput> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
}

const FormInput: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChangeText,
  className,
  ...rest
}) => {
  return (
    <View className={`mb-5 ${className ? className : ""}`}>
      {label && <Text>{label}</Text>}
      <TextInput
        placeholder={placeholder ? placeholder : label}
        onChangeText={onChangeText}
        defaultValue={value}
        value={value}
        className="border border-gray-200 rounded-md p-3 mt-2"
        {...rest}
      />
    </View>
  );
};

export default FormInput;
