// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../../index';
import { KitWorkflow } from '../../shared/KitHelper';
import { Kit } from '../../types/Kit';

export function main() {
  console.log(GLOBALVARS.currentPage);

  const kits: Kit[] = [
    {
      name: 'Advocates Referrals Kit',
      items: [
        { name: 'Advocate Referral One Pages', designID: 11422, contentID: 45960, recommendedQty: 500, isInventory: false },
        { name: 'Advocate Referral Stickers', designID: 11423, contentID: 45961, recommendedQty: 120, isInventory: false },
        { name: 'Advocate Referral Yard Sign', designID: 11421, contentID: 45959, recommendedQty: 10, isInventory: false },
      ],
      enforceRecommendedQty: false,
    },
  ];

  const kitWorkflow = new KitWorkflow(kits);
  kitWorkflow.run();

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
  }
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
  }
}
