export function persistDiscountedTotals(): void {
  window.addEventListener("load", () => {
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

    const storedSubtotal = localStorage.getItem("discountedSubtotal");
    const storedTotal = localStorage.getItem("discountedTotal");
    const appliedCode = localStorage.getItem("appliedPromoCode");

    if (!storedSubtotal || !storedTotal || !appliedCode) return;

    const originalSubtotal = parseFloat(
      subPriceSpan?.dataset.original || subPriceSpan?.textContent || "0"
    );
    const discountedSubtotal = parseFloat(storedSubtotal);
    const discountAmount = +(originalSubtotal - discountedSubtotal).toFixed(2);

    if (subPriceSpan) subPriceSpan.textContent = discountedSubtotal.toFixed(2);
    if (grandPriceSpan)
      grandPriceSpan.textContent = parseFloat(storedTotal).toFixed(2);

    // Inject promo discount row above subtotal
    let discountRow = document.getElementById("discountRow");
    if (!discountRow && subPriceSpan) {
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
  });
}
