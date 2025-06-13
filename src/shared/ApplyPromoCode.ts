export function applyPromoCode(): void {
  window.addEventListener("load", () => {
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const subPriceSpan = document.getElementById(
      "subPrice"
    ) as HTMLSpanElement | null;
    const taxPriceSpan = document.getElementById(
      "taxPrice"
    ) as HTMLSpanElement | null;
    const grandPriceSpan = document.getElementById(
      "grandPrice"
    ) as HTMLSpanElement | null;
    const rushPriceSpan = document.getElementById(
      "rushPrice"
    ) as HTMLSpanElement | null;
    const shipPriceSpan = document.getElementById(
      "shipPrice"
    ) as HTMLSpanElement | null;

    if (
      !promoInput ||
      !subPriceSpan ||
      !taxPriceSpan ||
      !grandPriceSpan ||
      !rushPriceSpan ||
      !shipPriceSpan
    ) {
      console.warn("Promo code injection failed. Missing elements.");
      return;
    }

    const parentSection = promoInput.closest("section");
    if (!parentSection) {
      console.warn("Could not find section to inject promo button.");
      return;
    }

    if (document.getElementById("applyPromoCodeBtn")) return;

    const applyButton = document.createElement("button");
    applyButton.innerText = "Apply Promo Code";
    applyButton.type = "button";
    applyButton.id = "applyPromoCodeBtn";
    applyButton.style.marginTop = "8px";
    applyButton.style.display = "block";
    parentSection.appendChild(applyButton);

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

    let discountRow = document.getElementById("discountRow");
    if (!discountRow) {
      const table = shipPriceSpan.closest("table");
      if (table) {
        discountRow = document.createElement("tr");
        discountRow.id = "discountRow";
        discountRow.innerHTML = `
          <td align="left" nowrap="">Promo Discount:</td>
          <td align="right" nowrap="">$<span id="promoDiscount">-0.00</span></td>
        `;
        const grandRow = table.querySelector("#grandTotal");
        table.insertBefore(discountRow, grandRow);
      }
    }

    const promoDiscountSpan = document.getElementById(
      "promoDiscount"
    ) as HTMLSpanElement | null;

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
      const discountedSubtotal = +(originalSubtotal * (1 - discount)).toFixed(
        2
      );

      // Recalculate tax based on discounted subtotal
      const originalTax = parseFloat(taxPriceSpan.textContent || "0");
      const taxRate = originalTax / originalSubtotal;
      const newTax = +(discountedSubtotal * taxRate).toFixed(2);

      const rush = parseFloat(rushPriceSpan.textContent || "0");
      const ship = parseFloat(shipPriceSpan.textContent || "0");
      const newTotal = +(discountedSubtotal + newTax + rush + ship).toFixed(2);
      const discountAmount = +(originalSubtotal - discountedSubtotal).toFixed(
        2
      );

      // Update UI
      subPriceSpan.textContent = discountedSubtotal.toFixed(2);
      taxPriceSpan.textContent = newTax.toFixed(2);
      grandPriceSpan.textContent = newTotal.toFixed(2);
      if (promoDiscountSpan)
        promoDiscountSpan.textContent = `-${discountAmount.toFixed(2)}`;

      // Set form fields
      promoHidden.value = code;
      discountTotalInput.value = newTotal.toFixed(2);

      console.log("Promo applied:", code, "New Total:", newTotal);
    });
  });
}
