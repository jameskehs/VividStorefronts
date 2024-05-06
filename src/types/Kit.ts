export interface Kit {
  name: string;
  items: KitItem[];
  isDynamic: boolean;
  dynamicOptions?: DynamicOptions;
}

export interface DynamicOptions {
  allowedTotalQuantity: number;
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
