import { useAppSettings } from "@/src/context/AppSettingsContext";
import { translateText } from "@/src/utils/translations";
import React from "react";
import { TextInput as NativeTextInput, TextInputProps } from "react-native";

export default function AppTextInput({ placeholder, ...props }: TextInputProps) {
  const { language } = useAppSettings();
  const localizedPlaceholder = placeholder
    ? translateText(placeholder, language)
    : undefined;

  return <NativeTextInput {...props} placeholder={localizedPlaceholder} />;
}
