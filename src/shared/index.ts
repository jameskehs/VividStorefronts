export function runBaseScript() {
  console.log('Hello from shared script!');

  //Wrap nav elements
  $('.tableSiteBanner, #navWrapper').wrapAll(`<div class="logoLinks"></div>`);
  $('.logoLinks').wrapAll(`<div class="navWrapper"></div>`);
  $('.tableLogin').wrapAll("<div class='loginWrapper'></div>");
}
