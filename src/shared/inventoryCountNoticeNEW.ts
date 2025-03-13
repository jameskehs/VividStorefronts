import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeInventoryCountNoticeNEW(newMessage: string, p0: string) {
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    var element = document.getElementById("inventoryCountNotice");

    // Ensure salesEmail is retrieved from the correct data source
    var salesEmailTxt =
      GLOBALVARS?.myAccountData?.salesEmailTxt || "sales@vividink.com";

    var emailLink = `<a href="mailto:${salesEmailTxt}">${salesEmailTxt}</a>`;
    var updatedMessage = newMessage.replace("quantity.", "quantity.<br>");
    updatedMessage = updatedMessage.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/gi,
      emailLink
    );

    if (element) {
      element.innerHTML = updatedMessage;
    } else {
      console.log("Element with id 'inventoryCountNotice' not found.");
    }
  }
}
