import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS, OptionsParameter } from "../index";
import { AddImagePickerSelectionToMemo } from "./imagePickertoMemo";
import { ChangeCustomerServiceMessage } from "./customerServiceMessage";
import { changeSupportText } from "./changeSupportText";
import { ChangeInventoryCountNoticeNEW } from "./inventoryCountNoticeNEW";
import { fixPaymentIframeA11y } from "./fixPaymentIframeA11y";

/* ─────────────────────────────────────────────────────────────
   Typings for platform-provided CSRF tokens map
────────────────────────────────────────────────────────────── */
declare global {
  interface Window {
    tokens?: Record<
      string,
      {
        index?: string;
        token?: string;
      }
    >;
    jQuery?: JQueryStatic;
  }
}

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
   CSRF helpers (robust even if specific window.tokens entry is missing)
────────────────────────────────────────────────────────────── */
function getAllTokenEntries(): Array<{
  path: string;
  index?: string;
  token?: string;
}> {
  const out: Array<{ path: string; index?: string; token?: string }> = [];
  const map = window.tokens || {};
  for (const k of Object.keys(map)) {
    out.push({ path: k, index: map[k]?.index, token: map[k]?.token });
  }
  return out;
}

/** Ensure window.tokens has an entry for each path (clone from the first good one). */
function ensureAjaxTokenFor(paths: string[]): void {
  if (!window.tokens) window.tokens = {};
  const entries = getAllTokenEntries().filter((e) => e.index && e.token);
  if (!entries.length) return; // nothing to clone from

  const donor = entries[0]; // good-enough donor
  for (const p of paths) {
    if (
      !window.tokens[p] ||
      !(window.tokens[p].index && window.tokens[p].token)
    ) {
      window.tokens[p] = { index: donor.index, token: donor.token };
    }
  }
}

/** Extracts "/cart/ajax_newProductID.php" → "ajax_newProductID.php" */
function basenameFromPath(p: string): string {
  try {
    const s = p.split("?")[0].split("#")[0];
    return s.substring(s.lastIndexOf("/") + 1);
  } catch {
    return p;
  }
}

