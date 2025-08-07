export function monitorResidentialToastAndBlockPage(): void {
  if (!document.getElementById("page-blocker-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "page-blocker-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0, 0, 0, 0.3)";
    overlay.style.zIndex = "9998";
    overlay.style.display = "none";
    document.body.appendChild(overlay);
  }

  const blockPage = () => {
    const overlay = document.getElementById("page-blocker-overlay");
    if (overlay) overlay.style.display = "block";
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (
          node instanceof HTMLElement &&
          node.classList.contains("jq-toast-single") &&
          node.textContent?.includes(
            "The USPS database indicates your address is Residential"
          )
        ) {
          blockPage();

          // ❌ Remove the close (×) button
          const closeBtn = node.querySelector(".close-jq-toast-single");
          if (closeBtn) closeBtn.remove();

          // ✅ Optional: Style the "go back" link to make it more obvious
          const goBackLink = node.querySelector(
            'a[href*="5-shipping.php"]'
          ) as HTMLAnchorElement;
          if (goBackLink) {
            goBackLink.style.fontWeight = "bold";
            goBackLink.style.color = "red";
            goBackLink.style.textDecoration = "underline";
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
