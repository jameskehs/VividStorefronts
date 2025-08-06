export function forceShippingCostToTBD(): void {
  const overrideShippingSummary = () => {
    const shipPriceSpan = document.getElementById("shipPrice");
    const hiddenShipCost = document.getElementById(
      "shipActualCost"
    ) as HTMLInputElement;

    if (shipPriceSpan) {
      const text = shipPriceSpan.textContent?.trim();
      const numericValue = parseFloat(text?.replace("$", "") || "");

      if (!isNaN(numericValue) && numericValue > 0 && text !== "TBD") {
        shipPriceSpan.textContent = "TBD";
        if (hiddenShipCost) {
          hiddenShipCost.value = "0.00";
        }
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

  overrideShippingSummary();
}
