export function applyPromoCode(): void {
  document.addEventListener("DOMContentLoaded", () => {
    const applyBtn = document.getElementById(
      "applyPromoCodeBtn"
    ) as HTMLButtonElement | null;
    const clearBtn = document.getElementById(
      "clearPromoCodeBtn"
    ) as HTMLButtonElement | null;
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;

    if (!applyBtn || !clearBtn || !promoInput) return;

    const getElementValue = (id: string): number => {
      const el = document.getElementById(id) as HTMLElement | null;
      if (!el) return 0;
      const value = el.textContent?.replace("$", "").trim();
      return parseFloat(value || "0");
    };

    const formatCurrency = (amount: number): string => amount.toFixed(2);

    applyBtn.addEventListener("click", () => {
      const code = promoInput.value.trim();
      if (!code) return;

      const discountAmount = 7.43; // Replace with dynamic logic as needed
      const subPrice = document.getElementById(
        "subPrice"
      ) as HTMLElement | null;
      const taxPrice = document.getElementById(
        "taxPrice"
      ) as HTMLElement | null;
      const grandPrice = document.getElementById(
        "grandPrice"
      ) as HTMLElement | null;

      if (!subPrice || !taxPrice || !grandPrice) return;

      const originalSubtotal = parseFloat(
        subPrice.dataset.original ||
          subPrice.textContent?.replace("$", "") ||
          "0"
      );
      if (!subPrice.dataset.original) {
        subPrice.dataset.original = originalSubtotal.toFixed(2);
      }

      const newSubtotal = +(originalSubtotal - discountAmount).toFixed(2);
      const taxRate = 0.105;
      const newTax = +(newSubtotal * taxRate).toFixed(2);
      const newTotal = +(
        newSubtotal +
        newTax +
        getElementValue("rushPrice") +
        getElementValue("shipPrice")
      ).toFixed(2);

      // Update DOM
      subPrice.textContent = formatCurrency(newSubtotal);
      taxPrice.textContent = formatCurrency(newTax);
      grandPrice.textContent = formatCurrency(newTotal);

      // Store values
      localStorage.setItem("discountedSubtotal", newSubtotal.toFixed(2));
      localStorage.setItem("discountedTax", newTax.toFixed(2));
      localStorage.setItem("discountedTotal", newTotal.toFixed(2));
      localStorage.setItem("promoDiscount", discountAmount.toFixed(2));
      localStorage.setItem("promoCode", code);

      // Add discount row if it doesn't exist
      const lineItemsTable = document.querySelector(
        "#lineItems table"
      ) as HTMLTableElement | null;
      if (lineItemsTable && !document.getElementById("discountRow")) {
        const row = lineItemsTable.insertRow(3);
        row.id = "discountRow";

        const cell1 = row.insertCell(0);
        cell1.textContent = "Promo Discount:";

        const cell2 = row.insertCell(1);
        cell2.innerHTML = `$<span id="promoDiscount">-${formatCurrency(
          discountAmount
        )}</span>`;
        cell2.style.textAlign = "right";
      }
    });

    clearBtn.addEventListener("click", () => {
      // Clear stored promo data
      localStorage.removeItem("discountedSubtotal");
      localStorage.removeItem("discountedTax");
      localStorage.removeItem("discountedTotal");
      localStorage.removeItem("promoDiscount");
      localStorage.removeItem("promoCode");

      // Remove discount row if it exists
      const row = document.getElementById("discountRow");
      if (row) row.remove();

      const subPrice = document.getElementById(
        "subPrice"
      ) as HTMLElement | null;
      const taxPrice = document.getElementById(
        "taxPrice"
      ) as HTMLElement | null;
      const grandPrice = document.getElementById(
        "grandPrice"
      ) as HTMLElement | null;

      if (subPrice?.dataset.original)
        subPrice.textContent = subPrice.dataset.original;
      if (taxPrice?.dataset.original)
        taxPrice.textContent = taxPrice.dataset.original;
      if (grandPrice?.dataset.original)
        grandPrice.textContent = grandPrice.dataset.original;

      promoInput.value = "";
    });
  });
}
