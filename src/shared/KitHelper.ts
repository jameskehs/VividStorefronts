import { StorefrontPage } from '../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../index';
import { Kit } from '../types/Kit';

interface ActiveKit extends Kit {
  index: number;
}

// export function runKitWorkflow(kits: Kit[]) {
//   // On catalog page, kit descriptions will have a span with the class jk_kit. We extract the text in this span and use it to set a click event on the parent product cell. Text inside span should match the name of a kit in the kits array.
//   if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
//     $('.jk_kit').each((index, span) => {
//       const jquerySpan = $(span);
//       const kitName = jquerySpan.text();
//       const sanitizedKitName = kitName.replace(/\s+/g, '');
//       const productCell = $(jquerySpan.parents('.prodCell')[0]);
//       productCell.append(
//         `<div id=${sanitizedKitName} style="height:100%;width:100%;background-color:transparent;position: absolute;z-index: 999"></div>`
//       );
//       $(`#${sanitizedKitName}`).on('click', () => {
//         startKitWorkflow(kitName);
//       });
//     });
//   }

//   // Search for the kit that was selected, put it in localstorage with an index of 0. Navigate to the first item in the kit.
//   function startKitWorkflow(kitName: string) {
//     const kit = kits.find((kit) => kit.name === kitName);
//     if (kit === undefined) return;
//     localStorage.setItem('activeKit', JSON.stringify({ ...kit, index: 0 }));
//     window.location.href = `/catalog/2-customize.php?&designID=${kit.items[0].designID}&contentID=${kit.items[0].contentID}`;
//   }

//   function continueKitWorkflow(activeKit: ActiveKit) {
//     // Redirect the user if they navigate away from the kit workflow.
//     if (
//       GLOBALVARS.currentPage === null ||
//       ![StorefrontPage.CUSTOMIZETEMPLATE, StorefrontPage.ADDTOCART, StorefrontPage.CART].includes(GLOBALVARS.currentPage)
//     ) {
//       window.location.href = `/catalog/2-customize.php?&designID=${activeKit.items[0].designID}&contentID=${activeKit.items[0].contentID}`;
//     }

//     // Hide navigation and breadcrumbs to discourage user from navigating away from the kit
//     $('#navWrapper, .crumbs').css('display', 'none');

//     // Append informational elements about the kit
//     if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE || GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
//       $('.tableMain').prepend(
//         `<h3 class="kit_header">You are currently building the ${activeKit.name}. You are on item ${activeKit.index + 1} of ${
//           activeKit.items.length
//         }</h3>` +
//           `<div class="kit_item_status">` +
//           activeKit.items
//             .map((item, index) => {
//               return `<p>
//               ${
//                 index > activeKit.index
//                   ? `<object type="image/svg+xml" data="${GLOBALVARS.baseURL}/src/assets/X.svg" width="24" height="24"></object>`
//                   : index === activeKit.index
//                   ? `<object type="image/svg+xml" data="${GLOBALVARS.baseURL}/src/assets/Clock.svg" width="24" height="24"></object>`
//                   : `<object type="image/svg+xml" data="${GLOBALVARS.baseURL}/src/assets/Check.svg" width="24" height="24"></object>`
//               }
//               ${item.name}</p>`;
//             })
//             .join('') +
//           `</div>`
//       );
//     }

//     // When the user is on the cart page, check if the kit is complete. If it is, show a message and remove the active kit from local storage. If it is not, navigate to the next item in the kit.
//     if (GLOBALVARS.currentPage === StorefrontPage.CART) {
//       if (activeKit.index === activeKit.items.length - 1) {
//         $('.tableMain').prepend(`<h3 class="kit_header"> 🎉 ${activeKit.name} complete! You may continue to shop or checkout.</h3>`);
//         localStorage.removeItem('activeKit');
//         $('#navWrapper, .crumbs').css('display', 'initial');
//         return;
//       } else {
//         $('.tableMain').css('display', 'none');
//         const nextIndex = activeKit.index + 1;
//         localStorage.setItem('activeKit', JSON.stringify({ ...activeKit, index: nextIndex }));
//         window.location.href = `/catalog/2-customize.php?&designID=${activeKit.items[nextIndex].designID}&contentID=${activeKit.items[nextIndex].contentID}`;
//       }
//     }

//     // On the add to cart page, show the recommended quantity for the current item in the kit
//     if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
//       $('#quantityCol').append(`<span>${activeKit.name} recommends quantity of ${activeKit.items[activeKit.index].recommendedQty}</span>`);
//     }
//   }

//   // If there is no active kit in local storage, return. Otherwise, continue the kit workflow.
//   const kitFromLocalStorage = localStorage.getItem('activeKit');
//   if (kitFromLocalStorage === null) return;
//   const activeKit: ActiveKit = JSON.parse(kitFromLocalStorage);
//   continueKitWorkflow(activeKit);
// }

export class KitWorkflow {
  kits: Kit[];
  activeKit: ActiveKit | null;

  constructor(kits: Kit[]) {
    this.kits = kits;
    this.activeKit = null;
  }

  run() {
    if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
      this.setupKitClickEvents();
    }

