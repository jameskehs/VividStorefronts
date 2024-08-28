// <script src="https://main--vividstorefronts.netlify.app/dist/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../../index';
import { limitPOField } from '../../shared/limitPOField';
import { replaceSizeText } from '../../shared/replaceSizeText';

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

const pricingTierTable: string = `
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

const costCenters: string[] = [
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

const inactiveBillTos: string[] = ['0050', '0138'];

export function main() {
  console.log(GLOBALVARS.currentPage);

  $('.linkC').html('<a href="/catalog/?g=2710&y=6234">CATALOG</a>');

  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
    $('#contactSalesInfo header').text(`Customer Service Representative`);
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

    if (productName.startsWith('FB')) {
      $('.tablesorter').append(`
        <h1>Football Team Key</h1>
          <div style="overflow-y: auto; height: 400px; border: 1px solid #ddd; width: 100%;">
              <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                      <tr>
                          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Football Sponsorship</th>
                          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Acronym</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Abilene Christian University</td><td style="border: 1px solid #ddd; padding: 8px;">ACU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Air Force Academy</td><td style="border: 1px solid #ddd; padding: 8px;">AIRFORCE</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Arizona Cardinals</td><td style="border: 1px solid #ddd; padding: 8px;">CARDINALS</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Baylor</td><td style="border: 1px solid #ddd; padding: 8px;">BAYLOR</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Cane's Branded</td><td style="border: 1px solid #ddd; padding: 8px;">CANES</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">CIF</td><td style="border: 1px solid #ddd; padding: 8px;">CIF</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Dallas Cowboys</td><td style="border: 1px solid #ddd; padding: 8px;">COWBOYS</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">EKU</td><td style="border: 1px solid #ddd; padding: 8px;">EKU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Fresno State University</td><td style="border: 1px solid #ddd; padding: 8px;">FRESNO</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">House Divided - OK</td><td style="border: 1px solid #ddd; padding: 8px;">OK_HD</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Kansas State University</td><td style="border: 1px solid #ddd; padding: 8px;">KANSASSTATE</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">House Divided - KS</td><td style="border: 1px solid #ddd; padding: 8px;">KS_HD</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Kent State University</td><td style="border: 1px solid #ddd; padding: 8px;">KENTST</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Lamar University</td><td style="border: 1px solid #ddd; padding: 8px;">LAMAR</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Lindenwood University</td><td style="border: 1px solid #ddd; padding: 8px;">LINDENWOOD</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">McNeese State University</td><td style="border: 1px solid #ddd; padding: 8px;">MCNEESE</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">New Orleans Saints</td><td style="border: 1px solid #ddd; padding: 8px;">SAINTS</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Tulane Athletics</td><td style="border: 1px solid #ddd; padding: 8px;">TULANE</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Nicholls State</td><td style="border: 1px solid #ddd; padding: 8px;">NICHOLLS</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Northern Arizona University</td><td style="border: 1px solid #ddd; padding: 8px;">NAU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Northern Illinois University</td><td style="border: 1px solid #ddd; padding: 8px;">NIU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Northwestern State University</td><td style="border: 1px solid #ddd; padding: 8px;">NWSU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Ohio State University</td><td style="border: 1px solid #ddd; padding: 8px;">OHIOSTATE</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Oklahoma State University</td><td style="border: 1px solid #ddd; padding: 8px;">OKSTATE</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Purple & Gold</td><td style="border: 1px solid #ddd; padding: 8px;">PRPL_GOLD</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Sam Houston State</td><td style="border: 1px solid #ddd; padding: 8px;">SAMHOUSTON</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Southeastern Louisiana University</td><td style="border: 1px solid #ddd; padding: 8px;">SELU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Southern Methodist University</td><td style="border: 1px solid #ddd; padding: 8px;">SMU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Southern University</td><td style="border: 1px solid #ddd; padding: 8px;">SU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Stephen F. Austin University</td><td style="border: 1px solid #ddd; padding: 8px;">SFAU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Texas A&M</td><td style="border: 1px solid #ddd; padding: 8px;">TXAM</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Texas Christian University</td><td style="border: 1px solid #ddd; padding: 8px;">TXCU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Texas State University</td><td style="border: 1px solid #ddd; padding: 8px;">TXSU</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Texas Tech</td><td style="border: 1px solid #ddd; padding: 8px;">TXTECH</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">Titans</td><td style="border: 1px solid #ddd; padding: 8px;">TITANS</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">UC Davis</td><td style="border: 1px solid #ddd; padding: 8px;">UCDAVIS</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">UGA</td><td style="border: 1px solid #ddd; padding: 8px;">UGA</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">UGA - Sponsorship Logo</td><td style="border: 1px solid #ddd; padding: 8px;">UGASPONSOR</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">ULM</td><td style="border: 1px solid #ddd; padding: 8px;">ULM</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of Arkansas</td><td style="border: 1px solid #ddd; padding: 8px;">UA</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of Central Oklahoma</td><td style="border: 1px solid #ddd; padding: 8px;">UCO</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of Hawaii</td><td style="border: 1px solid #ddd; padding: 8px;">UHI</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of Houston</td><td style="border: 1px solid #ddd; padding: 8px;">UHOUSTON</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of Kansas</td><td style="border: 1px solid #ddd; padding: 8px;">UKS</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of Louisiana at Lafayette</td><td style="border: 1px solid #ddd; padding: 8px;">ULL</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of Oklahoma</td><td style="border: 1px solid #ddd; padding: 8px;">UO</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of South Alabama</td><td style="border: 1px solid #ddd; padding: 8px;">USA</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of Texas Permian Basin</td><td style="border: 1px solid #ddd; padding: 8px;">UTPB</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of Tulsa</td><td style="border: 1px solid #ddd; padding: 8px;">UTULSA</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">University of North Texas</td><td style="border: 1px solid #ddd; padding: 8px;">UNTX</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">UNLV</td><td style="border: 1px solid #ddd; padding: 8px;">UNLV</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">UT</td><td style="border: 1px solid #ddd; padding: 8px;">UT</td></tr>
                      <tr><td style="border: 1px solid #ddd; padding: 8px;">UTSA</td><td style="border: 1px solid #ddd; padding: 8px;">UTSA</td></tr>
                  </tbody>
              </table>
          </div>
      `);
    }
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
    $(`button[rel="Ship to my address"]`).text('Ship to this address');
    $(`button[rel="Ship to company"]`).text('Ship to DRSO');
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    limitPOField(costCenters);

    $('#CCInstructions').html(
      'Enter the information below to complete the payment options for your order.<br><strong>These fields are not required for Franchises</strong>'
    );

    $('#quoteNameBox section').append(
      `<div class="bill-instructions"><p>Include your <strong>FOUR DIGIT RESTAURANT NUMBER WITH LEADING ZEROES</strong> (ex: 0001, 0010, 0100) Area, Division or Department Name.</p></div>`
    );
    $('#quoteName').prop('maxLength', '4');
    $('#quoteName').on('change', (e) => {
      const inputValue = (e.target as HTMLInputElement).value;
      if (inactiveBillTos.includes(inputValue)) {
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
      $('#show_userform').append(pricingTierTable);
    }
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
    $('span.smallbody:contains("We will contact you about shipping options after the order is reviewed by our staff.")').text(
      'For estimated shipping cost, please contact your customer service rep.'
    );
  }
}
