import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { applyPromoCode } from "../../shared/ApplyPromoCode";
import { persistDiscountedTotals } from "../../shared/persistDiscountedTotals";

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Optional: Add logic for Add to Cart Page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    // Optional: Add logic for Cart Page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    // Optional: Add logic for Catalog Page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
    // Optional: Add logic for Checkout Address Page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    persistDiscountedTotals(); // ✅ Persist total on confirmation page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    applyPromoCode(); // ✅ Apply promo code on payment page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
    persistDiscountedTotals(); // ✅ Persist total on review page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
    // Optional: Add logic for Checkout Shipping Page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
    // Optional: Add logic for Account Form Page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
    // Optional: Add logic for Customize Page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
    // Optional: Add logic for My Account Page
  }
  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
    // Optional: Add logic for View Orders Page
  }
}

main(); // ✅ Always call main at the end
