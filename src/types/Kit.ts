export interface Kit {
  name: string;
  items: KitItem[];
  isDynamic: boolean;
  dynamicOptions?: DynamicOptions;
  enforceRecommendedQty: boolean;
}

export interface DynamicOptions {
  totalAllowedItems: number;
}

interface KitItem {
  name: string;
  designID: number;
  contentID: number;
  recommendedQty: number;
  qtyInCart: number;
  isInventory: boolean;
  PODPackSize?: number;
}
