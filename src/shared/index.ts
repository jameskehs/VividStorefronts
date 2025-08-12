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
   NAN shim for buggy PHP pages
────────────────────────────────────────────────────────────── */

function installNaNShimEarly(): void {
  const g = window as unknown as Record<string, any>;
  if (typeof g.NAN === "undefined") {
    g.NAN = Number.NaN;
  }
  const handler = (ev: ErrorEvent) => {
    if (
      typeof g.NAN === "undefined" &&
      /NAN is not defined/i.test(ev.message || "")
    ) {
      g.NAN = Number.NaN;
      ev.preventDefault();
      window.removeEventListener("error", handler, true);
    }
  };
  window.addEventListener("error", handler, true);
}

/* ─────────────────────────────────────────────────────────────
   Front-end CC fee calculation & grand total update
────────────────────────────────────────────────────────────── */

export interface CcFeeCalcOptions {
  rate?: number; // e.g., 0.03 for 3%
  includeTaxInFee?: boolean; // true = fee on (subtotal + shipping + tax)
  ids?: {
    subtotal?: string; // default "subPrice"
    tax?: string; // default "taxPrice"
    shipping?: string; // default "shipPrice"
    fee?: string; // default "ccConvFee"
    grand?: string; // default "grandPrice"
  };
}

export function updateCcFeeAndGrandTotal(opts: CcFeeCalcOptions = {}): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const rate = opts.rate ?? 0.03;
  const includeTaxInFee = opts.includeTaxInFee ?? true; // include taxes in fee
  const ids = {
    subtotal: opts.ids?.subtotal ?? "subPrice",
    tax: opts.ids?.tax ?? "taxPrice",
    shipping: opts.ids?.shipping ?? "shipPrice",
    fee: opts.ids?.fee ?? "ccConvFee",
    grand: opts.ids?.grand ?? "grandPrice",
  };

  const readNumber = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return 0;
    const txt = (el.textContent || "").replace(/[^0-9.\-]/g, "");
    const n = parseFloat(txt);
    return isNaN(n) ? 0 : n;
  };

  const writeMoney = (id: string, val: number) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val.toFixed(2);
  };

  const round2 = (n: number) => Math.round(n * 100) / 100;

  const subtotal = readNumber(ids.subtotal);
  const tax = readNumber(ids.tax);
  const shipping = readNumber(ids.shipping);

  const feeBase = subtotal + shipping + (includeTaxInFee ? tax : 0);
  const fee = round2(feeBase * rate);
  writeMoney(ids.fee, fee);

  const grand = round2(subtotal + shipping + tax + fee);
  writeMoney(ids.grand, grand);
}

/* ─────────────────────────────────────────────────────────────
   Shared storefront bootstrap
────────────────────────────────────────────────────────────── */

let __ccFeeObserver: MutationObserver | null = null;

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
    '<a href="mailto:loginrequest@vividink.com">Email: loginrequest@vividink.com</a>'
  );

  AddImagePickerSelectionToMemo();

  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    options.enableDropdown && loadDropdownMenu();
  }

  // Payment-page-only CC fee calc (no pop-up, no iframe title handling)
  try {
    const isPaymentPage =
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
      window.location.pathname.includes("/checkout/4-payment.php");

    if (isPaymentPage) {
      installNaNShimEarly();

      const run = () =>
        updateCcFeeAndGrandTotal({
          rate: 0.03,
          includeTaxInFee: true, // fee includes tax
        });

      // Initial calc after DOM paints
      setTimeout(run, 350);

      // Recalculate whenever these numbers change
      const idsToWatch = ["subPrice", "taxPrice", "shipPrice"];
      const targets = idsToWatch
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      if (__ccFeeObserver) {
        __ccFeeObserver.disconnect();
        __ccFeeObserver = null;
      }

      if (targets.length) {
        __ccFeeObserver = new MutationObserver(() => run());
        targets.forEach((el) =>
          __ccFeeObserver!.observe(el, {
            childList: true,
            subtree: true,
            characterData: true,
          })
        );
      }
    }
  } catch (e) {
    console.warn("CC fee calc error:", e);
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
