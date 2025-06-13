export function persistDiscountedTotals(): void {
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

  const promoDiscountSpan = document.getElementById(
    "promoDiscount"
  ) as HTMLSpanElement | null;
  let discountRow = document.getElementById("discountRow");

  const storedSubtotal = localStorage.getItem("discountedSubtotal");
  const storedTotal = localStorage.getItem("discountedTotal");
  const storedTax = localStorage.getItem("discountedTax");
  const storedDiscount = localStorage.getItem("promoDiscount");

  if (
    !subPriceSpan ||
    !taxPriceSpan ||
    !grandPriceSpan ||
    !rushPriceSpan ||
    !shipPriceSpan
  ) {
    console.warn("persistDiscountedTotals: Missing required elements.");
    return;
  }

  const rush = parseFloat(rushPriceSpan.textContent || "0");
  const ship = parseFloat(shipPriceSpan.textContent || "0");

  const discountedSubtotal = storedSubtotal
    ? parseFloat(storedSubtotal)
    : parseFloat(subPriceSpan.textContent || "0");
  const discountedTax = storedTax
    ? parseFloat(storedTax)
    : parseFloat(taxPriceSpan.textContent || "0");
  const promoDiscount = storedDiscount ? parseFloat(storedDiscount) : 0;

  const calculatedGrandTotal = +(
    discountedSubtotal +
    discountedTax +
    rush +
    ship
  ).toFixed(2);

  // Apply stored values
  subPriceSpan.textContent = discountedSubtotal.toFixed(2);
  taxPriceSpan.textContent = discountedTax.toFixed(2);
  grandPriceSpan.textContent = (
    storedTotal ? parseFloat(storedTotal) : calculatedGrandTotal
  ).toFixed(2);

  // Add promo discount row if not already present
  if (!discountRow) {
    const lineItemsTable = document.querySelector("#lineItems table");
    if (lineItemsTable) {
      discountRow = document.createElement("tr");
      discountRow.id = "discountRow";
      discountRow.innerHTML = `
        <td align="left" nowrap="">Promo Discount:</td>
        <td align="right" nowrap="">$<span id="promoDiscount">-${promoDiscount.toFixed(
          2
        )}</span></td>
      `;

      const rows = lineItemsTable.querySelectorAll("tr");
      if (rows.length >= 3) {
        lineItemsTable.insertBefore(discountRow, rows[2]); // insert before subtotal row
      } else {
        lineItemsTable.appendChild(discountRow);
      }
    }
  } else if (promoDiscountSpan) {
    promoDiscountSpan.textContent = `-${promoDiscount.toFixed(2)}`;
  }
}
