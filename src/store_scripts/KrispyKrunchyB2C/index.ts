// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from "../../enums/StorefrontPage.enum";
import { GLOBALVARS } from "../../index";

let hasInitialized = false;

export function main() {
  if (hasInitialized) {
    console.warn("main() already initialized; skipping duplicate run.");
    return;
  }
  hasInitialized = true;

  console.log(GLOBALVARS.currentPage);

  document.title = "Krispy Krunchy Online Store";

  if (!$(".ship-message").length) {
    const shipMsg = `<p class="ship-message">More Items Coming Soon!</p>`;
    $(shipMsg).insertBefore(".tableMain");
  }

  // Change "Shipping & Handling" to "Shipping" in the order summary
  $("#taxRushShipGrand table tbody tr td").eq(7).text("Shipping");

  // Remove option to use default customer billing address
  $("#billAdrOnFileBox").remove();

  // Remove the Edit Profile Form
  $("#editProfileTbl tbody").eq(1).remove();

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    // Hide add to cart button when editing an item that was already added to the cart
    if ($("#returnToCartButton").css("display") === "block") {
      $("#addToCartButton").remove();
    }

    // Hide the qtyAvailable row when adding an item to cart
    $(".tablesorter tr").each(function (index, element) {
      if ($(element).find("th").text() === "Qty Available:") {
        $(element).hide();
      }
    });

    // Hide the Address Book box from the Add to Cart Page
    $("#orchAdrBookBox").hide();

    // Hide the Company ship to select box
    $("#companyShipToBox").hide();

    // Move the "complete order" section to the top of the shipment box
    const completeOrder = $("#completeOrder").closest("tr");
    const shipBox = completeOrder.closest(".ui-box").find("thead tr.header");
    shipBox.after(completeOrder);

    // Hide the employee select dropdown
    $("#custom_EmployeeID").closest("tr").hide();

    // Show the message and button to add a new employee
    const addEmployee = $("#addEmployee");
    const employeeHelp = $("#employeeHelp");
    if (addEmployee.length && employeeHelp.length) {
      addEmployee.show();
      employeeHelp.show();

      const $newEmpButton = $("#addEmployeeButton");
      if ($newEmpButton.length) {
        $newEmpButton.addClass("btn btn-primary");
      }
    }

    // Hide the combo menu option for employees
    $("#custom_MenuList").closest("tr").hide();

    // Hide the custom menu list section
    $("#custom_MenuListSection").hide();
  }

  //
  // ───────────── Checkout pages shipping message tweaks ─────────────
  //
  if (
    GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS ||
    GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW ||
    GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION
  ) {
    const replaceInnerHtml = (
      selector: string,
      search: string | RegExp,
      replace: string
    ) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el || !el.innerHTML) return;
      el.innerHTML = el.innerHTML.replace(search, replace);
    };

    // Edit the shipping message of the checkout page
    replaceInnerHtml(
      "div#mainContentSF .pw-order-shipment-box strong",
      /Shipping from [^<]*/,
      "Orders ship within 7 business days. Please allow additional time for transit."
    );

    // Edit the shipping message of the checkout page
    replaceInnerHtml(
      "div#mainContentSF .pw-order-shipment-box",
      /Orders typically ship in [^<]*/,
      "Orders typically ship within 7 business days. Please allow additional time for transit."
    );

    // Hide the customer ship to selector text
    replaceInnerHtml(
      "div#pf-shipment-box #shipmentShipto",
      /Use company ship to/g,
      ""
    );
  }

  //
  // ───────────── Add-to-Cart: FINISHED SIZE row under Quantity ─────────────
  //
  let _renderTimer: number | null = null;
  let _idleTimer: number | null = null;
  let _observer: MutationObserver | null = null;
  let _renders = 0;

  const extractSize = (root: ParentNode): { w: string; h: string } | null => {
    try {
      const memoTable = root.querySelector("table.memo");
      if (!memoTable) return null;

      const rows = Array.from(memoTable.querySelectorAll("tr"));
      const finishedRow = rows.find((tr) => {
        const th = tr.querySelector("th, td");
        return th && /finished size/i.test(th.textContent || "");
      });
      if (!finishedRow) return null;

      const valueCell = finishedRow.querySelector("td:last-child");
      if (!valueCell) return null;

      const raw = (valueCell.textContent || "").trim();
      if (!raw) return null;

      const cleaned = raw.replace(/\s+/g, " ");
      const match = cleaned.match(
        /(\d+(?:\.\d+)?)\s*(?:["in]|in\.?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:["in]|in\.?)?/i
      );
      if (!match) return null;

      return { w: match[1], h: match[2] };
    } catch (e) {
      console.warn("[msf] extractSize error:", e);
      return null;
    }
  };

  const isPrinted = (root: ParentNode): boolean => {
    try {
      const txt =
        (
          root.querySelector(
            "#breadcrumb .templateName a"
          ) as HTMLAnchorElement | null
        )?.getAttribute("title") ||
        (
          root.querySelector(
            "#breadcrumb .templateName a"
          ) as HTMLAnchorElement | null
        )?.textContent ||
        (root.querySelector("#productCode") as HTMLInputElement | null)
          ?.value ||
        "";
      return /^\s*printed\b/i.test(txt || "");
    } catch (e) {
      console.warn("[msf] isPrinted error:", e);
      return false;
    }
  };

  const renderFinishedSizeUnderQty = (
    root: Document | HTMLElement = document
  ): boolean => {
    try {
      const qtyRow = root.querySelector("#quantityRow");
      if (!qtyRow) return false;

      // clear any prior row
      const old = root.querySelector("#finishedSizeRow");
      if (old) old.remove();

      if (!isPrinted(root)) return false;

      const size = extractSize(root);
      if (!size) return false;

      // Use plain inches on add-to-cart (matches your previous sites)
      const label = `${size.w}"w × ${size.h}"h`;

      const tr = document.createElement("tr");
      tr.id = "finishedSizeRow";

      const tdLabel = document.createElement("td");
      tdLabel.setAttribute("align", "right");
      tdLabel.setAttribute("nowrap", "nowrap");
      tdLabel.innerHTML = "<strong>FINISHED SIZE:</strong>";

      const tdValue = document.createElement("td");
      tdValue.setAttribute("align", "left");
      tdValue.textContent = label;

      tr.append(tdLabel, tdValue);
      qtyRow.parentElement?.insertBefore(tr, qtyRow.nextSibling);

      return true;
    } catch (e) {
      console.warn("[msf] renderFinishedSizeUnderQty error:", e);
      return false;
    }
  };

  const scheduleRender = (root: Document | HTMLElement = document) => {
    if (_renderTimer !== null) {
      window.clearTimeout(_renderTimer);
    }
    _renderTimer = window.setTimeout(() => {
      const ok = renderFinishedSizeUnderQty(root);
      if (ok) {
        _renders++;
        if (_renders > 20 && _observer) {
          _observer.disconnect();
          _observer = null;
        }
      }
    }, 30);
  };

  const watchFinishedSize = () => {
    try {
      const root =
        (document.getElementById("editForm") as HTMLElement | null) ||
        document.body;
      if (!root) return;
      scheduleRender(root);
      _observer = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.addedNodes && m.addedNodes.length) {
            scheduleRender(root);
            return;
          }
        }
      });
      _observer.observe(root, { childList: true, subtree: true });
    } catch (e) {
      console.warn("[msf] watchFinishedSize error:", e);
    }
  };

  //
  // ───────────── Cart page: FINISHED SIZE under MEMO ("48\"w × 96\"h") ─────────────
  //
  const cartLooksPrinted = (scope: ParentNode): boolean => {
    const memoLabel = scope.querySelector<HTMLElement>(
      ".pw-cart-memo-label, .memo-label"
    );
    if (!memoLabel) return false;
    return /memo/i.test(memoLabel.textContent || "");
  };

  const injectFinishedSizeIntoCartItem = (itemBox: HTMLElement) => {
    const memoTable = itemBox.querySelector<HTMLTableElement>("table.memo");
    if (!memoTable) return;

    const memoInput = itemBox.querySelector(
      'input[name^="memo"]'
    ) as HTMLInputElement | null;
    const itemId = memoInput?.name?.replace("memo", "") || "";
    const rowId = `finishedSizeRow-${itemId || "unknown"}`;

    const old = itemBox.querySelector(`#${rowId}`);
    if (old) old.remove();

    if (!cartLooksPrinted(itemBox)) return;

    const sz = extractSize(itemBox);
    if (!sz) return;

    const label = `${sz.w}"w × ${sz.h}"h`;

    const tr = document.createElement("tr");
    tr.id = rowId;

    const tdLabel = document.createElement("td");
    tdLabel.setAttribute("align", "right");
    tdLabel.setAttribute("nowrap", "nowrap");
    tdLabel.innerHTML = "<strong>FINISHED SIZE:</strong>";

    const tdValue = document.createElement("td");
    tdValue.setAttribute("align", "left");
    tdValue.textContent = label;

    memoTable.appendChild(tr);
    tr.append(tdLabel, tdValue);
  };

  const injectFinishedSizeIntoCart = () => {
    const cartTable = document.querySelector<HTMLElement>("#cartItemsTbl");
    if (!cartTable) return;

    const itemBoxes =
      cartTable.querySelectorAll<HTMLElement>(".pw-cart-item-box");
    if (!itemBoxes.length) return;

    itemBoxes.forEach((box) => injectFinishedSizeIntoCartItem(box));
  };

  const isAddToCartPage = () => {
    const page = GLOBALVARS?.currentPage?.trim().toLowerCase() || "";
    return (
      page.includes("add to cart") ||
      window.location.pathname.includes("/cart/3-edit.php")
    );
  };

  const init = () => {
    if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
      watchFinishedSize();
    }

    if (GLOBALVARS.currentPage === StorefrontPage.CART) {
      injectFinishedSizeIntoCart();
      setTimeout(injectFinishedSizeIntoCart, 500);
      setTimeout(injectFinishedSizeIntoCart, 1500);
      setTimeout(injectFinishedSizeIntoCart, 3500);
    }

    // Add-to-cart page image swap
    if (isAddToCartPage()) {
      const img = document.getElementById(
        "productImage"
      ) as HTMLImageElement | null;
      const artID = (window as any).p?.artID;

      if (img && artID) {
        const origin = window.location.origin;
        const desiredURL = `${origin}/catalog/gen/pdf_art_image.php?artID=${artID}&nocache=${Date.now()}`;

        const apply = () => {
          try {
            if (img.src.startsWith(`${origin}/.cache`)) {
              img.src = desiredURL;
            }
          } catch {
            /* ignore */
          }
        };

        apply();
        const interval = setInterval(apply, 300);
        setTimeout(() => clearInterval(interval), 10000);
      }

      watchFinishedSize();
    }
  };

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

        if (!rawText) return;
        if (rawText === "HOME") return;

        const iconClass = iconMap[rawText];
        if (iconClass) {
          const countMatch = link.innerHTML.match(
            /<span class="badge">.*?<\/span>/
          )?.[0];

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
