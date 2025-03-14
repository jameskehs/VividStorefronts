import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export async function ChangeInventoryCountNoticeNEW(
  newMessage: string,
  emailPlaceholder: string
) {
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Get the element with the id 'inventoryCountNotice'
    var element = document.getElementById("inventoryCountNotice");

    // Try to get sales email from localStorage first
    var salesEmailTxt =
      localStorage.getItem("salesEmailTxt") || "sales@vividink.com";

    // If not in localStorage, fetch from /account/index.php
    if (!localStorage.getItem("salesEmailTxt")) {
      try {
        let response = await fetch("/account/index.php");
        let text = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, "text/html");
        let salesEmailElement = doc.getElementById("salesEmailTxt");
        salesEmailTxt =
          salesEmailElement?.textContent?.trim() || "sales@vividink.com";

        // Store in localStorage for future use
        localStorage.setItem("salesEmailTxt", salesEmailTxt);
      } catch (error) {
        console.error("Failed to fetch sales email:", error);
      }
    }

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
