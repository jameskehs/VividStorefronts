export enum StorefrontPages {
  ADDTOCART = '/cart/3-edit.php',
  CART = '/cart/index.php',
  CATALOG = '/catalog/',
  CHECKOUTADDRESS = '/checkout/5-shipping.php',
  CHECKOUTCONFIRMATION = '/checkout/9-confirm.php',
  CHECKOUTPAYMENT = '/checkout/6-payment.php',
  CHECKOUTREVIEW = '/checkout/7-review.php',
  CHECKOUTSHIPPING = '/checkout/51-method.php',
  CREATEEDITACCOUNT = '/account/edit_profile.php',
  CUSTOMIZE = '/catalog/2-customize.php',
  MYACCOUNT = '/account/index.php',
  VIEWORDERS = '/account/orders.php',
}

// function determineCurrentPage() {
//   const pathname = window.location.pathname;
//   switch (pathname) {
//     case '/account/index.php':
//       return 'My Account Page';
//     case '/account/orders.php':
//       return 'View Orders Page';
//     case '/account/edit_profile.php':
//       return 'Create/Edit Account Page';
//     case '/catalog/':
//       return 'Catalog Page';
//     case '/catalog/2-customize.php':
//       return 'Customize Page';
//     case '/cart/3-edit.php':
//       return 'Add To Cart Page';
//     case '/cart/index.php':
//       return 'Cart Page';
//     case '/checkout/5-shipping.php':
//       return 'Checkout Address Page';
//     case '/checkout/51-method.php':
//       return 'Checkout Shipping Page';
//     case '/checkout/6-payment.php':
//       return 'Checkout Payment Page';
//     case '/checkout/7-review.php':
//       return 'Checkout Review Page';
//     case '/checkout/9-confirm.php':
//       return 'Checkout Confirmation Page';
//     default:
//       return null;
//   }
// }
// const currentPage = determineCurrentPage();
