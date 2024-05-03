//<script src="https://main--vividstorefronts.netlify.app/dist/main.js"></script>
//<script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../enums/StorefrontPage.enum';
import { globalState } from '../index';

export function main() {
  console.log(globalState.currentPage);

  $('.tableSiteBanner, #navWrapper').wrapAll(`<div class="BannerWrapper"></div>`);
  $('.BannerWrapper').wrapAll(`<div class="WrapperContainer"></div>`);
  $('.tableLogin').wrapAll("<div class='loginWrapper'></div>");

  if (globalState.currentPage === StorefrontPage.ADDTOCART) {
    $('.colorSwatches').css('display', 'none');
  }
}
