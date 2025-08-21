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
   Ensure the hosted payment iframe has a tokenized URL (Option 3)
   - Tries several client-provided sources, then falls back to server
────────────────────────────────────────────────────────────── */
async function ensurePaymentIframeSrc(): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const iframe = document.getElementById(
    "load_payment"
  ) as HTMLIFrameElement | null;
  if (!iframe) return;

  const currentSrc = iframe.getAttribute("src") || "";
  if (currentSrc && currentSrc !== "about:blank") {
    // Already set
    return;
  }

  // 1) Try a global injected by the host page
  const fromGlobal = (window as any)?.PaymentPortalFrameURL as
    | string
    | undefined;

  // 2) Try a hidden field rendered server-side
  const fromHidden = (
    document.getElementById("paymentFrameUrl") as HTMLInputElement | null
  )?.value;

  // 3) Try a data- attribute on <body>
  const fromDataAttr =
    document.body?.getAttribute("data-payment-frame-url") || undefined;

  const candidate = [fromGlobal, fromHidden, fromDataAttr].find(
    (u) => typeof u === "string" && /^https?:\/\//i.test(u)
  );

  if (candidate) {
    iframe.src = candidate!;
    return;
  }

  // 4) Fallback: ask backend to mint a session and return hosted URL
  try {
    const orderNumber =
      (window as any)?.GLOBALVARS?.orderNumber ??
      Number(
        (document.getElementById("orderNumber") as HTMLInputElement | null)
          ?.value
      ) ??
      null;

    const resp = await fetch("/api/payment/frame-url", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber }),
    });

    if (!resp.ok) throw new Error(`frame-url ${resp.status}`);
    const { url } = await resp.json();
    if (!url || !/^https?:\/\//i.test(url))
      throw new Error("Missing or bad hosted URL");
    iframe.src = url;
  } catch (err) {
    console.warn("ensurePaymentIframeSrc: could not set iframe src", err);
  }
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

  // OPTION 3: Only show the modal once the iframe is visible AND has a real src
  const waitForTarget = () => {
    if (!iframeSelector) {
      showModal();
      return;
    }
    const el = document.querySelector(
      iframeSelector
    ) as HTMLIFrameElement | null;

    if (el && el.offsetParent !== null) {
      const src = el.getAttribute("src") || "";
      if (!src || src === "about:blank") {
        requestAnimationFrame(waitForTarget);
        return;
      }
      showModal();
      return;
    }
    requestAnimationFrame(waitForTarget);
  };

  setTimeout(() => requestAnimationFrame(waitForTarget), delayMs);
}

/* ─────────────────────────────────────────────────────────────
   Front-end CC fee calculation & grand total update
   - Includes tax in fee base (subtotal + shipping + tax)
────────────────────────────────────────────────────────────── */

export interface CcFeeCalcOptions {
  /** 0.03 means 3% */
  rate?: number;
  /** If true, include tax in the fee base */
  includeTaxInFee?: boolean;
  /** DOM IDs for targets (without #) */
  ids?: {
    subtotal?: string; // default: subPrice
    tax?: string; // default: taxPrice
    shipping?: string; // default: shipPrice
    fee?: string; // default: ccConvFee
    grand?: string; // default: grandPrice
  };
}

export function updateCcFeeAndGrandTotal(opts: CcFeeCalcOptions = {}): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const rate = opts.rate ?? 0.03;
  const includeTaxInFee = opts.includeTaxInFee ?? true; // <- default TRUE now
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

  // Includes tax in fee base when includeTaxInFee = true
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

  // 🔔 AUTO-TRIGGER the CC fee notice and correct fee on the payment step
  try {
    const isPaymentPage =
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
      window.location.pathname.includes("/checkout/4-payment.php");

    if (isPaymentPage) {
      // Ensure the iframe gets a tokenized URL ASAP (Option 3 core)
      void ensurePaymentIframeSrc();

      // Show the modal (once per browser, persistent) AFTER the frame has a real src
      initCreditCardFeeNotice({
        percentage: 3,
        storage: "local",
        storageKey: "cc-fee-accepted",
        iframeSelector: "#load_payment",
        delayMs: 300,
      });

      // Ensure fee is computed and added into the grand total
      const run = () =>
        updateCcFeeAndGrandTotal({
          rate: 0.03,
          includeTaxInFee: true, // ✅ include tax in surcharge
        });

      // Initial run after DOM has settled a bit
      setTimeout(run, 350);

      // Recompute whenever any of these numbers change
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
    // Never let this break checkout
    console.warn("CC fee notice or calc error:", e);
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
