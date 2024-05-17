export function replaceSizeText(replacementText: string) {
  $('.tablesorter tbody td').each((index, cell) => {
    console.log($(cell).text());
    if ($(cell).text() === 'SIZE') {
      $(cell).html(`<strong>${replacementText}</strong>`);
    }
  });
}