/* ─────────────────────────────────────────────────────────────
   CSRF: auto-attach Prisma/Dokshop token(s) to all jQuery AJAX
   – works even without PHP access
────────────────────────────────────────────────────────────── */
function attachGlobalAjaxCSRF(): void {
  const $ = window.jQuery || (window as any).$;
  if (!$ || !$.ajaxPrefilter) return;

  // Proactively synthesize missing token entries for known cart endpoints
  ensureAjaxTokenFor(["/cart/ajax_newProductID.php", "ajax_newProductID.php"]);

  $.ajaxPrefilter(function (options: any, _orig: any, jqXHR: JQueryXHR) {
    try {
      const base =
        (location as any).origin || location.protocol + "//" + location.host;
      const u = new URL(options.url, base);
      const path = u.pathname;
      const baseName = basenameFromPath(path);

      // Try exact path → prefix → basename matches in window.tokens
      const tokensMap = window.tokens || {};
      let entry = tokensMap[path] || null;

      if (!entry) {
        // prefix/suffix match (some maps store keys without full path or with different prefixes)
        const byPrefix = Object.keys(tokensMap).find(
          (k) => path.endsWith(k) || k.endsWith(path)
        );
        if (byPrefix) entry = tokensMap[byPrefix];
      }
      if (!entry) {
        // basename match (e.g., "ajax_newProductID.php")
        const byBase = Object.keys(tokensMap).find(
          (k) => basenameFromPath(k) === baseName
        );
        if (byBase) entry = tokensMap[byBase];
      }

      // Fallbacks: meta/cookie if present
      const meta = document.querySelector(
        'meta[name="csrf-token"]'
      ) as HTMLMetaElement | null;
      const metaToken = meta?.getAttribute("content") || "";
      const cookieToken =
        (document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/) || [])[1] || "";

      const kv: string[] = [];
      if (entry?.index && entry?.token) {
        kv.push("index=" + encodeURIComponent(entry.index));
        kv.push("token=" + encodeURIComponent(entry.token));
      } else if (metaToken) {
        kv.push("csrf=" + encodeURIComponent(metaToken));
      } else if (cookieToken) {
        kv.push("csrf=" + encodeURIComponent(cookieToken));
      }

      if (!kv.length) return;

      const add = kv.join("&");
      const isPost = (options.type || "").toUpperCase() === "POST";

      if (isPost) {
        if (typeof options.data === "string" && options.data.length) {
          options.data += "&" + add;
        } else if (options.data && typeof options.data === "object") {
          const params = new URLSearchParams(add);
          const extra: Record<string, string> = {};
          params.forEach((v, k) => (extra[k] = v));
          options.data = { ...options.data, ...extra };
        } else {
          options.data = add;
        }
      } else {
        options.url += (options.url.indexOf("?") >= 0 ? "&" : "?") + add;
      }

      if (metaToken && jqXHR?.setRequestHeader) {
        jqXHR.setRequestHeader("X-CSRF-Token", metaToken);
      }
    } catch (e) {
      console.warn("ajaxPrefilter CSRF attach failed:", e);
    }
  });
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
  // Attach once per element
  const ENFORCED = "data-int-enforced";

  const isLocked = (input: HTMLInputElement) => {
    if (!input) return true;
    if (input.type?.toLowerCase() === "hidden") return true;
    if (input.disabled || input.readOnly) return true;
    if (input.closest("fieldset[disabled]")) return true;
    if (input.getAttribute("aria-disabled") === "true") return true;
    return false;
  };

  const applyIntegerOnly = (input: HTMLInputElement) => {
    if (input.hasAttribute(ENFORCED)) return; // already done
    input.setAttribute(ENFORCED, "1");

    // Make sure we're not accidentally changing a locked field's type
    if (input.type.toLowerCase() !== "number")
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

    // Block decimal/exponent characters
    input.addEventListener("keydown", (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "." || k === "," || k === "e") e.preventDefault();
    });

    // Scrub on input/blur/change
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
  };

  // Prefer an actually editable input (i.e., not type="hidden")
  const findEditableQuantityInput = (): HTMLInputElement | null => {
    return (
      document.querySelector<HTMLInputElement>(
        '#quantityCol input[name="quantity"]:not([type="hidden"]):not([readonly]):not([disabled])'
      ) ||
      document.querySelector<HTMLInputElement>(
        'input#quantity[name="quantity"]:not([type="hidden"]):not([readonly]):not([disabled])'
      ) ||
      null
    );
  };

  const init = () => {
    // If backend locks it, do nothing (respect server setting)
    const editable = findEditableQuantityInput();
    if (!editable) return;

    // Safety check: bail if some parent lock exists
    if (isLocked(editable)) return;

    applyIntegerOnly(editable);
  };

  // Run once now
  init();

  // Re-run on DOM changes; still respects backend lock each time
  const host =
    document.getElementById("quantityCol") ||
    document.getElementById("editForm") ||
    document.body;

  try {
    const mo = new MutationObserver(() => init());
    mo.observe(host, { childList: true, subtree: true, attributes: true });
  } catch {
    // no-op
  }
}

