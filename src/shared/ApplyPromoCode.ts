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

    if (!document.getElementById("applyPromoCodeBtn")) {
      const buttonContainer = document.createElement("div");
      buttonContainer.style.marginTop = "8px";
      buttonContainer.style.display = "flex";
      buttonContainer.style.gap = "8px";
      buttonContainer.style.justifyContent = "center";

      // Apply Button
      const applyButton = document.createElement("button");
      applyButton.innerText = "Apply Promo Code";
      applyButton.type = "button";
      applyButton.id = "applyPromoCodeBtn";

      // Clear Button
      const clearButton = document.createElement("button");
      clearButton.innerText = "Clear";
      clearButton.type = "button";
      clearButton.id = "clearPromoCodeBtn";

      buttonContainer.appendChild(applyButton);
      buttonContainer.appendChild(clearButton);
      parentSection.appendChild(buttonContainer);

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
          promoHidden.value = "";
          discountTotalInput.value = "";
          localStorage.removeItem("discountedSubtotal");
          localStorage.removeItem("discountedTotal");
          localStorage.removeItem("appliedPromoCode");
          const promoDiscountSpan = document.getElementById("promoDiscount");
          if (promoDiscountSpan) promoDiscountSpan.textContent = "-0.00";
          return;
        }

        const originalSubtotal = parseFloat(
          subPriceSpan.dataset.original || subPriceSpan.textContent || "0"
        );
        if (!subPriceSpan.dataset.original)
          subPriceSpan.dataset.original = originalSubtotal.toString();

        const discountedSubtotal = +(originalSubtotal * (1 - discount)).toFixed(
          2
        );
        const originalTax = parseFloat(
          taxPriceSpan.dataset.original || taxPriceSpan.textContent || "0"
        );
        if (!taxPriceSpan.dataset.original)
          taxPriceSpan.dataset.original = originalTax.toString();

        const taxRate =
          originalSubtotal === 0 ? 0 : originalTax / originalSubtotal;
        const newTax = +(discountedSubtotal * taxRate).toFixed(2);
        const rush = parseFloat(rushPriceSpan.textContent || "0");
        const ship = parseFloat(shipPriceSpan.textContent || "0");
        const newTotal = +(discountedSubtotal + newTax + rush + ship).toFixed(
          2
        );
        const discountAmount = +(originalSubtotal - discountedSubtotal).toFixed(
          2
        );

        subPriceSpan.textContent = discountedSubtotal.toFixed(2);
        taxPriceSpan.textContent = newTax.toFixed(2);
        grandPriceSpan.textContent = newTotal.toFixed(2);

        // Inject promo discount row above subtotal
        let discountRow = document.getElementById("discountRow");
        if (!discountRow) {
          const subTotalRow = subPriceSpan.closest("tr");
          if (subTotalRow) {
            discountRow = document.createElement("tr");
            discountRow.id = "discountRow";
            discountRow.innerHTML = `
              <td align="left" nowrap="">Promo Discount:</td>
              <td align="right" nowrap="">$<span id="promoDiscount">-${discountAmount.toFixed(
                2
              )}</span></td>
            `;
            subTotalRow.parentElement?.insertBefore(discountRow, subTotalRow);
          }
        } else {
          const promoDiscountSpan = document.getElementById("promoDiscount");
          if (promoDiscountSpan)
            promoDiscountSpan.textContent = `-${discountAmount.toFixed(2)}`;
        }

        promoHidden.value = code;
        discountTotalInput.value = newTotal.toFixed(2);

        localStorage.setItem(
          "discountedSubtotal",
          discountedSubtotal.toFixed(2)
        );
        localStorage.setItem("discountedTotal", newTotal.toFixed(2));
        localStorage.setItem("appliedPromoCode", code);
        localStorage.setItem("discountedTax", newTax.toFixed(2));
        localStorage.setItem("promoDiscount", discountAmount.toFixed(2));

        console.log("Promo applied:", code, "New Total:", newTotal);
      });

      // Auto re-apply if stored code exists
      const savedCode = localStorage.getItem("appliedPromoCode");
      if (savedCode && promoInput.value !== savedCode) {
        promoInput.value = savedCode;
        applyButton.click();
      }
    }
  });
}
