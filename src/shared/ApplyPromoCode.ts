export function applyPromoCode(): void {
  requestAnimationFrame(() => {
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
      const applyButton = document.createElement("button");
      applyButton.innerText = "Apply Promo Code";
      applyButton.type = "button";
      applyButton.id = "applyPromoCodeBtn";
      applyButton.style.marginTop = "8px";
      applyButton.style.display = "block";
      parentSection.appendChild(applyButton);

      applyButton.addEventListener("click", handlePromoCode);
    }

    // Create or find hidden fields for backend
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

    // Create discount row if missing
    let discountRow = document.getElementById("discountRow");
    if (!discountRow) {
      const lineItemsTable = document.querySelector("#lineItems table");
      if (lineItemsTable) {
        discountRow = document.createElement("tr");
        discountRow.id = "discountRow";
        discountRow.innerHTML = `
          <td align="left" nowrap="">Promo Discount:</td>
          <td align="right" nowrap="">$<span id="promoDiscount">-0.00</span></td>
        `;
        const rows = lineItemsTable.querySelectorAll("tr");
        if (rows.length >= 3) {
          lineItemsTable.insertBefore(discountRow, rows[2]);
        } else {
          lineItemsTable.appendChild(discountRow);
        }
      }
    }

    const promoDiscountSpan = document.getElementById(
      "promoDiscount"
    ) as HTMLSpanElement | null;

    // Function handler
    function handlePromoCode() {
      const code = promoInput!.value.trim().toUpperCase();
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
        return;
      }

      const originalSubtotal = parseFloat(
        subPriceSpan!.dataset.original || subPriceSpan!.textContent || "0"
      );
      if (!subPriceSpan!.dataset.original)
        subPriceSpan!.dataset.original = originalSubtotal.toString();

      const discountedSubtotal = +(originalSubtotal * (1 - discount)).toFixed(
        2
      );
      const originalTax = parseFloat(
        taxPriceSpan!.dataset.original || taxPriceSpan!.textContent || "0"
      );
      if (!taxPriceSpan!.dataset.original)
        taxPriceSpan!.dataset.original = originalTax.toString();

      const taxRate =
        originalSubtotal === 0 ? 0 : originalTax / originalSubtotal;
      const newTax = +(discountedSubtotal * taxRate).toFixed(2);

      const rush = parseFloat(rushPriceSpan!.textContent || "0");
      const ship = parseFloat(shipPriceSpan!.textContent || "0");
      const newTotal = +(discountedSubtotal + newTax + rush + ship).toFixed(2);
      const discountAmount = +(originalSubtotal - discountedSubtotal).toFixed(
        2
      );

      subPriceSpan!.textContent = discountedSubtotal.toFixed(2);
      taxPriceSpan!.textContent = newTax.toFixed(2);
      grandPriceSpan!.textContent = newTotal.toFixed(2);
      if (promoDiscountSpan)
        promoDiscountSpan.textContent = `-${discountAmount.toFixed(2)}`;

      promoHidden.value = code;
      discountTotalInput.value = newTotal.toFixed(2);

      // Persist values
      localStorage.setItem("discountedSubtotal", discountedSubtotal.toFixed(2));
      localStorage.setItem("discountedTotal", newTotal.toFixed(2));
      localStorage.setItem("appliedPromoCode", code);

      console.log("Promo applied:", code, "New Total:", newTotal);
    }

    // Optionally restore saved promo
    const savedCode = localStorage.getItem("appliedPromoCode");
    if (savedCode && promoInput.value !== savedCode) {
      promoInput.value = savedCode;
      handlePromoCode(); // Re-apply automatically
    }
  });
}
