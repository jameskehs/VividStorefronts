export function replaceShippingCostWithTBD(): void {
  const overrideShippingCostText = () => {
    // --- Replace shipping method table cell values if > $0.00 ---
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

    // --- Replace shipping summary value if > $0.00 ---
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

    // --- Replace shipping label text ("Shipping & Handling:") ---
    const taxRushTable = document.querySelector("#taxRushShipGrand table");
    if (taxRushTable) {
      const rows = taxRushTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const labelCell = row.cells[0];
        if (
          labelCell &&
          labelCell.textContent
            ?.trim()
            .toLowerCase()
            .includes("shipping & handling")
        ) {
          labelCell.textContent = "Shipping:";
        }
      });
    }

    // --- Optionally zero out hidden actual cost ---
    const hiddenCost = document.getElementById(
      "shipActualCost"
    ) as HTMLInputElement;
    if (hiddenCost && parseFloat(hiddenCost.value) > 0) {
      hiddenCost.value = "0.00";
    }
  };

  // Observe value changes in summary shipping price
  const shipPriceSpan = document.getElementById("shipPrice");
  if (shipPriceSpan) {
    const observer = new MutationObserver(overrideShippingCostText);
    observer.observe(shipPriceSpan, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // Observe the shipping method table for changes
  const shippingTable = document.getElementById("shipping_method_table");
  if (shippingTable) {
    const observer = new MutationObserver(overrideShippingCostText);
    observer.observe(shippingTable, {
      childList: true,
      subtree: true,
    });
  }

  // Initial run
  overrideShippingCostText();
}
