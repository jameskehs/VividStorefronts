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
   Displayed qty normalization (e.g., <strong class="jobQty">2.00</strong>)
────────────────────────────────────────────────────────────── */
function normalizeDisplayedQuantities(root: ParentNode = document): void {
  const selectors = [
    ".jobQty",
    "td.jobQtyCell strong",
    ".qtyDisplay",
    ".cartQty",
    "[data-qty-display]",
  ].join(",");

  const els = root.querySelectorAll<HTMLElement>(selectors);
  els.forEach((el) => {
    const raw = (el.textContent || "").trim();

    // skip prices or empty text
    if (!raw || raw.includes("$")) return;

    // pure numeric strings (allow commas/decimals)
    if (/^\s*[\d.,]+\s*$/.test(raw)) {
      const n = Math.max(1, Math.floor(Number(raw.replace(/,/g, "")) || 1));
      el.textContent = String(n);
      return;
    }

    // embedded numbers like "Qty: 2.00" (avoid long IDs)
    el.textContent = raw.replace(/(\d+(?:[.,]\d+)?)/g, (m) => {
      if (m.length > 6) return m; // likely an ID
      const n = Math.max(1, Math.floor(Number(m.replace(/,/g, "")) || 1));
      return String(n);
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   Integer-only quantities on /cart/index.php & ?task=updateItem
────────────────────────────────────────────────────────────── */
function enforceIntegerQuantitiesOnCart(): void {
  const applyToInput = (input: HTMLInputElement) => {
    if ((input as any).__intApplied) return; // avoid double-binding
    (input as any).__intApplied = true;

    try {
      input.setAttribute("type", "number");
      input.setAttribute("step", "1");
      input.setAttribute("min", "1");
      input.inputMode = "numeric";

      const sanitize = () => {
        const n = Math.max(1, Math.floor(Number(input.value || "1") || 1));
        if (input.value !== String(n)) input.value = String(n);
      };

      // normalize any existing "1.00" -> "1"
      sanitize();

      input.addEventListener("keydown", (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (k === "." || k === "," || k === "e") e.preventDefault();
      });
      input.addEventListener("input", sanitize);
      input.addEventListener("blur", sanitize);
      input.addEventListener("change", sanitize);
      input.addEventListener("paste", (e: ClipboardEvent) => {
        const t = e.clipboardData?.getData("text") ?? "";
        const digits = t.replace(/[^\d]/g, "");
        if (digits !== t) {
          e.preventDefault();
          const n = Math.max(1, Math.floor(Number(digits || "1") || 1));
          input.value = String(n);
        }
      });
    } catch (err) {
      console.warn("Cart qty integer enforcement error:", err);
    }
  };

  const applyAll = (root: ParentNode = document) => {
    // inputs
    const candidates = root.querySelectorAll<HTMLInputElement>(
      [
        'input[name="quantity"]',
        'input[name^="quantity"]',
        'input[name*="qty"]',
        "input#quantity",
        '#quantityCol input[name="quantity"]',
        "input.quantity",
        "input.qty",
      ].join(",")
    );
    candidates.forEach(applyToInput);

    // displayed qtys
    normalizeDisplayedQuantities(root);
  };

  // run now
  applyAll();

  // observe typical cart containers for re-renders & text updates
  const host =
    document.getElementById("cartTable") ||
    document.getElementById("cartForm") ||
    document.querySelector(".cart, #content, #main") ||
    document.body;

  try {
    const mo = new MutationObserver((muts) => {
      let textChanged = false;
      for (const m of muts) {
        if (m.type === "childList" && m.addedNodes?.length) {
          m.addedNodes.forEach((n) => {
            if (n instanceof HTMLElement) applyAll(n);
          });
        }
        if (m.type === "characterData") textChanged = true;
      }
      if (textChanged) normalizeDisplayedQuantities(host!);
    });
    mo.observe(host!, { childList: true, subtree: true, characterData: true });
  } catch {
    // no-op
  }
}

/* ─────────────────────────────────────────────────────────────
   Force integer quantity on /cart/3-edit.php
────────────────────────────────────────────────────────────── */
function enforceIntegerQuantityOnCartEdit(): void {
  const apply = (input: HTMLInputElement) => {
    try {
      input.setAttribute("type", "number");
      input.setAttribute("step", "1");
      input.setAttribute("min", "1");
      input.inputMode = "numeric";

      const sanitize = () => {
        const n = Math.max(1, Math.floor(Number(input.value || "1") || 1));
        if (input.value !== String(n)) input.value = String(n);
      };

      // Normalize any default like "1.00" -> "1"
      sanitize();

      // Block decimal/exponent characters at the source
      input.addEventListener("keydown", (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
        if (k === "." || k === "," || k === "e") e.preventDefault();
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
        }
      });
    } catch (err) {
      console.warn("Quantity integer enforcement error:", err);
    }
  };

  const findQuantityInput = (): HTMLInputElement | null => {
    const byId = document.getElementById("quantity") as HTMLInputElement | null;
    if (byId) return byId;

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
   Hide "Add to Cart" ONLY when "Return to Cart" is visible
   (no :has, no global overrides, no attribute observer loops)
────────────────────────────────────────────────────────────── */
function toggleAddToCartWhenReturnPresent(): void {
  try {
    // 0) Remove any older injected CSS from previous attempts
    [
      "vi-hide-add-when-return-lite",
      "vi-hide-add-when-return-present",
      "hide-add-to-cart-when-return-present",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.tagName.toLowerCase() === "style")
        el.parentElement?.removeChild(el);
    });

    // 1) Install a simple class rule we can toggle safely
    const STYLE_ID = "vi-add-btn-hidden-class";
    let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      styleEl.type = "text/css";
      styleEl.textContent = `.vi-hidden{display:none !important;pointer-events:none !important;}`;
      document.head.appendChild(styleEl);
    }

    // 2) Scope to the button container (fallback to body if needed)
    const container =
      document.getElementById("checkoutProceedButtonContainer") ||
      document.getElementById("proceedToOrder") ||
      document.getElementById("editForm") ||
      document.body;

    const isReturnVisible = (): boolean => {
      const returns = container.querySelectorAll<HTMLButtonElement>(
        "#returnToCartButton, button[name='cart_return']"
      );
      for (const btn of Array.from(returns)) {
        if (btn.offsetParent !== null) return true; // truly visible in layout
      }
      return false;
    };

    const sync = () => {
      const hideAdd = isReturnVisible();
      const adds = container.querySelectorAll<HTMLButtonElement>(
        "#addToCartButton, button[name='add_cart']"
      );

      adds.forEach((btn) => {
        btn.classList.toggle("vi-hidden", hideAdd);
        btn.disabled = hideAdd;
        if (hideAdd) {
          btn.setAttribute("aria-hidden", "true");
          btn.setAttribute("tabindex", "-1");
        } else {
          btn.removeAttribute("aria-hidden");
          btn.removeAttribute("tabindex");
        }
      });

      // Keep hidden inputs aligned (no attribute observer → no loops)
      const showAddFlag = container.querySelector<HTMLInputElement>(
        "input[name='showAddToCart']"
      );
      if (showAddFlag) showAddFlag.value = hideAdd ? "0" : "1";
      const actionInput = container.querySelector<HTMLInputElement>(
        "input[name='cartButtonType']"
      );
      if (hideAdd && actionInput) actionInput.value = "return";
    };

    // Initial + a couple of delayed syncs for late renders
    sync();
    setTimeout(sync, 50);
    setTimeout(sync, 200);
    setTimeout(sync, 600);

    // 3) Observe only childList changes (no attributes/characterData)
    const mo = new MutationObserver(() => {
      cancelAnimationFrame((mo as any).__raf || 0);
      (mo as any).__raf = requestAnimationFrame(sync);
    });
    mo.observe(container, { childList: true, subtree: true });
  } catch (e) {
    console.warn("toggleAddToCartWhenReturnPresent error:", e);
  }
}

/* ─────────────────────────────────────────────────────────────
   Authorize.Net Accept Hosted loader (auto-POST token into iframe)
────────────────────────────────────────────────────────────── */

async function mountAuthorizeNetAcceptHosted(): Promise<void> {
  const iframe = findPaymentIframe();
  if (!iframe) return;

  const currentSrc = iframe.getAttribute("src") || "";
  if (currentSrc && currentSrc !== "about:blank") return;

  const orderNumber =
    (window as any)?.GLOBALVARS?.orderNumber ?? getOrderNumberFromDOM();

  const { index: csrfIndex, token: csrfToken } = getCsrf();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
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

  iframe.setAttribute("src", "about:blank");
}

/* ─────────────────────────────────────────────────────────────
   Non-Authorize.Net (legacy) loader using tokenized URL
────────────────────────────────────────────────────────────── */

async function mountGenericHostedFrame(): Promise<void> {
  const iframe = findPaymentIframe();
  if (!iframe) return;

  const currentSrc = iframe.getAttribute("src") || "";
  if (currentSrc && currentSrc !== "about:blank") return;

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

  // Only show the modal once the iframe is visible AND has a real session
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
   Targeted login-assistance email updater for 4-checkout
   (no scanning over arbitrary divs)
────────────────────────────────────────────────────────────── */
function updateLoginAssistanceMessage(): void {
  const path = (window.location.pathname || "").toLowerCase();
  if (!path.includes("/checkout/4-checkout.php")) return;

  const container = document.querySelector("#login-container");
  if (!container) return;

  // Find mailto links inside #login-container (usually only the assistance block)
  const links =
    container.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]');
  let updated = false;

  links.forEach((link) => {
    const nearestDiv = link.closest("div");
    const text = (nearestDiv?.textContent || "").toLowerCase();

    // Only touch the "If you have trouble logging in" assistance block
    if (text.includes("if you have trouble logging in")) {
      link.href = "mailto:loginrequests@vividink.com";
      link.textContent = "loginrequests@vividink.com";
      updated = true;
    }
  });

  // Fallback: if we didn't match by phrase but there's exactly one mailto in this container, update it.
  if (!updated && links.length === 1) {
    const link = links[0];
    link.href = "mailto:loginrequests@vividink.com";
    link.textContent = "loginrequests@vividink.com";
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
    '<a href="mailto:loginrequests@vividink.com">Email: loginrequests@vividink.com</a>'
  );

  // ✅ Only affect the 4-checkout login assistance block, without scanning every div
  try {
    updateLoginAssistanceMessage();
    // A couple of gentle retries in case the page paints late
    setTimeout(updateLoginAssistanceMessage, 100);
    setTimeout(updateLoginAssistanceMessage, 400);
  } catch (e) {
    console.warn("updateLoginAssistanceMessage error:", e);
  }

  AddImagePickerSelectionToMemo();

  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    options.enableDropdown && loadDropdownMenu();
  }

  // ✅ Quantity & button behavior on cart pages
  try {
    const path = (window.location.pathname || "").toLowerCase();
    const params = new URLSearchParams(window.location.search);

    if (path.includes("/cart/3-edit.php")) {
      enforceIntegerQuantityOnCartEdit();
      toggleAddToCartWhenReturnPresent(); // ← conditional hide with strong CSS
    }

    // ✅ Also apply to /cart/index.php and any page with ?task=updateItem
    if (
      path.includes("/cart/index.php") ||
      params.get("task") === "updateItem"
    ) {
      enforceIntegerQuantitiesOnCart();
    }
  } catch (e) {
    console.warn("Quantity/Add-to-Cart hooks error:", e);
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
