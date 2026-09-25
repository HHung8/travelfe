export function detectCardBrand(cardNumber: string): string {
    const digits = cardNumber.replace(/\D/g, "");
    if(/^4/.test(digits)) return "Visa";
    if(/^5[1-5]/.test(digits)) return "Mastercard";
    if(/^3[47]/.test(digits)) return "Amex";
    return "Card";
}

export function formatCardNumberDisplay(digits: string): string {
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
