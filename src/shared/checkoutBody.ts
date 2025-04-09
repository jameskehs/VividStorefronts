import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeCheckoutBody(newMessage: string, email: string) {
  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
    // Get the element with the id 'checkoutBody'
    var element = document.getElementById("checkoutBody");

    // Create the mailto link for the provided email address
    var emailLink = `<a href="mailto:${email}">${email}</a>`;

    // Replace the email address in the message with the mailto link
    var updatedMessage = newMessage.replace("angela@vividink.com", emailLink);

    // Set the updated message to the innerHTML of the element
    if (element) {
      element.innerHTML = updatedMessage;
    } else {
      console.log("Element with id 'checkoutBody' not found.");
    }
  }
}
