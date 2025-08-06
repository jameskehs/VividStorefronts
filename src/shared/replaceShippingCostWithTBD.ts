export function replaceShippingCostWithTBD(): void {
  const overrideShippingMethodTable = () => {
    const shippingTable = document.getElementById("shipping_method_table");
    if (!shippingTable) return;

    const rows = shippingTable.querySelectorAll("tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 5) {
        const costCell = cells[4];
        const text = costCell?.textContent?.trim();
        const value = parseFloat(text?.replace("$", "") || "");

        if (!isNaN(value) && value > 0 && text !== "TBD") {
          costCell.textContent = "TBD";
        }
      }
    });
  };

  const shippingTable = document.getElementById("shipping_method_table");
  if (shippingTable) {
    const observer = new MutationObserver(() => {
      overrideShippingMethodTable();
    });

    observer.observe(shippingTable, {
      childList: true,
      subtree: true,
    });
  }

  // Initial run
  overrideShippingMethodTable();
}
