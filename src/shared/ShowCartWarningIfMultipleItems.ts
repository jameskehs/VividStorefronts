import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ShowCartWarningIfMultipleItems() {
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    const cartTotalSpan = document.querySelector(".cartTotal");

    if (cartTotalSpan) {
      const match = cartTotalSpan.textContent?.match(/^(\d+)/);
      const count = match ? parseInt(match[1], 10) : 0;
      // Adjust count as needed
      if (count > 1) {
        // Check if warning already exists to avoid duplicates
        if (!document.getElementById("cartItemWarning")) {
          const warning = document.createElement("div");
          warning.id = "cartItemWarning";
          warning.textContent = "⚠️ Warning: More than one item in the cart!";
          warning.className = "cart-warning";

          // Append warning after the cart total
          cartTotalSpan.parentElement?.appendChild(warning);
        }
      }
    } else {
      console.log("cartTotal element not found.");
    }
  }
}
