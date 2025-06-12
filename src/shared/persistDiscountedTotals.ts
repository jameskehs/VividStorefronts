export function persistDiscountedTotals(): void {
  const subPriceSpan = document.getElementById(
    "subPrice"
  ) as HTMLSpanElement | null;
  const grandPriceSpan = document.getElementById(
    "grandPrice"
  ) as HTMLSpanElement | null;

  const storedSubtotal = localStorage.getItem("discountedSubtotal");
  const storedTotal = localStorage.getItem("discountedTotal");

  if (subPriceSpan && storedSubtotal) {
    subPriceSpan.textContent = storedSubtotal;
  }
  if (grandPriceSpan && storedTotal) {
    grandPriceSpan.textContent = storedTotal;
  }
}
