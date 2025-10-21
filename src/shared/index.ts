import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS, OptionsParameter } from "../index";
import { AddImagePickerSelectionToMemo } from "./imagePickertoMemo";
import { ChangeCustomerServiceMessage } from "./customerServiceMessage";
import { changeSupportText } from "./changeSupportText";
import { ChangeInventoryCountNoticeNEW } from "./inventoryCountNoticeNEW";
import { fixPaymentIframeA11y } from "./fixPaymentIframeA11y";

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

      // --- Payment diagnostics & auto-submit for form->iframe flow ---
      (() => {
        const IFRAME_ID = "load_payment";
        const IFRAME_TARGET = "load_payment"; // must match <iframe name="load_payment">
        const PAY_SCOPE = document.getElementById("paywithnewcard") || document;

        const iframe = document.getElementById(
          IFRAME_ID
        ) as HTMLIFrameElement | null;
        if (!iframe) {
          console.warn("[payment] iframe #load_payment not found.");
          return;
        }

        // 1) Log current state
        const logIframe = (label: string) => {
          const src = iframe.getAttribute("src") || "";
          if (!src) {
            console.warn(`[payment] ${label}: iframe has no src yet.`);
            return;
          }
          try {
            const u = new URL(src, window.location.href);
            const keys = [
              "sessionToken",
              "token",
              "sessiontoken",
              "ssl_txn_auth_token",
            ];
            const k = keys.find((x) => u.searchParams.has(x));
            const len = k ? (u.searchParams.get(k) || "").length : 0;
            console.info(
              `[payment] ${label}: host=${u.host}, path=${
                u.pathname
              }, tokenKey=${k ?? "none"}, tokenLen=${len}`
            );
          } catch {
            console.warn(
              `[payment] ${label}: iframe src not a valid URL:`,
              src
            );
          }
        };

        logIframe("initial");

        // 2) Find the form intended to populate the iframe (POST target="load_payment")
        const form =
          PAY_SCOPE.querySelector<HTMLFormElement>(
            `form[target="${IFRAME_TARGET}"]`
          ) ||
          document.querySelector<HTMLFormElement>(
            `form[target="${IFRAME_TARGET}"]`
          );

        if (!form) {
          console.warn(
            '[payment] No form with target="load_payment" found. If this flow expects a POST into the iframe, that form is missing or renamed.'
          );
        } else {
          // Helpful logs (no secrets): action URL, method, presence of typical token fields
          const action = form.getAttribute("action") || "";
          const method = (form.getAttribute("method") || "GET").toUpperCase();
          const tokenInput = form.querySelector<HTMLInputElement>(
            'input[name="sessionToken"],input[name="token"],input[name="ssl_txn_auth_token"]'
          );
          console.info(
            `[payment] Found form: method=${method}, action=${
              action ? new URL(action, location.href).href : "(none)"
            }, tokenField=${tokenInput?.name ?? "none"}`
          );

          // 3) Auto-submit once if the iframe is still blank after a short grace period
          //    Many platforms expect this submit to render the hosted payment page inside the iframe.
          const SUBMIT_FLAG = "__vi_payment_autosubmitted__";
          const trySubmit = () => {
            if (iframe.getAttribute("src")) {
              logIframe("pre-submit check (already has src)");
              return;
            }
            if ((form as any)[SUBMIT_FLAG]) return; // guard
            (form as any)[SUBMIT_FLAG] = true;

            try {
              console.info(
                "[payment] Auto-submitting payment form → iframe (once)."
              );
              form.submit();
            } catch (e) {
              console.warn("[payment] Form submit failed:", e);
            }
          };

          // Grace period to let any platform JS populate hidden fields
          setTimeout(trySubmit, 150);
          setTimeout(() => !iframe.getAttribute("src") && trySubmit(), 600);
        }

        // 4) Observe the iframe for when a src finally appears (via submit or platform JS)
        const mo = new MutationObserver(() => logIframe("mutation"));
        mo.observe(iframe, { attributes: true, attributeFilter: ["src"] });

        // Also log when it finishes loading (src assigned and navigated)
        iframe.addEventListener("load", () => logIframe("load"));
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
