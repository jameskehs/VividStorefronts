export function requirePOAndQuoteName(): void {
  const interval = setInterval(() => {
    const customerPO = document.getElementById(
      "customerPO"
    ) as HTMLInputElement | null;
    const quoteName = document.getElementById(
      "quoteName"
    ) as HTMLInputElement | null;
    const continueButton = document.getElementById(
      "orderPayment"
    ) as HTMLButtonElement | null;

    if (customerPO && quoteName && continueButton) {
      clearInterval(interval);

      const validateFields = () => {
        const isPOFilled = customerPO.value.trim().length > 0;
        const isQuoteFilled = quoteName.value.trim().length > 0;
        const isValid = isPOFilled && isQuoteFilled;

        continueButton.disabled = !isValid;
        continueButton.style.opacity = isValid ? "1" : "0.5";
        continueButton.style.cursor = isValid ? "pointer" : "not-allowed";
      };

      // Listen for user input
      customerPO.addEventListener("input", validateFields);
      quoteName.addEventListener("input", validateFields);

      // Also check on blur just in case
      customerPO.addEventListener("blur", validateFields);
      quoteName.addEventListener("blur", validateFields);

      // Initial validation
      validateFields();
    }
  }, 250);
}
