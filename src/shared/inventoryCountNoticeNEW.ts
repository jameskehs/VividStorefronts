import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeInventoryCountNoticeNEW(
  newMessage: string,
  emailPlaceholder: string
) {
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Get the element with the id 'inventoryCountNotice'
    var element = document.getElementById("inventoryCountNotice");

    // Dynamically extract the sales email from the element with id 'salesEmailTxt' on /account/index.php
    var salesEmailElement = document.getElementById("salesEmailTxt");
    var salesEmailTxt =
      salesEmailElement?.textContent?.trim() || "sales@vividink.com";

    // Insert a line break after the word "quantity"
    var updatedMessage = newMessage.replace("quantity.", "quantity.<br>");

    // Replace the email address in the updated message with the dynamically retrieved salesEmailTxt
    updatedMessage = updatedMessage.replace(emailPlaceholder, salesEmailTxt);

    // Set the updated message to the innerHTML of the element
    if (element) {
      element.innerHTML = updatedMessage;
    } else {
      console.log("Element with id 'inventoryCountNotice' not found.");
    }
  }
}
