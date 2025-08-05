// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { enhanceCheckoutAddressPage } from "../../shared/checkoutAddressEnhancements";
import { enableStakePopup } from "../../shared/stakePopup";

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    enableStakePopup();
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
    enhanceCheckoutAddressPage();
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
