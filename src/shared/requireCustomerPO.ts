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

    // Disable native HTML5 validation
    form.setAttribute("novalidate", "true");

    // ✅ Set "Pay with Card" as default
    payWithCardRadio.checked = true;
    purchaseOrderRadio.checked = false;

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

    // Initial state
    toggleCustomerPO();

    // ✅ Watch clicks on both radio *labels* instead (jQuery UI updates on label click)
    const poLabel = document.querySelector("label[for='purchaseOrder']");
    const ccLabel = document.querySelector("label[for='newCC']");

    poLabel?.addEventListener("click", () => {
      setTimeout(toggleCustomerPO, 0); // Delay to let jQuery update radio state
    });

    ccLabel?.addEventListener("click", () => {
      setTimeout(toggleCustomerPO, 0);
    });

    form.addEventListener("submit", validateForm);
  });
}
