export interface Kit {
  name: string;
  items: KitItem[];
  dynamicOptions?: DynamicOptions;
  enforceRecommendedQty: boolean;
  autoAdvance?: boolean;
}

export interface DynamicOptions {
  totalAllowedItems: number;
}

interface KitItem {
  name: string;
  designID: number;
  contentID: number;
  recommendedQty: number;
  isInventory: boolean;
  PODPackSize?: number;
}
