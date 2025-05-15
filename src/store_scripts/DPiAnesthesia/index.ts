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
      setupCustomerPORequirement(); // 🟢 This already handles the form
      break;
  }
}
