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
        { name: 'Advocate Referral One Pages (Set of 10)', designID: 11422, contentID: 45960, recommendedQty: 50, isInventory: false },
        { name: 'Advocate Referral Stickers (Set of 10)', designID: 11423, contentID: 45961, recommendedQty: 12, isInventory: false },
        { name: 'Advocate Referral Yard Sign (Set of 10)', designID: 11421, contentID: 45959, recommendedQty: 1, isInventory: false },
      ],
      enforceRecommendedQty: false,
    },
    {
      name: 'New Hire Kit (Mens)',
      items: [
        { name: 'Mens Dri Fit Polo', designID: 8566, contentID: 40286, recommendedQty: 2, isInventory: true },
        { name: 'Dad Cap', designID: 8800, contentID: 40630, recommendedQty: 1, isInventory: true },
      ],
      enforceRecommendedQty: true,
    },
    {
      name: 'New Hire Kit (Womens)',
      items: [
        { name: 'Womens Dri Fit Polo', designID: 8573, contentID: 40293, recommendedQty: 2, isInventory: true },
        { name: 'Dad Cap', designID: 8800, contentID: 40630, recommendedQty: 1, isInventory: true },
      ],
      enforceRecommendedQty: true,
    },
  ];

  const kitWorkflow = new KitWorkflow(kits);
  kitWorkflow.run();

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    $('p.ui-state-error').each((index, element) => {
      if ($(element).text() === 'ON BACKORDER') {
        $(element).hide();
      }
    });
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
