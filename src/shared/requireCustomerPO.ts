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
      console.warn("Missing required elements.");
      return;
    }

    // Disable native HTML5 validation to handle manually
    form.setAttribute("novalidate", "true");

    function toggleCustomerPO() {
      const isPO = purchaseOrderRadio!.checked;

      if (isPO) {
        customerPOInput!.setAttribute("required", "true");
        customerPOInput!.classList.add("required");
        customerPOInput!.placeholder = "required";
      } else {
        customerPOInput!.removeAttribute("required");
        customerPOInput!.classList.remove("required");
        customerPOInput!.placeholder = "";
      }
    }

    function validateForm(event: Event) {
      toggleCustomerPO();

      if (purchaseOrderRadio!.checked && customerPOInput!.value.trim() === "") {
        event.preventDefault();
        alert("Customer PO is required for Purchase Order payment.");
        customerPOInput!.focus();
      }
    }

    // Initial state on page load
    toggleCustomerPO();

    // Add event listeners
    purchaseOrderRadio.addEventListener("change", toggleCustomerPO);
    payWithCardRadio.addEventListener("change", toggleCustomerPO);
    form.addEventListener("submit", validateForm);
  });
}
