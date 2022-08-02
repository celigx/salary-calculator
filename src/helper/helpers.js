// Format number to currency
export const formatHrk = (value) => {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "HRK",
  }).format(value);
};

// Format number to EUR currency
export const formatEur = (value) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

// Fixed converstion rate 1 € = 7.53450 kn
export const conversionRate = 7.5345;
