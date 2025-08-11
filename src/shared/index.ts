import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS, OptionsParameter } from "../index";
import { AddImagePickerSelectionToMemo } from "./imagePickertoMemo";
import { ChangeCustomerServiceMessage } from "./customerServiceMessage";
import { changeSupportText } from "./changeSupportText";
import { ChangeInventoryCountNoticeNEW } from "./inventoryCountNoticeNEW";

export interface FeeShipmentLike {
  taxableCcConvFee?: number | string | null | undefined;
  nonTaxableCcConvFee?: number | string | null | undefined;
}

/**
 * Totals credit card convenience fees across shipments.
 * Returns `null` if there are no fees (> 0) across all shipments.
 */
export function calculateCreditCardFees<T extends FeeShipmentLike>(
  shipments: T[] | null | undefined
): number | null {
  if (!shipments || shipments.length === 0) return null;

  let total = 0;
  let hasAny = false;

  for (const s of shipments) {
    const nonTaxable = Number(s?.nonTaxableCcConvFee ?? 0);
    const taxable = Number(s?.taxableCcConvFee ?? 0);

    if (nonTaxable > 0 || taxable > 0) {
      hasAny = true;
      total += nonTaxable + taxable;
    }
  }

  return hasAny ? total : null;
}

/* ─────────────────────────────────────────────────────────────
   Credit card fee notice (exported & auto-triggered)
────────────────────────────────────────────────────────────── */

export interface CreditCardFeeNoticeOptions {
  percentage?: number;
  message?: string; // {PERCENT} placeholder allowed
  acceptText?: string;
  iframeSelector?: string | null;
  delayMs?: number;
  zIndex?: number;
  storage?: "session" | "local" | null;
  storageKey?: string;
  condition?: () => boolean;
}

export function initCreditCardFeeNotice(
  opts: CreditCardFeeNoticeOptions = {}
): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const {
    percentage = 3,
    message = "⚠️ In an effort to keep overall cost down, a {PERCENT}% surcharge will be added to all credit card transactions.",
    acceptText = "Accept",
    iframeSelector = "#load_payment",
    delayMs = 300,
    zIndex = 99999,
    storage = "session",
    storageKey = "cc-fee-notice-accepted",
    condition,
  } = opts;

  if (condition && !condition()) return;

  const storageObj =
    storage === "local"
      ? window.localStorage
      : storage === "session"
      ? window.sessionStorage
      : null;

  if (storageObj && storageObj.getItem(storageKey) === "true") return;

  const MODAL_ID = "cc-fee-notice-modal";
  const alreadyThere = () => !!document.getElementById(MODAL_ID);

  const showModal = () => {
    if (alreadyThere()) return;

    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: String(zIndex),
    });

    const box = document.createElement("div");
    Object.assign(box.style, {
      backgroundColor: "#ffffff",
      border: "1px solid #ffffff",
      color: "#000000",
      padding: "24px",
      borderRadius: "8px",
      fontSize: "1.05rem",
      fontWeight: "bold",
      maxWidth: "420px",
      boxShadow: "0 0 20px rgba(0,0,0,0.2)",
      position: "relative",
      textAlign: "center",
    });

    box.innerHTML = `
      <div style="margin-bottom: 1em;">
        ${message.replace("{PERCENT}", String(percentage))}
      </div>
      <button id="cc-fee-close-btn" style="
        background-color: #dadada;
        color: black;
        border: none;
        padding: 6px 18px;
        border-radius: 4px;
        cursor: pointer;
      ">${acceptText}</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const closeBtn = box.querySelector(
      "#cc-fee-close-btn"
    ) as HTMLButtonElement | null;
    if (closeBtn) {
      closeBtn.onclick = () => {
        if (storageObj) storageObj.setItem(storageKey, "true");
        overlay.remove();
      };
    }
  };

  const waitForTarget = () => {
    if (!iframeSelector) {
      showModal();
      return;
    }
    const el = document.querySelector(iframeSelector) as HTMLElement | null;
    if (el && el.offsetParent !== null) {
      showModal();
      return;
    }
    requestAnimationFrame(waitForTarget);
  };

  setTimeout(() => requestAnimationFrame(waitForTarget), delayMs);
}

/* ─────────────────────────────────────────────────────────────
   Shared storefront bootstrap
────────────────────────────────────────────────────────────── */

export function runSharedScript(options: OptionsParameter) {
  console.log("Hello from the shared script!");

  $(".tableSiteBanner, #navWrapper").wrapAll(`<div id="logoLinks"></div>`);

  options.hideHomeLink && $(".linkH").remove();
  options.hideAddressBook &&
    $("button#saveAddressBook, table#addressBook").remove();
  options.hideCompanyShipTo && $("div#shipToCompany").remove();
  options.lockAddressBook &&
    $('button[title="Import address book"], button#saveAddressBook').remove();

  ChangeInventoryCountNoticeNEW(
    "Inventory not available for the desired order quantity. Please contact your account manager at 225-751-7297, or by email at sales@poweredbyprisma.com",
    "sales@poweredbyprisma.com"
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

  // 🔔 AUTO-TRIGGER the CC fee notice on all storefronts at payment step
  try {
    const isPaymentPage =
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
      window.location.pathname.includes("/checkout/4-payment.php");

    if (isPaymentPage) {
      initCreditCardFeeNotice({
        percentage: 3,
        storage: "local", // show once per session after accept
        storageKey: "cc-fee-accepted",
        iframeSelector: "#load_payment",
        delayMs: 300,
        // condition: () => true,     // optional extra guard if you ever need it
      });
    }
  } catch (e) {
    // Never let this break checkout
    console.warn("CC fee notice error:", e);
  }
}

function loadDropdownMenu() {
  const $menu = $(".TreeControl ul");
  const $items = $menu.children("li");

  const closedArrow = `<svg fill="#000000" width="12px" height="12px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" transform="matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>`;
  const openArrow = `<svg fill="#000000" width="12px" height="12px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>`;

  let $currentParent: JQuery<HTMLElement> | null = null;

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

    const id = $btn.siblings("a").attr("href");
    localStorage.setItem(id!, JSON.stringify(isOpen));
  });
}
