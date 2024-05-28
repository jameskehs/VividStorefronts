import { GLOBALVARS } from '../../index';
import { KitWorkflow } from '../../shared/KitHelper';
import { Kit } from '../../types/Kit';

export function main(): void {
  console.log(GLOBALVARS.currentPage);

  const kits: Kit[] = [
    {
      name: 'Grand Opening Kit',
      items: [
        { name: 'Media Protocol Poster - English', designID: 6460, contentID: 44453, recommendedQty: 1, qtyInCart: 0, isInventory: true },
        { name: 'Media Protocol Poster - Spanish', designID: 6461, contentID: 44452, recommendedQty: 1, qtyInCart: 0, isInventory: true },
        { name: 'Store Hours Cling V1', designID: 7129, contentID: 44454, recommendedQty: 2, qtyInCart: 0, isInventory: false },
        { name: 'Store Hours Cling V2', designID: 7130, contentID: 44455, recommendedQty: 3, qtyInCart: 0, isInventory: false },
      ],
      isDynamic: false,
      enforceRecommendedQty: true,
    },
    {
      name: 'POP Kit #1',
      items: [
        { name: 'POP Kit - Business Cards', designID: 1805, contentID: 45036, recommendedQty: 1, qtyInCart: 0, isInventory: false, PODPackSize: 250 },
        { name: 'POP Kit - Gallon To Go Stickers', designID: 7600, contentID: 45038, recommendedQty: 1, qtyInCart: 0, isInventory: false },
        { name: 'POP Kit - Store Hours Cling (V1)', designID: 7129, contentID: 45040, recommendedQty: 1, qtyInCart: 0, isInventory: true },
        { name: 'POP Kit - Takeout Order Pads', designID: 6275, contentID: 45037, recommendedQty: 2, qtyInCart: 0, isInventory: true },
        { name: 'POP Kit - Yard Sign (Grand Opening)', designID: 7024, contentID: 45039, recommendedQty: 2, qtyInCart: 0, isInventory: true },
      ],
      isDynamic: true,
      enforceRecommendedQty: false,
      dynamicOptions: {
        totalAllowedItems: 7,
      },
    },
    {
      name: 'Welcome Bag - B-Quick Managers (Full Time)',
      items: [
        { name: 'Bennys Cap', designID: 11067, contentID: 45472, recommendedQty: 1, qtyInCart: 0, isInventory: true },
        { name: 'Manager Polos', designID: 11068, contentID: 45473, recommendedQty: 5, qtyInCart: 0, isInventory: true },
        { name: 'Name Tag Holder', designID: 11069, contentID: 45474, recommendedQty: 1, qtyInCart: 0, isInventory: true },
        { name: 'Name Tag Insert', designID: 11070, contentID: 45475, recommendedQty: 1, qtyInCart: 0, isInventory: false },
      ],
      isDynamic: false,
      enforceRecommendedQty: true,
    },
  ];

  const kitWorkflow = new KitWorkflow(kits);
  kitWorkflow.run();
}
