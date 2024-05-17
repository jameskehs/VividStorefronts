//<script src="https://main--vividstorefronts.netlify.app/dist/main.js"></script>
//<script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../index';

export function main() {
  console.log(GLOBALVARS.currentPage);

  $('.tableSiteBanner, #navWrapper').wrapAll(`<div class="BannerWrapper"></div>`);
  $('.BannerWrapper').wrapAll(`<div class="WrapperContainer"></div>`);
  $('.tableLogin').wrapAll("<div class='loginWrapper'></div>");

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    $('.colorSwatches').css('display', 'none');
  }
}
