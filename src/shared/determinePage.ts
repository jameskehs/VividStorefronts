import { StorefrontPage } from '../enums/StorefrontPage.enum';

export function determineCurrentPage(): StorefrontPage | null {
  const pathname = window.location.pathname;
  switch (pathname) {
    case '/account/index.php':
      return StorefrontPage.MYACCOUNT;
    case '/account/orders.php':
      return StorefrontPage.VIEWORDERS;
    case '/account/edit_profile.php':
      return StorefrontPage.CREATEEDITACCOUNT;
    case '/catalog/':
      return StorefrontPage.CATALOG;
    case '/catalog/2-customize.php':
      return StorefrontPage.CUSTOMIZETEMPLATE;
    case '/cart/3-edit.php':
      return StorefrontPage.ADDTOCART;
    case '/cart/index.php':
      return StorefrontPage.CART;
    case '/checkout/5-shipping.php':
      return StorefrontPage.CHECKOUTADDRESS;
    case '/checkout/51-method.php':
      return StorefrontPage.CHECKOUTSHIPPING;
    case '/checkout/6-payment.php':
      return StorefrontPage.CHECKOUTPAYMENT;
    case '/checkout/7-review.php':
      return StorefrontPage.CHECKOUTREVIEW;
    case '/checkout/9-confirm.php':
      return StorefrontPage.CHECKOUTCONFIRMATION;
    default:
      return null;
  }
}
