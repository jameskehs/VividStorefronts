import { Utils } from './shared/Utils';
import { GlobalState } from './types/GlobalState';
import { ScriptMap } from './types/ScriptMap';

// Declare global state object, this can be used across all modules
export const GLOBALVARS: GlobalState = {
  currentPage: null,
  baseURL: 'https://vividstorefronts.netlify.app',
};

async function loadStorefrontScript(groupID: number) {
  // Set global state
  GLOBALVARS.currentPage = Utils.determineCurrentPage();

  // Import the required module based on the groupID
  let scriptPath = ScriptMap[groupID];
  if (scriptPath === undefined) {
    console.error(`Module with groupID ${groupID} not found in ModuleMap.`);
    return;
  }

  const script = await import(/* webpackChunkName: "chunk" */ `./store_scripts/${scriptPath}/index.ts`);
  const styling = await import(/* webpackChunkName: "styling" */ `./store_scripts/${scriptPath}/styles.css`);

  console.log(styling);

  // Every module should have a main function, this will call it
  if (script && typeof script.main === 'function') {
    script.main();
  } else {
    console.error('The loaded module does not have a main function.');
    return;
  }

  if (styling !== undefined) {
    $('body').append(`<script>${styling.default}</script>`);
  } else {
    console.error('Error loading styles.');
  }
}

// Expose loadStoreScript to the global scope
(window as any).loadStorefrontScript = loadStorefrontScript;
