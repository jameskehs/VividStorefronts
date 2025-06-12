export function applyPromoCode(): void {
  document.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const subPriceSpan = document.getElementById(
      "subPrice"
    ) as HTMLSpanElement | null;
    const grandPriceSpan = document.getElementById(
      "grandPrice"
    ) as HTMLSpanElement | null;

    if (!promoInput || !subPriceSpan || !grandPriceSpan) {
      console.warn("Promo code elements not found.");
      return;
    }

    const originalSubtotal = parseFloat(
      subPriceSpan.textContent?.replace(/[$,]/g, "") || "0"
    );
    const tax = parseFloat(
      (
        document.getElementById("taxPrice") as HTMLSpanElement
      )?.textContent?.replace(/[$,]/g, "") || "0"
    );
    const rush = parseFloat(
      (
        document.getElementById("rushPrice") as HTMLSpanElement
      )?.textContent?.replace(/[$,]/g, "") || "0"
    );
    const shipping = parseFloat(
      (
        document.getElementById("shipPrice") as HTMLSpanElement
      )?.textContent?.replace(/[$,]/g, "") || "0"
    );

    function recalculateTotal(): void {
      let discount = 0;
      const code = promoInput!.value.trim().toUpperCase();

      if (code === "SAVE10") discount = 10;
      else if (code === "SAVE20") discount = 20;

      const newSubtotal = Math.max(0, originalSubtotal - discount);
      const newGrandTotal = newSubtotal + tax + rush + shipping;

      subPriceSpan!.textContent = newSubtotal.toFixed(2);
      grandPriceSpan!.textContent = newGrandTotal.toFixed(2);
    }

    promoInput.addEventListener("blur", recalculateTotal);
  });
}
