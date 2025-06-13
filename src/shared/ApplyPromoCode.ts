export function applyPromoCode(): void {
  window.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    if (!promoInput) return;

    // Use the closest box instead of section
    const promoContainer =
      promoInput.parentElement || promoInput.closest("div") || document.body;

    // Ensure buttons exist
    let applyBtn = document.getElementById(
      "applyPromoCodeBtn"
    ) as HTMLButtonElement | null;
    let clearBtn = document.getElementById(
      "clearPromoCodeBtn"
    ) as HTMLButtonElement | null;

    if (!applyBtn || !clearBtn) {
      const buttonWrapper = document.createElement("div");
      buttonWrapper.style.marginTop = "8px";
      buttonWrapper.style.display = "flex";
      buttonWrapper.style.gap = "8px";
      buttonWrapper.style.justifyContent = "center";

      applyBtn = document.createElement("button");
      applyBtn.id = "applyPromoCodeBtn";
      applyBtn.type = "button";
      applyBtn.textContent = "Apply Promo Code";

      clearBtn = document.createElement("button");
      clearBtn.id = "clearPromoCodeBtn";
      clearBtn.type = "button";
      clearBtn.textContent = "Clear";

      buttonWrapper.appendChild(applyBtn);
      buttonWrapper.appendChild(clearBtn);

      promoContainer.appendChild(buttonWrapper);
    }

    // Add listeners
    applyBtn?.addEventListener("click", () => {
      const code = promoInput.value.trim();
      if (!code) return;

      const discountAmount = 7.43; // Replace this with your logic
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
      if (!subPrice.dataset.original)
        subPrice.dataset.original = originalSubtotal.toFixed(2);

      const newSubtotal = +(originalSubtotal - discountAmount).toFixed(2);
      const taxRate = 0.105;
      const newTax = +(newSubtotal * taxRate).toFixed(2);
      const newTotal = +(newSubtotal + newTax).toFixed(2);

      subPrice.textContent = newSubtotal.toFixed(2);
      taxPrice.textContent = newTax.toFixed(2);
      grandPrice.textContent = newTotal.toFixed(2);

      localStorage.setItem("discountedSubtotal", newSubtotal.toFixed(2));
      localStorage.setItem("discountedTax", newTax.toFixed(2));
      localStorage.setItem("discountedTotal", newTotal.toFixed(2));
      localStorage.setItem("promoDiscount", discountAmount.toFixed(2));
      localStorage.setItem("promoCode", code);

      const lineItemsTable = document.querySelector(
        "#lineItems table"
      ) as HTMLTableElement | null;
      if (lineItemsTable && !document.getElementById("discountRow")) {
        const row = lineItemsTable.insertRow(3);
        row.id = "discountRow";

        const cell1 = row.insertCell(0);
        cell1.textContent = "Promo Discount:";

        const cell2 = row.insertCell(1);
        cell2.innerHTML = `$<span id="promoDiscount">-${discountAmount.toFixed(
          2
        )}</span>`;
        cell2.style.textAlign = "right";
      }
    });

    clearBtn?.addEventListener("click", () => {
      localStorage.removeItem("discountedSubtotal");
      localStorage.removeItem("discountedTax");
      localStorage.removeItem("discountedTotal");
      localStorage.removeItem("promoDiscount");
      localStorage.removeItem("promoCode");

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

      const row = document.getElementById("discountRow");
      if (row) row.remove();
    });
  });
}
