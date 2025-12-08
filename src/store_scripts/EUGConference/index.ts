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
      const interval = window.setInterval(() => {
        if (img.src.startsWith(`${origin}/.cache`)) {
          img.src = desiredURL;
          img.width = 400;
          img.style.height = "auto";
        }
      }, 300);

      // Stop checking after 10 seconds
      window.setTimeout(() => {
        window.clearInterval(interval);
      }, 10000);

      // Fix quantity input behavior on Add to Cart page
      fixQuantityInputOnAddToCart();
    }
  }

  // Run add-to-cart logic on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ---------------------------------------------------------
  // Helper: detect Address / Shipping steps by progress bar
  // ---------------------------------------------------------
  const getActiveStepTitle = (): string => {
    const activeTitle = document.querySelector<HTMLElement>(
      ".checkoutProgress .circle.active .title"
    );
    return activeTitle?.textContent?.trim().toLowerCase() || "";
  };

  const isAddressStep = () => getActiveStepTitle() === "address";
  const isShippingStep = () => getActiveStepTitle() === "shipping";

  // ---------------------------------------------------------
  // AUTO-SKIP ADDRESS STEP (Step 1)
  // ---------------------------------------------------------
  const setupAddressSkip = () => {
    if (!isAddressStep()) return;

    const btnSelector = '#shipToMyAddress button[name="button_shipTo"]';

    const clickShipToMyAddress = () => {
      const shipToMyAddressButton =
        document.querySelector<HTMLButtonElement>(btnSelector);
      if (!shipToMyAddressButton) {
        return false;
      }

      shipToMyAddressButton.click();
      return true;
    };

    // Give the page a moment to initialize, then click once
    window.setTimeout(() => {
      clickShipToMyAddress();
    }, 400);
  };

  // ---------------------------------------------------------
  // AUTO-SKIP SHIPPING STEP (Step 2)
  // ---------------------------------------------------------
  const setupShippingSkip = () => {
    if (!isShippingStep()) return;

    let attempts = 0;
    const maxAttempts = 40; // ~10 seconds (40 * 250ms)

    const intervalId = window.setInterval(() => {
      attempts++;

      const form = document.getElementById("ship") as HTMLFormElement | null;
      const continueBtn = document.getElementById(
        "shipContinue"
      ) as HTMLButtonElement | null;
      const radio = form?.querySelector<HTMLInputElement>(
        'input[name="shipMethod"]'
      );

      // Need form, a shipMethod radio, and an enabled Continue button
      if (form && continueBtn && radio && !continueBtn.disabled) {
        if (!radio.checked) {
          radio.checked = true;
          // fire their onclick (updates globals + totals)
          radio.click();
        }

        // Small delay to let update_order_summary_ui settle
        window.setTimeout(() => {
          if (!continueBtn.disabled) {
            continueBtn.click();
          }
        }, 150);

        window.clearInterval(intervalId);
        return;
      }

      if (attempts >= maxAttempts) {
        window.clearInterval(intervalId);
      }
    }, 250);
  };

  const runPageEnhancements = () => {
    setupAddressSkip();
    setupShippingSkip();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // tiny delay so inline scripts (get_shipping_methods, adjustCenter, etc.) run first
      window.setTimeout(runPageEnhancements, 200);
    });
  } else {
    window.setTimeout(runPageEnhancements, 200);
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
// Fix quantity field behavior on Add to Cart page
// -------------------------------------------------------------
function fixQuantityInputOnAddToCart(): void {
  const qtyInput = document.getElementById(
    "quantity"
  ) as HTMLInputElement | null;
  if (!qtyInput) return;

  // Remove Presswise's "int-enforced" flag so their script doesn't clamp keys
  qtyInput.removeAttribute("data-int-enforced");

  // If jQuery exists, unbind any key filters they put on this field
  const anyWindow = window as any;
  if (anyWindow.$) {
    const $qty = anyWindow.$(qtyInput);
    $qty.off("keydown");
    $qty.off("keypress");
  }

  // Add a sane key filter: allow digits + editing keys, block random characters
  qtyInput.addEventListener("keydown", (e: KeyboardEvent) => {
    const allowedNavKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Enter",
    ];

    // allow nav/edit keys
    if (allowedNavKeys.includes(e.key)) {
      return;
    }

    // allow Ctrl/Cmd combos (copy, paste, select all, etc.)
    if (
      (e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x"].includes(e.key.toLowerCase())
    ) {
      return;
    }

    // allow digits 0-9
    if (e.key >= "0" && e.key <= "9") {
      return;
    }

    // everything else: block
    e.preventDefault();
  });
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
      window.setTimeout(tryConvert, 200);
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryConvert);
  } else {
    tryConvert();
  }
}

convertMenuTextToIcons();
