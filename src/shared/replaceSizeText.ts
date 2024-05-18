export function replaceSizeText(replacementText: string) {
  $('.tablesorter tbody td').each((index, cell) => {
    $(cell).text() === 'SIZE' && $(cell).html(`<strong>${replacementText}</strong>`);
  });
}
