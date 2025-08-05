export function enhanceCheckoutAddressPage(): void {
  const $ = window.$;

  $("#addressBook, #newAddress").css("opacity", "0");

  $("#shipToMyAddress")
    .empty()
    .append("<p>Shipping address not required. Click button to proceed.</p>");

  $(".FedEx-email-notify").css("display", "none");

  $('button[name="button_shipTo"]').text("Continue to Delivery Method");

  const forms = $("#shipToCompany form");
  if (forms.length > 1) {
    forms[1].remove();
  }
}
