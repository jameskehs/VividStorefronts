export function persistDiscountedTotals(): void {
  window.addEventListener("DOMContentLoaded", () => {
    const subPriceSpan = document.getElementById(
      "subPrice"
    ) as HTMLSpanElement | null;
    const taxPriceSpan = document.getElementById(
      "taxPrice"
    ) as HTMLSpanElement | null;
    const grandPriceSpan = document.getElementById(
      "grandPrice"
    ) as HTMLSpanElement | null;
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const discountRowId = "discountRow";

    const storedSubtotal = localStorage.getItem("discountedSubtotal");
    const storedTax = localStorage.getItem("discountedTax");
    const storedTotal = localStorage.getItem("discountedTotal");
    const storedDiscount = localStorage.getItem("promoDiscount");
    const storedPromoCode = localStorage.getItem("promoCode");

    // Only continue if values are found
    if (!storedSubtotal || !storedTax || !storedTotal || !storedDiscount)
      return;

    if (subPriceSpan) {
      subPriceSpan.dataset.original ??= subPriceSpan.textContent || "0";
      subPriceSpan.textContent = storedSubtotal;
    }

    if (taxPriceSpan) {
      taxPriceSpan.dataset.original ??= taxPriceSpan.textContent || "0";
      taxPriceSpan.textContent = storedTax;
    }

    if (grandPriceSpan) {
      grandPriceSpan.dataset.original ??= grandPriceSpan.textContent || "0";
      grandPriceSpan.textContent = storedTotal;
    }

    if (promoInput && storedPromoCode) {
      promoInput.value = storedPromoCode;
    }

    // Add discount row if not already there
    const lineItemsTable = document.querySelector(
      "#lineItems table"
    ) as HTMLTableElement | null;
    if (lineItemsTable && !document.getElementById(discountRowId)) {
      const rows = lineItemsTable.rows;
      const discountRow = lineItemsTable.insertRow(Math.min(3, rows.length)); // Usually above subtotal

      discountRow.id = discountRowId;

      const cell1 = discountRow.insertCell(0);
      cell1.textContent = "Promo Discount:";

      const cell2 = discountRow.insertCell(1);
      cell2.innerHTML = `$<span id="promoDiscount">-${parseFloat(
        storedDiscount
      ).toFixed(2)}</span>`;
      cell2.style.textAlign = "right";
    }
  });
}
