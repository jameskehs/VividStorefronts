export function limitCostCenters(costCenters: string[]) {
  // const costCenters = ['Fundraising:Golf Events:Golf_GA', 'Fundraising:Golf Events:Golf_NC', 'Fundraising:Golf Events:Golf_TN', 'Fundraising:Tasting Events:Tasting_NC', 'Fundraising:Tasting Events:Tasting_TN', 'Fundraising:Tasting Events:TH2024', 'Admin:Admin_GA', 'Admin:Admin_NC', 'Admin:Admin_TN', 'Admin:Launch Events:Launch_Charlotte', 'Admin:Stewardship:James Beard Event', 'Admin:Stewardship:Stewardship_GA', 'Admin:Stewardship:Stewardship_NC', 'Admin:Stewardship:Stewardship_TN', 'Admin:Stewardship:Stewardship_Unclassified', 'Admin:SWAG:Swag_GA', 'Admin:SWAG:Swag_NC', 'Admin:SWAG:Swag_TN', 'Admin:SWAG:Swag_Unclassified'];

  const costCenterOptions = costCenters
    .map((cc) => {
      return `<option value="${cc}">${cc}</option>`;
    })
    .join(',');

  $('#customerPO').attr('readonly', 'true');
  $('#custPOBox').append(`
    <div id="costCenterContainer" style="display:flex">
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
  });
}
