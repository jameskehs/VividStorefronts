export function persistDiscountedTotals(): void {
  const subPriceSpan = document.getElementById(
    "subPrice"
  ) as HTMLSpanElement | null;
  const taxPriceSpan = document.getElementById(
    "taxPrice"
  ) as HTMLSpanElement | null;
  const grandPriceSpan = document.getElementById(
    "grandPrice"
  ) as HTMLSpanElement | null;
  const promoDiscountSpan = document.getElementById(
    "promoDiscount"
  ) as HTMLSpanElement | null;

  const promoHidden = document.getElementById(
    "appliedPromoCode"
  ) as HTMLInputElement | null;
  const discountTotalInput = document.getElementById(
    "discountedTotal"
  ) as HTMLInputElement | null;

  const storedSubtotal = localStorage.getItem("discountedSubtotal");
  const storedTotal = localStorage.getItem("discountedTotal");
  const storedDiscount = localStorage.getItem("promoDiscountAmount");
  const storedPromoCode = localStorage.getItem("promoCode");

  if (subPriceSpan && storedSubtotal) {
    subPriceSpan.textContent = storedSubtotal;
  }

  if (grandPriceSpan && storedTotal) {
    grandPriceSpan.textContent = storedTotal;
  }

  if (promoDiscountSpan && storedDiscount) {
    promoDiscountSpan.textContent = `-${storedDiscount}`;
  }

  if (promoHidden && storedPromoCode) {
    promoHidden.value = storedPromoCode;
  }

  if (discountTotalInput && storedTotal) {
    discountTotalInput.value = storedTotal;
  }
}
