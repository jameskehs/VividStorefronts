// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { stepStakePopup } from "../../shared/stepStakePopup";

export function main(): void {
  console.log(GLOBALVARS.currentPage);

  // Run shared enhancements (VIP check, MY ORDERS link, title change, etc.)
  stepStakePopup();

  // Optional: add additional logic per page here
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Additional logic for Add to Cart page (if needed)
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    if ($("#stake-style").length === 0) {
      $("head").append(
        `<link id="stake-style" rel="stylesheet" href="/path/to/stake-popup.css">`
      );
    }
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    // Catalog-specific logic
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
    // Already handled in stepStakePopup
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    // Logic for confirmation page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    // Logic for payment page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
    // Logic for review page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
    // Logic for shipping page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
    // Already handled in stepStakePopup
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
    // Logic for customize template
  }

  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
    // Logic for My Account page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
    // Already handled in stepStakePopup
  }
}
