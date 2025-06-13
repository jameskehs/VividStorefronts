export function persistDiscountedTotals(): void {
  const subPriceSpan = document.getElementById(
    "subPrice"
  ) as HTMLSpanElement | null;
  const grandPriceSpan = document.getElementById(
    "grandPrice"
  ) as HTMLSpanElement | null;
  const promoInput = document.getElementById(
    "customerPO"
  ) as HTMLInputElement | null;
  const taxPriceSpan = document.getElementById(
    "taxPrice"
  ) as HTMLSpanElement | null;
  const rushPriceSpan = document.getElementById(
    "rushPrice"
  ) as HTMLSpanElement | null;
  const shipPriceSpan = document.getElementById(
    "shipPrice"
  ) as HTMLSpanElement | null;
  const promoDiscountSpan = document.getElementById(
    "promoDiscount"
  ) as HTMLSpanElement | null;

  const storedSubtotal = localStorage.getItem("discountedSubtotal");
  const storedTotal = localStorage.getItem("discountedTotal");
  const storedCode = localStorage.getItem("appliedPromoCode");

  if (!subPriceSpan || !grandPriceSpan) return;

  if (storedSubtotal) subPriceSpan.textContent = storedSubtotal;
  if (storedTotal) grandPriceSpan.textContent = storedTotal;
  if (storedCode && promoInput) promoInput.value = storedCode;

  const originalSubtotal = parseFloat(
    subPriceSpan.dataset.original || subPriceSpan.textContent || "0"
  );
  const discountedSubtotal = parseFloat(
    storedSubtotal || subPriceSpan.textContent || "0"
  );
  const discountAmount = +(originalSubtotal - discountedSubtotal).toFixed(2);

  if (promoDiscountSpan && !isNaN(discountAmount) && discountAmount > 0) {
    promoDiscountSpan.textContent = `-${discountAmount.toFixed(2)}`;
  }

  // Recalculate tax
  const originalTax = parseFloat(
    taxPriceSpan?.dataset.original || taxPriceSpan?.textContent || "0"
  );
  const taxRate = originalSubtotal ? originalTax / originalSubtotal : 0;
  const newTax = +(discountedSubtotal * taxRate).toFixed(2);
  if (taxPriceSpan) taxPriceSpan.textContent = newTax.toFixed(2);

  // Recalculate grand total
  const rush = parseFloat(rushPriceSpan?.textContent || "0");
  const ship = parseFloat(shipPriceSpan?.textContent || "0");
  const newTotal = +(discountedSubtotal + newTax + rush + ship).toFixed(2);
  grandPriceSpan.textContent = newTotal.toFixed(2);
}
