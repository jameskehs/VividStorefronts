export function forceShippingCostToTBD(): void {
  const overrideShippingSummary = () => {
    const shipPriceSpan = document.getElementById("shipPrice");
    const hiddenShipCost = document.getElementById(
      "shipActualCost"
    ) as HTMLInputElement;

    if (!shipPriceSpan) return;

    const text = shipPriceSpan.textContent?.trim();
    const numericValue = parseFloat(text?.replace("$", "") || "");

    // Only override if it's a valid cost > 0 and not already "TBD"
    if (!isNaN(numericValue) && numericValue > 0 && text !== "TBD") {
      // 1. Set visual display to "TBD"
      shipPriceSpan.textContent = "TBD";

      // 2. Set hidden cost to 0
      if (hiddenShipCost) {
        hiddenShipCost.value = "0.00";
      }

      // 3. Force recalculate grand total using 0 shipping cost
      const rushPriceText = (
        document.getElementById("rushPrice")?.textContent || ""
      )
        .replace("$", "")
        .trim();
      const rushCost = parseFloat(rushPriceText) || 0;

      const handlingText = (
        document.getElementById("handlingPrice")?.textContent || ""
      )
        .replace("$", "")
        .trim();
      const handlingCost = parseFloat(handlingText) || 0;

      // Call existing global function if available
      if (typeof (window as any).update_order_summary_ui === "function") {
        (window as any).update_order_summary_ui(0, rushCost, handlingCost);
      }
    }
  };

  const shipPriceSpan = document.getElementById("shipPrice");
  if (shipPriceSpan) {
    const observer = new MutationObserver(() => {
      overrideShippingSummary();
    });

    observer.observe(shipPriceSpan, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // Run immediately on load
  overrideShippingSummary();
}
