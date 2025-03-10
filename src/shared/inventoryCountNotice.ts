import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeInventoryCountNotice(newMessage: string, email: string) {
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Get the element with the id 'inventoryCountNotice'
    var element = document.getElementById("inventoryCountNotice");

    // Create the mailto link for the provided email address
    var emailLink = `<a href="mailto:${email}">${email}</a>`;

    // Insert a line break after the word "quantity"
    var updatedMessage = newMessage.replace("quantity.", "quantity.<br>");

    // Replace the email address in the updated message with the mailto link
    updatedMessage = updatedMessage.replace("angela@vividink.com", emailLink);

    // Set the updated message to the innerHTML of the element
    if (element) {
      element.innerHTML = updatedMessage;
    } else {
      console.log("Element with id 'inventoryCountNotice' not found.");
    }
  }
}
