import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";

export function main() {
  //
  // ───────────────────────────── Helpers: Finished Size (hardened) ─────────────────────────────
  //
  const TAG_ID = "vi-finished-size";

  const isPrinted = (root: Document | HTMLElement = document): boolean => {
    try {
      const fromHidden =
        (
          root.querySelector("#productType") as HTMLInputElement | null
        )?.value?.trim() ||
        (
          root.querySelector(
            'input[name="productType"]'
          ) as HTMLInputElement | null
        )?.value?.trim() ||
        "";
      if (fromHidden) return /^printed$/i.test(fromHidden);

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
        // some carts use an <a.productImage rel="WxH_w_b"> on cart pages
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
  ): void => {
    try {
      const qtyCol = root.querySelector("#quantityCol");
      if (!qtyCol) return;

      // Only for printed; clean up if not printed
      if (!isPrinted(root)) {
        const old = qtyCol.querySelector("#" + TAG_ID);
        if (old) old.remove();
        return;
      }

      const size = findRawSize();
      if (!size) return;

      const label = formatSize(size);
      let tag = qtyCol.querySelector("#" + TAG_ID) as HTMLDivElement | null;

      if (!tag) {
        tag = document.createElement("div");
        tag.id = TAG_ID;
        tag.style.marginTop = "6px";
        tag.style.fontSize = "0.95em";
        tag.style.opacity = "0.9";

        // Optional pill styling if CSS vars exist
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
        if (qtyDesc?.parentElement) {
          qtyDesc.before(tag);
        } else if (qtyInput) {
          qtyInput.insertAdjacentElement("afterend", tag);
        } else {
          (qtyCol as HTMLElement).appendChild(tag);
        }
      }

      tag.textContent = `Finished Size: ${label}`;

      // Optional: populate hidden size input if blank (helps downstream imports)
      try {
        const sizeInput = document.querySelector(
          'input[name="size"]'
        ) as HTMLInputElement | null;
        if (sizeInput && !sizeInput.value)
          sizeInput.value = `${size.w} x ${size.h}`;
      } catch {
        /* ignore */
      }
    } catch (err) {
      console.warn("[vi] renderFinishedSizeUnderQty failed:", err);
    }
  };

  const watchFinishedSize = (): void => {
    try {
      renderFinishedSizeUnderQty(document);

      const root =
        (document.getElementById("editForm") as HTMLElement | null) ||
        document.body;
      if (!root) return;

      const obs = new MutationObserver((muts) => {
        try {
          let needed = false;
          for (const m of muts) {
            if (m.addedNodes && m.addedNodes.length) {
              needed = true;
              break;
            }
          }
          if (needed) renderFinishedSizeUnderQty(root);
        } catch (err) {
          console.warn("[vi] watchFinishedSize mutation loop error:", err);
        }
      });
      obs.observe(root, { childList: true, subtree: true, attributes: false });
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
      // Refresh product image to the full PDF preview thumbnail
      const img = document.getElementById(
        "productImage"
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
        const interval = window.setInterval(apply, 300);
        window.setTimeout(() => window.clearInterval(interval), 10000);
      }

      // Show finished size under Quantity (Printed items only)
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

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    // site-specific hooks if needed
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    // site-specific hooks if needed
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
    // site-specific hooks if needed
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
