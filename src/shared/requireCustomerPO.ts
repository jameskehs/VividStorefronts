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
      console.warn("Required elements not found.");
      return;
    }

    // Make "Pay with Card" selected by default
    payWithCardRadio.checked = true;
    purchaseOrderRadio.checked = false;

    // Disable native HTML5 validation
    form.setAttribute("novalidate", "true");

    function toggleCustomerPO(): void {
      if (purchaseOrderRadio!.checked) {
        customerPOInput!.classList.add("required");
        customerPOInput!.setAttribute("required", "true");
        customerPOInput!.placeholder = "required";
      } else {
        customerPOInput!.classList.remove("required");
        customerPOInput!.removeAttribute("required");
        customerPOInput!.placeholder = "";
      }
    }

    function validateForm(event: Event): void {
      toggleCustomerPO();

      if (purchaseOrderRadio!.checked && customerPOInput!.value.trim() === "") {
        event.preventDefault();
        alert("Customer PO is required for Purchase Order payment.");
        customerPOInput!.focus();
      }
    }

    // Set the correct initial state
    toggleCustomerPO();

    // Add event listeners
    purchaseOrderRadio.addEventListener("change", toggleCustomerPO);
    payWithCardRadio.addEventListener("change", toggleCustomerPO);
    form.addEventListener("submit", validateForm);
  });
}
