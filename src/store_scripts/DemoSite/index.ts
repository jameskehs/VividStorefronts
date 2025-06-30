import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { applyPromoCode } from "../../shared/ApplyPromoCode";
import { persistDiscountedTotals } from "../../shared/persistDiscountedTotals";

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Optional: Add logic for Add to Cart Page
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
