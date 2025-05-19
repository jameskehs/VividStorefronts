import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { setupCustomerPORequirement } from "../../shared/requireCustomerPO";

export function main() {
  console.log(GLOBALVARS.currentPage);

  switch (GLOBALVARS.currentPage) {
    case StorefrontPage.ADDTOCART:
    case StorefrontPage.CART:
    case StorefrontPage.CATALOG:
    case StorefrontPage.CHECKOUTADDRESS:
    case StorefrontPage.CHECKOUTCONFIRMATION:
    case StorefrontPage.CHECKOUTREVIEW:
    case StorefrontPage.CHECKOUTSHIPPING:
    case StorefrontPage.CREATEEDITACCOUNT:
    case StorefrontPage.CUSTOMIZETEMPLATE:
    case StorefrontPage.MYACCOUNT:
    case StorefrontPage.VIEWORDERS:
      break;

    case StorefrontPage.CHECKOUTPAYMENT:
      setupCustomerPORequirement(); // Existing logic
      customizePaymentMethod(); // Custom logic for button + input field
      break;
  }
}

function customizePaymentMethod() {
  const interval = setInterval(() => {
    const poRadio = document.querySelector("label[for='purchaseOrder']");
    const customerPO = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;

    if (poRadio && customerPO) {
      clearInterval(interval);

      // Rename the label text to "Promo Order"
      poRadio.textContent = "Promo Order";

      // Handle required field dynamically
      const promoOrderRadio = document.getElementById(
        "purchaseOrder"
      ) as HTMLInputElement;
      const cardRadio = document.getElementById("newCC") as HTMLInputElement;

      const updateRequired = () => {
        if (promoOrderRadio?.checked) {
          customerPO.required = true;
          customerPO.placeholder = "required";
        } else {
          customerPO.required = false;
          customerPO.placeholder = "optional";
        }
      };

      promoOrderRadio?.addEventListener("change", updateRequired);
      cardRadio?.addEventListener("change", updateRequired);

      // Initialize once on load
      updateRequired();
    }
  }, 250);
}
