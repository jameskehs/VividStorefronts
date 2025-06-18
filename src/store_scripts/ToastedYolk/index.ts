// Import dependencies
import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";

// Main page routing
export function main() {
  console.log(GLOBALVARS.currentPage);

  switch (GLOBALVARS.currentPage) {
    case StorefrontPage.ADDTOCART:
    case StorefrontPage.CART:
    case StorefrontPage.CATALOG:
    case StorefrontPage.CHECKOUTADDRESS:
    case StorefrontPage.CHECKOUTCONFIRMATION:
    case StorefrontPage.CHECKOUTPAYMENT:
    case StorefrontPage.CHECKOUTREVIEW:
    case StorefrontPage.CHECKOUTSHIPPING:
    case StorefrontPage.CREATEEDITACCOUNT:
    case StorefrontPage.CUSTOMIZETEMPLATE:
    case StorefrontPage.MYACCOUNT:
    case StorefrontPage.VIEWORDERS:
      // Do something if needed
      break;
  }
}

// Replace menu text with icons
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

// Move search bar to top header
export function moveSearchBarOverLogo(): void {
  const logoLinks = document.getElementById("logoLinks");
  const searchContainer = document.getElementById("home-search-container");

  if (!logoLinks || !searchContainer) {
    console.warn("Required elements not found to layer search bar.");
    return;
  }

  // Ensure parent is positioned
  logoLinks.style.position = "relative";

  // Style the search container to overlay
  searchContainer.style.position = "absolute";
  searchContainer.style.top = "0"; // adjust as needed
  searchContainer.style.left = "50%";
  searchContainer.style.transform = "translateX(-50%)";
  searchContainer.style.zIndex = "9999";
}

// Run after full page load
document.addEventListener("DOMContentLoaded", () => {
  moveSearchBarOverLogo();
});
