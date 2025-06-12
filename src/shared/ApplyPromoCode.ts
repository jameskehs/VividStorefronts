export function applyPromoCode(): void {
  document.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;

    if (!promoInput) {
      console.warn("Promo code input not found.");
      return;
    }

    // Patch into existing update function
    const originalUpdate = (window as any).update_order_summary_ui;

    (window as any).update_order_summary_ui = function (
      shipCost: number,
      rushCost: number,
      handlingCost: number
    ) {
      // Call the original function first
      originalUpdate(shipCost, rushCost, handlingCost);

      // Now apply promo after cart totals are updated
      applyDiscount();
    };

    function applyDiscount(): void {
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

      if (
        !subPriceSpan ||
        !grandPriceSpan ||
        !taxPriceSpan ||
        !rushPriceSpan ||
        !shipPriceSpan
      )
        return;

      const originalSubtotal = parseFloat(
        subPriceSpan.textContent?.replace(/[$,]/g, "") || "0"
      );
      const tax = parseFloat(
        taxPriceSpan.textContent?.replace(/[$,]/g, "") || "0"
      );
      const rush = parseFloat(
        rushPriceSpan.textContent?.replace(/[$,]/g, "") || "0"
      );
      const shipping = parseFloat(
        shipPriceSpan.textContent?.replace(/[$,]/g, "") || "0"
      );

      let discount = 0;
      const code = promoInput!.value.trim().toUpperCase();

      if (code === "SAVE10") discount = 10;
      else if (code === "SAVE20") discount = 20;

      const newSubtotal = Math.max(0, originalSubtotal - discount);
      const newGrandTotal = newSubtotal + tax + rush + shipping;

      subPriceSpan.textContent = newSubtotal.toFixed(2);
      grandPriceSpan.textContent = newGrandTotal.toFixed(2);
    }

    // Also run when user leaves the promo field
    promoInput.addEventListener("blur", () => {
      applyDiscount();
    });
  });
}
