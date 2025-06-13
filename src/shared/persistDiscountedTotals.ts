export function persistDiscountedTotals(): void {
  window.addEventListener("load", () => {
    const subPriceSpan = document.getElementById(
      "subPrice"
    ) as HTMLSpanElement | null;
    const grandPriceSpan = document.getElementById(
      "grandPrice"
    ) as HTMLSpanElement | null;
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

    if (!storedSubtotal || !storedTotal || !storedCode) return;

    const discountedSubtotal = parseFloat(storedSubtotal);
    const discountedTotal = parseFloat(storedTotal);

    // Get current original tax by estimating from discounted tax
    const originalSubtotal = parseFloat(
      subPriceSpan?.dataset.original || "37.16"
    ); // fallback default
    const currentTax = parseFloat(
      taxPriceSpan?.dataset.original || taxPriceSpan?.textContent || "0"
    );
    const estimatedTaxRate =
      originalSubtotal > 0 ? currentTax / originalSubtotal : 0;
    const recalculatedTax = +(discountedSubtotal * estimatedTaxRate).toFixed(2);

    const rush = parseFloat(rushPriceSpan?.textContent || "0");
    const ship = parseFloat(shipPriceSpan?.textContent || "0");
    const recalculatedGrandTotal = +(
      discountedSubtotal +
      recalculatedTax +
      rush +
      ship
    ).toFixed(2);

    const discountAmount = +(originalSubtotal - discountedSubtotal).toFixed(2);

    // Update values
    if (subPriceSpan) subPriceSpan.textContent = discountedSubtotal.toFixed(2);
    if (taxPriceSpan) taxPriceSpan.textContent = recalculatedTax.toFixed(2);
    if (grandPriceSpan)
      grandPriceSpan.textContent = recalculatedGrandTotal.toFixed(2);
    if (promoDiscountSpan)
      promoDiscountSpan.textContent = `-${discountAmount.toFixed(2)}`;
  });
}
