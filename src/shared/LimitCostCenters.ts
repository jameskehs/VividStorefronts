// Limit the customerPO field to certain options
export function limitCostCenters(costCenters: string[]) {
  const costCenterOptions = costCenters
    .map((cc) => {
      return `<option value="${cc}">${cc}</option>`;
    })
    .join(',');

  $('#customerPO').attr('readonly', 'true');
  $('#custPOBox').append(`
    <div id="costCenterContainer" style="display:flex;padding:12px;gap:12px;justify-content:center;align-items:center">
        <label>Cost Center</label>
        <select>
        <option value="">Choose a Cost Center</option>
        ${costCenterOptions}
        </select>
    </div>`);

  $('#costCenterContainer select').on('change', (e) => {
    $('#customerPO')
      .val((e.target as HTMLSelectElement).value)
      .trigger('blur');

    // Blur the quoteName field to trigger the validation
    $('#quoteName').trigger('blur');
  });
}
