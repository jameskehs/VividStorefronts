declare global {
  interface Window {
    $: JQueryStatic;
    setAction?: (action: string) => void;
  }
}

export function enableStakePopup(): void {
  const $ = window.$;
  let allItems: string[] = [];

  $("#shoppingCartTbl .dtContent table td:nth-of-type(2)").each((_i, el) => {
    const text = (el as HTMLElement).innerText.trim();
    if (text) allItems.push(text);
  });

  if (
    allItems.length === 0 ||
    allItems.some((item) => item.toLowerCase().includes("sign stake"))
  ) {
    return;
  }

  if ($("#stake-overlay").length === 0) {
    $("body").append(`<div id="stake-overlay"></div>`);
  }
}

// Popup HTML binding (delegated)
$(document).on("click", "#stake-overlay", (e) => {
  e.preventDefault();
  e.stopPropagation();

  if ($("#stake-background").length > 0) return;

  $("body").append(`
    <div id="stake-background">
      <div id="stake-box">
        <button id="stake-exit" type="button">X</button>
        <p>Did you order stakes?</p>
        <a href="/catalog/2-customize.php?&designID=8454&contentID=40142">View Stakes</a>
      </div>
    </div>
  `);
});

$(document).on("click", "#stake-exit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  $("#stake-background").remove();
  $("#stake-overlay").remove();

  try {
    if (typeof window.setAction === "function") {
      window.setAction("process");
    }
  } catch (err) {
    console.warn("setAction failed:", err);
  }
});
