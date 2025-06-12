import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function updateSupportEmail(newEmail: string): void {
  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
    // Select the <a> tag inside the checkoutBody td
    const emailLink = document.querySelector(
      "td.checkoutBody a[href^='mailto:']"
    ) as HTMLAnchorElement;

    if (emailLink) {
      emailLink.href = `mailto:${newEmail}`;
      emailLink.textContent = newEmail;
    } else {
      console.warn("Support email link not found");
    }
  }
}
