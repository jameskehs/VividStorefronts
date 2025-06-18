// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";

export function main() {
  console.log(GLOBALVARS.currentPage);

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
  }
}

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

export function moveSearchBarToHeader(): void {
  const logoLinks = document.getElementById("logoLinks");
  const logoTable = logoLinks?.querySelector("table");
  const navWrapper = document.getElementById("navWrapper");
  const searchContainer = document.getElementById("home-search-container");

  if (!logoLinks || !logoTable || !navWrapper || !searchContainer) {
    console.warn("One or more required elements not found");
    return;
  }

  // Clear current logoLinks children and reappend in correct order
  logoLinks.innerHTML = "";
  logoLinks.appendChild(logoTable);
  logoLinks.appendChild(searchContainer);
  logoLinks.appendChild(navWrapper);
}

document.addEventListener("DOMContentLoaded", () => {
  moveSearchBarToHeader();
});
function bindSearchEvents(): void {
  const input = document.getElementById(
    "home-search-input"
  ) as HTMLInputElement;
  const button = document.getElementById("home-search-btn");

  function searchProducts() {
    const searchValue = input?.value.trim();
    if (searchValue) {
      window.location.href = `${
        window.location.origin
      }/catalog/?search=${encodeURIComponent(searchValue)}&g=0&y=0&p=0&m=g`;
    }
  }

  if (button) {
    button.addEventListener("click", searchProducts);
  }

  if (input) {
    input.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        searchProducts();
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  moveSearchBarToHeader();
  bindSearchEvents();
});
