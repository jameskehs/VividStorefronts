import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function HideCheckoutButtonIfMultipleItems() {
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    const cartTotalSpan = document.querySelector(".cartTotal");
    const checkoutButton = document.querySelector(
      "#checkoutProceedButtonContainer button[name='button_checkout']"
    ) as HTMLButtonElement | null;

    if (cartTotalSpan && checkoutButton) {
      const match = cartTotalSpan.textContent?.match(/^(\d+)/);
      const count = match ? parseInt(match[1], 10) : 0;

      if (count > 1) {
        checkoutButton.style.display = "none";
      }
    } else {
      if (!cartTotalSpan) console.log("cartTotal element not found.");
      if (!checkoutButton) console.log("Checkout button not found.");
    }
  }
}
