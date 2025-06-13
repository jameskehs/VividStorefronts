export function applyPromoCode(): void {
  window.addEventListener("load", () => {
    const custPOBox = document.getElementById("custPOBox");
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;

    if (!custPOBox || !promoInput) {
      console.warn("Missing #custPOBox or #customerPO");
      return;
    }

    const section = custPOBox.querySelector("section");
    if (!section) {
      console.warn("Could not find <section> inside #custPOBox");
      return;
    }

    // Prevent duplicate buttons
    if (
      !document.getElementById("applyPromoCodeBtn") &&
      !document.getElementById("clearPromoCodeBtn")
    ) {
      const buttonWrapper = document.createElement("div");
      buttonWrapper.style.marginTop = "8px";
      buttonWrapper.style.display = "flex";
      buttonWrapper.style.justifyContent = "center";
      buttonWrapper.style.gap = "8px";

      const applyBtn = document.createElement("button");
      applyBtn.type = "button";
      applyBtn.id = "applyPromoCodeBtn";
      applyBtn.textContent = "Apply Promo Code";

      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.id = "clearPromoCodeBtn";
      clearBtn.textContent = "Clear";

      buttonWrapper.appendChild(applyBtn);
      buttonWrapper.appendChild(clearBtn);
      section.appendChild(buttonWrapper);

      // ✅ Wire up apply button
      applyBtn.addEventListener("click", () => {
        const code = promoInput.value.trim();
        if (!code) return;

        const discountAmount = 7.43;
        const subPrice = document.getElementById("subPrice");
        const taxPrice = document.getElementById("taxPrice");
        const grandPrice = document.getElementById("grandPrice");

        if (!subPrice || !taxPrice || !grandPrice) return;

        const originalSubtotal = parseFloat(
          subPrice.dataset.original ||
            subPrice.textContent?.replace("$", "") ||
            "0"
        );
        const newSubtotal = originalSubtotal - discountAmount;
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

        const table = document.querySelector(
          "#lineItems table"
        ) as HTMLTableElement | null;
        if (table && !document.getElementById("discountRow")) {
          const row = table.insertRow(3);
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

      // ✅ Wire up clear button
      clearBtn.addEventListener("click", () => {
        localStorage.removeItem("discountedSubtotal");
        localStorage.removeItem("discountedTax");
        localStorage.removeItem("discountedTotal");
        localStorage.removeItem("promoDiscount");
        localStorage.removeItem("promoCode");

        const row = document.getElementById("discountRow");
        if (row) row.remove();

        const subPrice = document.getElementById("subPrice");
        const taxPrice = document.getElementById("taxPrice");
        const grandPrice = document.getElementById("grandPrice");

        if (subPrice && subPrice.dataset.original)
          subPrice.textContent = subPrice.dataset.original;
        if (taxPrice && taxPrice.dataset.original)
          taxPrice.textContent = taxPrice.dataset.original;
        if (grandPrice && grandPrice.dataset.original)
          grandPrice.textContent = grandPrice.dataset.original;

        promoInput.value = "";
      });
    }
  });
}
