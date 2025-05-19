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
    const checkoutButton = document.getElementById(
      "checkoutProceedButton"
    ) as HTMLButtonElement | null;

    if (
      promoOrderRadio &&
      cardRadio &&
      customerPO &&
      poLabel &&
      checkoutButton
    ) {
      clearInterval(interval);

      // Rename the radio label from "Purchase Order" to "Promo Order"
      poLabel.textContent = "Promo Order";

      const updateRequirement = () => {
        const isPromoOrder = promoOrderRadio.checked;
        const hasPO = customerPO.value.trim().length > 0;

        customerPO.required = isPromoOrder;
        customerPO.placeholder = isPromoOrder ? "required" : "optional";
        customerPO.classList.toggle("required", isPromoOrder);

        // Show/hide the checkout button
        if (isPromoOrder && !hasPO) {
          checkoutButton.style.display = "none";
        } else {
          checkoutButton.style.display = "";
        }
      };

      // Event listeners
      promoOrderRadio.addEventListener("change", updateRequirement);
      cardRadio.addEventListener("change", updateRequirement);
      customerPO.addEventListener("input", updateRequirement);
      customerPO.addEventListener("blur", updateRequirement);

      // Initial check
      updateRequirement();
    }
  }, 250);
}
