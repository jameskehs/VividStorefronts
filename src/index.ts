async function loadStorefrontScript(groupID: number) {
  switch (groupID) {
    case 66:
      await import(/* webpackChunkName: "JKTest" */ './JKTest');
      break;
    default:
      console.error('Group ID not recognized');
  }
}

(window as any).loadStorefrontScript = loadStorefrontScript;

// function determineSite() {
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   const groupID = Number(urlParams.get('groupID'));
//   console.log(groupID);
//   loadStorefrontScript(groupID);
// }

// console.log('Hi');
// determineSite();
