import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function applyPromoCode(): void {
  if (GLOBALVARS.currentPage !== StorefrontPage.CHECKOUTPAYMENT) return;

  document.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const subPriceSpan = document.getElementById("subPrice");
    const grandPriceSpan = document.getElementById("grandPrice");
    const taxPriceSpan = document.getElementById("taxPrice");
    const shipPriceSpan = document.getElementById("shipPrice");
    const rushPriceSpan = document.getElementById("rushPrice");

    if (!promoInput || !subPriceSpan || !grandPriceSpan) return;

    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply Promo Code";
    applyBtn.style.marginTop = "6px";
    applyBtn.style.display = "block";
    applyBtn.type = "button";

    promoInput.parentElement?.appendChild(applyBtn);

    applyBtn.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      const originalSub = parseFloat(subPriceSpan.textContent || "0");
      const tax = parseFloat(taxPriceSpan?.textContent || "0");
      const ship = parseFloat(shipPriceSpan?.textContent || "0");
      const rush = parseFloat(rushPriceSpan?.textContent || "0");

      let discount = 0;
      if (code === "SAVE10") discount = originalSub * 0.1;
      else if (code === "SAVE20") discount = originalSub * 0.2;
      else if (code === "FREESHIP") discount = 5;

      const newSubtotal = Math.max(0, originalSub - discount);
      const newGrandTotal = newSubtotal + tax + ship + rush;

      subPriceSpan.textContent = newSubtotal.toFixed(2);
      grandPriceSpan.textContent = newGrandTotal.toFixed(2);
    });
  });
}
