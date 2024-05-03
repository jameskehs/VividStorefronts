import { Utils } from './shared/determinePage';
import { GlobalState } from './types/GlobalState';

// Declare global state object, this can be used across all modules
export const globalState: GlobalState = {
  currentPage: null,
  baseURL: 'https://vividstorefronts.netlify.app',
};

async function loadStorefrontScript(groupID: number) {
  // Set global state
  globalState.currentPage = Utils.determineCurrentPage();

  // Import the required module based on the groupID
  let module;
  switch (groupID) {
    case 66:
      module = await import(/* webpackChunkName: "JKTest" */ './store_scripts/JKTest');
      break;
    case 123:
      module = await import(/* webpackChunkName: "PenningtonBiomedical" */ './store_scripts/PenningtonBiomedical');
      break;
    case 124:
      module = await import(/* webpackChunkName: "EpicPiping" */ './store_scripts/EpicPiping');
      break;
    default:
      console.error('Group ID not recognized');
  }

  // Every module should have a main function, this will call it
  if (module && typeof module.main === 'function') {
    module.main();
  } else {
    console.error('The loaded module does not have a main function.');
  }
}

// Expose loadStoreScript to the global scope
(window as any).loadStorefrontScript = loadStorefrontScript;
