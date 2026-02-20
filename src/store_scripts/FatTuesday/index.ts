import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";

export function main() {
  //
  // ───────────── Shared helpers (Printed only) ─────────────
  //
  const isPrinted = (root: Document | HTMLElement = document): boolean => {
    try {
      const hidden =
        (
          root.querySelector("#productType") as HTMLInputElement | null
        )?.value?.trim() ||
        (
          root.querySelector(
            'input[name="productType"]',
          ) as HTMLInputElement | null
        )?.value?.trim() ||
        "";
      if (hidden) return /^printed$/i.test(hidden);

      const txt =
        (
          root.querySelector(
            "#breadcrumb .templateName a",
          ) as HTMLAnchorElement | null
        )?.getAttribute("title") ||
        (
          root.querySelector(
            "#breadcrumb .templateName a",
          ) as HTMLAnchorElement | null
        )?.textContent ||
        (root.querySelector("#productCode") as HTMLInputElement | null)
          ?.value ||
        "";
      return /^\s*printed\b/i.test(txt || "");
    } catch {
      return false;
    }
  };

  // Pull WxH from a few common places (productCode/productID/link rel/title)
  const extractSize = (
    scope: ParentNode | Document = document,
  ): { w: string; h: string } | null => {
    try {
      const candidates: string[] = [
        (scope.querySelector?.("#productCode") as HTMLInputElement | null)
          ?.value || "",
        (
          scope.querySelector?.(
            'input[name="productID"]',
          ) as HTMLInputElement | null
        )?.value || "",
        (
          scope.querySelector?.(
            'a.productImage[id^="productImage-"]',
          ) as HTMLAnchorElement | null
        )?.getAttribute("rel") || "",
        (
          scope.querySelector?.(
            "#breadcrumb .templateName a",
          ) as HTMLAnchorElement | null
        )?.getAttribute("title") ||
          (
            scope.querySelector?.(
              "#breadcrumb .templateName a",
            ) as HTMLAnchorElement | null
          )?.textContent ||
          "",
      ];
      for (const raw of candidates) {
        if (!raw) continue;
        const m = raw.match(/(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)/);
        if (m) return { w: m[1], h: m[2] };
      }
      return null;
    } catch {
      return null;
    }
  };

  //
  // ───────────── Add-to-Cart: show FINISHED SIZE row under Quantity ─────────────
  //
  let _renderTimer: number | null = null;
  let _idleTimer: number | null = null;
  let _observer: MutationObserver | null = null;
  let _renders = 0;

  const renderFinishedSizeUnderQty = (
    root: Document | HTMLElement = document,
  ): boolean => {
    try {
      const qtyRow = root.querySelector("#quantityRow");
      if (!qtyRow) return false;

      // clear any prior row
      const old = root.querySelector("#finishedSizeRow");
      if (old) old.remove();

      if (!isPrinted(root)) return false;

      const size = extractSize(root);
      if (!size) return false;

      // Use plain inches on add-to-cart (matches your previous sites)
      const label = `${size.w}"w × ${size.h}"h`;

      const tr = document.createElement("tr");
      tr.id = "finishedSizeRow";

      const tdLabel = document.createElement("td");
      tdLabel.setAttribute("align", "right");
      tdLabel.innerHTML = "<strong>FINISHED SIZE</strong>";

      const tdValue = document.createElement("td");
      tdValue.textContent = label;
      tdValue.style.fontWeight = "normal";
      tdValue.style.fontSize = "1em";

      tr.append(tdLabel, tdValue);
      qtyRow.parentElement?.insertBefore(tr, qtyRow.nextElementSibling);

      // fill hidden size if blank (helps downstream)
      const sizeInput = document.querySelector(
        'input[name="size"]',
      ) as HTMLInputElement | null;
      if (sizeInput && !sizeInput.value)
        sizeInput.value = `${size.w} x ${size.h}`;

      return true;
    } catch (e) {
      console.warn("[msf] renderFinishedSizeUnderQty error:", e);
      return false;
    }
  };

  const scheduleRender = (root: Document | HTMLElement) => {
    if (_renderTimer) window.clearTimeout(_renderTimer);
    _renderTimer = window.setTimeout(() => {
      _renderTimer = null;
      if (_renders > 50) {
        if (_observer) {
          _observer.disconnect();
          _observer = null;
        }
        return;
      }
      const ok = renderFinishedSizeUnderQty(root);
      _renders++;
      if (ok) {
        if (_idleTimer) window.clearTimeout(_idleTimer);
        _idleTimer = window.setTimeout(() => {
          if (_observer) {
            _observer.disconnect();
            _observer = null;
          }
        }, 2000);
      }
    }, 200);
  };

  const watchFinishedSize = () => {
    try {
      const root =
        (document.getElementById("editForm") as HTMLElement | null) ||
        document.body;
      if (!root) return;
      scheduleRender(root);
      _observer = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.addedNodes && m.addedNodes.length) {
            scheduleRender(root);
            return;
          }
        }
      });
      _observer.observe(root, { childList: true, subtree: true });
    } catch (e) {
      console.warn("[msf] watchFinishedSize error:", e);
    }
  };

  //
  // ───────────── Cart page: FINISHED SIZE under MEMO ("48\"w × 96\"h") ─────────────
  //
  const cartLooksPrinted = (scope: ParentNode): boolean => {
    try {
      const hasInksOrPaper = !!scope.querySelector(
        ".jobDetailsTable .INKSRow, .jobDetailsTable .PAPERRow",
      );
      const rel =
        (
          scope.querySelector(
            'a.productImage[id^="productImage-"]',
          ) as HTMLAnchorElement | null
        )?.getAttribute("rel") || "";
      const printedByRel = /_w_/i.test(rel) || /_w_b/i.test(rel);
      const titleTxt = (
        scope.querySelector(".jobDescCell .jobDesc")?.textContent || ""
      ).trim();
      const printedByTitle = /^printed\b/i.test(titleTxt);
      return hasInksOrPaper || printedByRel || printedByTitle;
    } catch {
      return false;
    }
  };

  const cartRenderOne = (itemBox: HTMLElement) => {
    try {
      const memoTable = itemBox.querySelector(".memoTable tbody");
      if (!memoTable) return;

      const memoInput = memoTable.querySelector(
        'input[name^="memo"]',
      ) as HTMLInputElement | null;
      const itemId = memoInput?.name?.replace("memo", "") || "";
      const rowId = `finishedSizeRow-${itemId || "unknown"}`;

      const old = itemBox.querySelector(`#${rowId}`);
      if (old) old.remove();

      if (!cartLooksPrinted(itemBox)) return;

      const sz = extractSize(itemBox);
      if (!sz) return;

      // Cart-specific format: 48"w × 96"h
      const label = `${sz.w}"w × ${sz.h}"h`;

      const tr = document.createElement("tr");
      tr.id = rowId;

      const tdLabel = document.createElement("td");
      tdLabel.setAttribute("align", "right");
      tdLabel.setAttribute("nowrap", "nowrap");
      tdLabel.innerHTML = "<strong>FINISHED SIZE:</strong>";

      const tdValue = document.createElement("td");
      tdValue.setAttribute("align", "left");
      tdValue.textContent = label;

      memoTable.appendChild(tr);
      tr.append(tdLabel, tdValue);
    } catch (e) {
      console.warn("[msf] cartRenderOne error:", e);
    }
  };

  const installCartFinishedSize = () => {
    const root = document.getElementById("shoppingCartTbl") || document.body;
    if (!root) return;

    const renderAll = () => {
      root.querySelectorAll<HTMLTableElement>(".dtContent").forEach((dt) => {
        cartRenderOne(dt as unknown as HTMLElement);
      });
    };

    renderAll();

    // light observer (auto-disconnect after idle)
    let t: number | null = null;
    const schedule = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        t = null;
        renderAll();
      }, 200);
    };

    try {
      const obs = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.addedNodes && m.addedNodes.length) {
            schedule();
            return;
          }
        }
      });
      obs.observe(root, { childList: true, subtree: true });

      let idle: number | null = window.setTimeout(() => {
        obs.disconnect();
      }, 3000);
      root.addEventListener("DOMNodeInserted", () => {
        if (idle) window.clearTimeout(idle);
        idle = window.setTimeout(() => {
          obs.disconnect();
        }, 3000);
      });
    } catch {
      /* noop */
    }
  };

  // ───────────── Checkout: auto-apply FT{N} based on count of $75 items ─────────────
  const installAutoCouponFT = () => {
    const MIN_75_ITEMS = 2; // start applying at 2
    const MAX_75_ITEMS = 10; // safety cap (adjust as you want)

    const root = document.getElementById("lineItems") || document.body;
    if (!root) return;

    const count75Items = (): number => {
      const rows = Array.from(
        root.querySelectorAll<HTMLTableRowElement>("table tr"),
      );

      let count = 0;
      for (const tr of rows) {
        const tds = tr.querySelectorAll<HTMLTableCellElement>("td");
        if (tds.length < 2) continue;

        const left = (tds[0].textContent || "").trim();
        const right = (tds[1].textContent || "").trim();

        // Only count actual item rows like: "1.00 - Fat Tuesday 190 Cherry"
        // (avoid subtotal/tax/shipping/coupon rows)
        const looksLikeLineItem = /^\d+(\.\d+)?\s*-/.test(left);
        const isExactly75 = /\$75\.00\b/.test(right);

        if (looksLikeLineItem && isExactly75) count++;
      }
      return count;
    };

    const getAppliedCoupon = (): string | null => {
      // Your applied state shows: <span title="...">Coupon Code: FT2</span>
      const couponSpan = root.querySelector<HTMLSpanElement>(
        'span[title^="Applied"][title*="off"]',
      );
      const txt = (couponSpan?.textContent || "").trim();
      const m = txt.match(/Coupon Code:\s*([A-Z0-9_-]+)/i);
      return m?.[1]?.toUpperCase() || null;
    };

    const removeCouponIfPresent = () => {
      const remove = document.getElementById(
        "remove-coupon",
      ) as HTMLElement | null;
      if (!remove) return;
      remove.click(); // Presswise UI usually wires this up
    };

    const applyCoupon = (code: string) => {
      const input = document.getElementById(
        "coupon-code",
      ) as HTMLInputElement | null;
      const btn = document.getElementById(
        "apply-coupon",
      ) as HTMLButtonElement | null;
      if (!input || !btn) return;

      input.value = code;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      btn.click();
    };

    const render = () => {
      const n = count75Items();

      // Not eligible => clear auto state and optionally remove applied FT* coupon
      if (n < MIN_75_ITEMS || n > MAX_75_ITEMS) {
        sessionStorage.removeItem("FT_AUTO_LAST");
        return;
      }

      const desired = `FT${n}`.toUpperCase();
      const applied = getAppliedCoupon();

      // If already correct, do nothing
      if (applied === desired) {
        sessionStorage.setItem("FT_AUTO_LAST", desired);
        return;
      }

      // Prevent spam-click loops if the DOM is mid-refresh
      const lastTried = sessionStorage.getItem("FT_AUTO_LAST");
      if (lastTried === desired) return;

      // If a different coupon is applied, remove it first, then apply desired
      if (applied && applied !== desired) {
        removeCouponIfPresent();
        // allow the UI to refresh, then apply the new one
        window.setTimeout(() => applyCoupon(desired), 350);
      } else {
        applyCoupon(desired);
      }

      sessionStorage.setItem("FT_AUTO_LAST", desired);
    };

    render();

    // Re-run if checkout summary updates dynamically
    try {
      let t: number | null = null;
      const schedule = () => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(() => {
          t = null;
          render();
        }, 200);
      };

      const obs = new MutationObserver(() => schedule());
      obs.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      // Disconnect after a bit to keep it light
      window.setTimeout(() => obs.disconnect(), 10000);
    } catch {
      /* noop */
    }
  };

  //
  // ───────────── Existing site logic + entry ─────────────
  //
  function init() {
    const isAddToCartPage = () => {
      const page = GLOBALVARS?.currentPage?.trim().toLowerCase() || "";
      return (
        page.includes("add to cart") ||
        window.location.pathname.includes("/cart/3-edit.php")
      );
    };

    const isCartPage = () =>
      (GLOBALVARS?.currentPage || "").toLowerCase().includes("cart page") ||
      window.location.pathname.includes("/cart/");

    // Cart page hook (runs independently of add-to-cart)
    if (isCartPage()) {
      installCartFinishedSize();
    }

    // Add-to-cart page image swap + finished size under quantity
    if (isAddToCartPage()) {
      const img = document.getElementById(
        "productImage",
      ) as HTMLImageElement | null;
      const artID = (window as any).p?.artID;

      if (img && artID) {
        const origin = window.location.origin;
        const desiredURL = `${origin}/catalog/gen/pdf_art_image.php?artID=${artID}&nocache=${Date.now()}`;

        const apply = () => {
          try {
            if (img.src.startsWith(`${origin}/.cache`)) {
              img.src = desiredURL;
              img.width = 400;
              img.style.height = "auto";
            }
          } catch {
            /* ignore */
          }
        };

        apply();
        const interval = setInterval(apply, 300);
        setTimeout(() => clearInterval(interval), 10000);
      }

      watchFinishedSize();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // (Unused in this file, but keeping the stubs to match your template)
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    installAutoCouponFT();
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
    installAutoCouponFT();
  }
}

