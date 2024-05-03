//<script src="https://main--vividstorefronts.netlify.app/dist/main.js"></script>
//<script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../enums/StorefrontPage.enum';
import { globalState } from '../index';

export function main() {
  console.log(globalState.currentPage);

  $('.tableSiteBanner, #navWrapper').wrapAll(`<div class="BannerWrapper"></div>`);

  if (globalState.currentPage === StorefrontPage.CHECKOUTADDRESS) {
    $('#shipInstructions').css('display', 'none');
    $('.tableMain').prepend(
      '<h2 style="font-size:16px;border:2px solid #3e1c84;padding:12px;text-align:center;font-weight:bold">Personal orders should not be shipped to Pennington Biomedical.</h2>'
    );
  }
}
