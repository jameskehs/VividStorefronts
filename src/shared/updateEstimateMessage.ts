import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function updateEstimateMessage(newMessage: string): void {
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
    // Select the span containing the estimate message
    const estimateSpan = document.querySelector("td[colspan='2'] .smallbody");

    if (estimateSpan) {
      estimateSpan.innerHTML = `<span class="red">*</span> ${newMessage}`;
    } else {
      console.warn("Estimate message element not found");
    }
  }
}
