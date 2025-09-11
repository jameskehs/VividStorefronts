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
   Payment helpers: robust detection, scraping, and iframe finding
────────────────────────────────────────────────────────────── */

function isPaymentStep(): boolean {
  const p = (window.location.pathname || "").toLowerCase();
  return (
    p.includes("/checkout/4-payment.php") ||
    p.includes("/checkout/6-payment.php") ||
    p.includes("/checkout/6-payment_new.php") ||
    p.includes("/checkout/payment.php") ||
    (window as any)?.GLOBALVARS?.currentPage === StorefrontPage.CHECKOUTPAYMENT
  );
}

function findPaymentIframe(): HTMLIFrameElement | null {
  return (
    (document.getElementById("load_payment") as HTMLIFrameElement) ||
    (document.querySelector("#paywithnewcard iframe") as HTMLIFrameElement) ||
    (document.querySelector(
      'iframe[name="load_payment"]'
    ) as HTMLIFrameElement) ||
    null
  );
}

function getOrderNumberFromDOM(): number | null {
  const ids = ["orderNumber", "orderNo", "orderID", "orderId"];
  for (const id of ids) {
    const el = document.getElementById(id) as
      | HTMLInputElement
      | HTMLElement
      | null;
    if (!el) continue;
    const raw = (el as HTMLInputElement).value ?? el.textContent ?? "";
    const n = Number(String(raw).replace(/[^\d]/g, ""));
    if (Number.isFinite(n) && n > 0) return n;
  }
  const nameCandidates = [
    "orderNumber",
    "order_no",
    "order_id",
    "ordernumber",
    "orderno",
  ];
  for (const nm of nameCandidates) {
    const el = document.querySelector<HTMLInputElement>(`input[name="${nm}"]`);
    if (el) {
      const n = Number((el.value || "").replace(/[^\d]/g, ""));
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  const scope =
    document.querySelector("#checkoutSummary, #orderSummary, .ui-box, table") ||
    document.body;
  const m = (scope.textContent || "").match(
    /order\s*(?:number|no\.?|#)\s*[:\-]?\s*(\d{3,})/i
  );
  if (m) {
    const n = Number(m[1]);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function getCsrf() {
  const idx = (
    document.querySelector(
      'input[name="_CSRF_INDEX"]'
    ) as HTMLInputElement | null
  )?.value;
  const tok = (
    document.querySelector(
      'input[name="_CSRF_TOKEN"]'
    ) as HTMLInputElement | null
  )?.value;
  return { index: idx ?? null, token: tok ?? null };
}

function getPaymentMethod(): string | null {
  // Your DOM shows: <input ... class="paymentMethodStored" value="anetIFrame">
  const el =
    document.querySelector<HTMLInputElement>(".paymentMethodStored[checked]") ||
    document.querySelector<HTMLInputElement>(".paymentMethodStored");
  return el?.value ?? null;
}

/* ─────────────────────────────────────────────────────────────
   NEW: Force integer quantities on /cart/3-edit.php
────────────────────────────────────────────────────────────── */

function enforceIntegerQuantityOnCartEdit(): void {
  const apply = (input: HTMLInputElement) => {
    try {
      // Make it a number field with integer-only UX
      input.setAttribute("type", "number");
      input.setAttribute("step", "1");
      input.setAttribute("min", "1");
      input.inputMode = "numeric";

      // Normalize any default like "1.00" -> "1"
      const start = Math.max(1, Math.floor(Number(input.value || "1") || 1));
      input.value = String(start);

      const sanitize = () => {
        const n = Math.max(1, Math.floor(Number(input.value || "1") || 1));
        // Only set if different to avoid double firing onchange
        if (input.value !== String(n)) input.value = String(n);
      };

      // Block decimal/exponent characters at the source
      input.addEventListener("keydown", (e: KeyboardEvent) => {
        const blocked =
          e.key === "." || e.key === "," || e.key.toLowerCase() === "e";
        if (blocked) e.preventDefault();
      });

      // Scrub on input/blur/change (preserves existing inline onchange handlers)
      input.addEventListener("input", sanitize);
      input.addEventListener("blur", sanitize);
      input.addEventListener("change", sanitize);

      // Clean pasted content
      input.addEventListener("paste", (e: ClipboardEvent) => {
        const t = e.clipboardData?.getData("text") ?? "";
        const digits = t.replace(/[^\d]/g, "");
        if (digits !== t) {
          e.preventDefault();
          const n = Math.max(1, Math.floor(Number(digits || "1") || 1));
          input.value = String(n);
          // Let the page's inline onchange fire naturally when focus changes
        }
      });
    } catch (err) {
      console.warn("Quantity integer enforcement error:", err);
    }
  };

  const findQuantityInput = (): HTMLInputElement | null => {
    // Primary ID (from your markup)
    const byId = document.getElementById("quantity") as HTMLInputElement | null;
    if (byId) return byId;

    // Fallbacks
    return (
      document.querySelector<HTMLInputElement>(
        '#quantityCol input[name="quantity"]'
      ) ||
      document.querySelector<HTMLInputElement>(
        'input#quantity[name="quantity"]'
      ) ||
      null
    );
  };

  const init = () => {
    const input = findQuantityInput();
    if (input) apply(input);
  };

  // Run once now
  init();

  // Re-run if the form/quantity area re-renders
  const host =
    document.getElementById("quantityCol") ||
    document.getElementById("editForm") ||
    document.body;

  try {
    const mo = new MutationObserver(() => init());
    mo.observe(host, { childList: true, subtree: true });
  } catch {
    // no-op
  }
}

/* ─────────────────────────────────────────────────────────────
   Authorize.Net Accept Hosted loader (auto-POST token into iframe)
────────────────────────────────────────────────────────────── */

async function mountAuthorizeNetAcceptHosted(): Promise<void> {
  const iframe = findPaymentIframe();
  if (!iframe) return;

  // If it already has something meaningful, bail
  const currentSrc = iframe.getAttribute("src") || "";
  if (currentSrc && currentSrc !== "about:blank") return;

  // 1) get order number best-effort
  const orderNumber =
    (window as any)?.GLOBALVARS?.orderNumber ?? getOrderNumberFromDOM();

  // 2) call backend to mint Accept Hosted token
  //    Expected response: { token: "..." }
  const { index: csrfIndex, token: csrfToken } = getCsrf();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  // Include CSRF if your backend expects them in headers; if not, they’re harmless.
  if (csrfIndex) headers["X-CSRF-INDEX"] = csrfIndex;
  if (csrfToken) headers["X-CSRF-TOKEN"] = csrfToken;

  let token: string | null = null;
  try {
    const resp = await fetch("/api/anet/hosted-token", {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ orderNumber: orderNumber ?? null }),
    });
    if (!resp.ok) throw new Error(`anet token http ${resp.status}`);
    const data = await resp.json();
    token = data?.token || null;
  } catch (e) {
    console.warn("[anet] failed to fetch hosted token", e);
  }
  if (!token) {
    console.warn("[anet] No hosted token returned; cannot load iframe.");
    return;
  }

  // 3) POST the token to the Accept Hosted payment URL, targeting the iframe.
  //    (Authorize.Net supports POSTing { token } to this endpoint.)
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://accept.authorize.net/payment/payment";
  form.target = iframe.name || "load_payment";
  form.style.display = "none";

  const tokenInput = document.createElement("input");
  tokenInput.type = "hidden";
  tokenInput.name = "token";
  tokenInput.value = token;

  form.appendChild(tokenInput);
  document.body.appendChild(form);
  form.submit();

  // Optional: set a placeholder src so our “modal waiter” will proceed after first load
  iframe.setAttribute("src", "about:blank"); // not required; the form target controls load
}

/* ─────────────────────────────────────────────────────────────
   Non-Authorize.Net (legacy) loader using tokenized URL
────────────────────────────────────────────────────────────── */

async function mountGenericHostedFrame(): Promise<void> {
  const iframe = findPaymentIframe();
  if (!iframe) return;

  const currentSrc = iframe.getAttribute("src") || "";
  if (currentSrc && currentSrc !== "about:blank") return;

  // 1) client-provided sources
  const fromGlobal = (window as any)?.PaymentPortalFrameURL as
    | string
    | undefined;
  const fromHidden = (
    document.getElementById("paymentFrameUrl") as HTMLInputElement | null
  )?.value;
  const fromDataAttr =
    document.body?.getAttribute("data-payment-frame-url") || undefined;

  const firstValid = (...urls: (string | undefined)[]) =>
    urls.find((u) => typeof u === "string" && /^https?:\/\//i.test(String(u)));

  let hostedUrl = firstValid(fromGlobal, fromHidden, fromDataAttr);

  // 2) backend fallback if none provided
  if (!hostedUrl) {
    const orderNumber =
      (window as any)?.GLOBALVARS?.orderNumber ?? getOrderNumberFromDOM();

    try {
      const resp = await fetch("/api/payment/frame-url", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderNumber ?? null }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data?.url && /^https?:\/\//i.test(data.url)) {
          hostedUrl = data.url;
        } else {
          console.warn(
            "[payment] /api/payment/frame-url returned no usable url"
          );
        }
      } else {
        console.warn(`[payment] /api/payment/frame-url HTTP ${resp.status}`);
      }
    } catch (e) {
      console.warn("[payment] /api/payment/frame-url fetch failed", e);
    }
  }

  if (!hostedUrl) {
    console.warn(
      "[payment] No tokenized URL found. Provide window.PaymentPortalFrameURL, " +
        '<input id="paymentFrameUrl">, <body data-payment-frame-url>, or implement /api/payment/frame-url.'
    );
    return;
  }

  // set src (retry-once handled by gateway if needed)
  const onError = () => {
    iframe?.removeEventListener("error", onError);
    console.warn("[payment] iframe load error (token might be expired)");
  };
  iframe.addEventListener("error", onError, { once: true });
  iframe.src = hostedUrl;
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

  // Only show the modal once the iframe is visible AND has a real session (src or posted token)
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
      // For Accept Hosted we POST into the frame; src may remain about:blank until load.
      // We’ll simply wait a tick longer if src is empty/about:blank.
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
  const includeTaxInFee = opts.includeTaxInFee ?? true;
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
   Hide "Add to Cart" on /cart/3-edit.php (keep "Return to Cart")
────────────────────────────────────────────────────────────── */
function hideAddToCartOnCartEdit(): void {
  const apply = () => {
    // Button
    const addBtn = document.getElementById(
      "addToCartButton"
    ) as HTMLButtonElement | null;
    if (addBtn) {
      // Hide and disable for safety; also remove from tab order and a11y tree
      addBtn.style.display = "none";
      addBtn.disabled = true;
      addBtn.setAttribute("tabindex", "-1");
      addBtn.setAttribute("aria-hidden", "true");
      // Remove click handlers in case styles get overridden
      addBtn.onclick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false as unknown as any;
      };
    }

    // Ensure server-side action defaults to "return"
    const actionInput = document.querySelector<HTMLInputElement>(
      'input[name="cartButtonType"]'
    );
    if (actionInput) actionInput.value = "return";

    // If your page uses showAddToCart flag, set it to 0/false
    const showAddFlag = document.querySelector<HTMLInputElement>(
      'input[name="showAddToCart"]'
    );
    if (showAddFlag) showAddFlag.value = "0";

    // Guard against Enter key accidentally triggering a submit that would try to add
    const form = document.getElementById("editForm") as HTMLFormElement | null;
    if (form) {
      form.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          // Let the form submit, but ensure it’s the "return" action
          if (actionInput) actionInput.value = "return";
        }
      });
      form.addEventListener("submit", () => {
        if (actionInput) actionInput.value = "return";
      });
    }
  };

  // Run once now
  apply();

  // Re-apply if the button area re-renders
  const host =
    document.getElementById("checkoutProceedButtonContainer") ||
    document.getElementById("proceedToOrder") ||
    document.getElementById("editForm") ||
    document.body;

  try {
    const mo = new MutationObserver(() => apply());
    mo.observe(host, { childList: true, subtree: true });
  } catch {
    // no-op
  }
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

  // ✅ Apply integer-only quantity on all Add-To-Cart pages
  try {
    if (
      (window.location.pathname || "")
        .toLowerCase()
        .includes("/cart/3-edit.php")
    ) {
      enforceIntegerQuantityOnCartEdit();
      hideAddToCartOnCartEdit();
    }
  } catch (e) {
    console.warn("Quantity integer hook error:", e);
  }

  try {
    if (isPaymentStep()) {
      const method = getPaymentMethod();

      if (method && method.toLowerCase() === "anetiframe") {
        // ✅ Authorize.Net Accept Hosted path (requires POSTing token into iframe)
        void mountAuthorizeNetAcceptHosted();
      } else {
        // ✅ Generic hosted page path (tokenized URL set as iframe src)
        void mountGenericHostedFrame();
      }

      // Show the modal AFTER the frame has a real session
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
          includeTaxInFee: true,
        });

      setTimeout(run, 350);

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
