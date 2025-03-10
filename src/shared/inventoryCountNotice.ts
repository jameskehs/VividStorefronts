import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export function ChangeInventoryCountNotice(newMessage: string) {
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Get the element with the id 'inventoryCountNotice'
    var element = document.getElementById("inventoryCountNotice");

    // Check if the element exists to avoid errors
    if (element) {
      // Change the content of the element
      element.innerHTML = newMessage;
    } else {
      console.log("Element with id 'inventoryCountNotice' not found.");
    }
  }
}