/* ─────────────────────────────────────────────────────────────
   CART CLICK GUARD:
   Stop buggy inline handler (the one that reassigns `const`)
   and run a safe +/− quantity adjuster instead.
────────────────────────────────────────────────────────────── */
function installCartClickGuard(): void {
  // Helper to find nearest quantity input in a cart row
  const findQtyInput = (from: Element): HTMLInputElement | null => {
    const row =
      from.closest(".cart-row, tr, li, .itemRow, .cartItem, .productRow") ||
      document;
    return (
      row.querySelector<HTMLInputElement>(
        'input[type="number"].qty, input.qty, input[name*="qty"], input[name*="quantity"]'
      ) || null
    );
  };

  // A robust safe adjuster for +/- buttons (works off button text or data attrs)
  const safeAdjust = (btn: Element) => {
    const input = findQtyInput(btn);
    if (!input) return;

    const raw = parseInt(input.value || "1", 10);
    const current = isFinite(raw) && raw > 0 ? raw : 1;

    // Decide inc/dec: prefer data-action, else look at symbol/text
    let action = (btn.getAttribute("data-action") || "").toLowerCase();
    if (!action) {
      const text = (btn.textContent || "").trim();
      if (text === "+" || /increase|plus/i.test(text)) action = "inc";
      else if (text === "−" || text === "-" || /decrease|minus/i.test(text))
        action = "dec";
    }

    let next = current;
    if (action === "inc") next = current + 1;
    else if (action === "dec") next = Math.max(1, current - 1);

    if (String(next) !== input.value) {
      input.value = String(next);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  // Capture-phase click listener to guard cart buttons
  document.addEventListener(
    "click",
    (ev) => {
      const target = ev.target as Element | null;
      if (!target) return;

      const btn = target.closest(
        'button, .qty-btn, .qtyPlus, .qtyMinus, [data-action="inc"], [data-action="dec"]'
      ) as Element | null;
      if (!btn) return;

      // Only intervene on cart contexts
      const inCart = !!(
        btn.closest("#cart") ||
        btn.closest(".cart") ||
        btn.closest(".cart-container")
      );
      if (!inCart) return;

      // Heuristic: if it LOOKS like a qty control, we handle it and stop others
      const text = (btn.textContent || "").trim();
      const looksLikeQty =
        (btn as Element).matches(
          '.qty-btn, .qtyPlus, .qtyMinus, [data-action="inc"], [data-action="dec"]'
        ) || /^\s*[+\-]\s*$/.test(text);

      if (looksLikeQty) {
        ev.stopImmediatePropagation(); // prevent the buggy handler from running
        ev.preventDefault();
        try {
          safeAdjust(btn);
        } catch (e) {
          console.warn("Safe qty adjust failed:", e);
        }
      }
    },
    true // capture
  );
}

/* ─────────────────────────────────────────────────────────────
   Suppress the specific noisy inline "Assignment to constant variable" error
   so it doesn’t break other scripts during DOM-ready.
────────────────────────────────────────────────────────────── */
function suppressKnownInlineConstError(): void {
  window.addEventListener(
    "error",
    (ev: ErrorEvent) => {
      if (
        typeof ev.message === "string" &&
        /Assignment to constant variable/i.test(ev.message)
      ) {
        ev.preventDefault?.();
        return true;
      }
      return false;
    },
    true // capture
  );
}

/* ─────────────────────────────────────────────────────────────
   Hide "Add to Cart" ONLY when "Return to Cart" is visible
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
   Front-end CC fee calculation & grand total update (no UI)
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
────────────────────────────────────────────────────────────── */
function updateLoginAssistanceMessage(): void {
  const path = (window.location.pathname || "").toLowerCase();
  if (!path.includes("/checkout/4-checkout.php")) return;

  const container = document.querySelector("#login-container");
  if (!container) return;

  const links =
    container.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]');
  let updated = false;

  links.forEach((link) => {
    const nearestDiv = link.closest("div");
    const text = (nearestDiv?.textContent || "").toLowerCase();

    if (text.includes("if you have trouble logging in")) {
      link.href = "mailto:dokshopbr@poweredbyprisma.com";
      link.textContent = "dokshopbr@poweredbyprisma.com";
      updated = true;
    }
  });

  if (!updated && links.length === 1) {
    const link = links[0];
    link.href = "mailto:dokshopbr@poweredbyprisma.com";
    link.textContent = "dokshopbr@poweredbyprisma.com";
  }
}

/* ─────────────────────────────────────────────────────────────
   Shared storefront bootstrap
────────────────────────────────────────────────────────────── */
export function runSharedScript(options: OptionsParameter) {
  console.log("Hello from the shared script!");

  // Attach CSRF and suppress the noisy inline const error as early as we can
  try {
    attachGlobalAjaxCSRF();
    suppressKnownInlineConstError();
  } catch (e) {
    console.warn("bootstrap guards error:", e);
  }

  $(".tableSiteBanner, #navWrapper").wrapAll(`<div id="logoLinks"></div>`);

  options.hideHomeLink && $(".linkH").remove();
  options.hideAddressBook &&
    $("button#saveAddressBook, table#addressBook").remove();
  options.hideCompanyShipTo && $("div#shipToCompany").remove();
  options.lockAddressBook &&
    $('button[title="Import address book"], button#saveAddressBook').remove();

  ChangeInventoryCountNoticeNEW(
    "Inventory not available for the desired order quantity. Please contact your account manager at 225-751-7297, or by email at salesBR@poweredbyprisma.com",
    "salesBR@poweredbyprisma.com"
  );

  ChangeCustomerServiceMessage(
    "For customer service, please email your Sales Representative listed above."
  );

  changeSupportText(
    "If you are having issues accessing your account, please contact our support team:",
    "Phone: 225-751-7297",
    '<a href="mailto:dokshopbr@poweredbyprisma.com">Email: dokshopbr@poweredbyprisma.com</a>'
  );

  // Login help text tweaks (scoped)
  try {
    updateLoginAssistanceMessage();
    setTimeout(updateLoginAssistanceMessage, 100);
    setTimeout(updateLoginAssistanceMessage, 400);
  } catch (e) {
    console.warn("updateLoginAssistanceMessage error:", e);
  }

  AddImagePickerSelectionToMemo();

  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    options.enableDropdown && loadDropdownMenu();
  }

  // Cart page behaviors
  try {
    const path = (window.location.pathname || "").toLowerCase();
    const params = new URLSearchParams(window.location.search);

    if (path.includes("/cart/3-edit.php")) {
      enforceIntegerQuantityOnCartEdit();
      toggleAddToCartWhenReturnPresent();
    }

    if (
      path.includes("/cart/index.php") ||
      params.get("task") === "updateItem"
    ) {
      // Guard against buggy inline handler (const reassignment) and keep UX intact
      installCartClickGuard();
      enforceIntegerQuantitiesOnCart();
    }
  } catch (e) {
    console.warn("Quantity/Add-to-Cart hooks error:", e);
  }

  // Note: we intentionally do NOT touch the payment iframe anymore.
  // Payment step: enforce accessible name on hosted iframe (Axe/Lighthouse fix)
  try {
    const p = (window.location.pathname || "").toLowerCase();
    if (
      p.includes("/checkout/4-payment.php") ||
      p.includes("/checkout/6-payment.php") ||
      p.includes("/checkout/6-payment_new.php") ||
      p.includes("/checkout/payment.php")
    ) {
      try {
        fixPaymentIframeA11y();
        setTimeout(fixPaymentIframeA11y, 150);
        setTimeout(fixPaymentIframeA11y, 600);
      } catch (err) {
        console.warn("fixPaymentIframeA11y error:", err);
      }

      // Wait for Authorize.Net token, then POST form into iframe
      (() => {
        const SCOPE = document.getElementById("paywithnewcard") || document;
        const iframe = document.getElementById(
          "load_payment"
        ) as HTMLIFrameElement | null;
        const form =
          SCOPE.querySelector<HTMLFormElement>('form[target="load_payment"]') ||
          document.querySelector<HTMLFormElement>(
            'form[target="load_payment"]'
          );
        if (!iframe || !form) return;
        if (iframe.getAttribute("name") !== "load_payment")
          iframe.setAttribute("name", "load_payment");

        const tokenInputs = ["token", "sessionToken", "ssl_txn_auth_token"];

        const getTokenLen = () => {
          for (const k of tokenInputs) {
            const el = form.querySelector<HTMLInputElement>(
              `input[name="${k}"]`
            );
            if (el?.value?.trim()) return el.value.trim().length;
          }
          return 0;
        };

        const submit = form.submit.bind(form);
        let submitted = false;
        const start = Date.now();
        const MAX_MS = 6000;

        (function tick() {
          if (submitted) return;
          const len = getTokenLen();
          if (len > 0) {
            submitted = true;
            submit();
            return;
          }
          if (Date.now() - start > MAX_MS) return; // give up silently in prod
          setTimeout(tick, 150);
        })();
      })();

      // Optional: recompute fee display here if desired
      // setTimeout(() => updateCcFeeAndGrandTotal({ rate: 0.03, includeTaxInFee: true }), 350);
    }
  } catch (e) {
    console.warn("Payment step note error:", e);
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
