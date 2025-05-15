import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function setupPromoCodeDiscount(): void {
  if (GLOBALVARS.currentPage !== StorefrontPage.CHECKOUTPAYMENT) return;

  document.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement;
    const subPriceEl = document.getElementById("subPrice");
    const taxEl = document.getElementById("taxPrice");
    const rushEl = document.getElementById("rushPrice");
    const shipEl = document.getElementById("shipPrice");
    const grandTotalEl = document.getElementById("grandPrice");

    if (
      !promoInput ||
      !subPriceEl ||
      !taxEl ||
      !rushEl ||
      !shipEl ||
      !grandTotalEl
    ) {
      console.warn(
        "Promo code setup failed: missing one or more DOM elements."
      );
      return;
    }

    const promoCodes = {
      SAVE10: 10.0,
      FREESHIP: 14.98,
      VIP25: 25.0,
    };

    function parseAmount(el: HTMLElement | null) {
      return parseFloat(el!.textContent?.replace(/[^\d.-]/g, "") || "0");
    }

    function formatAmount(amount: number) {
      return amount.toFixed(2);
    }

    function recalculateWithPromo() {
      const code = promoInput.value.trim().toUpperCase();
      const discount =
        code in promoCodes ? promoCodes[code as keyof typeof promoCodes] : 0;

      const originalSub = parseAmount(subPriceEl);
      const tax = parseAmount(taxEl);
      const rush = parseAmount(rushEl);
      const ship = parseAmount(shipEl);

      const newSub = Math.max(originalSub - discount, 0);
      const newGrand = newSub + tax + rush + ship;

      subPriceEl!.textContent = formatAmount(newSub);
      grandTotalEl!.textContent = formatAmount(newGrand);

      promoInput.style.border =
        discount > 0 ? "2px solid green" : "2px solid red";
    }

    promoInput.addEventListener("blur", recalculateWithPromo);
  });
}
