// login-support.js
function changeLoginSupportText(newText, newPhone, newEmail) {
  const supportSection = document.querySelector("login_support");

  supportSection.innerHTML = `
      <hr>
      <p>${newText}</p>
      <p>Phone: ${newPhone}</p>
      <p>Email: <a href="mailto:${newEmail}">${newEmail}</a></p>
  `;
}

// Example of changing the text dynamically
window.onload = function () {
  changeLoginSupportText(
    "If you're facing issues logging in, please reach out to our support team.",
    "225-751-1234",
    "support@newdomain.com"
  );
};
