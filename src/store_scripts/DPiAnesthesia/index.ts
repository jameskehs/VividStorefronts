import { GLOBALVARS } from '../../index';

export function main() {
  console.log(GLOBALVARS.currentPage);

  $('.tableSiteBanner, #navWrapper').wrapAll(`<div class="BannerWrapper"></div>`);
}
