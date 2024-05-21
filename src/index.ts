import { Utils } from './shared/Utils';
import { runBaseScript } from './shared/index';
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

  const uniqueScript = await import(/* webpackChunkName: "uniqueScript" */ `./store_scripts/${scriptPath}/index.ts`);
  const baseStyling = await import(/* webpackChunkName: "basestyling" */ `./shared/styles.css`);
  const uniqueStyling = await import(/* webpackChunkName: "styling" */ `./store_scripts/${scriptPath}/styles.css`);

  runBaseScript();
  $('head').append(`<style>${baseStyling.default}</style>`);
  console.log(baseStyling);
  // Every module should have a main function, this will call it
  if (uniqueScript && typeof uniqueScript.main === 'function') {
    uniqueScript.main();
  } else {
    console.error('The loaded module does not have a main function.');
    return;
  }

  if (uniqueStyling !== undefined) {
    $('head').append(`<style>${uniqueStyling.default}</style>`);
  } else {
    console.error('Error loading styles.');
  }
}

// Expose loadStoreScript to the global scope
(window as any).loadStorefrontScript = loadStorefrontScript;
