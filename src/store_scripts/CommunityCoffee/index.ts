// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../../index';
import { replaceAttrText } from '../../shared/replaceSizeText';

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    const productName = $('.tablesorter tbody tr td').eq(1).text().trim();

    if (productName.includes('RTD Pricing Stickers')) {
      replaceAttrText('SIZE', 'PRICE');
      replaceAttrText('COLOR', 'DRINK SIZE');
    }
    if (productName.includes('Magnetic Menu Board')) {
      replaceAttrText('SIZE', 'PRICE');
    }

    if (productName.includes('TF Server Label')) {
      console.log('Server Label');
      localStorage.setItem('redirect', '/catalog/?g=3544&y=8333');
      $('#addToCartButton').text('Add to Cart & Return to Label Page');
    }

    if (productName.includes('RTD Pricing Sticker')) {
      localStorage.setItem('redirect', '/catalog/?g=3545&y=8236');
      $('#addToCartButton').text('Add to Cart & Return to Sticker Page');
    }

    $('#qtyAvailableDisplay, input#qtyAvailable').closest('tr').hide();
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    const redirect = localStorage.getItem('redirect');
    if (redirect) {
      localStorage.removeItem('redirect');
      window.location.href = redirect;
    }
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
