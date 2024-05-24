import { Utils } from './shared/Utils';
import { runSharedScript } from './shared/index';
import { GlobalState } from './types/GlobalState';
import { ScriptMap } from './types/ScriptMap';
//~~~~~ Declare global state object, this can be used across all modules ~~~~~//
export const GLOBALVARS: GlobalState = {
  currentPage: null,
  baseURL: 'https://vividstorefronts.netlify.app',
};

interface StylingParameter {
  navbarBackground?: string;
  navbarTextColor?: string;
  navbarHoverColor?: string;

  loginbarBackground?: string;
  loginbarTextColor?: string;
  loginbarHoverColor?: string;

  primaryBackground?: string;
  primaryTextColor?: string;
  primaryHoverColor?: string;

  secondaryBackground?: string;
  secondaryTextColor?: string;
  secondaryHoverColor?: string;
}

async function loadStorefrontScript(groupID: number, styling?: StylingParameter) {
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

    (groupID === 66 || groupID === 123) && (await import(/* webpackChunkName: "basestyling" */ `./shared/styles.css`));
    await import(/* webpackChunkName: "uniqueStyling" */ `./store_scripts/${scriptFolder}/styles.css`);

    //~~~~~ Set Styling Variables ~~~~~//
    if (styling !== undefined) setCSSVariables(styling);
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

function setCSSVariables(styling: StylingParameter) {
  const root = $(':root');
  root.css({
    '--navbar-bg': styling.navbarBackground ?? root.css('--navbar-bg'),
    '--navbar-text': styling.navbarTextColor ?? root.css('--navbar-text'),
    '--navbar-hover': styling.navbarHoverColor ?? root.css('--navbar-hover'),

    '--loginbar-bg': styling.loginbarBackground ?? root.css('--loginbar-bg'),
    '--loginbar-text': styling.loginbarTextColor ?? root.css('--loginbar-text'),
    '--loginbar-hover': styling.loginbarHoverColor ?? root.css('--loginbar-hover'),

    '--primary-color': styling.primaryBackground ?? root.css('--primary-color'),
    '--primary-text': styling.primaryTextColor ?? root.css('--primary-text'),
    '--primary-hover': styling.primaryHoverColor ?? root.css('--primary-hover'),

    '--secondary-color': styling.secondaryBackground ?? root.css('--secondary-color'),
    '--secondary-text': styling.secondaryTextColor ?? root.css('--secondary-text'),
    '--secondary-hover': styling.secondaryHoverColor ?? root.css('--secondary-hover'),
  });
}

//~~~~~ Expose loadStorefrontScript to the window ~~~~~//
(window as any).loadStorefrontScript = loadStorefrontScript;
