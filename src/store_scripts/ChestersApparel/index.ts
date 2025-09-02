import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { applyPromoCode } from "../../shared/ApplyPromoCode";
import { persistDiscountedTotals } from "../../shared/persistDiscountedTotals";
import { monitorResidentialToastAndBlockPage } from "../../shared/BlockOnResidentialToast";

export function main() {
  function init() {
    const isAddToCartPage = () => {
      const page = GLOBALVARS?.currentPage?.trim().toLowerCase() || "";
      return (
        page.includes("add to cart") ||
        window.location.pathname.includes("/cart/3-edit.php")
      );
    };

    if (isAddToCartPage()) {
      const img = document.getElementById(
        "productImage"
      ) as HTMLImageElement | null;
      const artID = (window as any).p?.artID;

      if (!img || !artID) return;

      const origin = window.location.origin;
      const uniqueNoCache = Date.now();
      const desiredURL = `${origin}/catalog/gen/pdf_art_image.php?artID=${artID}&nocache=${uniqueNoCache}`;

      // Only replace if it's the old thumbnail
      if (img.src.startsWith(`${origin}/.cache`)) {
        img.src = desiredURL;
        img.width = 400;
        img.style.height = "auto";
      }

      // Watch for AJAX overwrites for a short time
      const interval = setInterval(() => {
        if (img.src.startsWith(`${origin}/.cache`)) {
          img.src = desiredURL;
          img.width = 400;
          img.style.height = "auto";
        }
      }, 300);

      // Stop checking after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    }

    // ===== CART BANNER (single-insert + positioned under login bar) =====
    if (GLOBALVARS.currentPage === StorefrontPage.CART) {
      const ensureCartBanner = () => {
        // If already inserted, stop.
        if (document.getElementById("cart-guidance-banner")) return true;

        // Find the first .tableMain (this sits just below the login bar in your markup)
        const tableMain = document.querySelector(".tableMain");
        if (!tableMain) return false; // not ready yet

        // Build the banner
        const banner = document.createElement("div");
        banner.id = "cart-guidance-banner";
        banner.setAttribute("role", "status");
        banner.style.background = "#fff";
        banner.style.color = "#ff0000ff";
        banner.style.padding = "10px";
        banner.style.textAlign = "center";
        banner.style.fontWeight = "bold";
        banner.style.border = "1px solid transparent";
        banner.style.margin = "8px 0";

        // Message text (change as needed)
        banner.textContent =
          "Budget Guidance: $450 limit for new employees. $250/year for existing employees.";

        // Insert directly before .tableMain (i.e., below the login bar)
        const parent = tableMain.parentElement || tableMain;
        parent.insertBefore(banner, tableMain);
        return true;
      };

      // Try immediately, then retry briefly in case layout scripts render late
      let attempts = 0;
      const tryInsert = () => {
        if (ensureCartBanner()) return;
        if (++attempts < 25) setTimeout(tryInsert, 150);
      };
      tryInsert();
    }
    // ===================================================================
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
    // (intentionally blank)
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

        // ✅ Override the CATALOG link's href
        if (matchedKey === "CATALOG") {
          link.setAttribute("href", "/catalog/?g=3829&y=9146");
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
