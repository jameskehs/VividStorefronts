import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS, OptionsParameter } from "../index";
import { AddImagePickerSelectionToMemo } from "./imagePickertoMemo";
import { ChangeCustomerServiceMessage } from "./customerServiceMessage";
import { changeSupportText } from "./changeSupportText";
import { ChangeInventoryCountNoticeNEW } from "./inventoryCountNoticeNEW";

export function runSharedScript(options: OptionsParameter) {
  console.log("Hello from the shared script!");

  // Wrap nav elements
  $(".tableSiteBanner, #navWrapper").wrapAll(`<div id="logoLinks"></div>`);
  // $('#logoLinks').wrapAll(`<div id="headWrapper"></div>`);
  // $('.tableLogin').wrapAll("<div id='loginWrapper'></div>");

  options.hideHomeLink && $(".linkH").remove();
  options.hideAddressBook &&
    $("button#saveAddressBook, table#addressBook").remove();
  options.hideCompanyShipTo && $("div#shipToCompany").remove();
  options.lockAddressBook &&
    $('button[title="Import address book"], button#saveAddressBook').remove();

  // Call the updated function with a placeholder email to be replaced dynamically
  ChangeInventoryCountNoticeNEW(
    "Inventory not available for the desired order quantity. Please contact your account manager at 225-751-7297, or by email at sales@poweredbyprisma.com",
    "sales@poweredbyprisma.com" // Placeholder email to be replaced dynamically
  );

  ChangeCustomerServiceMessage(
    "For customer service, please email your Sales Representative listed above."
  );

  changeSupportText(
    "If you are having issues accessing your account, please contact our support team:",
    "Phone: 225-751-7297",
    '<a herf="mailto:loginrequest@vividink.com">Email: loginrequest@vividink.com</a>'
  );

  AddImagePickerSelectionToMemo();

  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    options.enableDropdown && loadDropdownMenu();
  }

  // Add "On Demand" tag to products that are not inventoried
  /*$('.prodCell').each(function (index, cell) {
    const inventoryTag = $(this).find('.meta p.ui-state-error, .meta p.ui-state-default');
    if (inventoryTag.length === 0) {
      $('span.meta', this).prepend('<p class="ui-state-default ui-corner-all" style="text-align: center;">On Demand</p>');
    }
  });*/
}

// 💳 Credit Card Fee Popup (now global)
if (
  GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
  window.location.pathname.includes("/checkout/4-payment.php")
) {
  const displayCcFeeMessage = () => {
    if (document.getElementById("cc-fee-notice-modal")) return;

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "cc-fee-notice-modal";
    Object.assign(modalOverlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "99999",
    });

    const modalBox = document.createElement("div");
    Object.assign(modalBox.style, {
      backgroundColor: "#ffffff",
      border: "1px solid #ffffff",
      color: "#000000",
      padding: "24px",
      borderRadius: "8px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      maxWidth: "400px",
      boxShadow: "0 0 20px rgba(0,0,0,0.2)",
      position: "relative",
      textAlign: "center",
    });

    modalBox.innerHTML = `
        <div style="margin-bottom: 1em;">
          ⚠️ In an effort to keep overall cost down, a 3% surcharge will be added to all credit card transactions.
        </div>
        <button id="cc-fee-close-btn" style="
          background-color: #dadada;
          color: black;
          border: none;
          padding: 4px 16px;
          border-radius: 4px;
          cursor: pointer;
        ">Accept</button>
      `;

    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);

    const closeBtn = modalBox.querySelector(
      "#cc-fee-close-btn"
    ) as HTMLButtonElement;
    closeBtn.onclick = () => modalOverlay.remove();
  };

  const waitForIframe = () => {
    const iframe = document.querySelector(
      "#load_payment"
    ) as HTMLElement | null;
    if (iframe && iframe.offsetParent !== null) {
      displayCcFeeMessage();
      return;
    }
    requestAnimationFrame(waitForIframe);
  };

  setTimeout(() => requestAnimationFrame(waitForIframe), 300);
}

function loadDropdownMenu() {
  const $menu = $(".TreeControl ul");
  const $items = $menu.children("li");

  const closedArrow = `<svg fill="#000000" width="12px" height="12px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>`;
  const openArrow = `<svg fill="#000000" width="12px" height="12px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>`;

  let $currentParent = null;

  $items.each(function () {
    const $item = $(this);
    const indent = parseInt($item.css("text-indent"));

    if (indent === 0) {
      $item.addClass("dropdown");
      $item.append('<ul class="dropdown-content"></ul>');
      $currentParent = $item;
    } else if (indent === 10 || indent === 20) {
      $item.addClass("nested-dropdown");
      $currentParent!.find("ul").first().append($item);
    }
  });

  // Set initial state based on localStorage
  $items.each(function () {
    const $item = $(this);
    if (
      $item.hasClass("dropdown") &&
      $item.find(".dropdown-content").children().length > 0
    ) {
      const id = $item.find("a").attr("href");
      $item.prepend(`
      <button class="toggle-btn" style="position:absolute;right:10px;border:1px solid #ddd !important;height:20px;">${closedArrow}</button>`);
      const isOpen = localStorage.getItem(id!) === "true";
      $item.find(".dropdown-content").toggle(isOpen);
      $item.find(".toggle-btn").html(isOpen ? openArrow : closedArrow);
    }
  });

  $(".toggle-btn").on("click", function (e): void {
    e.stopPropagation();
    const $btn = $(this);
    const $dropdownContent = $btn.siblings(".dropdown-content");
    $dropdownContent.toggle();
    const isOpen = $dropdownContent.is(":visible");
    $btn.html(isOpen ? openArrow : closedArrow);

    // Store state in localStorage
    const id = $btn.siblings("a").attr("href");
    localStorage.setItem(id!, JSON.stringify(isOpen));
  });
}
