export function replaceShippingCostWithTBD(): void {
  function overrideShippingCostText() {
    // Replace shipping cost in the shipping method table
    const shippingTable = document.getElementById("shipping_method_table");
    if (shippingTable) {
      const rows = shippingTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 5) {
          const costCell = cells[4];
          if (costCell && costCell.textContent?.trim().startsWith("$")) {
            costCell.textContent = "TBD";
          }
        }
      });
    }

    // Replace the shipping & handling value in the summary table
    const shipPriceSpan = document.getElementById("shipPrice");
    if (shipPriceSpan) {
      shipPriceSpan.textContent = "TBD";
    }

    // Optional: Also replace the hidden actual cost
    const hiddenCost = document.getElementById(
      "shipActualCost"
    ) as HTMLInputElement;
    if (hiddenCost) {
      hiddenCost.value = "0.00";
    }
  }

  // Observe DOM changes to reapply "TBD" when shipping is updated
  const observer = new MutationObserver(() => {
    overrideShippingCostText();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial call on load
  overrideShippingCostText();
}
