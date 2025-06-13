export function applyPromoCode(): void {
  const INTERVAL = 100; // ms
  const TIMEOUT = 5000; // ms

  let elapsed = 0;
  const waitForElements = setInterval(() => {
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const subPriceSpan = document.getElementById(
      "subPrice"
    ) as HTMLSpanElement | null;
    const taxPriceSpan = document.getElementById(
      "taxPrice"
    ) as HTMLSpanElement | null;
    const grandPriceSpan = document.getElementById(
      "grandPrice"
    ) as HTMLSpanElement | null;
    const rushPriceSpan = document.getElementById(
      "rushPrice"
    ) as HTMLSpanElement | null;
    const shipPriceSpan = document.getElementById(
      "shipPrice"
    ) as HTMLSpanElement | null;

    if (
      promoInput &&
      subPriceSpan &&
      taxPriceSpan &&
      grandPriceSpan &&
      rushPriceSpan &&
      shipPriceSpan
    ) {
      clearInterval(waitForElements);
      initializePromoCode(
        promoInput,
        subPriceSpan,
        taxPriceSpan,
        grandPriceSpan,
        rushPriceSpan,
        shipPriceSpan
      );
    }

    elapsed += INTERVAL;
    if (elapsed >= TIMEOUT) {
      clearInterval(waitForElements);
      console.warn("Promo code setup failed: timeout waiting for elements.");
    }
  }, INTERVAL);
}

function initializePromoCode(
  promoInput: HTMLInputElement,
  subPriceSpan: HTMLSpanElement,
  taxPriceSpan: HTMLSpanElement,
  grandPriceSpan: HTMLSpanElement,
  rushPriceSpan: HTMLSpanElement,
  shipPriceSpan: HTMLSpanElement
): void {
  const parentSection = promoInput.closest("section");
  if (!parentSection || document.getElementById("applyPromoCodeBtn")) return;

  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginTop = "8px";
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "8px";
  buttonContainer.style.justifyContent = "center";

  const applyButton = document.createElement("button");
  applyButton.innerText = "Apply Promo Code";
  applyButton.type = "button";
  applyButton.id = "applyPromoCodeBtn";

  const clearButton = document.createElement("button");
  clearButton.innerText = "Clear";
  clearButton.type = "button";
  clearButton.id = "clearPromoCodeBtn";

  buttonContainer.appendChild(applyButton);
  buttonContainer.appendChild(clearButton);
  parentSection.appendChild(buttonContainer);

  const form = promoInput.form;
  if (!form) return;

  const promoHidden = ensureHiddenInput(form, "appliedPromoCode");
  const discountTotalInput = ensureHiddenInput(form, "discountedTotal");

  // Create promo discount row if not present
  let discountRow = document.getElementById("discountRow");
  if (!discountRow) {
    const lineItemsTable = document.querySelector("#lineItems table");
    if (lineItemsTable) {
      discountRow = document.createElement("tr");
      discountRow.id = "discountRow";
      discountRow.innerHTML = `
        <td align="left" nowrap="">Promo Discount:</td>
        <td align="right" nowrap="">$<span id="promoDiscount">-0.00</span></td>
      `;
      const rows = lineItemsTable.querySelectorAll("tr");
      lineItemsTable.insertBefore(discountRow, rows[2] || null);
    }
  }

  const promoDiscountSpan = document.getElementById(
    "promoDiscount"
  ) as HTMLSpanElement | null;

  // Apply promo code logic
  applyButton.addEventListener("click", () => {
    const code = promoInput.value.trim().toUpperCase();
    const validCodes: Record<string, number> = {
      SAVE10: 0.1,
      SAVE20: 0.2,
      WELCOME5: 0.05,
    };

    const discount = validCodes[code];
    if (!discount) {
      alert("Invalid promo code.");
      promoHidden.value = "";
      discountTotalInput.value = "";
      localStorage.clear();
      return;
    }

    const originalSubtotal = parseFloat(
      subPriceSpan.dataset.original || subPriceSpan.textContent || "0"
    );
    if (!subPriceSpan.dataset.original)
      subPriceSpan.dataset.original = originalSubtotal.toString();

    const discountedSubtotal = +(originalSubtotal * (1 - discount)).toFixed(2);
    const originalTax = parseFloat(
      taxPriceSpan.dataset.original || taxPriceSpan.textContent || "0"
    );
    if (!taxPriceSpan.dataset.original)
      taxPriceSpan.dataset.original = originalTax.toString();

    const taxRate = originalSubtotal === 0 ? 0 : originalTax / originalSubtotal;
    const newTax = +(discountedSubtotal * taxRate).toFixed(2);

    const rush = parseFloat(rushPriceSpan.textContent || "0");
    const ship = parseFloat(shipPriceSpan.textContent || "0");
    const newTotal = +(discountedSubtotal + newTax + rush + ship).toFixed(2);
    const discountAmount = +(originalSubtotal - discountedSubtotal).toFixed(2);

    subPriceSpan.textContent = discountedSubtotal.toFixed(2);
    taxPriceSpan.textContent = newTax.toFixed(2);
    grandPriceSpan.textContent = newTotal.toFixed(2);
    if (promoDiscountSpan)
      promoDiscountSpan.textContent = `-${discountAmount.toFixed(2)}`;

    promoHidden.value = code;
    discountTotalInput.value = newTotal.toFixed(2);

    localStorage.setItem("discountedSubtotal", discountedSubtotal.toFixed(2));
    localStorage.setItem("discountedTotal", newTotal.toFixed(2));
    localStorage.setItem("discountedTax", newTax.toFixed(2));
    localStorage.setItem("appliedPromoCode", code);
    localStorage.setItem("promoDiscount", discountAmount.toFixed(2));

    console.log("Promo applied:", code, "New Total:", newTotal);
  });

  // Clear button logic
  clearButton.addEventListener("click", () => {
    promoInput.value = "";
    promoHidden.value = "";
    discountTotalInput.value = "";

    const originalSubtotal = parseFloat(
      subPriceSpan.dataset.original || subPriceSpan.textContent || "0"
    );
    const originalTax = parseFloat(
      taxPriceSpan.dataset.original || taxPriceSpan.textContent || "0"
    );

    subPriceSpan.textContent = originalSubtotal.toFixed(2);
    taxPriceSpan.textContent = originalTax.toFixed(2);

    const rush = parseFloat(rushPriceSpan.textContent || "0");
    const ship = parseFloat(shipPriceSpan.textContent || "0");
    const newTotal = +(originalSubtotal + originalTax + rush + ship).toFixed(2);
    grandPriceSpan.textContent = newTotal.toFixed(2);

    if (promoDiscountSpan) promoDiscountSpan.textContent = `-0.00`;

    localStorage.removeItem("appliedPromoCode");
    localStorage.removeItem("discountedSubtotal");
    localStorage.removeItem("discountedTotal");
    localStorage.removeItem("discountedTax");
    localStorage.removeItem("promoDiscount");

    console.log("Promo cleared.");
  });

  // Auto-reapply saved code
  const savedCode = localStorage.getItem("appliedPromoCode");
  if (savedCode && promoInput.value !== savedCode) {
    promoInput.value = savedCode;
    applyButton.click();
  }
}

function ensureHiddenInput(
  form: HTMLFormElement,
  id: string
): HTMLInputElement {
  let input = document.getElementById(id) as HTMLInputElement;
  if (!input) {
    input = document.createElement("input");
    input.type = "hidden";
    input.name = id;
    input.id = id;
    form.appendChild(input);
  }
  return input;
}
