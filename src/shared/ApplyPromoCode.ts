export function applyPromoCode() {
  document.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const subPriceSpan = document.getElementById(
      "subPrice"
    ) as HTMLElement | null;
    const grandPriceSpan = document.getElementById(
      "grandPrice"
    ) as HTMLElement | null;

    if (!promoInput || !subPriceSpan || !grandPriceSpan) {
      console.warn("Promo code elements not found");
      return;
    }

    function parseCurrency(value: string): number {
      return parseFloat(value.replace(/[^0-9.-]+/g, ""));
    }

    function formatCurrency(value: number): string {
      return value.toFixed(2);
    }

    function applyDiscount(): void {
      const promoCode = promoInput!.value.trim().toUpperCase();
      const validCodes: Record<string, number> = {
        SAVE10: 10,
        SAVE20: 20,
        SAVE30: 30,
      };

      const discountPercent = validCodes[promoCode] ?? 0;
      const originalSubtotal = parseCurrency(subPriceSpan!.textContent ?? "0");

      const discountedSubtotal = originalSubtotal * (1 - discountPercent / 100);
      subPriceSpan!.textContent = formatCurrency(discountedSubtotal);

      const tax = parseCurrency(
        document.getElementById("taxPrice")?.textContent ?? "0"
      );
      const shipping = parseCurrency(
        document.getElementById("shipPrice")?.textContent ?? "0"
      );
      const rush = parseCurrency(
        document.getElementById("rushPrice")?.textContent ?? "0"
      );
      const specialFee = parseCurrency(
        document.getElementById("specialFeeAmount")?.textContent ?? "0"
      );

      const grandTotal =
        discountedSubtotal + tax + shipping + rush + specialFee;
      grandPriceSpan!.textContent = formatCurrency(grandTotal);
    }

    promoInput.addEventListener("blur", applyDiscount);
  });
}
