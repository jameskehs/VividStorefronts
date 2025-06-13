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

      const discountMap: Record<string, number> = {
        SAVE10: 0.1,
        SAVE20: 0.2,
        SAVE30: 0.3,
      };

      applyBtn.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        const discountRate = discountMap[code];

        if (!discountRate) {
          alert("Invalid promo code.");
          return;
        }

        const subPrice = document.getElementById("subPrice");
        const taxPrice = document.getElementById("taxPrice");
        const grandPrice = document.getElementById("grandPrice");

        if (!subPrice || !taxPrice || !grandPrice) return;

        const originalSubtotal = parseFloat(
          subPrice.dataset.original ||
            subPrice.textContent?.replace("$", "") ||
            "0"
        );
        subPrice.dataset.original ||= originalSubtotal.toFixed(2);

        const newSubtotal = +(originalSubtotal * (1 - discountRate)).toFixed(2);
        const taxRate = 0.105;
        const newTax = +(newSubtotal * taxRate).toFixed(2);
        const newTotal = +(newSubtotal + newTax).toFixed(2);
        const discountAmount = +(originalSubtotal - newSubtotal).toFixed(2);

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
        } else {
          const promoSpan = document.getElementById("promoDiscount");
          if (promoSpan) {
            promoSpan.textContent = `-${discountAmount.toFixed(2)}`;
          }
        }
      });

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
