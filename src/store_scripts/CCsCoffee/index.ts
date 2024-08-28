// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../../index';

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    $('.tablesorter tr').each(function (index, element) {
      if ($(this).text().includes('AVAILABLE')) {
        $(this).hide();
      }
    });
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    $('.ui-state-error:contains(ON BACKORDER)').hide();
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
    const shipInterval = setInterval(() => {
      if ($("td.h3:contains('USPS')").length > 0) {
        $("td.h3:contains('USPS')").append(
          "<p style='display: inline;margin-left: 10px;font-weight: normal;color: red'>(Best used for small orders)</p>"
        );
        clearInterval(shipInterval);
      }
    }, 500);

    $('.deliveryTimeCol, #shipping_method_table tbody tr td:nth-of-type(3)').hide();
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

// $(".tableSiteBanner, #navWrapper").wrapAll(`<div class="BannerWrapper"></div>`);
// $(".BannerWrapper").wrapAll(`<div class="BannerWrapperContainer"></div>`);
// $(".tableLogin").wrapAll(`<div class="tableLoginContainer"></div>`);
// function determineCurrentPage() {
//   const pathname = window.location.pathname;
//   switch (pathname) {
//     case "/account/index.php":
//       return "My Account Page";
//     case "/account/orders.php":
//       return "View Orders Page";
//     case "/catalog/":
//       return "Catalog Page";
//     case "/catalog/2-customize.php":
//       return "Customize Page";
//     case "/cart/3-edit.php":
//       return "Add To Cart Page";
//     case "/cart/index.php":
//       return "Cart Page";
//     case "/checkout/5-shipping.php":
//       return "Checkout Address Page";
//     case "/checkout/51-method.php":
//       return "Checkout Shipping Page";
//     case "/checkout/6-payment.php":
//       return "Checkout Payment Page";
//     case "/checkout/7-review.php":
//       return "Checkout Review Page";
//     case "/checkout/9-confirm.php":
//       return "Checkout Confirmation Page";
//     default:
//       return null;
//   }
// }
// const currentPage = determineCurrentPage();
// const storedPromoCode = localStorage.getItem("CC_PROMO_CODE");
// if (currentPage !== "Catalog Page" && currentPage !== "Customize Page") {
//   $("div#breadcrumb").remove();
// }

// if(currentPage === "Add To Cart Page"){
//   	$(".tablesorter tr").each((index,element)=>{
//     if(element.innerHTML.includes("qtyAvailable")){
//         element.style.display = 'none'
//     }
// })
// }

//   if(currentPage === "Catalog Page"){
//   $(".ui-state-error:contains(ON BACKORDER)").css('display','none')
//   }

//    $('strong:contains("AVAILABLE")').text("INVENTORY");
// 	const packSizeItems = [
//       {
//       name: 'Custom Matte Name Tags',
//   	  packSize: 25
//       }
//     ];

//   	for(packSizeItem of packSizeItems){
//   	const productName = $(".tablesorter tbody tr td")[1].innerText;
//     if(packSizeItem.name === productName){
//       	$(".tablesorter tbody tr td")[5].append(`Pack(s) of ${packSizeItem.packSize}`)
//     }
// 	}

// if(currentPage === "Checkout Shipping Page"){
//   const shipInterval = setInterval(()=>{
//       if($("td.h3:contains('USPS')").length > 0){
//         $("td.h3:contains('USPS')").append("<p style='display: inline;margin-left: 10px;font-weight: normal;color: red'>(Best used for small orders)</p>")
//         clearInterval(shipInterval)
//       }

//     },500)

// }
// if (currentPage.includes("Checkout")) {
//   $("#lineItems").append(`<div id="promo-info"></div>`);
//   const renderPromoForm = () => {
//     $("#promo-info").empty();
//     $("#promo-info").append(`
//     <div id="promo-form">
//     <input id="promo-field" type='text' placeholder='Enter Promo Code'/>
//     <button type='button'>Apply</button>
//     </div>`);

//     $("#promo-form button").on("click", () => {
//       const enteredPromoCode = $("#promo-field").val();
//       if (enteredPromoCode.length === 0) {
//         alert("Promo Code cannot be blank!");
//         return;
//       }

//       localStorage.setItem("CC_PROMO_CODE", enteredPromoCode);
//       renderExistingPromo(enteredPromoCode);
//     });
//   };
//   const renderExistingPromo = (existingPromo) => {
//     $("#promo-info").empty();
//     $("#promo-info").append(`
//       <div id="applied-promo-info">
//       <p>Promo Applied: ${existingPromo}</p>
//       <button type="button" id="clear-promo-btn">X</button>
//       </div>
//       `);
//     $("#lineItems").append("<p id='promo-disclaimer'><span style='font-weight:bold'>NOTE: </span>Your Grand Total will not update to reflect promo code discounts. Once you place your order, the promo code will be validated by our sales team, and your order will be updated with the discounted total. If you are paying with a credit card, your card will be authorized for the Grand Total shown above. Once our sales team validates the promo code, your card will be charged for the discounted amount.</p>");

//     $("#clear-promo-btn").on("click", () => {
//       localStorage.removeItem("CC_PROMO_CODE");
//       $("#promo-disclaimer").remove();
//       renderPromoForm();
//     });
//   };

//   if (!storedPromoCode) {
//     renderPromoForm();
//   } else {
//     renderExistingPromo(storedPromoCode);
//   }
// }

// if(currentPage === "Checkout Review Page"){
//   if(storedPromoCode){
//     $("#clear-promo-btn").remove();
//     $("#comments").val(`PROMO CODE: ${storedPromoCode}`);
//   } else {
//     $("#promo-info").remove();
//   }

//   $("#orderSubmit").on('click',()=>{
//     localStorage.removeItem("CC_PROMO_CODE");
//   })
// }
