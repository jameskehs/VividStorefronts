export class Loader {
  init(): void {
    $('head').append('<link href="https://css.gg/css?=|spinner" rel="stylesheet">');
  }

  activate(): void {
    $('body').append(`<div id='storefront-script-loader'><i class="gg-spinner"></i></div>`);
    $('#storefront-script-loader').css({
      position: 'fixed',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      'background-color': '#fafafa',
      'z-index': '99999',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
    });
    $('.gg-spinner').css('transform', 'scale(2)');
  }

  deactivate(): void {
    $('#storefront-script-loader').remove();
  }
}
