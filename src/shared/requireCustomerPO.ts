import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function setupCustomerPORequirement(): void {
  if (GLOBALVARS.currentPage !== StorefrontPage.CHECKOUTPAYMENT) return;

  document.addEventListener("DOMContentLoaded", () => {
    const purchaseOrderRadio = document.getElementById(
      "purchaseOrder"
    ) as HTMLInputElement | null;
    const payWithCardRadio = document.getElementById(
      "newCC"
    ) as HTMLInputElement | null;
    const customerPOInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const form = document.querySelector("form") as HTMLFormElement | null;

    if (!purchaseOrderRadio || !payWithCardRadio || !customerPOInput || !form) {
      console.warn("Required payment form elements not found");
      return;
    }

    // Safe non-null assertions after null check
    const purchaseOrder = purchaseOrderRadio!;
    const payWithCard = payWithCardRadio!;
    const customerPO = customerPOInput!;
    const paymentForm = form!;

    function toggleCustomerPO(): void {
      if (purchaseOrder.checked) {
        customerPO.classList.add("required");
        customerPO.placeholder = "required";
      } else {
        customerPO.classList.remove("required");
        customerPO.placeholder = "";
      }
    }

    function validateForm(event: Event): void {
      toggleCustomerPO(); // optional but helpful

      const isPurchaseOrder = purchaseOrder.checked;
      const customerPOValue = customerPO.value.trim();

      if (isPurchaseOrder && customerPOValue === "") {
        event.preventDefault();
        alert("Customer PO is required for Purchase Order payment.");
        customerPO.focus();
      }
    }

    // Attach listeners
    purchaseOrder.addEventListener("change", toggleCustomerPO);
    payWithCard.addEventListener("change", toggleCustomerPO);
    paymentForm.addEventListener("submit", validateForm);

    // Initialize on page load
    toggleCustomerPO();
  });
}
