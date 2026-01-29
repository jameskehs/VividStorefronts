import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";
import { applyPromoCode } from "../../shared/ApplyPromoCode";
import { persistDiscountedTotals } from "../../shared/persistDiscountedTotals";
import { monitorResidentialToastAndBlockPage } from "../../shared/BlockOnResidentialToast";
import { ChangeInventoryCountNoticeNEW } from "../../shared/inventoryCountNoticeNEW";

export function main() {
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

    // Also neutralize the hidden input’s value if you want:
    const hiddenInput =
      document.querySelector<HTMLInputElement>("#qtyAvailable");
    if (hiddenInput) hiddenInput.value = "";

    return changed;
  }

  function watchAndHideAvailableQty(durationMs = 10000) {
    // Run immediately
    hideAvailableQtyOnce();

    // Observe for dynamic updates
    const observer = new MutationObserver(() => {
      hideAvailableQtyOnce();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Stop after a short window to avoid overhead
    setTimeout(() => observer.disconnect(), durationMs);
  }

  /**
   * USPS first: Reorder rows in #shipping_method_table so USPS options appear first.
   * Does NOT change the current selection by default.
   */
  function prioritizeUSPSRows() {
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
      // ignore hidden rows
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

    // Rebuild order: special rows (in original order) + USPS rows + other rows
    const newOrder = [...specialRows, ...uspsRows, ...otherRows];

    // Only rewrite DOM if order actually changes to avoid flicker
    const changed =
      newOrder.length !== allRows.length ||
      newOrder.some((row, i) => row !== allRows[i]);

    if (changed) {
      // Detach all, then append in new order
      const frag = document.createDocumentFragment();
      newOrder.forEach((r) => frag.appendChild(r));
      tbody.appendChild(frag);

      // Reapply zebra striping classes (o/e) to carrier rows only (keep special rows as-is)
      reapplyZebraStriping(tbody, specialRowIds);

      // Restore previous selection (if it existed)
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
  ) {
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
  function observeShippingTable() {
    const table = document.querySelector("#shipping_method_table");
    if (!table) return;

    // Run once immediately (in case rows are already there)
    prioritizeUSPSRows();

    const observer = new MutationObserver(() => {
      prioritizeUSPSRows();
    });

    observer.observe(table, {
      childList: true,
      subtree: true,
    });

    // Graceful stop after a short window (adjust if your page reflows longer)
    setTimeout(() => observer.disconnect(), 15000);
  }

  function whenShippingTableReady(cb: () => void, timeoutMs = 12000) {
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

  function init() {
    const isAddToCartPage = () => {
      const page = GLOBALVARS?.currentPage?.trim().toLowerCase() || "";
      return (
        page.includes("add to cart") ||
        window.location.pathname.includes("/cart/3-edit.php")
      );
    };

    // Always try to hide AVAILABLE row on relevant pages
    const onCheckoutPage =
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING ||
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
      GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION ||
      window.location.pathname.includes("/checkout/");

    if (isAddToCartPage() || onCheckoutPage) {
      watchAndHideAvailableQty(12000);
    }

    // USPS prioritization only on the shipping step
    if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
      whenShippingTableReady(() => {
        // One more immediate pass in case the table appeared between polls
        prioritizeUSPSRows();
        // Then observe for subsequent re-renders (ajax loads, rate recalcs, etc.)
        observeShippingTable();
      });
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

      // 2) Also hide any existing nodes immediately (in case CSS arrives a tick later)
      document
        .querySelectorAll<HTMLElement>("#productImageCol .buttonContainer")
        .forEach((el) => (el.style.display = "none"));
    }
    // --- End Add to Cart hide ---

    // === Existing image swap logic for Add to Cart ===
    if (isAddToCartPage()) {
      const img = document.getElementById(
        "productImage",
      ) as HTMLImageElement | null;
      const artID = (window as any).p?.artID;

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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
    $("#continueTbl .smallbody")
      .eq(1)
      .html(
        `<span class="red">*</span> Delivery time listed includes 1 to 2 days to process order plus shipping.
      Please note we do not process orders on weekends or holidays.`,
      );

    monitorResidentialToastAndBlockPage();
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    persistDiscountedTotals();
  }

  if (
    GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT ||
    window.location.pathname.includes("/checkout/4-payment.php")
  ) {
    // (No-op; reserved for future payment-page logic)
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
// Call the updated function with a placeholder email to be replaced dynamically

ChangeInventoryCountNoticeNEW(
  "Inventory not available for the desired order quantity. Please contact your account manager at 225-751-7297, or by email at dokshopbr@poweredbyprisma.com",
  "dokshopbr@poweredbyprisma.com", // Placeholder email to be replaced dynamically
);
