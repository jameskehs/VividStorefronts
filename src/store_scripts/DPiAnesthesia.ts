import { globalState } from '../index';

export function main() {
  console.log(globalState.currentPage);

  $('.tableSiteBanner, #navWrapper').wrapAll(`<div class="BannerWrapper"></div>`);
}
