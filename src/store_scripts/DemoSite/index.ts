import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
// import { applyPromoCode } from "../../shared/ApplyPromoCode";
// import { persistDiscountedTotals } from "../../shared/persistDiscountedTotals";
import { monitorResidentialToastAndBlockPage } from "../../shared/BlockOnResidentialToast";
import { initChatWidget } from "../../chat/chatWidget";

document.addEventListener("DOMContentLoaded", () => {
  try {
    initChatWidget({
      title: "Prisma Assistant",
      apiBase: "https://ai-chat-bot-1xm4.onrender.com/api/ai",
      debug: true,
    });
    console.log("[VividChat] direct mount called");
  } catch (e) {
    console.warn("[VividChat] init error:", e);
  }
});

export function main() {
  //
  // ───────────── Finished Size helpers (Printed only) — throttled & guarded ─────────────
  //
  const TAG_ID = "vi-finished-size";
  let _renderTimer: number | null = null;
  let _idleTimer: number | null = null;
  let _observer: MutationObserver | null = null;
  let _lastText = ""; // prevent no-op DOM writes
  let _renders = 0; // upper bound for safety

  const isPrinted = (root: Document | HTMLElement = document): boolean => {
    try {
      const hidden =
        (
          root.querySelector("#productType") as HTMLInputElement | null
        )?.value?.trim() ||
        (
          root.querySelector(
            'input[name="productType"]'
          ) as HTMLInputElement | null
        )?.value?.trim() ||
        "";
      if (hidden) return /^printed$/i.test(hidden);

      const txt =
        (
          root.querySelector(
            "#breadcrumb .templateName a"
          ) as HTMLAnchorElement | null
        )?.getAttribute("title") ||
        (
          root.querySelector(
            "#breadcrumb .templateName a"
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

  const findRawSize = (): { w: string; h: string } | null => {
    try {
      const candidates: string[] = [
        (document.querySelector("#productCode") as HTMLInputElement | null)
          ?.value || "",
        (
          document.querySelector(
            'input[name="productID"]'
          ) as HTMLInputElement | null
        )?.value || "",
        (
          document.querySelector(
            'a.productImage[id^="productImage-"]'
          ) as HTMLAnchorElement | null
        )?.getAttribute("rel") || "",
        (
          document.querySelector(
            "#breadcrumb .templateName a"
          ) as HTMLAnchorElement | null
        )?.getAttribute("title") ||
          (
            document.querySelector(
              "#breadcrumb .templateName a"
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

  const formatSize = (s: { w: string; h: string }) => `${s.w} × ${s.h} in`;

  const renderFinishedSizeUnderQty = (
    root: Document | HTMLElement = document
  ): boolean => {
    try {
      const qtyRow = root.querySelector("#quantityRow");
      if (!qtyRow) return false;

      // Remove any prior finished-size row
      const oldRow = root.querySelector("#finishedSizeRow");
      if (oldRow) oldRow.remove();

      if (!isPrinted(root)) return false;

      const size = findRawSize();
      if (!size) return false;

      const label = `${size.w} × ${size.h} in`;

      // Create the new row (matches PRODUCT row style)
      const tr = document.createElement("tr");
      tr.id = "finishedSizeRow";

      const tdLabel = document.createElement("td");
      tdLabel.setAttribute("align", "right");
      tdLabel.innerHTML = "<strong>FINISHED SIZE</strong>";

      const tdValue = document.createElement("td");
      tdValue.textContent = label;

      // Optional style for consistency
      tdValue.style.fontWeight = "normal";
      tdValue.style.fontSize = "1em";

      tr.append(tdLabel, tdValue);

      // Insert right after Quantity row
      qtyRow.parentElement?.insertBefore(tr, qtyRow.nextElementSibling);

      // Optional: populate hidden size input if blank
      const sizeInput = document.querySelector(
        'input[name="size"]'
      ) as HTMLInputElement | null;
      if (sizeInput && !sizeInput.value) sizeInput.value = label;

      return true;
    } catch (err) {
      console.warn("[vi] renderFinishedSizeUnderQty failed:", err);
      return false;
    }
  };

  const scheduleRender = (root: Document | HTMLElement) => {
    if (_renderTimer !== null) window.clearTimeout(_renderTimer);
    // throttle to at most once per 200ms
    _renderTimer = window.setTimeout(() => {
      _renderTimer = null;
      if (_renders > 50) {
        // hard safety cap per page load
        if (_observer) {
          _observer.disconnect();
          _observer = null;
        }
        return;
      }
      const ok = renderFinishedSizeUnderQty(root);
      _renders++;

      // after a successful render, if no mutations for 2s, disconnect observer
      if (ok) {
        if (_idleTimer !== null) window.clearTimeout(_idleTimer);
        _idleTimer = window.setTimeout(() => {
          if (_observer) {
            _observer.disconnect();
            _observer = null;
          }
        }, 2000);
      }
    }, 200);
  };

  const watchFinishedSize = (): void => {
    try {
      const root =
        (document.getElementById("editForm") as HTMLElement | null) ||
        document.body;
      if (!root) return;

      // initial render
      scheduleRender(root);

      // observe childList only; throttle callback
      _observer = new MutationObserver((muts) => {
        // if any added nodes exist, schedule render
        for (const m of muts) {
          if (m.addedNodes && m.addedNodes.length) {
            scheduleRender(root);
            return;
          }
        }
      });
      _observer.observe(root, { childList: true, subtree: true });
    } catch (err) {
      console.warn("[vi] watchFinishedSize init failed:", err);
    }
  };

  //
  // ───────────────────────────── Existing Site Logic ─────────────────────────────
  //
  function init() {
    const isAddToCartPage = () => {
      try {
        const page = GLOBALVARS?.currentPage?.trim().toLowerCase?.() || "";
        return (
          page.includes("add to cart") ||
          window.location.pathname.includes("/cart/3-edit.php")
        );
      } catch {
        return window.location.pathname.includes("/cart/3-edit.php");
      }
    };

    if (isAddToCartPage()) {
      // Swap proof image from .cache to generated preview (for 10s max)
      try {
        const img = document.getElementById(
          "productImage"
        ) as HTMLImageElement | null;
        const artID = (window as any)?.p?.artID;
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
          const interval = window.setInterval(apply, 300);
          window.setTimeout(() => window.clearInterval(interval), 10000);
        }
      } catch (e) {
        console.warn("[vi] image swap error:", e);
      }

      // Finished Size (Printed only)
      try {
        watchFinishedSize();
      } catch (e) {
        console.warn("[vi] finished size init error:", e);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
    $("#continueTbl .smallbody")
      .eq(1)
      .html(
        `<span class="red">*</span> Delivery time listed includes 1 to 2 days to process order plus shipping.
      Please note we do not process orders on weekends or holidays.`
      );
    monitorResidentialToastAndBlockPage();
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    // persistDiscountedTotals();
  }

  if (
    GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
    window.location.pathname.includes("/checkout/4-payment.php")
  ) {
    // applyPromoCode();
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
          rawText?.startsWith(key)
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
