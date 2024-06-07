export interface StylingParameter {
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

  tagBrandBackground?: string;
  tagBrandText?: string;

  tagDecorationBackground?: string;
  tagDecorationText?: string;

  tagDimensionsBackground?: string;
  tagDimensionsText?: string;

  tagPackSizeBackground?: string;
  tagPackSizeText?: string;

  tagSkuBackground?: string;
  tagSkuText?: string;
}

export const StylingParameterMetadata: Record<keyof StylingParameter, { CSSVariableName: string }> = {
  bodyBackground: { CSSVariableName: '--body-bg' },

  navbarBackground: { CSSVariableName: '--navbar-bg' },
  navbarTextColor: { CSSVariableName: '--navbar-text' },
  navbarHoverColor: { CSSVariableName: '--navbar-hover' },

  loginbarBackground: { CSSVariableName: '--loginbar-bg' },
  loginbarTextColor: { CSSVariableName: '--loginbar-text' },
  loginbarHoverColor: { CSSVariableName: '--loginbar-hover' },

  primaryBackground: { CSSVariableName: '--primary-color' },
  primaryTextColor: { CSSVariableName: '--primary-text' },
  primaryHoverColor: { CSSVariableName: '--primary-hover' },

  secondaryBackground: { CSSVariableName: '--secondary-color' },
  secondaryTextColor: { CSSVariableName: '--secondary-text' },
  secondaryHoverColor: { CSSVariableName: '--secondary-hover' },

  tagBrandBackground: { CSSVariableName: '--tag-brand-bg' },
  tagBrandText: { CSSVariableName: '--tag-brand-text' },

  tagDecorationBackground: { CSSVariableName: '--tag-decoration-bg' },
  tagDecorationText: { CSSVariableName: '--tag-decoration-text' },

  tagDimensionsBackground: { CSSVariableName: '--tag-dimensions-bg' },
  tagDimensionsText: { CSSVariableName: '--tag-dimensions-text' },

  tagPackSizeBackground: { CSSVariableName: '--tag-pack-size-bg' },
  tagPackSizeText: { CSSVariableName: '--tag-pack-size-text' },

  tagSkuBackground: { CSSVariableName: '--tag-sku-bg' },
  tagSkuText: { CSSVariableName: '--tag-sku-text' },
};
