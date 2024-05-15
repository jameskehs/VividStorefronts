import { Utils } from './shared/Utils';
import { GlobalState } from './types/GlobalState';
import { ModuleMap } from './types/ModuleMap';

// Declare global state object, this can be used across all modules
export const globalState: GlobalState = {
  currentPage: null,
  baseURL: 'https://vividstorefronts.netlify.app',
};

async function loadStorefrontScript(groupID: number) {
  // Set global state
  globalState.currentPage = Utils.determineCurrentPage();

  // Import the required module based on the groupID
  let modulePath = ModuleMap[groupID];
  const module = await import(/* webpackChunkName: "JKTest" */ `./store_scripts/${modulePath}`);

  if (module === undefined) {
    console.error(`Module with groupID ${groupID} not found in ModuleMap.`);
  }
  // Every module should have a main function, this will call it
  else if (module && typeof module.main === 'function') {
    module.main();
  } else {
    console.error('The loaded module does not have a main function.');
  }
}

// Expose loadStoreScript to the global scope
(window as any).loadStorefrontScript = loadStorefrontScript;
