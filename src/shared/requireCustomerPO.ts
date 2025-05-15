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
    const form = document.getElementById(
      "authorizeIFrameForm"
    ) as HTMLFormElement | null;

    if (!purchaseOrderRadio || !payWithCardRadio || !customerPOInput || !form) {
      console.warn("Missing required elements.");
      return;
    }

    // ✅ Force "Pay with Card" to be the default on load
    payWithCardRadio.checked = true;
    purchaseOrderRadio.checked = false;

    function toggleCustomerPO(): void {
      if (purchaseOrderRadio!.checked) {
        customerPOInput!.setAttribute("required", "true");
        customerPOInput!.classList.add("required");
        customerPOInput!.placeholder = "required";
      } else {
        customerPOInput!.removeAttribute("required");
        customerPOInput!.classList.remove("required");
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

    // Initial setup
    toggleCustomerPO();

    // ✅ Use label clicks for jQuery UI radio button updates
    const poLabel = document.querySelector("label[for='purchaseOrder']");
    const ccLabel = document.querySelector("label[for='newCC']");

    poLabel?.addEventListener("click", () => setTimeout(toggleCustomerPO, 10));
    ccLabel?.addEventListener("click", () => setTimeout(toggleCustomerPO, 10));

    // Validate before form submission
    form.addEventListener("submit", validateForm);
  });
}
