import { OptionsParameter } from '../index';

export function runSharedScript(options: OptionsParameter) {
  console.log('Hello from the shared script!');

  // Wrap nav elements
  $('.tableSiteBanner, #navWrapper').wrapAll(`<div id="logoLinks"></div>`);
  $('#logoLinks').wrapAll(`<div id="headWrapper"></div>`);
  $('.tableLogin').wrapAll("<div id='loginWrapper'></div>");

  options.hideHomeLink && $('.linkH').hide();
  options.hideAddressBook && $('button#saveAddressBook, table#addressBook').hide();
  options.hideCompanyShipTo && $('div#shipToCompany').hide();

  // Add "On Demand" tag to products that are not inventoried
  $('.prodCell').each(function (index, cell) {
    const inventoryTag = $(this).find('.meta p.ui-state-error, .meta p.ui-state-default');
    if (inventoryTag.length === 0) {
      $('span.meta', this).prepend('<p class="ui-state-default ui-corner-all" style="text-align: center;">On Demand</p>');
    }
  });
}
