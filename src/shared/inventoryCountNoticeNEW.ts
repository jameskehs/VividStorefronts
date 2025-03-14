import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeInventoryCountNoticeNEW(
  newMessage: string,
  email: string
) {
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Get the element with the id 'inventoryCountNotice'
    var element = document.getElementById("inventoryCountNotice");

    // Get the sales email text from the SALESEMAILTXT enum
    var salesEmailTxt = StorefrontPage.SALESEMAILTXT;

    // Insert a line break after the word "quantity"
    var updatedMessage = newMessage.replace("quantity.", "quantity.<br>");

    // Replace the email address in the updated message with the salesEmailTxt
    updatedMessage = updatedMessage.replace(email, salesEmailTxt);

    // Set the updated message to the innerHTML of the element
    if (element) {
      element.innerHTML = updatedMessage;
    } else {
      console.log("Element with id 'inventoryCountNotice' not found.");
    }
  }
}
