import { StorefrontPage } from './enums/StorefrontPage.enum';
import { determineCurrentPage } from './shared/determinePage';
import { GlobalState } from './types/GlobalState';

// Declare global state object, this can be used across all modules
export const globalState: GlobalState = {
  currentPage: undefined,
};

async function loadStorefrontScript(groupID: number) {
  // Set global state
  globalState.currentPage = determineCurrentPage();

  // Import the required module based on the groupID
  let module;
  switch (groupID) {
    case 66:
      module = await import(/* webpackChunkName: "JKTest" */ './JKTest');
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
