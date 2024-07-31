// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../../index';

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
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
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
    $(function () {
      replacePhoneInputs('Mobile', 'Mobile Phone');
      replacePhoneInputs('Work', 'Work Phone');
    });
  }
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
  }
}

function replacePhoneInputs(labelMatch: string, inputName: string) {
  let phoneContainer = $(`
    <tr>
      <td align="right" valign="top">
        <span class="required_star">*</span>
        <strong>${inputName} Phone:&nbsp;</strong>
      </td>
      <td align="left">
        <div class="phone-container"></div>
      </td>
    </tr>`);

  let rowIndex = null;
  let firstItem = true;

  $('#show_userform table tr').each((index, element) => {
    const [label, input] = $(element).children();
    if (label.innerText.includes(labelMatch)) {
      if (firstItem) {
        rowIndex = index;
        firstItem = false;
      }

      $(input).appendTo(phoneContainer.find('.phone-container'));
      $(element).remove();
    }
  });

  $(`#show_userform table tr:eq(${rowIndex})`).after(phoneContainer);
}
