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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    persistDiscountedTotals();
  }

  if (
    GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
    window.location.pathname.includes("/checkout/4-payment.php")
  ) {
    applyPromoCode();

    const displayCcFeeMessage = () => {
      if (document.getElementById("cc-fee-notice-modal")) return;

      const modalOverlay = document.createElement("div");
      modalOverlay.id = "cc-fee-notice-modal";
      modalOverlay.style.position = "fixed";
      modalOverlay.style.top = "0";
      modalOverlay.style.left = "0";
      modalOverlay.style.width = "100vw";
      modalOverlay.style.height = "100vh";
      modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
      modalOverlay.style.display = "flex";
      modalOverlay.style.alignItems = "center";
      modalOverlay.style.justifyContent = "center";
      modalOverlay.style.zIndex = "99999"; // boosted z-index

      const modalBox = document.createElement("div");
      modalBox.style.backgroundColor = "#ffffff";
      modalBox.style.border = "1px solid #ffffff";
      modalBox.style.color = "#000000";
      modalBox.style.padding = "24px";
      modalBox.style.borderRadius = "8px";
      modalBox.style.fontSize = "1.2rem";
      modalBox.style.fontWeight = "bold";
      modalBox.style.maxWidth = "400px";
      modalBox.style.boxShadow = "0 0 20px rgba(0,0,0,0.2)";
      modalBox.style.position = "relative";
      modalBox.style.textAlign = "center";

      modalBox.innerHTML = `
      <div style="margin-bottom: 1em;">⚠️ A credit card processing fee will be applied to your order total.</div>
      <button id="cc-fee-close-btn" style="
        background-color: #dadada;
        color: black;
        border: none;
        padding: 4px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">Accept</button>
    `;

      modalOverlay.appendChild(modalBox);
      document.body.appendChild(modalOverlay);

      const closeBtn = modalBox.querySelector(
        "#cc-fee-close-btn"
      ) as HTMLButtonElement;
      closeBtn.onclick = () => {
        modalOverlay.remove();
      };
    };

    const waitForIframe = () => {
      const iframe = document.querySelector(
        "#load_payment"
      ) as HTMLElement | null;
      if (iframe && iframe.offsetParent !== null) {
        displayCcFeeMessage();
        return;
      }
      requestAnimationFrame(waitForIframe); // keep checking
    };

    // Delay a little to ensure DOM is initialized
    setTimeout(() => requestAnimationFrame(waitForIframe), 300);
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

if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
  $("#continueTbl .smallbody").eq(1)
    .html(`<span class="red">*</span> Delivery time listed includes 1 to 2 days to process order plus shipping.
      Please note we do not process orders on weekends or holidays.`);

  monitorResidentialToastAndBlockPage();
}
