// src/storefront/fixPaymentIframeA11y.ts
export function fixPaymentIframeA11y() {
  try {
    // 1) Ensure a stable header ID we can reference
    const header =
      (document.querySelector(
        "#paywithnewcard header"
      ) as HTMLElement | null) ??
      (document.querySelector(
        "#paywithnewcard h1, #paywithnewcard h2, #paywithnewcard h3"
      ) as HTMLElement | null);

    let headerEl = header;
    if (!headerEl) {
      // Fallback: inject a visually-hidden header so we always have an accessible label target
      headerEl = document.createElement("h2");
      headerEl.textContent = "Pay With Credit Card";
      headerEl.id = "cc-payment-header";
      headerEl.setAttribute("data-injected", "true");
      headerEl.style.position = "absolute";
      headerEl.style.width = "1px";
      headerEl.style.height = "1px";
      headerEl.style.padding = "0";
      headerEl.style.margin = "-1px";
      headerEl.style.overflow = "hidden";
      headerEl.style.clip = "rect(0, 0, 0, 0)";
      headerEl.style.whiteSpace = "nowrap";
      headerEl.style.border = "0";
      document.querySelector("#paywithnewcard")?.prepend(headerEl);
    } else if (!headerEl.id) {
      headerEl.id = "cc-payment-header";
    }

    const apply = (ifr: HTMLIFrameElement) => {
      if (!ifr) return;
      // Set both: some linters insist on title; SRs love aria-labelledby
      ifr.setAttribute("title", "Credit card payment form");
      ifr.setAttribute("aria-labelledby", headerEl!.id);
      // optional hardening
      if (!ifr.hasAttribute("role")) ifr.setAttribute("role", "document");
    };

    // Apply now if present
    const iframeNow = document.getElementById(
      "load_payment"
    ) as HTMLIFrameElement | null;
    if (iframeNow) apply(iframeNow);

    // Apply again on window load (if gateway injects late)
    window.addEventListener("load", () => {
      const ifr = document.getElementById(
        "load_payment"
      ) as HTMLIFrameElement | null;
      if (ifr) apply(ifr);
    });

    // Watch for dynamic replacements inside #paywithnewcard
    const target = document.getElementById("paywithnewcard") ?? document.body;
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of Array.from(m.addedNodes)) {
          if (!(n instanceof HTMLElement)) continue;
          if (n.id === "load_payment" && n instanceof HTMLIFrameElement)
            apply(n);
          const found = n.querySelector?.(
            "#load_payment"
          ) as HTMLIFrameElement | null;
          if (found) apply(found);
        }
      }
    });
    obs.observe(target, { childList: true, subtree: true });
  } catch {
    // no-op: never let this break checkout
  }
}
