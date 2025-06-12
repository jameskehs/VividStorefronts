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

    // ✅ Create apply button
    const applyButton = document.createElement("button");
    applyButton.innerText = "Apply Promo Code";
    applyButton.style.marginTop = "8px";
    applyButton.style.display = "block";
    applyButton.type = "button"; // prevent accidental form submission

    // ✅ Inject after the promo input
    promoInput.parentElement?.appendChild(applyButton);

    // ✅ Create hidden inputs to send data to backend
    const form = promoInput.form;
    if (!form) return;

    let promoHidden = document.getElementById(
      "appliedPromoCode"
    ) as HTMLInputElement;
    if (!promoHidden) {
      promoHidden = document.createElement("input");
      promoHidden.type = "hidden";
      promoHidden.name = "appliedPromoCode";
      promoHidden.id = "appliedPromoCode";
      form.appendChild(promoHidden);
    }

    let discountTotalInput = document.getElementById(
      "discountedTotal"
    ) as HTMLInputElement;
    if (!discountTotalInput) {
      discountTotalInput = document.createElement("input");
      discountTotalInput.type = "hidden";
      discountTotalInput.name = "discountedTotal";
      discountTotalInput.id = "discountedTotal";
      form.appendChild(discountTotalInput);
    }

    // ✅ Handle discount application
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

      // ✅ Persist to backend
      promoHidden.value = code;
      discountTotalInput.value = newTotal.toFixed(2);
    });
  });
}
