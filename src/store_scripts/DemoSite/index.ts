import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { applyPromoCode } from "../../shared/ApplyPromoCode";
import { persistDiscountedTotals } from "../../shared/persistDiscountedTotals";

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    document.addEventListener("DOMContentLoaded", () => {
      const img = document.getElementById(
        "productImage"
      ) as HTMLImageElement | null;
      const artID = (window as any).p?.artID;

      if (!img) {
        console.warn("[AddToCart] No #productImage found.");
        return;
      }

      if (!artID) {
        console.warn("[AddToCart] No artID found on window.p.");
        return;
      }

      console.log(
        `[AddToCart] Setting up MutationObserver for productImage (artID=${artID})`
      );

      // Define our observer
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "src"
          ) {
            console.log(
              `[AddToCart] Detected src change on #productImage: ${img.src}`
            );

            // Always force our high-res URL
            const newURL = `gen/pdf_art_image.php?artID=${artID}`;
            if (img.src !== newURL) {
              console.log(
                `[AddToCart] Replacing src with high-res URL: ${newURL}`
              );
              img.src = newURL;
              img.width = 400;
              img.style.height = "auto";
            }
          }
        });
      });

      // Start observing
      observer.observe(img, { attributes: true, attributeFilter: ["src"] });

      // Set once initially as well
      const initialURL = `gen/pdf_art_image.php?artID=${artID}`;
      console.log(
        `[AddToCart] Setting initial productImage src: ${initialURL}`
      );
      img.src = initialURL;
      img.width = 400;
      img.style.height = "auto";
    });
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    // Optional: Add logic for Cart Page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    // Optional: Add logic for Catalog Page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
    // Optional: Add logic for Checkout Address Page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    persistDiscountedTotals(); // ✅ Persist total on confirmation page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    applyPromoCode(); // ✅ Apply promo code on payment page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
    persistDiscountedTotals(); // ✅ Persist total on review page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
    // Optional: Add logic for Checkout Shipping Page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
    // Optional: Add logic for Account Form Page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
    // Optional: Add logic for Customize Page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
    // Optional: Add logic for My Account Page
  }

  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
    // Optional: Add logic for View Orders Page
  }
}

main(); // ✅ Always call main at the end

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

        // Match based on start of menu text
        const matchedKey = Object.keys(iconMap).find((key) =>
          rawText?.startsWith(key)
        );
        const iconClass = matchedKey ? iconMap[matchedKey] : "";

        if (iconClass) {
          const countMatch = rawText?.match(/\((\d+)\)/)?.[1];

          // Create a container span to wrap icon and badge
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
