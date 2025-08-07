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

      // Remove the close (×) button
      const closeBtn = toast.querySelector(".close-jq-toast-single");
      if (closeBtn) closeBtn.remove();

      // Replace toast content with updated message and inline "go back" link
      toast.innerHTML = `
        <strong class="sans red">Important Message</strong><br>
        The USPS database indicates your address is Residential, but you have it flagged as Commercial.<br>
        Please <a href="5-shipping.php" style="color: red; font-weight: bold; text-decoration: underline;">go back</a> and click the Verify Address button to ensure the most reliable package delivery.<br>
        We verify all addresses with the USPS address database.
      `;

      clearInterval(pollInterval);
    }
  }, 300);
}
