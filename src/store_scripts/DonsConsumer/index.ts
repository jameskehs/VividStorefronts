import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { applyPromoCode } from "../../shared/ApplyPromoCode";
import { persistDiscountedTotals } from "../../shared/persistDiscountedTotals";
import { monitorResidentialToastAndBlockPage } from "../../shared/BlockOnResidentialToast";

export function main() {
  function hideAvailableQtyOnce(): boolean {
    let changed = false;

    // Primary: hide by the known span id
    const qtySpan = document.getElementById("qtyAvailableDisplay");
    if (qtySpan) {
      const tr = qtySpan.closest("tr") as HTMLTableRowElement | null;
      if (tr && tr.style.display !== "none") {
        tr.style.display = "none";
        changed = true;
      }
    }

    // Fallback: find any row whose left cell label is "AVAILABLE"
    const rows = document.querySelectorAll<HTMLTableRowElement>(
      "table.tablesorter tr"
    );
    rows.forEach((row) => {
      const labelCellStrong = row.querySelector("td:first-child > strong");
      const label = labelCellStrong?.textContent?.trim().toUpperCase() ?? "";
      if (label === "AVAILABLE" && row.style.display !== "none") {
        row.style.display = "none";
        changed = true;
      }
    });

    // Also neutralize the hidden input’s value if you want:
    const hiddenInput =
      document.querySelector<HTMLInputElement>("#qtyAvailable");
    if (hiddenInput) hiddenInput.value = "";

    return changed;
  }

  function watchAndHideAvailableQty(durationMs = 10000) {
    // Run immediately
    hideAvailableQtyOnce();

    // Observe for dynamic updates
    const observer = new MutationObserver(() => {
      hideAvailableQtyOnce();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Stop after a short window to avoid overhead
    setTimeout(() => observer.disconnect(), durationMs);
  }

  function init() {
    const isAddToCartPage = () => {
      const page = GLOBALVARS?.currentPage?.trim().toLowerCase() || "";
      return (
        page.includes("add to cart") ||
        window.location.pathname.includes("/cart/3-edit.php")
      );
    };

    // Always try to hide AVAILABLE row on relevant pages
    const onCheckoutPage =
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING ||
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION ||
      window.location.pathname.includes("/checkout/");

    if (isAddToCartPage() || onCheckoutPage) {
      watchAndHideAvailableQty(12000);
    }

    // === Existing image swap logic for Add to Cart ===
    if (isAddToCartPage()) {
      const img = document.getElementById(
        "productImage"
      ) as HTMLImageElement | null;
      const artID = (window as any).p?.artID;

      if (img && artID) {
        const origin = window.location.origin;
        const uniqueNoCache = Date.now();
        const desiredURL = `${origin}/catalog/gen/pdf_art_image.php?artID=${artID}&nocache=${uniqueNoCache}`;

        const fixImg = () => {
          if (img.src.startsWith(`${origin}/.cache`)) {
            img.src = desiredURL;
            img.width = 400;
            img.style.height = "auto";
          }
        };

        fixImg();
        const interval = setInterval(fixImg, 300);
        setTimeout(() => clearInterval(interval), 10000);
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
    persistDiscountedTotals();
  }

  if (
    GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
    window.location.pathname.includes("/checkout/4-payment.php")
  ) {
    // (No-op; reserved for future payment-page logic)
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

        if (matchedKey === "CATALOG") {
          link.setAttribute("href", "/catalog/?g=3830&y=9150");
        }

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
