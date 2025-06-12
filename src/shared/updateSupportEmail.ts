export function updateSupportEmail(newEmail: string): void {
  const emailLink = document.querySelector(
    'a[href^="mailto:artdepartment@poweredbyprisma.com"]'
  ) as HTMLAnchorElement;
  if (emailLink) {
    emailLink.href = `mailto:${newEmail}`;
    emailLink.textContent = newEmail;
  } else {
    console.warn("Email link not found.");
  }
}
