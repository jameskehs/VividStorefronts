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
    const selectedImage = localStorage.getItem('imagePickerSelection');
    console.log({ selectedImage });
    if (!selectedImage) return;

    const newMemoFieldValue = selectedImage + $('.memoRow input').last().val()?.toString().replace('Your job name/memo here', '');
    $('#shoppingCartTbl .memoRow input').last().val(newMemoFieldValue).trigger('blur');

    localStorage.removeItem('imagePickerSelection');
  }
}
