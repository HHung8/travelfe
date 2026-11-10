import { AppCurrency } from "../context/AppSettingsContext";

export function formatCurrency(
  amount: number,
  currency: AppCurrency,
  vndPerUsd: number | null,
  language: "vi" | "en" = "vi"
): string {
  if (!Number.isFinite(amount)) return "—";
  if (currency === "VND" && vndPerUsd === null) return "—";
  const convertedAmount =
    currency === "VND" && vndPerUsd !== null ? amount * vndPerUsd : amount;

  return new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(convertedAmount);
}
