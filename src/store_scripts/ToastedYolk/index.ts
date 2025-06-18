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

export function moveSearchBarNextToLogo(): void {
  const logoLinks = document.getElementById("logoLinks");
  const searchContainer = document.getElementById("home-search-container");

  if (!logoLinks || !searchContainer) {
    console.warn("Required elements not found to move search bar.");
    return;
  }

  // Move the search bar after the logo table
  const table = logoLinks.querySelector("table");
  if (table) {
    table.insertAdjacentElement("afterend", searchContainer);
  }

  // Flex layout
  logoLinks.style.display = "flex";
  logoLinks.style.alignItems = "center";
  logoLinks.style.justifyContent = "space-between";

  // Optional styling
  searchContainer.style.marginLeft = "40px";
  searchContainer.style.flexGrow = "1";
  searchContainer.style.display = "flex";
  searchContainer.style.justifyContent = "center";

  // ✅ Rebind the search button and enter key
  const input = document.getElementById(
    "home-search-input"
  ) as HTMLInputElement;
  const btn = document.getElementById("home-search-btn");

  function searchProducts() {
    const query = input?.value.trim();
    if (query) {
      window.location.href = `/catalog/?search=${encodeURIComponent(
        query
      )}&g=0&y=0&p=0&m=g`;
    }
  }

  btn?.addEventListener("click", searchProducts);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchProducts();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  moveSearchBarNextToLogo();
});
