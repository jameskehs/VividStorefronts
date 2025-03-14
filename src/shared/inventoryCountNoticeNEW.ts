import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeInventoryCountNoticeNEW(
  newMessage: string,
  email: string
) {
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Get the element with the id 'inventoryCountNotice'
    var element = document.getElementById("inventoryCountNotice");

    // Get the sales email span from MYACCOUNT page enum
    var salesEmailSpan = StorefrontPage.MYACCOUNT;

    // Insert a line break after the word "quantity"
    var updatedMessage = newMessage.replace("quantity.", "quantity.<br>");

    // Replace the email address in the updated message with the salesEmailTxt span
    updatedMessage = updatedMessage.replace(
      "angela@vividink.com",
      salesEmailSpan
    );

    // Set the updated message to the innerHTML of the element
    if (element) {
      element.innerHTML = updatedMessage;
    } else {
      console.log("Element with id 'inventoryCountNotice' not found.");
    }
  }
}
