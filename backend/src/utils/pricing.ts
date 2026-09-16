export interface DiscountRule {
  id: string;
  type: string; // percentage, fixed, promotional_price
  value: number;
  startDate: Date | null;
  endDate: Date | null;
  active: boolean;
}

export interface PriceCalculationResult {
  basePrice: number;
  finalPrice: number;
  previousPrice: number | null;
  discountPercentage: number | null;
  activeDiscount: {
    id: string;
    type: string;
    value: number;
    startDate: string | null;
    endDate: string | null;
    active: boolean;
  } | null;
}

export function calculateProductPrice(
  basePrice: number,
  previousPrice: number | null,
  discounts?: DiscountRule[]
): PriceCalculationResult {
  if (!discounts || discounts.length === 0) {
    return {
      basePrice,
      finalPrice: basePrice,
      previousPrice,
      discountPercentage: previousPrice && previousPrice > basePrice
        ? Math.round(((previousPrice - basePrice) / previousPrice) * 100)
        : null,
      activeDiscount: null,
    };
  }

  const now = new Date();
  // Find currently active discount
  const activeDiscount = discounts.find((d) => {
    if (!d.active) return false;
    if (d.startDate && new Date(d.startDate) > now) return false;
    if (d.endDate && new Date(d.endDate) < now) return false;
    return true;
  });

  if (!activeDiscount) {
    return {
      basePrice,
      finalPrice: basePrice,
      previousPrice,
      discountPercentage: previousPrice && previousPrice > basePrice
        ? Math.round(((previousPrice - basePrice) / previousPrice) * 100)
        : null,
      activeDiscount: null,
    };
  }

  let finalPrice = basePrice;
  let discountPercentage: number | null = null;

  if (activeDiscount.type === 'percentage') {
    discountPercentage = Math.min(Math.max(activeDiscount.value, 0), 100);
    finalPrice = Math.round(basePrice * (1 - discountPercentage / 100));
  } else if (activeDiscount.type === 'fixed') {
    finalPrice = Math.max(0, Math.round(basePrice - activeDiscount.value));
    discountPercentage = basePrice > 0
      ? Math.round(((basePrice - finalPrice) / basePrice) * 100)
      : 0;
  } else if (activeDiscount.type === 'promotional_price') {
    finalPrice = Math.max(0, Math.round(activeDiscount.value));
    discountPercentage = basePrice > 0 && finalPrice < basePrice
      ? Math.round(((basePrice - finalPrice) / basePrice) * 100)
      : null;
  }

  return {
    basePrice,
    finalPrice,
    previousPrice: previousPrice || basePrice,
    discountPercentage,
    activeDiscount: {
      id: activeDiscount.id,
      type: activeDiscount.type,
      value: activeDiscount.value,
      startDate: activeDiscount.startDate ? new Date(activeDiscount.startDate).toISOString() : null,
      endDate: activeDiscount.endDate ? new Date(activeDiscount.endDate).toISOString() : null,
      active: activeDiscount.active,
    },
  };
}
