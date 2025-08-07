export function monitorResidentialToastAndBlockPage(): void {
  if (!document.getElementById("page-blocker-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "page-blocker-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    overlay.style.zIndex = "9998";
    overlay.style.display = "none";
    document.body.appendChild(overlay);
  }

  const overlay = document.getElementById("page-blocker-overlay")!;

  const pollInterval = setInterval(() => {
    const toast = document.querySelector(".jq-toast-single");

    if (
      toast &&
      toast.textContent?.includes(
        "The USPS database indicates your address is Residential"
      )
    ) {
      overlay.style.display = "block";

      // Remove the close button
      const closeBtn = toast.querySelector(".close-jq-toast-single");
      if (closeBtn) closeBtn.remove();

      // Preserve the "go back" link
      const goBackLink = toast.querySelector(
        'a[href*="5-shipping.php"]'
      ) as HTMLAnchorElement | null;
      const linkHTML = goBackLink?.outerHTML || "";

      // Replace the entire toast content
      toast.innerHTML = `
        <strong class="sans red">Important Message</strong><br>
        The USPS database indicates your address is Residential, but you have it flagged as Commercial.<br>
        <strong>Please go back and click the Verify Address button</strong> to ensure the most reliable package delivery.<br>
        We verify all addresses with the USPS address database.<br><br>
        ${linkHTML}
      `;

      // Style the link
      if (goBackLink) {
        goBackLink.style.fontWeight = "bold";
        goBackLink.style.color = "red";
        goBackLink.style.textDecoration = "underline";
      }

      clearInterval(pollInterval);
    }
  }, 300);
}
