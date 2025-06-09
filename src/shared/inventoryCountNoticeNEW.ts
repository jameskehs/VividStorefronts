import { StorefrontPage } from "../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../index";

export async function ChangeInventoryCountNoticeNEW(
  newMessage: string,
  emailPlaceholder: string
) {
  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    const element = document.getElementById("inventoryCountNotice");

    let salesEmailTxt = "sales@poweredbyprisma.com";

    // Always try to fetch fresh first
    try {
      const response = await fetch("/account/index.php");
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const salesEmailElement = doc.querySelector("#salesEmailTxt a");

      if (salesEmailElement?.textContent?.trim()) {
        salesEmailTxt = salesEmailElement.textContent.trim();
        localStorage.setItem("salesEmailTxt", salesEmailTxt);
      } else {
        // Fallback to localStorage
        salesEmailTxt = localStorage.getItem("salesEmailTxt") || salesEmailTxt;
      }
    } catch (e) {
      console.error("Error fetching sales email:", e);
      salesEmailTxt = localStorage.getItem("salesEmailTxt") || salesEmailTxt;
    }

    const mailtoLink = `<a href="mailto:${salesEmailTxt}">${salesEmailTxt}</a>`;

    const updatedMessage = newMessage
      .replace("quantity.", "quantity.<br>")
      .replace(emailPlaceholder, mailtoLink); // ← this is key

    if (element) {
      element.innerHTML = updatedMessage;
    } else {
      console.log("Element with id 'inventoryCountNotice' not found.");
    }
  }
}
