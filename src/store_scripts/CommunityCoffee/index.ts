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

    $('#qtyAvailableDisplay, input#qtyAvailable').closest('tr').hide();
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
    window.resolveRequired($('#customerPO').get(0)!);

    $('#customerPO').on('blur', (event) => {
      //ensure the field has a four digit number
      const poNumber = $(event.target).val() as string;
      if (poNumber && !/^\d{4}$/.test(poNumber)) {
        alert('Please enter a valid 4 digit PO number');
        $(event.target).val('');
      }
    });
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
