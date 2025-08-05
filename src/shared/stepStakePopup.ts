import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

// Extend the global Window interface
declare global {
  interface Window {
    $: JQueryStatic;
    setAction?: (action: string) => void;
  }
}

export function stepStakePopup(): void {
  const $ = window.$;

  // Check for 'VIP' keyword in content
  const vipText = $(".dtContent > td.largebody").text();
  if (vipText.includes("VIP")) {
    alert("exists");
  }

  // Add 'MY ORDERS' link after third menu item
  $("#menu li:nth-child(3)").after(
    `<li class="linkO"><a href="/account/orders.php">MY ORDERS</a></li>`
  );

  // Set document title
  document.title = "NOLA Living Realty Online Store";

  // Page-specific enhancements
  switch (GLOBALVARS.currentPage) {
    case StorefrontPage.CREATEEDITACCOUNT:
      $(
        'input[name="contactAddress1"],input[name="contactAddress2"],input[name="contactAddress3"],input[name="contactCity"],input[name="contactZip"],input[name="avsResidential"],select[name="contactCountry"]'
      )
        .attr("disabled", "disabled")
        .css("background-color", "#e6e6e6");
      break;

    case StorefrontPage.CART:
      enableStakePopup();
      break;

    case StorefrontPage.CHECKOUTADDRESS:
      $("#addressBook, #newAddress").css("opacity", "0");
      $("#shipToMyAddress")
        .empty()
        .append(
          "<p>Shipping address not required. Click button to proceed.</p>"
        );
      $(".FedEx-email-notify").hide();
      const forms = $("#shipToCompany form");
      if (forms.length > 1) {
        forms[1].remove();
      }
      $('button[name="button_shipTo"]').text("Continue to Delivery Method");
      break;

    case StorefrontPage.VIEWORDERS:
      $(".menuG").removeClass("menuG");
      $(".linkO").addClass("menuG");
      break;
  }

  function enableStakePopup(): void {
    let allItems = "";
    $("#shoppingCartTbl .dtContent table td:nth-of-type(2)").each((_i, el) => {
      allItems += (el as HTMLElement).innerText;
    });

    console.log("stepStakePopup: All items in cart:", allItems);

    if (allItems.includes("Sign Stake")) {
      console.log("stepStakePopup: 'Sign Stake' found. Skipping popup.");
      return;
    }

    console.log("stepStakePopup: Triggering stake popup");

    // Make sure overlay doesn't already exist
    if ($("#stake-overlay").length === 0) {
      $("body").append(`<div id="stake-overlay"></div>`);

      $("#stake-overlay").on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Only show popup if one doesn't already exist
        if ($("#stake-background").length > 0) return;

        $("body").append(`
          <div id="stake-background">
            <div id="stake-box">
              <div id="stake-exit">X</div>
              <p>Did you order stakes?</p>
              <a href="/catalog/2-customize.php?&designID=8454&contentID=40142">View Stakes</a>
            </div>
          </div>
        `);

        $("#stake-exit").on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          $("#stake-background").remove();
          $("#stake-overlay").remove();

          try {
            if (typeof window.setAction === "function") {
              window.setAction("process");
            }
          } catch (err) {
            console.warn("setAction failed:", err);
          }
        });
      });
    }
  }
}
