export function replaceShippingCostWithTBD(): void {
  // Function to override visible shipping costs if they're greater than 0
  const overrideShippingCostText = () => {
    // Update each shipping method row
    const shippingTable = document.getElementById("shipping_method_table");
    if (shippingTable) {
      const rows = shippingTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 5) {
          const costCell = cells[4];
          const text = costCell?.textContent?.trim();
          if (text && text.startsWith("$")) {
            const value = parseFloat(text.replace("$", ""));
            if (value > 0) {
              costCell.textContent = "TBD";
            }
          }
        }
      });
    }

    // Update the summary shipping cost if it's greater than 0
    const shipPriceSpan = document.getElementById("shipPrice");
    if (shipPriceSpan) {
      const text = shipPriceSpan.textContent?.trim();
      if (text && text.startsWith("$")) {
        const value = parseFloat(text.replace("$", ""));
        if (value > 0) {
          shipPriceSpan.textContent = "TBD";
        }
      }
    }

    // Optional: Override hidden actual cost
    const hiddenCost = document.getElementById(
      "shipActualCost"
    ) as HTMLInputElement;
    if (hiddenCost && parseFloat(hiddenCost.value) > 0) {
      hiddenCost.value = "0.00";
    }
  };

  // Observe shipping price in summary box
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

  // Observe shipping method table for dynamic changes
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

  // Initial run
  overrideShippingCostText();
}