    this.activeKit = this.getActiveKitFromLocalStorage();
    if (this.activeKit !== null) {
      // Redirect the user if they navigated away from the kit workflow.
      if (
        GLOBALVARS.currentPage === null ||
        ![StorefrontPage.CUSTOMIZETEMPLATE, StorefrontPage.ADDTOCART, StorefrontPage.CART].includes(GLOBALVARS.currentPage)
      ) {
        window.location.href = `/catalog/2-customize.php?&designID=${this.activeKit!.items[this.activeKit!.index].designID}&contentID=${
          this.activeKit!.items[this.activeKit!.index].contentID
        }`;
      }

      // Hide navigation and breadcrumbs to discourage user from navigating away from the kit
      $('#navWrapper, .crumbs').css('display', 'none');

      this.continueKitWorkflow();
    }
  }

  setupKitClickEvents() {
    $('.jk_kit').each((index, span) => {
      const kitName = $(span).text();
      const productCell = $(span).closest('.prodCell').eq(0);
      const kitElement = $(
        `<div id="${kitName.replace(
          /\s+/g,
          ''
        )}" class="kitCell" style="height:100%;width:100%;background-color:transparent;position:absolute;z-index:999"></div>`
      );

      productCell.append(kitElement);
      kitElement.on('mouseenter', function () {
        $(this).siblings('section').children('a').css('transform', 'scale(1.05)');
      });

      kitElement.on('mouseleave', function () {
        $(this).siblings('section').children('a').css('transform', 'scale(1)');
      });
      kitElement.on('click', () => this.startKitWorkflow(kitName));
    });
  }

  startKitWorkflow(kitName: string) {
    const kit = this.kits.find((kit) => kit.name === kitName);
    if (kit === undefined) return;
    localStorage.setItem('activeKit', JSON.stringify({ ...kit, index: 0 }));
    const { designID, contentID } = kit.items[0];
    window.location.href = `/catalog/2-customize.php?&designID=${designID}&contentID=${contentID}`;
  }

  continueKitWorkflow(): void {
    if (this.activeKit === null) return;
    localStorage.removeItem('shouldRedirectToCatalog');
    let hideKitDetails = JSON.parse(localStorage.getItem('hideKitDetails') ?? 'false');

    // Append informational elements about the kit
    if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE || GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
      $('.tableMain').prepend(
        `<div id="kit_status_container">
            <div id="kit_header_container">
              <h3 class="kit_header">You are currently building the ${this.activeKit.name}. You are on item ${this.activeKit.index + 1} of ${
          this.activeKit.items.length
        }.</h3>
        <button type="button" class="toggle_kit_details">${hideKitDetails ? 'Show Details' : 'Hide Details'}</button>
            </div>
          <div class="kit_item_status ${hideKitDetails ? 'hide_kit_details' : ''}">` +
          this.activeKit.items
            .map((item, index) => {
              return `<p>
              ${
                index > this.activeKit!.index
                  ? `<object type="image/svg+xml" data="${GLOBALVARS.baseURL}/assets/X.svg" width="24" height="24"></object>`
                  : index === this.activeKit!.index
                  ? `<object type="image/svg+xml" data="${GLOBALVARS.baseURL}/assets/Clock.svg" width="24" height="24"></object>`
                  : `<object type="image/svg+xml" data="${GLOBALVARS.baseURL}/assets/Check.svg" width="24" height="24"></object>`
              }
              ${item.name}</p>`;
            })
            .join('') +
          `</div></div>`
      );

      $('button.toggle_kit_details').on('click', () => {
        hideKitDetails = !hideKitDetails;
        $('.kit_item_status').toggleClass('hide_kit_details');
        localStorage.setItem('hideKitDetails', JSON.stringify(hideKitDetails));
        $('button.toggle_kit_details').text(hideKitDetails ? 'Show Details' : 'Hide Details');
      });
    }

    // When the user is on the cart page, check if the kit is complete. If it is, show a message and remove the active kit from local storage. If it is not, navigate to the next item in the kit.
    if (GLOBALVARS.currentPage === StorefrontPage.CART) {
      const newMemoFieldValue =
        `PART OF ${this.activeKit.name} | ` + $('.memoRow input').last().val()?.toString().replace('Your job name/memo here', '');
      $('#shoppingCartTbl .memoRow input').last().val(newMemoFieldValue).trigger('blur');

      if (this.activeKit.index === this.activeKit.items.length - 1) {
        $('.tableMain').prepend(`<h3 class="kit_header"> 🎉 ${this.activeKit.name} complete! You may continue to shop or checkout.</h3>`);
        localStorage.removeItem('activeKit');
        $('#navWrapper, .crumbs').css('display', 'initial');
        return;
      } else {
        $('.tableMain').css('display', 'none');
        const nextIndex = this.activeKit.index + 1;
        localStorage.setItem('activeKit', JSON.stringify({ ...this.activeKit, index: nextIndex }));
        window.location.href = `/catalog/2-customize.php?&designID=${this.activeKit.items[nextIndex].designID}&contentID=${this.activeKit.items[nextIndex].contentID}`;
      }
    }

    // On the add to cart page, show the recommended quantity for the current item in the kit. If enforceRecommendedQty is true, force the recommended qty.
    if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
      $('#quantityCol').append(
        `<span>${this.activeKit.name} recommends quantity of ${this.activeKit.items[this.activeKit.index].recommendedQty}</span>`
      );

      if (this.activeKit.enforceRecommendedQty) {
        $('input#quantity').val(this.activeKit.items[this.activeKit.index].recommendedQty);
        setTimeout(() => {
          $('input#quantity').trigger('change').prop('disabled', true);
        }, 1000);
      }

      if (this.activeKit.autoAdvance && this.activeKit.items[this.activeKit.index].isInventory) {
        $('button#addToCartButton').trigger('click');
      }
    }
  }

  getActiveKitFromLocalStorage(): ActiveKit | null {
    const kitFromLocalStorage = localStorage.getItem('activeKit');
    return kitFromLocalStorage ? (JSON.parse(kitFromLocalStorage) as ActiveKit) : null;
  }
}

// Usage
// const kitWorkflow = new KitWorkflow(this.kits);
// kitWorkflow.run();
