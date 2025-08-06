export function forceShippingCostToTBD(): void {
  const overrideShippingSummary = () => {
    // Set visible display to "TBD"
    const shipPriceSpan = document.getElementById("shipPrice");
    if (shipPriceSpan) {
      shipPriceSpan.textContent = "TBD";
    }

    // Set hidden actual cost to "0.00"
    const hiddenShipCost = document.getElementById(
      "shipActualCost"
    ) as HTMLInputElement;
    if (hiddenShipCost) {
      hiddenShipCost.value = "0.00";
    }

    // Optional: if there's a span with ID grandPrice, recalculate or log it
    // You may want to trigger your update_order_summary_ui() here again
  };

  // Re-apply every time DOM updates (e.g., after AJAX call)
  const observeShippingChanges = () => {
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
  };

  // Initial and persistent override
  overrideShippingSummary();
  observeShippingChanges();
}
