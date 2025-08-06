export function replaceShippingCostWithTBD(): void {
  // Function to replace the text with "TBD"
  const overrideShippingCostText = () => {
    // Replace shipping method table costs
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

    // Replace summary shipping cost
    const shipPriceSpan = document.getElementById("shipPrice");
    if (shipPriceSpan && shipPriceSpan.textContent?.trim().startsWith("$")) {
      shipPriceSpan.textContent = "TBD";
    }

    // Optional: Set hidden actual cost to 0.00
    const hiddenCost = document.getElementById(
      "shipActualCost"
    ) as HTMLInputElement;
    if (hiddenCost) {
      hiddenCost.value = "0.00";
    }
  };

  // Observe only the ship price span
  const shipPriceTarget = document.getElementById("shipPrice");
  if (shipPriceTarget) {
    const observer = new MutationObserver(() => {
      overrideShippingCostText();
    });

    observer.observe(shipPriceTarget, {
      characterData: true,
      subtree: true,
      childList: true,
    });
  }

  // Also observe the table in case shipping method updates
  const shipMethodTable = document.getElementById("shipping_method_table");
  if (shipMethodTable) {
    const observer = new MutationObserver(() => {
      overrideShippingCostText();
    });

    observer.observe(shipMethodTable, {
      childList: true,
      subtree: true,
    });
  }

  // Initial run on page load
  overrideShippingCostText();
}
