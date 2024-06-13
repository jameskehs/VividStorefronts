// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../../index';

export function main() {
  console.log(GLOBALVARS.currentPage);

  document.title = 'Krispy Krunchy Online Store';

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Hide add to cart button when editing an item that was already added to the cart
    if ($('#returnToCartButton').css('display') === 'block') {
      $('#addToCartButton').remove();
    }

    // Hide the qtyAvailable row when adding an item to cart
    $('.tablesorter tr').each(function (index, element) {
      if ($(this).html().includes('qtyAvailable')) {
        $(this).hide();
      }
    });
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
    const activeTemplate = $('.templateName a').text().trim();

    if (activeTemplate.includes('Business Cards')) {
      $('#show_userform').append(
        `<p style="font-weight:bold;font-size:14px">Don't see your job title? Contact <a href="mailto:graphics@krispykrunchy.com">Graphics@krispykrunchy.com</a> for help</p>`
      );
    }
  }
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
  }
}

/* 
<SCRIPT LANGUAGE = JavaScript>
if( $(".dtContent > td.largebody").text().indexOf('VIP') >= 0) {
   alert("exists");
}
document.title = "Krispy Krunchy Online Store";
$(".tableSiteBanner, #navWrapper").wrapAll(`<div class="BannerWrapper"></div>`)
    let shipMsg = `<p class="ship-message">Orders over $100 receive free shipping. Please NOTE: Shipping will show in your total at the checkout process but your card will only be charged for items ordered - no shipping!</p>`
	$("#topbreadsearch").append(shipMsg);
 $("#editForm").append(shipMsg);
  $(".checkoutProgress").append(shipMsg);
  $("#shoppingCartTbl").prepend(shipMsg);
if(window.location.pathname.includes("/checkout")){
     $('#taxRushShipGrand table tbody tr td')[5].innerText = "Shipping"
     }

  

  //$("#billAdrOnFileBox section table tbody tr td:nth-child(1)").remove();
  $("#editProfileTbl tbody")[1].remove();
  
if(window.location.pathname.includes("/cart/3-edit.php")){
	if($("#returnToCartButton").css('display') === 'block'){
    $('#addToCartButton').remove();
    }
  	$(".tablesorter tr").each((index,element)=>{
    if(element.innerHTML.includes("qtyAvailable")){
        //element.style.display = 'none'
    }
})
}
</SCRIPT>
*/
