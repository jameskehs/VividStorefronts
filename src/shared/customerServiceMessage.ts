import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeCustomerServiceMessage(newMessage: string) {
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
    // Get the element with the id 'copyright'
    var element = document.getElementById("copyright");

    // Check if the element exists to avoid errors
    if (element) {
      // Change the content of the element
      element.innerHTML = newMessage;
    } else {
      console.log("Element with id 'copyright' not found.");
    }
  }
}
