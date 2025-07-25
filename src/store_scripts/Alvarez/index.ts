// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { ChangeInventoryCountNoticeNEW } from "../../shared/inventoryCountNoticeNEW";
import { replaceAttrText } from "../../shared/replaceSizeText";

export function main() {
  console.log(GLOBALVARS.currentPage);
  $("body").prepend(`
    <div class="site-banner">
      <p>Turn Times On All Embroidered Items Will Take 2-3 Weeks</p>
    </div>`);

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
// Call the updated function with a placeholder email to be replaced dynamically
ChangeInventoryCountNoticeNEW(
  "Inventory not available for the desired order quantity. Please contact your account manager at 225-751-7297, or by email at sales@poweredbyprisma.com",
  "sales@poweredbyprisma.com" // Placeholder email to be replaced dynamically
);
