export function runBaseScript() {
  console.log('Hello from shared script!');

  //Wrap nav elements
  $('.tableSiteBanner, #navWrapper').wrapAll(`<div id="logoLinks"></div>`);
  $('.logoLinks').wrapAll(`<div id="navWrapper"></div>`);
  $('.tableLogin').wrapAll("<div id='loginWrapper'></div>");
}
