export function replaceShippingCostWithTBD(): void {
  document.addEventListener("DOMContentLoaded", () => {
    // --- Replace shipping cost in shipping_method_table ---

    const shippingTable = document.getElementById("shipping_method_table");
    if (shippingTable) {
      const rows = shippingTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 5) {
          const costCell = cells[4];
          costCell.textContent = "TBD";
        }
      });
    }

    // --- Replace "Shipping & Handling" value with TBD in taxRushShipGrand ---

    const taxRushTable = document.getElementById("taxRushShipGrand");
    if (taxRushTable) {
      const rows = taxRushTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const text = row.textContent?.toLowerCase() || "";
        if (text.includes("shipping & handling")) {
          const cells = row.querySelectorAll("td");
          if (cells.length === 2) {
            cells[1].textContent = "TBD";
          }
        }
      });
    }
  });
}
