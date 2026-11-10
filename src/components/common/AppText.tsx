import { useAppSettings } from "@/src/context/AppSettingsContext";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { translateText } from "@/src/utils/translations";
import React from "react";
import { Text as NativeText, TextProps } from "react-native";

export default function AppText({ children, ...props }: TextProps) {
  const { language, currency, vndPerUsd } = useAppSettings();
  const childrenArray = React.Children.toArray(children);
  const localizedChildren = childrenArray.map((child, index) => {
    if (typeof child === "string") {
      const nextChild = childrenArray[index + 1];
      if (child === "$" && typeof nextChild === "number") {
        return formatCurrency(
          nextChild,
          currency,
          vndPerUsd,
          language
        );
      }
      return translateText(
        child.replace(
          /^(\s*)\$([\d,]+(?:\.\d+)?)(.*)$/,
          (_, leading: string, amount: string, suffix: string) =>
            `${leading}${formatCurrency(
              Number(amount.replace(/,/g, "")),
              currency,
              vndPerUsd,
              language
            )}${suffix}`
        ),
        language
      );
    }
    if (typeof child === "number" && childrenArray[index - 1] === "$") {
      return null;
    }
    return child;
  });

  return <NativeText {...props}>{localizedChildren}</NativeText>;
}
