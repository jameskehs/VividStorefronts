// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../../index';

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
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
    $('#customizeTbl h2').text('Preview your Design');
  }
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
  }

  if (
    [
      StorefrontPage.CHECKOUTADDRESS,
      StorefrontPage.CHECKOUTCONFIRMATION,
      StorefrontPage.CHECKOUTPAYMENT,
      StorefrontPage.CHECKOUTREVIEW,
      StorefrontPage.CHECKOUTSHIPPING,
    ].includes(GLOBALVARS.currentPage!)
  ) {
    $('.checkoutProgress').append(
      "<h1 style='max-width:900px; margin:0 auto; padding: 24px 0'>All T-shirt orders must be received by Tuesday, September 24, 2024. You may choose direct shipping via USPS to your shipping address provided or pick up at Vivid Ink, <a href='https://www.google.com/maps?q=8640+Airline+Hwy,+Baton+Rouge,+LA+70815' target='_blank'>8640 Airline Hwy, Baton Rouge, LA 70815</a>. Shirts will be available for pick up on October 9th. Vivid Ink is open Monday - Friday 8 AM-5 PM.</h1>"
    );
  }
}
