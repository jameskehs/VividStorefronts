import { globalState } from '../index';
import { runKitWorkflow } from '../shared/KitWorkflow';
import { Kit } from '../types/Kit';

export function main(): void {
  $('.tableSiteBanner, #navWrapper').wrapAll(`<div class="BannerWrapper"></div>`);
  console.log(globalState.currentPage);

  const kits: Kit[] = [
    {
      name: 'Grand Opening Kit',
      items: [
        { name: 'Media Protocol Poster - English', designID: 6460, contentID: 44453, recommendedQty: 1 },
        { name: 'Media Protocol Poster - Spanish', designID: 6461, contentID: 44452, recommendedQty: 1 },
        { name: 'Store Hours Cling V1', designID: 7129, contentID: 44454, recommendedQty: 2 },
        { name: 'Store Hours Cling V2', designID: 7130, contentID: 44455, recommendedQty: 3 },
      ],
    },
  ];

  runKitWorkflow(kits);
}
