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

  // Run init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // --- AUTO-SKIP ADDRESS & SHIPPING STEP ---------------------------

  const isAddressAndShippingPage = () => {
    const page = GLOBALVARS?.currentPage?.trim().toLowerCase() || "";
    // Heuristics: tweak if needed for your environment
    if (page.includes("address") || page.includes("shipping")) return true;

    // Fallback: look for a typical shipping method field
    return !!document.querySelector('input[name="shipMethodID"]');
  };

  if (isAddressAndShippingPage()) {
    const runAutoSkip = () => autoSkipAddressAndShipping();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runAutoSkip);
    } else {
      runAutoSkip();
    }
  }

  // -----------------------------------------------------------------

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    // you can add confirmation-page logic here if needed
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    // payment-page logic here if needed
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
    // review-page logic here if needed
  }
}

main();

function autoSkipAddressAndShipping(): void {
  // Try to locate the main checkout form
  const form =
    document.querySelector<HTMLFormElement>('form[action*="checkout"]') ||
    document.querySelector<HTMLFormElement>('form[name="checkoutForm"]');

  if (!form) return;

  // List of required shipping address fields (adjust selectors to match your markup)
  const requiredSelectors = [
    'input[name="stFirst"]',
    'input[name="stLast"]',
    'input[name="stStreet"]',
    'input[name="stCity"]',
    'select[name="stState"]',
    'input[name="stZip"]',
  ];

  const allFilled = requiredSelectors.every((selector) => {
    const el = form.querySelector<HTMLInputElement | HTMLSelectElement>(
      selector
    );
    if (!el) return false;
    return (el as HTMLInputElement | HTMLSelectElement).value.trim().length > 0;
  });

  // If the user hasn't got a full address yet (guest checkout, new user, etc.), don't skip
  if (!allFilled) return;

  // Optionally, set a default shipping method if nothing is selected yet.
  // If you know a specific value for your default, replace "input[name='shipMethodID']"
  // with something like "input[name='shipMethodID'][value='123']".
  const existingChecked = form.querySelector<HTMLInputElement>(
    'input[name="shipMethodID"]:checked'
  );

  if (!existingChecked) {
    const defaultShip = form.querySelector<HTMLInputElement>(
      'input[name="shipMethodID"]'
    );
    if (defaultShip) {
      defaultShip.checked = true;
    }
  }

  // Small delay gives Presswise's own JS a chance to finish any last DOM tweaks
  setTimeout(() => {
    const continueButton =
      form.querySelector<HTMLButtonElement>('button[type="submit"]') ||
      form.querySelector<HTMLInputElement>('input[type="submit"]');

    if (continueButton) {
      continueButton.click();
    } else {
      form.submit();
    }
  }, 300);
}

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
