import { OptionsParameter } from '../index';

export function runSharedScript(options: OptionsParameter) {
  console.log('Hello from the shared script!');

  //Wrap nav elements
  $('.tableSiteBanner, #navWrapper').wrapAll(`<div id="logoLinks"></div>`);
  $('#logoLinks').wrapAll(`<div id="headWrapper"></div>`);
  $('.tableLogin').wrapAll("<div id='loginWrapper'></div>");

  options.hideHomeLink && $('.linkH').hide();
}
