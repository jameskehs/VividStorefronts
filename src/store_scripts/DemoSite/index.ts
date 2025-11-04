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
      const qtyCol = root.querySelector("#quantityCol");
      if (!qtyCol) return false;

      if (!isPrinted(root)) {
        const old = qtyCol.querySelector("#" + TAG_ID);
        if (old) old.remove();
        _lastText = "";
        return false;
      }

      const size = findRawSize();
      if (!size) return false;

      const label = `Finished Size: ${formatSize(size)}`;
      if (label === _lastText) return false; // nothing to do

      let tag = qtyCol.querySelector("#" + TAG_ID) as HTMLDivElement | null;
      if (!tag) {
        tag = document.createElement("div");
        tag.id = TAG_ID;
        tag.style.marginTop = "6px";
        tag.style.fontSize = "0.95em";
        tag.style.opacity = "0.9";

        try {
          const rootStyle = getComputedStyle(document.documentElement);
          const bg = (
            rootStyle.getPropertyValue("--tag-dimensions-bg") || ""
          ).trim();
          const fg = (
            rootStyle.getPropertyValue("--tag-dimensions-text") || ""
          ).trim();
          if (bg || fg) {
            tag.style.display = "inline-block";
            tag.style.padding = "2px 8px";
            tag.style.borderRadius = "6px";
            if (bg) tag.style.background = bg;
            if (fg) tag.style.color = fg;
          }
        } catch {
          /* ignore */
        }

        const qtyInput = qtyCol.querySelector(
          "#quantity"
        ) as HTMLElement | null;
        const qtyDesc = qtyCol.querySelector(
          "#quantityDescription"
        ) as HTMLElement | null;
        if (qtyDesc?.parentElement) qtyDesc.before(tag);
        else if (qtyInput) qtyInput.insertAdjacentElement("afterend", tag);
        else (qtyCol as HTMLElement).appendChild(tag);
      }

      tag.textContent = label;
      _lastText = label;

      try {
        const sizeInput = document.querySelector(
          'input[name="size"]'
        ) as HTMLInputElement | null;
        if (sizeInput && !sizeInput.value)
          sizeInput.value = `${size.w} x ${size.h}`;
      } catch {
        /* ignore */
      }

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
