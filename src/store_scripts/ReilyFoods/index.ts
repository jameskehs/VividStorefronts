// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
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
