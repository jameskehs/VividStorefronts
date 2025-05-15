import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function setupPromoCodeField(): void {
  if (GLOBALVARS.currentPage !== StorefrontPage.CHECKOUTPAYMENT) return;

  document.addEventListener("DOMContentLoaded", () => {
    const promoCodeInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const promoCodeLabel = document.querySelector(
      "label[for='customerPO']"
    ) as HTMLLabelElement | null;

    if (!promoCodeInput) {
      console.warn("Promo code input not found.");
      return;
    }

    // ✅ Update placeholder and label
    promoCodeInput.placeholder = "Enter Promo Code (optional)";
    promoCodeInput.removeAttribute("required");
    promoCodeInput.classList.remove("required");

    if (promoCodeLabel) {
      promoCodeLabel.textContent = "Promo Code";
    }

    // Optional: Add listener for promo code validation logic
    promoCodeInput.addEventListener("blur", () => {
      const code = promoCodeInput.value.trim();
      if (code) {
        // Replace with real validation logic or AJAX call if needed
        console.log("Validating promo code:", code);
      }
    });
  });
}
