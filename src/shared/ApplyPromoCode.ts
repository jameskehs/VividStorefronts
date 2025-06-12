console.log("applyPromoCode() running");

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
      console.warn("Promo code injection failed. Missing elements.");
      return;
    }

    // ✅ Prevent duplicate buttons
    if (document.getElementById("applyPromoBtn")) return;

    // ✅ Create button
    const applyButton = document.createElement("button");
    applyButton.id = "applyPromoBtn";
    applyButton.innerText = "Apply Promo Code";
    applyButton.style.marginTop = "8px";
    applyButton.style.display = "block";

    // ✅ Inject after the promo input
    promoInput.parentElement?.appendChild(applyButton);

    // ✅ On click, apply discount if code matches
    applyButton.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      const validCodes: Record<string, number> = {
        SAVE10: 0.1,
        SAVE20: 0.2,
        WELCOME5: 0.05,
      };

      const discount = validCodes[code];
      const originalSubtotal = parseFloat(subPriceSpan.textContent || "0");

      if (!discount) {
        alert("Invalid promo code.");
        return;
      }

      const newSubtotal = +(originalSubtotal * (1 - discount)).toFixed(2);
      const tax = parseFloat(
        document.getElementById("taxPrice")?.textContent || "0"
      );
      const ship = parseFloat(
        document.getElementById("shipPrice")?.textContent || "0"
      );
      const rush = parseFloat(
        document.getElementById("rushPrice")?.textContent || "0"
      );

      const newTotal = +(newSubtotal + tax + ship + rush).toFixed(2);

      subPriceSpan.textContent = newSubtotal.toFixed(2);
      grandPriceSpan.textContent = newTotal.toFixed(2);
    });
  });
}
