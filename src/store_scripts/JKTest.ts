import { globalState } from '../index';

export function main() {
  $('.tableSiteBanner, #navWrapper').wrapAll(`<div class="BannerWrapper"></div>`);
  console.log(globalState.currentPage);
}
