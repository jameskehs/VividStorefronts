import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";

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

  // Run main init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ---------------------------------------------------------
  // AUTO-SKIP ADDRESS STEP (Step 1)
  // ---------------------------------------------------------
  const setupAddressSkip = () => {
    // Detect the Address step by the presence of the "Ship to my address" button
    const shipToMyAddressButton = document.querySelector<HTMLButtonElement>(
      '#shipToMyAddress button[name="button_shipTo"]'
    );

    // There is also a progress bar: .circle.active with "Address" title,
    // but the button check is the most reliable for this page.
    if (!shipToMyAddressButton) return;

    // Give Presswise a moment to finish binding handlers, then click it
    setTimeout(() => {
      // Safety check in case user already navigated away
      const btn = document.querySelector<HTMLButtonElement>(
        '#shipToMyAddress button[name="button_shipTo"]'
      );
      if (btn) {
        btn.click();
      }
    }, 400);
  };

  // ---------------------------------------------------------
  // AUTO-SKIP SHIPPING STEP (Step 2)
  // ---------------------------------------------------------
  const setupShippingSkip = () => {
    // Shipping step typically has shipMethodID radios
    const shipMethodRadios = document.querySelectorAll<HTMLInputElement>(
      'input[name="shipMethodID"]'
    );
    if (shipMethodRadios.length === 0) return;

    // Find the form that contains the shipping methods
    const form =
      shipMethodRadios[0].closest("form") ||
      document.querySelector<HTMLFormElement>("form");

    if (!form) return;

    const chooseDefaultAndSubmit = () => {
      // If nothing selected yet, select the first one (or customize which you want)
      const alreadyChecked = form.querySelector<HTMLInputElement>(
        'input[name="shipMethodID"]:checked'
      );
      if (!alreadyChecked) {
        const first = form.querySelector<HTMLInputElement>(
          'input[name="shipMethodID"]'
        );
        if (first) {
          first.checked = true;
        }
      }

      setTimeout(() => {
        const submitButton =
          form.querySelector<HTMLButtonElement>('button[type="submit"]') ||
          form.querySelector<HTMLInputElement>('input[type="submit"]');

        if (submitButton) {
          submitButton.click();
        } else {
          form.submit();
        }
      }, 200);
    };

    // Small delay so any Presswise JS can populate shipping methods fully
    setTimeout(chooseDefaultAndSubmit, 400);
  };

  const runSkipLogic = () => {
    setupAddressSkip();
    setupShippingSkip();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runSkipLogic);
  } else {
    // tiny delay so all inline scripts (like loadStorefrontScript) have executed
    setTimeout(runSkipLogic, 200);
  }

  // ---------------------------------------------------------
  // Other page hooks if you want them later
  // ---------------------------------------------------------
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    // confirmation-page logic here if needed
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    // payment-page logic here if needed
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
    // review-page logic here if needed
  }
}

main();

// -------------------------------------------------------------
// Existing menu-icon code
// -------------------------------------------------------------
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