main();

function convertMenuTextToIcons(): void {
  const iconMap: Record<string, string> = {
    HOME: "fa-home",
    CATALOG: "fa-book-open",
    "MY ACCOUNT": "fa-user",
    "SHOPPING CART": "fa-shopping-cart",
  };

  const tryConvert = () => {
    const menuItems = document.querySelectorAll<HTMLLIElement>("#menu li");

    if (menuItems.length === 0) {
      setTimeout(tryConvert, 200);
      return;
    }

    menuItems.forEach((item) => {
      const link = item.querySelector("a");
      if (link) {
        const rawText = link.textContent?.trim().toUpperCase();

        const matchedKey = Object.keys(iconMap).find((key) =>
          rawText?.startsWith(key),
        );
        const iconClass = matchedKey ? iconMap[matchedKey] : "";

        if (iconClass) {
          const countMatch = rawText?.match(/\((\d+)\)/)?.[1];

          link.innerHTML = `
    <span class="icon-wrap">
      <i class="fa ${iconClass}"></i>
      ${countMatch ? `<span class="badge">${countMatch}</span>` : ""}
    </span>
  `;
          link.setAttribute("title", rawText || "");
        }
      }
    });
  };

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", tryConvert)
    : tryConvert();
}

convertMenuTextToIcons();
