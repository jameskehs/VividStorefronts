// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";

function limitCustomerPO(maxLength = 50): void {
  const applyLimit = (): boolean => {
    const customerPO = document.querySelector<HTMLInputElement>(
      "#customerPO, input[name='customerPO']",
    );

    if (!customerPO) {
      return false;
    }

    customerPO.maxLength = maxLength;

    customerPO.addEventListener("input", () => {
      if (customerPO.value.length > maxLength) {
        customerPO.value = customerPO.value.slice(0, maxLength);
      }
    });

    return true;
  };

  if (applyLimit()) {
    return;
  }

  const observer = new MutationObserver(() => {
    if (applyLimit()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    limitCustomerPO(50);
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
  }

  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
  }
}
