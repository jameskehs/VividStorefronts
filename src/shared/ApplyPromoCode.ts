import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function applyPromoCode(): void {
  if (GLOBALVARS.currentPage !== StorefrontPage.CHECKOUTPAYMENT) return;

  document.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const subPriceSpan = document.getElementById(
      "subPrice"
    ) as HTMLElement | null;
    const grandPriceSpan = document.getElementById(
      "grandPrice"
    ) as HTMLElement | null;
    const taxPriceSpan = document.getElementById(
      "taxPrice"
    ) as HTMLElement | null;
    const shipPriceSpan = document.getElementById(
      "shipPrice"
    ) as HTMLElement | null;
    const rushPriceSpan = document.getElementById(
      "rushPrice"
    ) as HTMLElement | null;

    if (!promoInput || !subPriceSpan || !grandPriceSpan) {
      console.warn("Promo code or price spans not found.");
      return;
    }

    // ✅ Create and inject Apply button
    const applyBtn = document.createElement("button");
    applyBtn.id = "applyPromoBtn";
    applyBtn.type = "button";
    applyBtn.textContent = "Apply Promo Code";
    applyBtn.style.marginTop = "8px";
    promoInput.parentElement?.appendChild(applyBtn);

    const parsePrice = (el: HTMLElement | null): number =>
      el ? parseFloat(el.textContent?.replace(/[^\d.]/g, "") || "0") : 0;

    const originalSubtotal = parsePrice(subPriceSpan);

    applyBtn.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      let discount = 0;

      if (code === "SAVE10") discount = originalSubtotal * 0.1;
      else if (code === "SAVE20") discount = originalSubtotal * 0.2;
      else if (code === "FREESHIP") discount = 5;

      const newSubtotal = Math.max(originalSubtotal - discount, 0);
      const tax = parsePrice(taxPriceSpan);
      const ship = parsePrice(shipPriceSpan);
      const rush = parsePrice(rushPriceSpan);
      const newGrand = (newSubtotal + tax + ship + rush).toFixed(2);

      subPriceSpan.textContent = newSubtotal.toFixed(2);
      grandPriceSpan.textContent = newGrand;
    });
  });
}
