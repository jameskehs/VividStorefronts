export function setupCustomerPORequirement() {
  const interval = setInterval(() => {
    const promoOrderRadio = document.getElementById(
      "purchaseOrder"
    ) as HTMLInputElement | null;
    const cardRadio = document.getElementById(
      "newCC"
    ) as HTMLInputElement | null;
    const customerPO = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const poLabel = document.querySelector("label[for='purchaseOrder']");

    if (promoOrderRadio && cardRadio && customerPO && poLabel) {
      clearInterval(interval);

      // Rename the radio label from "Purchase Order" to "Promo Order"
      poLabel.textContent = "Promo Order";

      const updateRequirement = () => {
        const isPromoOrder = promoOrderRadio.checked;

        customerPO.required = isPromoOrder;
        customerPO.placeholder = isPromoOrder ? "required" : "optional";

        // Optionally toggle a class
        customerPO.classList.toggle("required", isPromoOrder);
      };

      // Attach listeners
      promoOrderRadio.addEventListener("change", updateRequirement);
      cardRadio.addEventListener("change", updateRequirement);

      // Initial run
      updateRequirement();
    }
  }, 250);
}
