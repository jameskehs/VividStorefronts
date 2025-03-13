import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeInventoryCountNoticeNEW(newMessage: string) {
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Get the element with the id 'inventoryCountNotice'
    var element = document.getElementById("inventoryCountNotice");

    // Retrieve the salesEmail from StorefrontPage.MYACCOUNT
    var salesEmailTxt =
      StorefrontPage.MYACCOUNT?.salesEmailTxt || "sales@vividink.com";

    // Create the mailto link for the provided email address
    var emailLink = `<a href="mailto:${salesEmailTxt}">${salesEmailTxt}</a>`;

    // Insert a line break after the word "quantity."
    var updatedMessage = newMessage.replace("quantity.", "quantity.<br>");

    // Replace any email address in the updated message with the mailto link
    updatedMessage = updatedMessage.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/gi,
      emailLink
    );

    // Set the updated message to the innerHTML of the element
    if (element) {
      element.innerHTML = updatedMessage;
    } else {
      console.log("Element with id 'inventoryCountNotice' not found.");
    }
  }
}
