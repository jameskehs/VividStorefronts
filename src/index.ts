import { Utils } from './shared/Utils';
import { runSharedScript } from './shared/index';
import { GlobalState } from './types/GlobalState';
import { ScriptMap } from './types/ScriptMap';
//~~~~~ Declare global state object, this can be used across all modules ~~~~~//
export const GLOBALVARS: GlobalState = {
  currentPage: null,
  baseURL: 'https://vividstorefronts.netlify.app',
};

async function loadStorefrontScript(groupID: number, styling?: any) {
  try {
    //~~~~~ Hide the body until everything is loaded ~~~~~//
    $('body').css('display', 'none');

    //~~~~~ Set Global Variables ~~~~~//
    GLOBALVARS.currentPage = Utils.determineCurrentPage();

    //~~~~~ Find the script folder to import from ~~~~~//
    let scriptFolder = ScriptMap[groupID];
    if (scriptFolder === undefined) {
      throw new Error(`Module with groupID ${groupID} not found in ModuleMap.`);
    }

    //~~~~~ Load our scripts and styles ~~~~~//
    const uniqueScript = await import(/* webpackChunkName: "uniqueScript" */ `./store_scripts/${scriptFolder}/index.ts`);

    groupID === 66 && (await import(/* webpackChunkName: "basestyling" */ `./shared/styles.css`));
    await import(/* webpackChunkName: "uniqueStyling" */ `./store_scripts/${scriptFolder}/styles.css`);

    //~~~~~ Run shared script and the main function from unique script ~~~~~//
    groupID !== 58 && runSharedScript();

    if (uniqueScript && typeof uniqueScript.main === 'function') {
      uniqueScript.main();
    } else {
      throw new Error('The loaded module does not have a main function.');
    }
  } catch (error: unknown) {
    console.error(error);
  } finally {
    //~~~~~ Show the body once everything is complete ~~~~~//
    $('body').css('display', 'block');
  }
}

//~~~~~ Expose loadStorefrontScript to the window ~~~~~//
(window as any).loadStorefrontScript = loadStorefrontScript;
