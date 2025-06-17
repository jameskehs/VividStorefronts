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
  document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll<HTMLLIElement>("#menu li");

    const iconMap: Record<string, string> = {
      HOME: "fa-home",
      CATALOG: "fa-book-open",
      "MY ACCOUNT": "fa-user",
      "SHOPPING CART": "fa-shopping-cart",
    };

    menuItems.forEach((item) => {
      const link = item.querySelector("a");
      if (link) {
        const text = link.textContent?.trim().toUpperCase();
        const iconClass = iconMap[text ?? ""];

        if (iconClass) {
          link.innerHTML = `<i class="fa ${iconClass}"></i>`;
          link.setAttribute("title", text || "");
        }
      }
    });
  });
}

convertMenuTextToIcons();
