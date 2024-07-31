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
    const productName = $('.templateName a').text().trim();

    if (['US QR Code Business Cards', 'US Standard Business Cards'].includes(productName)) {
      $(function () {
        replacePhoneInputs('Mobile', 'Mobile Phone', true);
        replacePhoneInputs('Work', 'Work Phone', false);
      });
    }
  }
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
  }
}

function replacePhoneInputs(labelMatch: string, inputName: string, required: boolean) {
  let phoneContainer = $(`
    <tr>
      <td align="right" valign="top">
        ${required ? '<span class="required_star">*</span>' : ''}
        <strong>${inputName}:&nbsp;</strong>
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
        console.log('Found first phone input at row index:', index);
        rowIndex = index;
        firstItem = false;
      }

      $(input).appendTo(phoneContainer.find('.phone-container'));
      $(element).remove();
    }
  });
  console.log('Inserting phone inputs at row index:', rowIndex);
  $(`#show_userform table tr:eq(${rowIndex})`).after(phoneContainer);
}
