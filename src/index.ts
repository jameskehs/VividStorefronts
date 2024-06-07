import { Utils } from './shared/Utils';
import { runSharedScript } from './shared/index';
import { GlobalState } from './types/GlobalState';
import { ScriptMap } from './types/ScriptMap';
import { StylingParameter, StylingParameterMetadata } from './types/StylingParameter';

// Declare global state object
export const GLOBALVARS: GlobalState = {
  currentPage: null,
  baseURL: 'https://vividstorefronts.netlify.app',
};

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
    if (groupID === 66 || groupID === 130 || groupID === 124 || groupID === 83 || groupID === 132 || groupID === 70 || groupID === 95) {
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

function setCSSVariables(stylingVariables: StylingParameter) {
  const root = $(':root');
  for (const variable in stylingVariables) {
    if (variable in StylingParameterMetadata) {
      root.css(StylingParameterMetadata[variable as keyof StylingParameter].CSSVariableName, variable);
    }
  }
}

// Expose loadStorefrontScript to the window
(window as any).loadStorefrontScript = loadStorefrontScript;
