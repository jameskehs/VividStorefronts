// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    $("p.ui-state-error").each((index, element) => {
      if ($(element).text() === "ON BACKORDER") {
        $(element).hide();
      }
    });
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
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
if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
  $("#CCInstructions")
    .css("color", "red")
    .css("font-weight", "bold")
    .text(
      "Your credit card will be authorized once the order is placed. This may put a hold on funds with your banking institution. Please note that we do not charge your credit card until the order has shipped. Most times the shipping cost is less than estimated shipping cost shown.\n Enter the information below to complete the payment options for your order."
    );
}
