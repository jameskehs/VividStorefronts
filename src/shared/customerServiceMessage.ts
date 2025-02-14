import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeCustomerServiceMessage(newMessage: string) {
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
    // Get the element with the id 'custServices'
    var element = document.getElementById("custServices");

    // Check if the element exists to avoid errors
    if (element) {
      // Change the content of the element
      element.innerHTML = newMessage;
    } else {
      console.log("Element with id 'custServices' not found.");
    }
  }
}
