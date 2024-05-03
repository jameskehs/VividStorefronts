export interface Kit {
  name: string;
  items: KitItem[];
}

interface KitItem {
  name: string;
  designID: number;
  contentID: number;
  recommendedQty: number;
}
