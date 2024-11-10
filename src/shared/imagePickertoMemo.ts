import { StorefrontPage } from '../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../index';

export function AddImagePickerSelectionToMemo() {
  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
    const selectedImage = $('.image-picker-ui-name').text();
    console.log({ selectedImage });
    if (selectedImage) {
      localStorage.setItem('imagePickerSelection', selectedImage);
    }
  }

  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    $('#change-options').on('click', (event) => {
      const itemID = $(event.target).attr('name')!.replace('edit', '');
      localStorage.setItem('editingItemID', itemID);
    });

    const selectedImage = localStorage.getItem('imagePickerSelection');
    const currentlyEditingID = localStorage.getItem('editingItemID');
    console.log({ selectedImage, currentlyEditingID });

    if (!selectedImage) return;

    if (currentlyEditingID) {
      const memoFieldElement = $(`input[name="memo${currentlyEditingID}"]`);
      const regEx = /\|[^|]*\|/g;
      memoFieldElement.val()?.toString().replace(regEx, `| Test |`);
      const newMemoFieldValue = memoFieldElement.val()?.toString().replace(regEx, `| Test |`) ?? '';
      memoFieldElement.val(newMemoFieldValue).trigger('blur');
    } else {
      const newMemoFieldValue = `| ${selectedImage} | ${$('.memoRow input').last().val()?.toString().replace('Your job name/memo here', '')}`;
      $('#shoppingCartTbl .memoRow input').last().val(newMemoFieldValue).trigger('blur');
    }

    localStorage.removeItem('imagePickerSelection');
    localStorage.removeItem('editingItemID');
  }
}
