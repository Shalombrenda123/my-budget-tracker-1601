export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "XAF", label: "FCFA Franc", locale: "fr-CM" },
  { value: "NGN", label: "₦ Naira", locale: "en-NG" },
  { value: "CDF", label: "FC Franc", locale: "fr-CD" },
  { value: "EUR", label: "€ Euro", locale: "fr-FR" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" }
];

export type Currency = (typeof Currencies)[0];