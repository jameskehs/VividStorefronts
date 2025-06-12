export function applyPromoCode(): void {
  window.addEventListener("load", () => {
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

    const parentSection = promoInput.closest("section");
    if (!parentSection) {
      console.warn("Could not find section to inject promo button.");
      return;
    }

    // Prevent duplicate buttons
    if (document.getElementById("applyPromoCodeBtn")) return;

    // ✅ Create and append button
    const applyButton = document.createElement("button");
    applyButton.innerText = "Apply Promo Code";
    applyButton.type = "button";
    applyButton.id = "applyPromoCodeBtn";
    applyButton.style.marginTop = "8px";
    applyButton.style.display = "block";
    parentSection.appendChild(applyButton);

    // ✅ Prepare hidden inputs
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

    // ✅ Click event to apply promo code
    applyButton.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      const validCodes: Record<string, number> = {
        SAVE10: 0.1,
        SAVE20: 0.2,
        WELCOME5: 0.05,
      };

      const discount = validCodes[code];
      if (!discount) {
        alert("Invalid promo code.");
        return;
      }

      const originalSubtotal = parseFloat(subPriceSpan.textContent || "0");
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

      // ✅ Set form hidden inputs
      promoHidden.value = code;
      discountTotalInput.value = newTotal.toFixed(2);

      console.log("Promo applied:", code, "New Total:", newTotal);
    });
  });
}
