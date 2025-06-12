import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function applyPromoCode(): void {
  if (GLOBALVARS.currentPage !== StorefrontPage.CHECKOUTPAYMENT) return;

  document.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.querySelector<HTMLInputElement>("#customerPO");
    const subPriceSpan = document.querySelector<HTMLElement>("#subPrice");
    const grandPriceSpan = document.querySelector<HTMLElement>("#grandPrice");
    const taxSpan = document.querySelector<HTMLElement>("#taxPrice");
    const shipSpan = document.querySelector<HTMLElement>("#shipPrice");
    const rushSpan = document.querySelector<HTMLElement>("#rushPrice");

    if (!promoInput || !subPriceSpan || !grandPriceSpan) {
      console.warn("Promo code input or price spans not found.");
      return;
    }

    // Create and insert the button only if it doesn't already exist
    if (!document.querySelector("#applyPromoButton")) {
      const applyButton = document.createElement("button");
      applyButton.id = "applyPromoButton";
      applyButton.type = "button";
      applyButton.textContent = "Apply Promo Code";
      applyButton.style.marginTop = "8px";
      applyButton.style.padding = "6px 12px";
      applyButton.style.display = "inline-block";
      applyButton.style.background = "#444";
      applyButton.style.color = "#fff";
      applyButton.style.border = "none";
      applyButton.style.borderRadius = "4px";
      applyButton.style.cursor = "pointer";

      // Insert the button directly after the input
      promoInput.parentElement?.appendChild(applyButton);

      applyButton.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        const subtotal = parseFloat(subPriceSpan.textContent || "0");
        const tax = parseFloat(taxSpan?.textContent || "0");
        const shipping = parseFloat(shipSpan?.textContent || "0");
        const rush = parseFloat(rushSpan?.textContent || "0");

        let discount = 0;
        if (code === "SAVE10") discount = subtotal * 0.1;
        else if (code === "SAVE20") discount = subtotal * 0.2;
        else if (code === "FREESHIP") discount = 5;

        const newSubtotal = Math.max(0, subtotal - discount);
        const newGrand = newSubtotal + tax + shipping + rush;

        subPriceSpan.textContent = newSubtotal.toFixed(2);
        grandPriceSpan.textContent = newGrand.toFixed(2);
      });
    }
  });
}
