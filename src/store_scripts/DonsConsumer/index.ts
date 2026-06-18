import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { persistDiscountedTotals } from "../../shared/persistDiscountedTotals";
import { monitorResidentialToastAndBlockPage } from "../../shared/BlockOnResidentialToast";

export function main() {
  function normalizeText(text: string | null | undefined): string {
    return (text ?? "").replace(/\s+/g, " ").trim();
  }

  function isAddToCartPage(): boolean {
    const page = GLOBALVARS?.currentPage?.trim().toLowerCase() || "";

    return (
      GLOBALVARS.currentPage === StorefrontPage.ADDTOCART ||
      page.includes("add to cart") ||
      window.location.pathname.includes("/cart/3-edit.php")
    );
  }

  function isCheckoutShippingPage(): boolean {
    return GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING;
  }

  function isCheckoutBillingPage(): boolean {
    return (
      GLOBALVARS.currentPage === StorefrontPage.BILLINGADDRESS ||
      window.location.pathname.includes("/checkout/61-billing.php")
    );
  }

  function isCheckoutPaymentPage(): boolean {
    return (
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
      window.location.pathname.includes("/checkout/4-payment.php")
    );
  }

  function isCheckoutConfirmationPage(): boolean {
    return GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION;
  }

  function isAnyCheckoutPage(): boolean {
    return (
      isCheckoutShippingPage() ||
      isCheckoutBillingPage() ||
      isCheckoutPaymentPage() ||
      isCheckoutConfirmationPage() ||
      window.location.pathname.includes("/checkout/")
    );
  }

  function hideAvailableQtyOnce(): boolean {
    let changed = false;

    // Primary: hide by the known span id
    const qtySpan = document.getElementById("qtyAvailableDisplay");

    if (qtySpan) {
      const tr = qtySpan.closest("tr") as HTMLTableRowElement | null;

      if (tr && tr.style.display !== "none") {
        tr.style.display = "none";
        changed = true;
      }
    }

    // Fallback: find any row whose left cell label is "AVAILABLE"
    const rows = document.querySelectorAll<HTMLTableRowElement>(
      "table.tablesorter tr",
    );

    rows.forEach((row) => {
      const labelCellStrong = row.querySelector("td:first-child > strong");
      const label = labelCellStrong?.textContent?.trim().toUpperCase() ?? "";

      if (label === "AVAILABLE" && row.style.display !== "none") {
        row.style.display = "none";
        changed = true;
      }
    });

    // Also neutralize the hidden input’s value if present
    const hiddenInput =
      document.querySelector<HTMLInputElement>("#qtyAvailable");

    if (hiddenInput) {
      hiddenInput.value = "";
    }

    return changed;
  }

  function watchAndHideAvailableQty(durationMs = 10000): void {
    // Run immediately
    hideAvailableQtyOnce();

    // Observe for dynamic updates
    const observer = new MutationObserver(() => {
      hideAvailableQtyOnce();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Stop after a short window to avoid overhead
    setTimeout(() => observer.disconnect(), durationMs);
  }

  function updateShippingDeliveryMessage(): void {
    const target = document
      .querySelectorAll<HTMLElement>("#continueTbl .smallbody")
      .item(1);

    if (!target) return;

    const desiredText =
      "* Delivery time listed includes 1 to 2 days to process order plus shipping. Please note we do not process orders on weekends or holidays.";

    if (normalizeText(target.textContent) === desiredText) return;

    target.innerHTML = `
      <span class="red">*</span> Delivery time listed includes 1 to 2 days to process order plus shipping.
      Please note we do not process orders on weekends or holidays.
    `;
  }

  function watchAndUpdateShippingDeliveryMessage(durationMs = 10000): void {
    updateShippingDeliveryMessage();

    const observer = new MutationObserver(() => {
      updateShippingDeliveryMessage();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => observer.disconnect(), durationMs);
  }

  function findBillingFormStartTextNode(
    root: HTMLElement,
  ): { node: Text; offset: number } | null {
    const markerPatterns = [
      /ENTER\s+A\s+NEW\s+BILLING\s+ADDRESS/i,
      /NAME\/COMPANY/i,
    ];

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const text = node.textContent ?? "";

      for (const pattern of markerPatterns) {
        const match = pattern.exec(text);

        if (match) {
          return {
            node: node as Text,
            offset: match.index,
          };
        }
      }

      node = walker.nextNode();
    }

    return null;
  }

  function updateBillingAddressMessage(): void {
    const newBillingTitle = "Billing Address";

    const newBillingMessageHTML = `
      Please enter your billing address.
      <br><br>
      If you contact us about your order, we'll reference your account by the name you provide below.
    `;

    const newBillingMessageText =
      "Please enter your billing address. If you contact us about your order, we'll reference your account by the name you provide below.";

    const billingCell = Array.from(
      document.querySelectorAll<HTMLTableCellElement>("td.body"),
    ).find((cell) => {
      const text = normalizeText(cell.textContent).toUpperCase();

      return (
        text.includes("CHOOSE A BILLING") &&
        (text.includes("ENTER A NEW BILLING ADDRESS") ||
          text.includes("NAME/COMPANY") ||
          isCheckoutBillingPage())
      );
    });

    if (!billingCell) return;

    const title = Array.from(
      billingCell.querySelectorAll<HTMLSpanElement>("span.largebody"),
    ).find((span) => {
      const text = normalizeText(span.textContent).toUpperCase();
      return text.includes("CHOOSE A BILLING");
    });

    if (!title) return;

    if (normalizeText(title.textContent) !== newBillingTitle) {
      title.textContent = newBillingTitle;
    }

    const marker = findBillingFormStartTextNode(billingCell);

    // Fallback: if we cannot safely find the form start,
    // only insert/update the custom message without deleting anything else.
    if (!marker) {
      const existingMessage = billingCell.querySelector<HTMLElement>(
        "#customBillingAddressMessage",
      );

      if (!existingMessage) {
        const message = document.createElement("div");
        message.id = "customBillingAddressMessage";
        message.className = "body";
        message.innerHTML = newBillingMessageHTML;

        title.insertAdjacentElement("afterend", message);
      } else if (
        normalizeText(existingMessage.textContent) !== newBillingMessageText
      ) {
        existingMessage.innerHTML = newBillingMessageHTML;
      }

      return;
    }

    const range = document.createRange();
    range.setStartAfter(title);
    range.setEnd(marker.node, marker.offset);

    const currentMessageText = normalizeText(range.cloneContents().textContent);

    if (currentMessageText === newBillingMessageText) {
      return;
    }

    // Delete the messy/duplicated default message between the title and form.
    range.deleteContents();

    const message = document.createElement("div");
    message.id = "customBillingAddressMessage";
    message.className = "body";
    message.innerHTML = newBillingMessageHTML;

    title.insertAdjacentElement("afterend", message);
  }

  function watchAndUpdateBillingAddressMessage(durationMs = 10000): void {
    updateBillingAddressMessage();

    const observer = new MutationObserver(() => {
      updateBillingAddressMessage();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    setTimeout(() => observer.disconnect(), durationMs);
  }

  /**
   * USPS first: Reorder rows in #shipping_method_table so USPS options appear first.
   * Does NOT change the current selection by default.
   */
  function prioritizeUSPSRows(): void {
    const AUTO_SELECT_USPS = false; // set to true if you want USPS auto-selected when present

    const table = document.querySelector<HTMLTableElement>(
      "#shipping_method_table",
    );

    if (!table) return;

    const tbody = table.tBodies?.[0] || table.querySelector("tbody");

    if (!tbody) return;

    // Collect rows; keep track of special rows that should stay at the very top in original order.
    const allRows = Array.from(
      tbody.querySelectorAll<HTMLTableRowElement>("tr"),
    );

    if (allRows.length === 0) return;

    const specialRowIds = new Set(["tbdShippingRow", "loadShippingRow"]);
    const specialRows: HTMLTableRowElement[] = [];
    const carrierRows: HTMLTableRowElement[] = [];

    for (const row of allRows) {
      const id = row.id || "";

      if (specialRowIds.has(id)) {
        specialRows.push(row);
      } else {
        carrierRows.push(row);
      }
    }

    // Partition carrierRows into USPS vs non-USPS using the radio input's data-carriertype
    const uspsRows: HTMLTableRowElement[] = [];
    const otherRows: HTMLTableRowElement[] = [];

    for (const row of carrierRows) {
      // Ignore hidden rows
      if (row.style.display === "none") {
        otherRows.push(row);
        continue;
      }

      const radio = row.querySelector<HTMLInputElement>(
        "input[type='radio'][name='shipMethod']",
      );

      const carrierType =
        radio?.getAttribute("data-carriertype")?.trim().toUpperCase() || "";

      if (carrierType === "USPS") {
        uspsRows.push(row);
      } else {
        otherRows.push(row);
      }
    }

    if (uspsRows.length === 0) {
      // Nothing to do if USPS not present
      return;
    }

    // Remember currently checked value to preserve selection after reordering.
    const checkedRadio = tbody.querySelector<HTMLInputElement>(
      "input[type='radio'][name='shipMethod']:checked",
    );

    const checkedValue = checkedRadio?.value ?? null;

    // Rebuild order: special rows in original order + USPS rows + other rows
    const newOrder = [...specialRows, ...uspsRows, ...otherRows];

    // Only rewrite DOM if order actually changes to avoid flicker
    const changed =
      newOrder.length !== allRows.length ||
      newOrder.some((row, index) => row !== allRows[index]);

    if (changed) {
      // Detach all, then append in new order
      const frag = document.createDocumentFragment();

      newOrder.forEach((row) => frag.appendChild(row));
      tbody.appendChild(frag);

      // Reapply zebra striping classes (o/e) to carrier rows only
      reapplyZebraStriping(tbody, specialRowIds);

      // Restore previous selection if it existed
      if (checkedValue) {
        const newChecked = tbody.querySelector<HTMLInputElement>(
          `input[type='radio'][name='shipMethod'][value='${CSS.escape(
            checkedValue,
          )}']`,
        );

        if (newChecked && !newChecked.checked) {
          newChecked.checked = true;
        }
      }

      // Optionally auto-select the first USPS row
      if (AUTO_SELECT_USPS) {
        const firstUSPS = uspsRows[0].querySelector<HTMLInputElement>(
          "input[type='radio'][name='shipMethod']",
        );

        if (firstUSPS && !firstUSPS.checked) {
          // Some sites rely on onclick handlers to recompute totals, so trigger click if present.
          firstUSPS.click();
        }
      }
    }
  }

  function reapplyZebraStriping(
    tbody: HTMLTableSectionElement,
    specialRowIds: Set<string>,
  ): void {
    let toggle = 0; // 0 => 'o', 1 => 'e'

    const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>("tr"));

    rows.forEach((row) => {
      if (specialRowIds.has(row.id)) {
        return; // keep special rows untouched
      }

      row.classList.remove("o", "e");
      row.classList.add(toggle % 2 === 0 ? "o" : "e");
      toggle++;
    });
  }

  /**
   * Start observing the shipping table so when the platform re-renders options,
   * USPS rows get bubbled to the top again.
   */
  function observeShippingTable(): void {
    const table = document.querySelector("#shipping_method_table");

    if (!table) return;

    // Run once immediately in case rows are already there
    prioritizeUSPSRows();

    const observer = new MutationObserver(() => {
      prioritizeUSPSRows();
    });

    observer.observe(table, {
      childList: true,
      subtree: true,
    });

    // Graceful stop after a short window
    setTimeout(() => observer.disconnect(), 15000);
  }

  function whenShippingTableReady(cb: () => void, timeoutMs = 12000): void {
    const start = Date.now();

    const poll = () => {
      const table = document.querySelector("#shipping_method_table tbody");

      const hasOptions =
        !!table &&
        table.querySelectorAll("input[type='radio'][name='shipMethod']")
          .length > 0;

      if (hasOptions) {
        cb();
        return;
      }

      if (Date.now() - start > timeoutMs) {
        // Give up silently
        return;
      }

      setTimeout(poll, 150);
    };

    poll();
  }

  function init(): void {
    const onCheckoutPage = isAnyCheckoutPage();

    // Always try to hide AVAILABLE row on relevant pages
    if (isAddToCartPage() || onCheckoutPage) {
      watchAndHideAvailableQty(12000);
    }

    // Billing step message cleanup
    if (isCheckoutBillingPage()) {
      watchAndUpdateBillingAddressMessage(12000);
    }

    // USPS prioritization and delivery message only on the shipping step
    if (isCheckoutShippingPage()) {
      watchAndUpdateShippingDeliveryMessage(12000);

      whenShippingTableReady(() => {
        // One more immediate pass in case the table appeared between polls
        prioritizeUSPSRows();

        // Then observe for subsequent re-renders: ajax loads, rate recalcs, etc.
        observeShippingTable();
      });

      monitorResidentialToastAndBlockPage();
    }

    // --- Hide .buttonContainer ONLY on the Add to Cart page ---
    if (isAddToCartPage()) {
      // 1) Inject CSS so any future re-renders stay hidden
      if (!document.getElementById("hideButtonsOnATC")) {
        const style = document.createElement("style");

        style.id = "hideButtonsOnATC";
        style.textContent = `
          /* Be precise so we don't accidentally hide other pages' buttons */
          #productImageCol .buttonContainer { display: none !important; }
        `;

        document.head.appendChild(style);
      }

      // 2) Also hide any existing nodes immediately
      document
        .querySelectorAll<HTMLElement>("#productImageCol .buttonContainer")
        .forEach((el) => {
          el.style.display = "none";
        });
    }
    // --- End Add to Cart hide ---

    // === Existing image swap logic for Add to Cart ===
    if (isAddToCartPage()) {
      const img = document.getElementById(
        "productImage",
      ) as HTMLImageElement | null;

      const artID = (window as unknown as { p?: { artID?: string | number } }).p
        ?.artID;

      if (img && artID) {
        const origin = window.location.origin;
        const uniqueNoCache = Date.now();

        const desiredURL = `${origin}/catalog/gen/pdf_art_image.php?artID=${artID}&nocache=${uniqueNoCache}`;

        const fixImg = () => {
          if (img.src.startsWith(`${origin}/.cache`)) {
            img.src = desiredURL;
            img.width = 400;
            img.style.height = "auto";
          }
        };

        fixImg();

        const interval = setInterval(fixImg, 300);

        setTimeout(() => clearInterval(interval), 10000);
      }
    }

    if (isCheckoutConfirmationPage()) {
      persistDiscountedTotals();
    }

    if (isCheckoutPaymentPage()) {
      // No-op; reserved for future payment-page logic
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

main();

function convertMenuTextToIcons(): void {
  const iconMap: Record<string, string> = {
    HOME: "fa-home",
    CATALOG: "fa-book-open",
    "MY ACCOUNT": "fa-user",
    "SHOPPING CART": "fa-shopping-cart",
  };

  const tryConvert = () => {
    const menuItems = document.querySelectorAll<HTMLLIElement>("#menu li");

    if (menuItems.length === 0) {
      setTimeout(tryConvert, 200);
      return;
    }

    menuItems.forEach((item) => {
      const link = item.querySelector("a");

      if (link) {
        const rawText = link.textContent?.trim().toUpperCase();

        const matchedKey = Object.keys(iconMap).find((key) =>
          rawText?.startsWith(key),
        );

        const iconClass = matchedKey ? iconMap[matchedKey] : "";

        if (matchedKey === "CATALOG") {
          link.setAttribute("href", "/catalog/?g=3830&y=9150");
        }

        if (iconClass) {
          const countMatch = rawText?.match(/\((\d+)\)/)?.[1];

          link.innerHTML = `
            <span class="icon-wrap">
              <i class="fa ${iconClass}"></i>
              ${countMatch ? `<span class="badge">${countMatch}</span>` : ""}
            </span>
          `;

          link.setAttribute("title", rawText || "");
        }
      }
    });
  };

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", tryConvert)
    : tryConvert();
}

convertMenuTextToIcons();
