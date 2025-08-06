export function hideShippingCostColumn(): void {
  document.addEventListener("DOMContentLoaded", () => {
    // --- Hide shipping cost column from shipping method table ---

    // Hide shipping cost header
    const headerElements = document.querySelectorAll(".shipCostCol");
    headerElements.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    // Hide shipping cost cells in table rows
    const shippingTable = document.getElementById("shipping_method_table");
    if (shippingTable) {
      const rows = shippingTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 5) {
          (cells[4] as HTMLElement).style.display = "none";
        }
      });
    }

    // --- Hide Shipping & Handling row from taxRushShipGrand table ---

    const taxRushTable = document.getElementById("taxRushShipGrand");
    if (taxRushTable) {
      const rows = taxRushTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const text = row.textContent?.toLowerCase() || "";
        if (text.includes("shipping & handling")) {
          (row as HTMLElement).style.display = "none";
        }
      });
    }
  });
}
