import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { applyPromoCode } from "../../shared/ApplyPromoCode";
import { persistDiscountedTotals } from "../../shared/persistDiscountedTotals";

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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    persistDiscountedTotals();
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    applyPromoCode();

    const displayCcFeeMessage = () => {
      const container =
        document.querySelector("#checkout_box") || document.body;

      if (document.getElementById("cc-fee-notice")) return;

      const notice = document.createElement("div");
      notice.id = "cc-fee-notice";
      notice.textContent =
        "⚠️ A credit card processing fee will be applied to your order total.";
      notice.style.backgroundColor = "#fff3cd";
      notice.style.border = "1px solid #ffeeba";
      notice.style.color = "#856404";
      notice.style.padding = "12px";
      notice.style.margin = "20px 0";
      notice.style.fontSize = "1rem";
      notice.style.fontWeight = "bold";
      notice.style.borderRadius = "5px";
      notice.style.textAlign = "center";

      container.insertBefore(notice, container.firstChild);
    };

    const shouldShowCcNotice = () => {
      const ccOnly = document.querySelector<HTMLInputElement>(
        "input[name='paymentMethod'][value='anetIFrame']"
      )?.checked;

      const ccIframeVisible =
        (document.querySelector("#load_payment") as HTMLElement | null)?.style
          .display !== "none";

      return ccOnly || ccIframeVisible;
    };

    const waitForIframeAndTrigger = () => {
      const maxWait = 5000;
      const interval = 100;
      let elapsed = 0;

      const check = () => {
        if (shouldShowCcNotice()) {
          displayCcFeeMessage();
        } else if (elapsed < maxWait) {
          elapsed += interval;
          setTimeout(check, interval);
        }
      };

      check();
    };

    waitForIframeAndTrigger();
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
    persistDiscountedTotals();
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
