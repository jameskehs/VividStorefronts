export function persistDiscountedTotals(): void {
  window.addEventListener("load", () => {
    const subPriceSpan = document.getElementById(
      "subPrice"
    ) as HTMLSpanElement | null;
    const grandPriceSpan = document.getElementById(
      "grandPrice"
    ) as HTMLSpanElement | null;
    const taxPriceSpan = document.getElementById(
      "taxPrice"
    ) as HTMLSpanElement | null;
    const rushPriceSpan = document.getElementById(
      "rushPrice"
    ) as HTMLSpanElement | null;
    const shipPriceSpan = document.getElementById(
      "shipPrice"
    ) as HTMLSpanElement | null;

    const storedSubtotal = localStorage.getItem("discountedSubtotal");
    const storedTotal = localStorage.getItem("discountedTotal");
    const storedCode = localStorage.getItem("appliedPromoCode");

    if (!storedSubtotal || !storedTotal || !storedCode) return;

    const discountedSubtotal = parseFloat(storedSubtotal);
    const discountedTotal = parseFloat(storedTotal);

    // Estimate tax rate
    const originalSubtotal = parseFloat(
      subPriceSpan?.dataset.original || "37.16"
    );
    const originalTax = parseFloat(
      taxPriceSpan?.dataset.original || taxPriceSpan?.textContent || "0"
    );
    const estimatedTaxRate = originalSubtotal
      ? originalTax / originalSubtotal
      : 0;
    const recalculatedTax = +(discountedSubtotal * estimatedTaxRate).toFixed(2);

    const rush = parseFloat(rushPriceSpan?.textContent || "0");
    const ship = parseFloat(shipPriceSpan?.textContent || "0");
    const newGrandTotal = +(
      discountedSubtotal +
      recalculatedTax +
      rush +
      ship
    ).toFixed(2);

    const discountAmount = +(originalSubtotal - discountedSubtotal).toFixed(2);

    // Inject discount row if missing
    let discountRow = document.getElementById("discountRow");
    if (!discountRow) {
      const lineItemsTable = document.querySelector("#lineItems table");
      if (lineItemsTable) {
        discountRow = document.createElement("tr");
        discountRow.id = "discountRow";
        discountRow.innerHTML = `
          <td align="left" nowrap="">Promo Discount:</td>
          <td align="right" nowrap="">$<span id="promoDiscount">-${discountAmount.toFixed(
            2
          )}</span></td>
        `;
        const subtotalRow = lineItemsTable
          .querySelector("#subPrice")
          ?.closest("tr");
        if (subtotalRow?.parentElement) {
          subtotalRow.parentElement.insertBefore(discountRow, subtotalRow);
        }
      }
    } else {
      const promoDiscountSpan = document.getElementById(
        "promoDiscount"
      ) as HTMLSpanElement | null;
      if (promoDiscountSpan) {
        promoDiscountSpan.textContent = `-${discountAmount.toFixed(2)}`;
      }
    }

    // Update all values
    if (subPriceSpan) subPriceSpan.textContent = discountedSubtotal.toFixed(2);
    if (taxPriceSpan) taxPriceSpan.textContent = recalculatedTax.toFixed(2);
    if (grandPriceSpan) grandPriceSpan.textContent = newGrandTotal.toFixed(2);
  });
}
