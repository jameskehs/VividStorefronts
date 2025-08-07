export function monitorResidentialToastAndBlockPage(): void {
  // Create overlay once
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

  const checkForResidentialToast = () => {
    const toast = document.querySelector(".jq-toast-single");

    if (
      toast &&
      toast.textContent?.includes(
        "The USPS database indicates your address is Residential"
      )
    ) {
      // 🔒 Block the page
      overlay.style.display = "block";

      // ❌ Remove the close button
      const closeBtn = toast.querySelector(".close-jq-toast-single");
      if (closeBtn) closeBtn.remove();

      // ✅ Style the "go back" link (optional)
      const goBackLink = toast.querySelector(
        'a[href*="5-shipping.php"]'
      ) as HTMLAnchorElement | null;
      if (goBackLink) {
        goBackLink.style.fontWeight = "bold";
        goBackLink.style.color = "red";
        goBackLink.style.textDecoration = "underline";
      }

      // ✅ Stop checking once handled
      clearInterval(pollInterval);
    }
  };

  const pollInterval = setInterval(checkForResidentialToast, 300);
}
