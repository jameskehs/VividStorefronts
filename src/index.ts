function loadStorefrontScript(groupID: number) {
  switch (groupID) {
    case 66:
      require('./JKTest');
  }
}

function determineSite() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const groupID = Number(urlParams.get('groupID'));
  console.log(groupID);
  loadStorefrontScript(groupID);
}

console.log('Hi');
determineSite();
