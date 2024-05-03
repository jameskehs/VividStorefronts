import { StorefrontPage } from '../enums/StorefrontPage.enum';
import { globalState } from '../index';
import { Kit } from '../types/Kit';

export function runKitWorkflow(kits: Kit[]) {
  // If there is no active kit in local storage, return. Otherwise, continue the kit workflow.
  const kitFromLocalStorage = localStorage.getItem('activeKit');
  if (kitFromLocalStorage === null) return;
  const activeKit: Kit & { index: number } = JSON.parse(kitFromLocalStorage);
  continueKitWorkflow();

  // Kit descriptions will have a span with the class jk_kit. We extract the text in this span and use it to set a click event on the parent product cell. Text inside span should match the name of a kit in the kits array.
  $('.jk_kit').each((index, span) => {
    const jquerySpan = $(span);
    const kitName = jquerySpan.text();
    const sanitizedKitName = kitName.replace(/\s+/g, '');
    const productCell = $(jquerySpan.parents('.prodCell')[0]);
    productCell.append(
      `<div id=${sanitizedKitName} style="height:100%;width:100%;background-color:transparent;position: absolute;z-index: 999"></div>`
    );
    $(`#${sanitizedKitName}`).on('click', () => {
      startKitWorkflow(kitName);
    });
  });

  // Search for the kit that was selected, put it in localstorage with an index of 0. Navigate to the first item in the kit.
  function startKitWorkflow(kitName: string) {
    const kit = kits.find((kit) => kit.name === kitName);
    if (kit === undefined) return;
    localStorage.setItem('activeKit', JSON.stringify({ ...kit, index: 0 }));
    window.location.href = `/catalog/2-customize.php?&designID=${kit.items[0].designID}&contentID=${kit.items[0].contentID}`;
  }

  function continueKitWorkflow() {
    // Redirect the user if they try to redirect while in the middle of a kit
    if (
      globalState.currentPage === null ||
      ![StorefrontPage.CUSTOMIZETEMPLATE, StorefrontPage.ADDTOCART, StorefrontPage.CART].includes(globalState.currentPage)
    ) {
      window.location.href = `/catalog/2-customize.php?&designID=${activeKit.items[0].designID}&contentID=${activeKit.items[0].contentID}`;
    }

    // Hide the navigation and breadcrumbs to discourage navigating away from the kit
    $('#navWrapper, .crumbs').css('display', 'none');

    // Append informational elements about the kit
    if (globalState.currentPage === StorefrontPage.CUSTOMIZETEMPLATE || globalState.currentPage === StorefrontPage.ADDTOCART) {
      $('.tableMain').prepend(
        `<h3 class="kit_header">You are currently building the ${activeKit.name}. You are on item ${activeKit.index + 1} of ${
          activeKit.items.length
        }</h3>` +
          `<div class="kit_item_status">` +
          activeKit.items
            .map((item, index) => {
              return `<p>
              ${
                index > activeKit.index
                  ? `<object type="image/svg+xml" data="${globalState.baseURL}/src/assets/X.svg" width="24" height="24"></object>`
                  : index === activeKit.index
                  ? `<object type="image/svg+xml" data="${globalState.baseURL}/src/assets/Clock.svg" width="24" height="24"></object>`
                  : `<object type="image/svg+xml" data="${globalState.baseURL}/src/assets/Check.svg" width="24" height="24"></object>`
              }
              ${item.name}</p>`;
            })
            .join('') +
          `</div>`
      );
    }

    // When the user is on the cart page, check if the kit is complete. If it is, show a message and remove the active kit from local storage. If it is not, navigate to the next item in the kit.
    if (globalState.currentPage === StorefrontPage.CART) {
      if (activeKit.index === activeKit.items.length - 1) {
        $('.tableMain').prepend(`<h3 class="kit_header"> 🎉 ${activeKit.name} complete! You may continue to shop or checkout.</h3>`);
        localStorage.removeItem('activeKit');
        $('#navWrapper, .crumbs').css('display', 'initial');
        return;
      } else {
        $('.tableMain').css('display', 'none');
        const nextIndex = activeKit.index + 1;
        localStorage.setItem('activeKit', JSON.stringify({ ...activeKit, index: nextIndex }));
        window.location.href = `/catalog/2-customize.php?&designID=${activeKit.items[nextIndex].designID}&contentID=${activeKit.items[nextIndex].contentID}`;
      }
    }

    // On the add to cart page, show the recommended quantity for the current item in the kit
    if (globalState.currentPage === StorefrontPage.ADDTOCART) {
      $('#quantityCol').append(`<span>${activeKit.name} recommends quantity of ${activeKit.items[activeKit.index].recommendedQty}</span>`);
    }
  }
}
