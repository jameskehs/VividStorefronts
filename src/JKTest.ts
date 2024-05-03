import { globalState } from './index';

export function main() {
  $('.tableSiteBanner, #navWrapper').wrapAll(`<div class="BannerWrapper"></div>`);
  alert('Hi');
  console.log(globalState.currentPage);
}
