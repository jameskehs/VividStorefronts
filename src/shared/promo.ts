import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function setupPromoCodeDiscount(): void {
  if (GLOBALVARS.currentPage !== StorefrontPage.CHECKOUTPAYMENT) return;

  document.addEventListener("DOMContentLoaded", () => {
    const promoCodeInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const subPriceSpan = document.getElementById("subPrice");
    const taxPriceSpan = document.getElementById("taxPrice");
    const rushPriceSpan = document.getElementById("rushPrice");
    const shipPriceSpan = document.getElementById("shipPrice");
    const grandPriceSpan = document.getElementById("grandPrice");

    if (
      !promoCodeInput ||
      !subPriceSpan ||
      !taxPriceSpan ||
      !rushPriceSpan ||
      !shipPriceSpan ||
      !grandPriceSpan
    ) {
      console.warn("Required elements for promo code discount not found.");
      return;
    }

    const validPromoCodes: Record<string, number> = {
      SAVE10: 10.0,
      FREESHIP: 14.98,
      VIP25: 25.0,
    };

    function parseCurrency(value: string): number {
      return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
    }

    function formatCurrency(value: number): string {
      return value.toFixed(2);
    }

    function recalculateTotals(): void {
      const promoCode = promoCodeInput!.value.trim().toUpperCase();
      const discount = validPromoCodes[promoCode] || 0;

      const subPrice = parseCurrency(subPriceSpan!.textContent || "0");
      const taxPrice = parseCurrency(taxPriceSpan!.textContent || "0");
      const rushPrice = parseCurrency(rushPriceSpan!.textContent || "0");
      const shipPrice = parseCurrency(shipPriceSpan!.textContent || "0");

      let discountedSubtotal = subPrice - discount;
      if (discountedSubtotal < 0) discountedSubtotal = 0;

      const newGrandTotal =
        discountedSubtotal + taxPrice + rushPrice + shipPrice;

      // Update the displayed totals
      subPriceSpan!.textContent = formatCurrency(discountedSubtotal);
      grandPriceSpan!.textContent = formatCurrency(newGrandTotal);

      // Optional visual feedback
      promoCodeInput!.style.borderColor = discount > 0 ? "green" : "initial";
    }

    promoCodeInput.addEventListener("blur", recalculateTotals);
    promoCodeInput.addEventListener("keyup", () => {
      // Live feedback
      const promoCode = promoCodeInput.value.trim().toUpperCase();
      promoCodeInput.style.borderColor = validPromoCodes[promoCode]
        ? "green"
        : "red";
    });

    // Optional: trigger initial calculation if value pre-filled
    if (promoCodeInput.value.trim()) {
      recalculateTotals();
    }
  });
}
