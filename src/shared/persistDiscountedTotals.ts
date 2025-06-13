export function persistDiscountedTotals(): void {
  const subPrice = document.getElementById("subPrice") as HTMLElement | null;
  const taxPrice = document.getElementById("taxPrice") as HTMLElement | null;
  const grandPrice = document.getElementById(
    "grandPrice"
  ) as HTMLElement | null;

  const storedSubtotal = localStorage.getItem("discountedSubtotal");
  const storedTax = localStorage.getItem("discountedTax");
  const storedTotal = localStorage.getItem("discountedTotal");
  const storedDiscount = localStorage.getItem("promoDiscount");

  if (!subPrice || !taxPrice || !grandPrice) return;

  // Store original values if not already stored
  if (!subPrice.dataset.original) {
    subPrice.dataset.original =
      subPrice.textContent?.replace("$", "").trim() || "";
  }
  if (!taxPrice.dataset.original) {
    taxPrice.dataset.original =
      taxPrice.textContent?.replace("$", "").trim() || "";
  }
  if (!grandPrice.dataset.original) {
    grandPrice.dataset.original =
      grandPrice.textContent?.replace("$", "").trim() || "";
  }

  if (storedSubtotal && storedTax && storedTotal && storedDiscount) {
    subPrice.textContent = parseFloat(storedSubtotal).toFixed(2);
    taxPrice.textContent = parseFloat(storedTax).toFixed(2);
    grandPrice.textContent = parseFloat(storedTotal).toFixed(2);

    // Inject the promo discount row if not already present
    const lineItemsTable = document.querySelector(
      "#lineItems table"
    ) as HTMLTableElement | null;
    if (lineItemsTable && !document.getElementById("discountRow")) {
      const row = lineItemsTable.insertRow(3); // Adjust this index if needed
      row.id = "discountRow";

      const cell1 = row.insertCell(0);
      cell1.textContent = "Promo Discount:";

      const cell2 = row.insertCell(1);
      cell2.innerHTML = `$<span id="promoDiscount">-${parseFloat(
        storedDiscount
      ).toFixed(2)}</span>`;
      cell2.style.textAlign = "right";
    }
  }
}
