import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function changeSupportText(
  newText: string,
  newPhone: string,
  newEmail: string
) {
  if (GLOBALVARS.currentPage === StorefrontPage.LOGIN) {
    // Get the table element with the class 'login_support'
    var element = document.getElementById("login_support");

    // Check if the element exists to avoid errors
    if (element) {
      // Change the content of the element
      element.innerHTML = newText;
      element.innerHTML = newPhone;
      element.innerHTML = newEmail;
    } else {
      console.log("Element with id 'login_support' not found.");
    }
  }
}
