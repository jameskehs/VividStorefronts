export function restructureCartLayout(): void {
  const productRow = document.getElementById("productRow");
  const quantityRow = document.getElementById("quantityRow");
  const paperRow = document.getElementById("paperRow");
  const imageRow = document.getElementById("productImageRow");

  if (!productRow || !quantityRow || !paperRow || !imageRow) {
    console.warn("Cart layout rows not found");
    return;
  }

  const imageCol = document.getElementById("productImageCol");
  if (!imageCol) {
    console.warn("Product image column not found");
    return;
  }

  // Create a container to hold all fields stacked
  const fieldsContainer = document.createElement("div");
  fieldsContainer.className = "cart-fields-stack";

  // Add the content from the existing rows
  const productContent = productRow.querySelector("td:nth-child(2)");
  const quantityContent = quantityRow.querySelector("td:nth-child(2)");
  const paperContent = paperRow.querySelector("td:nth-child(2)");

  if (productContent)
    fieldsContainer.appendChild(productContent.cloneNode(true));
  if (quantityContent)
    fieldsContainer.appendChild(quantityContent.cloneNode(true));
  if (paperContent) fieldsContainer.appendChild(paperContent.cloneNode(true));

  // Insert our new stacked fields at the top of the right-side image cell
  imageCol.insertBefore(fieldsContainer, imageCol.firstChild);

  // Remove the old rows
  productRow.remove();
  quantityRow.remove();
  paperRow.remove();
}
