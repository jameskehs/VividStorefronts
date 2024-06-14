// Future TODO: Replace all instanced of replaceSizeText with replaceAttrText
export function replaceSizeText(replacementText: string) {
  $('.tablesorter tbody td').each((index, cell) => {
    $(cell).text() === 'SIZE' && $(cell).html(`<strong>${replacementText}</strong>`);
  });
}

export function replaceAttrText(attribute: 'SIZE' | 'COLOR', replacementText: string) {
  $('.tablesorter tbody td').each((index, cell) => {
    $(cell).text() === attribute && $(cell).html(`<strong>${replacementText.toUpperCase()}</strong>`);
  });
}
