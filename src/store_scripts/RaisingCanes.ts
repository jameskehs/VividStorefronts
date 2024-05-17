// <script src="https://main--vividstorefronts.netlify.app/dist/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../index';
import { limitCostCenters } from '../shared/LimitCostCenters';
import { replaceSizeText } from '../shared/ReplaceSizeText';

const pricingTiers: { name: string; boxPricing: number }[] = [
  { name: 'Value', boxPricing: 9.89 },
  { name: 'Boston', boxPricing: 10.39 },
  { name: 'Value +', boxPricing: 10.49 },
  { name: 'Portland', boxPricing: 10.79 },
  { name: 'Base', boxPricing: 10.99 },
  { name: 'Base [High Tax]', boxPricing: 10.99 },
  { name: 'Base+', boxPricing: 11.09 },
  { name: 'Mid', boxPricing: 11.59 },
  { name: 'Mid - AZ.NV', boxPricing: 11.59 },
  { name: 'Mid+', boxPricing: 11.69 },
  { name: 'High', boxPricing: 11.79 },
  { name: 'High+', boxPricing: 11.99 },
  { name: 'Las Vegas Strip', boxPricing: 12.69 },
  { name: 'CA High', boxPricing: 12.69 },
  { name: 'Base +20%', boxPricing: 12.99 },
  { name: 'Broadway - Nashville', boxPricing: 12.99 },
  { name: 'CA High+', boxPricing: 12.99 },
  { name: 'Potential Base +20%', boxPricing: 13.19 },
  { name: 'Bay Area, CA', boxPricing: 13.99 },
  { name: 'NYC', boxPricing: 14.69 },
  { name: 'Time Square', boxPricing: 14.99 },
];

const pricingTierTable = `
    <table id="price-tier-table">
        <thead>
            <tr>
                <td>Tier Name</td>
                <td>Box Combo Price</td>
            <tr>
        </thead>
        <tbody>
        ${pricingTiers
          .map((tier) => {
            return `
                <tr>
                <td>${tier.name}</td>
                <td>$${tier.boxPricing}</td>
                </tr>
                `;
          })
          .join('')}
        </tbody>
    </table>
`;

const costCenters = [
  `LRM/ACI Programs_ACI - Active Lifestyle`,
  `LRM/ACI Programs_ACI - Business Development`,
  `LRM/ACI Programs_ACI - Pet Welfare`,
  `LRM/ACI Programs_ACI - Caniac Marketing`,
  `LRM/ACI Programs_ACI - Education`,
  `LRM/ACI Programs_ACI - Feeding the Hungry`,
  `LRM/ACI Programs_ACI - Other`,
  `LRM/ACI Programs_Community Relations - Charitable Contribution`,
  `LRM/ACI Programs_Fundraiser Donation`,
  `Production_Production - Graphics`,
  `Production_Restaurant Graphics`,
  `Preopening Advertising_Not Applicable`,
  `Recruiting_Not Applicable`,
  `Office Supplies_Not Applicable`,
  `Production_Production - Print`,
  `Cane's Love_Not Applicable`,
  `Restaurant Supplies_Not Applicable`,
];

export function main() {
  console.log(GLOBALVARS.currentPage);

  $('.linkC').html('<a href="/catalog/?g=2710&y=6234">CATALOG</a>');

  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
    $('#contactSalesInfo header').text(`Customer Service Representative:`);
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    $('.counter').text() === 'No products to show.' && $('.counter').css('display', 'none');
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    $('.memoRow th').text('MEMO (PLEASE DO NOT CHANGE AUTOFILLED INFO):');
  }

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    const productName = $('.tablesorter tbody tr td').eq(1).text().trim();

    $('#paperLabel').html('<strong>MATERIAL<strong>');

    // Replace "Size" text for specific items
    const replaceSizeTextItems = [
      { sku: 'MENU3759', newText: 'PRICING TIER' },
      { sku: 'DIN3591', newText: 'PRICING TIER' },
    ];
    const item = replaceSizeTextItems.find((item) => productName.toLowerCase().includes(item.sku.toLowerCase()));
    item !== undefined && replaceSizeText(item.newText);

    //Add Pricing Tiers to Laminated Tablet Menus
    if (productName === 'Laminated Tablet Menus - MENU3759') {
      $('.tablesorter').append(pricingTierTable);
    }
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
    $(`button[rel="Ship to my address"]`).text('Ship to this address');
    $(`button[rel="Ship to company"]`).text('Ship to DRSO');
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    limitCostCenters(costCenters);

    $('#CCInstructions').html(
      'Enter the information below to complete the payment options for your order.<br><strong>These fields are not required for Franchises</strong>'
    );

    $('#quoteNameBox section').append(
      `<div class="bill-instructions"><p>Include your <strong>FOUR DIGIT RESTAURANT NUMBER WITH LEADING ZEROES</strong> (ex: 0001, 0010, 0100) Area, Division or Department Name.</p></div>`
    );
    $('#quoteName').prop('maxLength', '4');
    $('#quoteName').on('change', (e) => {
      const inputValue = (e.target as HTMLInputElement).value;
      if (inputValue === '0050' || inputValue === '0138') {
        alert(`${inputValue} is an Inactive Cost Center`);
        $('#quoteName').val('');
      } else if (inputValue.length !== 4) {
        alert(`Cost Center must be 4 digits!`);
        $('#quoteName').val('');
      }
    });
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
    const activeTemplate = $('.templateName a').text();

    if (activeTemplate.includes('Logo Banner')) {
      $('button#N101').text('Select a color');
    }

    if (activeTemplate.includes('Achievement Award')) {
      $('#customizeTbl').prepend(
        `<p style="color:red; font-weight:bold; text-align:center; font-size:16px">IF CUSTOMIZATION IS NOT NEEDED PLEASE VISIT <a href="/catalog/?g=2710&y=6245">"ACHIEVEMENT AWARDS - STANDARD" CATEGORY</a> FOR BLANK ONES</p>`
      );
    }
    if (activeTemplate.includes('MENU')) {
      $('#customizeTbl').append(pricingTierTable);
    }
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
    $('span.smallbody:contains("We will contact you about shipping options after the order is reviewed by our staff.")').text(
      'For estimated shipping cost, please contact your customer service rep.'
    );
  }
}
