import { Utils } from './shared/Utils';
import { runSharedScript } from './shared/index';
import { GlobalState } from './types/GlobalState';
import { ScriptMap } from './types/ScriptMap';

// Declare global state object
export const GLOBALVARS: GlobalState = {
  currentPage: null,
  baseURL: 'https://vividstorefronts.netlify.app',
};

interface StylingParameter {
  bodyBackground?: string;

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

export interface OptionsParameter {
  hideHomeLink?: boolean;
  hideCompanyShipTo?: boolean;
  hideAddressBook?: boolean;
}

const defaultOptions: OptionsParameter = {
  hideHomeLink: false,
  hideCompanyShipTo: false,
  hideAddressBook: false,
};

async function loadStorefrontScript(groupID: number, styling?: StylingParameter, options?: OptionsParameter) {
  try {
    // Hide the body until everything is loaded. This is to prevent flashing of unstyled content
    $('body').hide();

    // Set global variables and merge options with defaults
    GLOBALVARS.currentPage = Utils.determineCurrentPage();
    const scriptOptions: OptionsParameter = { ...defaultOptions, ...options };

    // Conditionally import base styling
    if (groupID === 66 || groupID === 130 || groupID === 124 || groupID === 83) {
      await import(/* webpackChunkName: "basestyling" */ `./shared/styles.css`);
    }

    // Apply styling variables if provided
    if (styling) setCSSVariables(styling);

    // Run shared script if applicable
    if (groupID !== 58) runSharedScript(scriptOptions);

    // Determine and load the appropriate script module
    const scriptFolder = ScriptMap[groupID];
    if (!scriptFolder) {
      throw new Error(`Module with groupID ${groupID} not found in ModuleMap.`);
    }

    const uniqueScript = await import(/* webpackChunkName: "uniqueScript" */ `./store_scripts/${scriptFolder}/index.ts`);
    await import(/* webpackChunkName: "uniqueStyling" */ `./store_scripts/${scriptFolder}/styles.css`);

    // Execute the main function of the loaded module
    if (uniqueScript && typeof uniqueScript.main === 'function') {
      uniqueScript.main();
    } else {
      throw new Error('The loaded module does not have a main function.');
    }
  } catch (error: unknown) {
    console.error(error);
  } finally {
    // Show the body once everything is complete
    $('body').show();
  }
}

function setCSSVariables(styling: StylingParameter) {
  const root = $(':root');
  root.css({
    '--body-bg': styling.bodyBackground ?? root.css('--body-bg'),

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

// Expose loadStorefrontScript to the window
(window as any).loadStorefrontScript = loadStorefrontScript;
