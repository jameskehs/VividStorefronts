// <script src="https://main--vividstorefronts.netlify.app/dist/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../../index';
import { limitPOField } from '../../shared/limitPOField';

const costCenters = [
  'Fundraising:Golf Events:Golf_GA',
  'Fundraising:Golf Events:Golf_NC',
  'Fundraising:Golf Events:Golf_TN',
  'Fundraising:Tasting Events:Tasting_NC',
  'Fundraising:Tasting Events:Tasting_TN',
  'Fundraising:Tasting Events:TH2024',
  'Admin:Admin_GA',
  'Admin:Admin_NC',
  'Admin:Admin_TN',
  'Admin:Launch Events:Launch_Charlotte',
  'Admin:Stewardship:James Beard Event',
  'Admin:Stewardship:Stewardship_GA',
  'Admin:Stewardship:Stewardship_NC',
  'Admin:Stewardship:Stewardship_TN',
  'Admin:Stewardship:Stewardship_Unclassified',
  'Admin:SWAG:Swag_GA',
  'Admin:SWAG:Swag_NC',
  'Admin:SWAG:Swag_TN',
  'Admin:SWAG:Swag_Unclassified',
];

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
    limitPOField(costCenters);
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
  }
}
