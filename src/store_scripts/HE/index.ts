// <script src="https://main--vividstorefronts.netlify.app/main.js"></script>
// <script>loadStorefrontScript(brandingProfile)</script>

import { StorefrontPage } from '../../enums/StorefrontPage.enum';
import { GLOBALVARS } from '../../index';
import { KitWorkflow } from '../../shared/KitHelper';
import { Kit } from '../../types/Kit';

interface HEBillingAddress {
  branchName: string;
  branchNumber: number;
  address1: string;
  city: string;
  state: string;
  zip: number;
}

const kits: Kit[] = [
  {
    name: 'New Branch Startup Kit',
    items: [
      { name: 'One Pocket Blade Folder', designID: 8487, contentID: 40176, recommendedQty: 1, isInventory: true },
      { name: 'Two Pocket Folder', designID: 8545, contentID: 40235, recommendedQty: 1, isInventory: true },
      { name: 'Daily Counter Telephone Log', designID: 8488, contentID: 40177, recommendedQty: 1, isInventory: true },
      { name: 'Parts Quote and Call Log', designID: 8489, contentID: 40178, recommendedQty: 1, isInventory: true },
      { name: 'Inspection Form', designID: 8490, contentID: 40179, recommendedQty: 1, isInventory: true },
      { name: 'Rental Contract Rev 1/22', designID: 8787, contentID: 40617, recommendedQty: 2, isInventory: true },
      { name: 'Daily Service Call Log', designID: 8491, contentID: 40180, recommendedQty: 1, isInventory: true },
      { name: 'Service Report', designID: 8786, contentID: 40616, recommendedQty: 1, isInventory: true },
      { name: 'Vehicle Mileage Report', designID: 8492, contentID: 40181, recommendedQty: 3, isInventory: true },
      { name: 'CONNECT Flyer', designID: 8834, contentID: 43161, recommendedQty: 3, isInventory: true },
      { name: 'Rentals Flyer', designID: 9011, contentID: 43167, recommendedQty: 3, isInventory: true },
      { name: 'Used Equipment Website Flyer', designID: 9014, contentID: 43169, recommendedQty: 3, isInventory: true },
      { name: "Now Hiring 3' x 10' with QR Code", designID: 8866, contentID: 40720, recommendedQty: 1, isInventory: true },
      { name: "Now Open Banner 3.5' x 8'", designID: 8859, contentID: 40713, recommendedQty: 1, isInventory: true },
      { name: "Silhouette Banner 4' x 8'", designID: 8862, contentID: 40716, recommendedQty: 2, isInventory: true },
      { name: 'Code of Conduct Ethics Poster', designID: 8496, contentID: 40185, recommendedQty: 1, isInventory: true },
      { name: 'Ethics Violation Poster', designID: 8552, contentID: 40247, recommendedQty: 1, isInventory: true },
      { name: 'Refer and Receive Poster', designID: 8553, contentID: 40248, recommendedQty: 1, isInventory: true },
      { name: 'LiveSafe Banner', designID: 8497, contentID: 40186, recommendedQty: 1, isInventory: true },
      { name: 'LiveSafe Cling', designID: 8826, contentID: 40675, recommendedQty: 1, isInventory: true },
      { name: 'LiveSafe Poster', designID: 8827, contentID: 40676, recommendedQty: 1, isInventory: true },
      { name: "Poster Frame 2' x 3'", designID: 8828, contentID: 40677, recommendedQty: 1, isInventory: true },
      { name: "Wash Rack Safety Sign 2' x 3'", designID: 8829, contentID: 40678, recommendedQty: 1, isInventory: true },
      { name: 'Join Our Team Recruiting Cards', designID: 8503, contentID: 40192, recommendedQty: 1, isInventory: true },
      { name: 'Thank You Card and Envelope', designID: 8504, contentID: 40193, recommendedQty: 1, isInventory: true },
      { name: 'Field Service Repair Tag Wires Attached', designID: 8505, contentID: 40194, recommendedQty: 1, isInventory: true },
      { name: 'Ready to Rent Tag Loose Wires', designID: 8824, contentID: 40673, recommendedQty: 3, isInventory: true },
      { name: 'Warranty Parts Tag 3-Ply', designID: 8825, contentID: 40674, recommendedQty: 1, isInventory: true },
    ],
    enforceRecommendedQty: true,
  },
  {
    name: 'Small Decal Kit',
    enforceRecommendedQty: true,
    items: [
      { name: 'HE-EWHEEL', designID: 8486, contentID: 40175, recommendedQty: 1, isInventory: true },
      { name: 'HE-D10x10', designID: 8483, contentID: 40172, recommendedQty: 2, isInventory: true },
      { name: 'HE-D10x9', designID: 8584, contentID: 40306, recommendedQty: 2, isInventory: true },
      { name: 'HE-D104x14', designID: 8583, contentID: 40305, recommendedQty: 6, isInventory: true },
      { name: 'HE-D13.5x3', designID: 8585, contentID: 40307, recommendedQty: 2, isInventory: true },
      { name: 'HE-D14x6', designID: 8586, contentID: 40308, recommendedQty: 1, isInventory: true },
      { name: 'HE-D15.5x14', designID: 8587, contentID: 40309, recommendedQty: 2, isInventory: true },
      { name: 'HE-D15x15', designID: 8839, contentID: 40688, recommendedQty: 2, isInventory: true },
      { name: 'HE-D20x18', designID: 8589, contentID: 40311, recommendedQty: 3, isInventory: true },
      { name: 'HE-D22.5x5', designID: 8838, contentID: 40687, recommendedQty: 2, isInventory: true },
      { name: 'HE-D24x10', designID: 8591, contentID: 40313, recommendedQty: 1, isInventory: true },
      { name: 'HE-D37x5', designID: 8848, contentID: 40702, recommendedQty: 6, isInventory: true },

      { name: 'HE-D4x1.75', designID: 8849, contentID: 40703, recommendedQty: 1, isInventory: true },
      { name: 'HE-D5x4.5', designID: 8850, contentID: 40704, recommendedQty: 3, isInventory: true },
      { name: 'HE-D64x8.75', designID: 8592, contentID: 40314, recommendedQty: 10, isInventory: true },
      { name: 'HE-D7.5x7.5', designID: 8717, contentID: 40547, recommendedQty: 1, isInventory: true },
      { name: 'HE-D9x4', designID: 8718, contentID: 40548, recommendedQty: 1, isInventory: true },
      { name: 'HE-DCR', designID: 8719, contentID: 40549, recommendedQty: 5, isInventory: true },
      { name: 'HE-DMDCL', designID: 8728, contentID: 40558, recommendedQty: 5, isInventory: true },
      { name: 'HE-DNR', designID: 8729, contentID: 40559, recommendedQty: 1, isInventory: true },
    ],
  },
];

const billingAddresses: HEBillingAddress[] = [
  { branchName: 'Albuquerque', branchNumber: 4042, address1: '3801 Prince St SE', city: 'Albuquerque', state: 'NM', zip: 87105 },
  { branchName: 'Aledo', branchNumber: 4085, address1: '104 BPR Ln', city: 'Aledo', state: 'TX', zip: 76008 },
  { branchName: 'Alexandria', branchNumber: 4006, address1: '5732 S MacArthur Dr', city: 'Alexandria', state: 'LA', zip: 71302 },
  { branchName: 'Amarillo', branchNumber: 4168, address1: '12828 I-27', city: 'Amarillo', state: 'TX', zip: 79119 },
  { branchName: 'Arden', branchNumber: 1118, address1: '100 Crescent Hill Rd', city: 'Arden', state: 'NC', zip: 28704 },
  { branchName: 'Ashland', branchNumber: 1113, address1: '10409 Success St', city: 'Ashland', state: 'VA', zip: 23005 },
  { branchName: 'Atlanta', branchNumber: 4019, address1: '3160 Ellenwood Industrial Dr', city: 'Ellenwood', state: 'GA', zip: 30294 },
  { branchName: 'Atlanta (Specialty)', branchNumber: 4146, address1: '3160 Ellenwood Industrial Dr', city: 'Ellenwood', state: 'GA', zip: 30294 },
  { branchName: 'Austin', branchNumber: 4030, address1: '104 Benelli Dr', city: 'Hutto', state: 'TX', zip: 78634 },
  { branchName: 'Bakersfield', branchNumber: 1054, address1: '8136 Golden State Hwy', city: 'Bakersfield', state: 'CA', zip: 93308 },
  { branchName: 'Baltimore', branchNumber: 4053, address1: '2111 Grays Rd', city: 'Dundalk', state: 'MD', zip: 21222 },
  { branchName: 'Baton Rouge', branchNumber: 4001, address1: '7502 Pecue Ln', city: 'Baton Rouge', state: 'LA', zip: 70809 },
  { branchName: 'Beaumont', branchNumber: 4077, address1: '3825 Stone Oak Dr', city: 'Beaumont', state: 'TX', zip: 77705 },
  { branchName: 'Belgrade', branchNumber: 1294, address1: '343 Floss Flats Rd', city: 'Belgrade', state: 'MT', zip: 59714 },
  { branchName: 'Benicia', branchNumber: 4074, address1: '4700 E 2nd St', city: 'Benicia', state: 'CA', zip: 94510 },
  { branchName: 'Billings', branchNumber: 1291, address1: '100 Steffes Rd', city: 'Billings', state: 'MT', zip: 59101 },
  { branchName: 'Birmingham', branchNumber: 4101, address1: '806 Labarge Dr', city: 'Bessemer', state: 'AL', zip: 35022 },
  { branchName: 'Birmingham (Specialty)', branchNumber: 4147, address1: '1369 McCain Pkwy', city: 'Pelham', state: 'AL', zip: 35124 },
  { branchName: 'Boise', branchNumber: 4035, address1: '7489 Federal Way', city: 'Boise', state: 'ID', zip: 83716 },
  { branchName: 'Bradenton', branchNumber: 4169, address1: '4004 15th St E', city: 'Bradenton', state: 'FL', zip: 34208 },
  { branchName: 'Bryan', branchNumber: 4094, address1: '740 N Harvey Mitchell Pkwy', city: 'Bryan', state: 'TX', zip: 77807 },
  { branchName: 'Buda', branchNumber: 4097, address1: '16536 S I-35', city: 'Buda', state: 'TX', zip: 78610 },
  { branchName: 'Cedar Rapids', branchNumber: 4154, address1: '1925 Blairs Ferry Rd NE', city: 'Cedar Rapids', state: 'IA', zip: 52402 },
  { branchName: 'Charleston', branchNumber: 4068, address1: '1115 Newton Way', city: 'Summerville', state: 'SC', zip: 29483 },
  { branchName: 'Charleston (Specialty)', branchNumber: 4148, address1: '1115 Newton Way', city: 'Summerville', state: 'SC', zip: 29483 },
  { branchName: 'Charlotte', branchNumber: 4022, address1: '10710 Nations Ford Rd', city: 'Charlotte', state: 'NC', zip: 28273 },
  { branchName: 'Chattanooga', branchNumber: 4058, address1: '4132 Jersey Pike', city: 'Chattanooga', state: 'TN', zip: 37421 },
  { branchName: 'Chesapeake', branchNumber: 1112, address1: '1201 Cavalier Blvd', city: 'Chesapeake', state: 'VA', zip: 23323 },
  { branchName: 'Clarksville', branchNumber: 1309, address1: '2281 Wilma Rudolph Blvd', city: 'Clarksville', state: 'TN', zip: 37040 },
  { branchName: 'Cleburne', branchNumber: 4156, address1: '1800 S Hwy 171', city: 'Cleburne', state: 'TX', zip: 76031 },
  { branchName: "Coeur d''Alene", branchNumber: 1293, address1: '3940 E 16th Ave', city: 'Post Falls', state: 'ID', zip: 83854 },
  { branchName: 'Colorado Springs', branchNumber: 4044, address1: '2401 Steel Dr', city: 'Colorado Springs', state: 'CO', zip: 80907 },
  { branchName: 'Columbia', branchNumber: 1121, address1: '125 Cort Rd', city: 'Columbia', state: 'SC', zip: 29203 },
  { branchName: 'Columbia', branchNumber: 4159, address1: '5611 Brown Station Rd', city: 'Columbia', state: 'MO', zip: 65202 },
  { branchName: 'Columbus', branchNumber: 4170, address1: '2845 Fisher Rd', city: 'Columbus', state: 'OH', zip: 43204 },
  { branchName: 'Conroe', branchNumber: 4140, address1: '530 Frazier Commerce Dr', city: 'Conroe', state: 'TX', zip: 77303 },
  { branchName: 'Corporate Headquarters', branchNumber: 4000, address1: '7500 Pecue Ln', city: 'Baton Rouge', state: 'LA', zip: 70809 },
  { branchName: 'Corpus Christi', branchNumber: 4029, address1: '7809 I-37 Access Rd', city: 'Corpus Christi', state: 'TX', zip: 78409 },
  { branchName: 'Dallas', branchNumber: 4018, address1: '3040 Roy Orr Blvd', city: 'Grand Prairie', state: 'TX', zip: 75050 },
  { branchName: 'Dallas (Specialty)', branchNumber: 4130, address1: '3040 Roy Orr Blvd', city: 'Grand Prairie', state: 'TX', zip: 75050 },
  { branchName: 'Daytona Beach', branchNumber: 4160, address1: '998 Bellevue Ave', city: 'Daytona Beach', state: 'FL', zip: 32114 },
  { branchName: 'Decatur', branchNumber: 1303, address1: '4041 N Brush College Rd', city: 'Decatur', state: 'IL', zip: 62521 },
  { branchName: 'Decatur', branchNumber: 4171, address1: '930 Old Trinity Rd', city: 'Trinity', state: 'AL', zip: 35673 },
  { branchName: 'Denton', branchNumber: 4167, address1: '1001 Prosperity Way', city: 'Krugerville', state: 'TX', zip: 76227 },
  { branchName: 'Denver', branchNumber: 4043, address1: '9200 E 96th Ave', city: 'Henderson', state: 'CO', zip: 80640 },
  { branchName: 'Denver (Specialty)', branchNumber: 4174, address1: '9200 E 96th Ave', city: 'Henderson', state: 'CO', zip: 80640 },
  { branchName: 'Dothan', branchNumber: 4091, address1: '3425 Napier Field Rd', city: 'Dothan', state: 'AL', zip: 36303 },
  { branchName: 'Durham', branchNumber: 4079, address1: '815 Ellis Rd', city: 'Durham', state: 'NC', zip: 27703 },
  { branchName: 'East Phoenix', branchNumber: 4138, address1: '2557 W Peterson Dr', city: 'Apache Junction', state: 'AZ', zip: 85120 },
  { branchName: 'El Dorado', branchNumber: 4125, address1: '4682 Junction City Hwy', city: 'El Dorado', state: 'AR', zip: 71730 },
  { branchName: 'Erie', branchNumber: 4083, address1: '2240 E I-25 Frontage Rd', city: 'Erie', state: 'CO', zip: 80516 },
  { branchName: 'Fairburn', branchNumber: 4122, address1: '7735 Bishop Rd, Bldg B', city: 'Fairburn', state: 'GA', zip: 30213 },
  { branchName: 'Fontana', branchNumber: 4033, address1: '14695 Randall Ave', city: 'Fontana', state: 'CA', zip: 92335 },
  { branchName: 'Forestville', branchNumber: 4073, address1: '8101 Parston Dr', city: 'District Heights', state: 'MD', zip: 20747 },
  { branchName: 'Fort Collins', branchNumber: 4078, address1: '1429 E Mulberry St', city: 'Fort Collins', state: 'CO', zip: 80524 },
  { branchName: 'Fort Myers', branchNumber: 4024, address1: '16701 Old US 41', city: 'Fort Myers', state: 'FL', zip: 33912 },
  { branchName: 'Fort Walton Beach', branchNumber: 4088, address1: '45 Ready Ave NW', city: 'Fort Walton Beach', state: 'FL', zip: 32548 },
  { branchName: 'Fort Worth', branchNumber: 4062, address1: '12997 N Fwy', city: 'Fort Worth', state: 'TX', zip: 76177 },
  { branchName: 'Frederick', branchNumber: 4136, address1: '4820 Winchester Blvd', city: 'Frederick', state: 'MD', zip: 21703 },
  { branchName: 'Freeport', branchNumber: 4071, address1: '603 County Rd 227A', city: 'Freeport', state: 'TX', zip: 77541 },
  { branchName: 'Fresno', branchNumber: 4109, address1: '4199 E Jefferson Ave', city: 'Fresno', state: 'CA', zip: 93725 },
  { branchName: 'Glasgow', branchNumber: 4179, address1: '54359 US Hwy 2', city: 'Glasgow', state: 'MT', zip: 59230 },
  { branchName: 'Goleta', branchNumber: 4162, address1: '285 Rutherford St', city: 'Goleta', state: 'CA', zip: 93117 },
  { branchName: 'Great Falls', branchNumber: 4180, address1: '2809 Vaughn Rd', city: 'Great Falls', state: 'MT', zip: 59404 },
  { branchName: 'Greeley', branchNumber: 4082, address1: '1645 1st Ave', city: 'Greeley', state: 'CO', zip: 80631 },
  { branchName: 'Greensboro', branchNumber: 1116, address1: '307 S Regional Rd', city: 'Greensboro', state: 'NC', zip: 27409 },
  { branchName: 'Greenville', branchNumber: 1122, address1: '585 Brookshire Rd', city: 'Greer', state: 'SC', zip: 29651 },
  { branchName: 'Havre', branchNumber: 4181, address1: '3810 US Hwy 2 W', city: 'Havre', state: 'MT', zip: 59501 },
  { branchName: 'Hollywood', branchNumber: 4139, address1: '2200 N 30th Rd', city: 'Hollywood', state: 'FL', zip: 33021 },
  { branchName: 'Houston', branchNumber: 4009, address1: '18144 Imperial Valley Dr', city: 'Houston', state: 'TX', zip: 77060 },
  { branchName: 'Houston (Specialty)', branchNumber: 4113, address1: '6100 Almeda Genoa Rd', city: 'Houston', state: 'TX', zip: 77048 },
  { branchName: 'Houston South', branchNumber: 4157, address1: '6100 Almeda Genoa Rd', city: 'Houston', state: 'TX', zip: 77048 },
  { branchName: 'Huntsville', branchNumber: 4057, address1: '190 Production Ave', city: 'Madison', state: 'AL', zip: 35758 },
  { branchName: 'Idaho Falls', branchNumber: 4165, address1: '2727 E 14th N', city: 'Ammon', state: 'ID', zip: 83401 },
  { branchName: 'Indianapolis', branchNumber: 1308, address1: '5520 W 96th St', city: 'Zionsville', state: 'IN', zip: 46077 },
  { branchName: 'Indio', branchNumber: 4132, address1: '45600 Citrus Ave', city: 'Indio', state: 'CA', zip: 92201 },
  { branchName: 'Jackson', branchNumber: 4012, address1: '4200 I-55 S', city: 'Jackson', state: 'MS', zip: 39212 },
  { branchName: 'Jacksonville', branchNumber: 4072, address1: '240 Hammond Blvd', city: 'Jacksonville', state: 'FL', zip: 32254 },
  { branchName: 'Jonesboro', branchNumber: 4166, address1: '2400 Dr MLK Jr Dr', city: 'Jonesboro', state: 'AR', zip: 72401 },
  { branchName: 'Kansas City', branchNumber: 4119, address1: '720 E 3rd St', city: 'Kansas City', state: 'MO', zip: 64106 },
  { branchName: 'Katy', branchNumber: 4066, address1: '502 FM 359 Rd S', city: 'Brookshire', state: 'TX', zip: 77423 },
  { branchName: 'Kenner (Specialty) ', branchNumber: 4112, address1: '212 E Airline Hwy', city: 'Kenner', state: 'LA', zip: 70062 },
  { branchName: 'Kings Mountain', branchNumber: 4145, address1: '612 Canterbury Rd', city: 'Kings Mountain', state: 'NC', zip: 28086 },
  { branchName: 'Knoxville', branchNumber: 4110, address1: '3521 E Governor John Sevier Hwy', city: 'Knoxville', state: 'TN', zip: 37914 },
  { branchName: 'La Mirada', branchNumber: 1051, address1: '14241 E Alondra Blvd', city: 'La Mirada', state: 'CA', zip: 90638 },
  { branchName: 'Lafayette', branchNumber: 4046, address1: '5407 Hwy 90 E', city: 'Broussard', state: 'LA', zip: 70518 },
  { branchName: 'Lake Charles', branchNumber: 4004, address1: '2320 Louis Alleman Pkwy', city: 'Sulphur', state: 'LA', zip: 70663 },
  { branchName: 'Lake Charles (Specialty)', branchNumber: 4131, address1: '2320 Louis Alleman Pkwy', city: 'Sulphur', state: 'LA', zip: 70663 },
  { branchName: 'Lakeland', branchNumber: 4127, address1: '210 Complex Dr', city: 'Lakeland', state: 'FL', zip: 33801 },
  { branchName: 'Las Vegas', branchNumber: 4038, address1: '4129 Losee Rd', city: 'North Las Vegas', state: 'NV', zip: 89030 },
  { branchName: 'Lewistown', branchNumber: 4182, address1: '2566 Truck Byp', city: 'Lewistown', state: 'MT', zip: 59457 },
  { branchName: 'Little Rock', branchNumber: 4010, address1: '11618 Otter Creek South Rd', city: 'Mabelvale', state: 'AR', zip: 72103 },
  { branchName: 'Lodi', branchNumber: 4111, address1: '955 N Guild Ave', city: 'Lodi', state: 'CA', zip: 95240 },
  { branchName: 'Longview', branchNumber: 4115, address1: '5028 W Loop 281 S', city: 'Longview', state: 'TX', zip: 75603 },
  { branchName: 'Los Angeles', branchNumber: 4108, address1: '9050 Norris Ave', city: 'Sun Valley', state: 'CA', zip: 91352 },
  { branchName: 'Louisville', branchNumber: 1307, address1: '10700 Bluegrass Pkwy', city: 'Louisville', state: 'KY', zip: 40299 },
  { branchName: 'Lubbock', branchNumber: 4065, address1: '3227 E Slaton Rd', city: 'Lubbock', state: 'TX', zip: 79404 },
  { branchName: 'Lufkin', branchNumber: 4178, address1: '4530 US Hwy 69 N', city: 'Lufkin', state: 'TX', zip: 75904 },
  { branchName: 'Lynnwood', branchNumber: 4080, address1: '12406 Mukilteo Speedway', city: 'Mukilteo', state: 'WA', zip: 98275 },
  { branchName: 'Macon', branchNumber: 4116, address1: '4600 Pio Nono Ave', city: 'Macon', state: 'GA', zip: 31206 },
  { branchName: 'Marietta', branchNumber: 4117, address1: '1069 Canton Rd', city: 'Marietta', state: 'GA', zip: 30066 },
  { branchName: 'McKinney', branchNumber: 4100, address1: '490 Industrial Blvd', city: 'McKinney', state: 'TX', zip: 75069 },
  { branchName: 'Memphis', branchNumber: 4028, address1: '5245 Hwy 78', city: 'Memphis', state: 'TN', zip: 38118 },
  { branchName: 'Mesquite', branchNumber: 4060, address1: '3550 US Hwy 80 E', city: 'Mesquite', state: 'TX', zip: 75149 },
  { branchName: 'Midland', branchNumber: 4059, address1: '10608 W County Rd 150', city: 'Midland', state: 'TX', zip: 79706 },
  { branchName: 'Mobile', branchNumber: 4134, address1: '6562 Theodore Dawes Rd', city: 'Theodore', state: 'AL', zip: 36582 },
  { branchName: 'Monroe', branchNumber: 4135, address1: '900 Delta Dr', city: 'Monroe', state: 'LA', zip: 71203 },
  { branchName: 'Murfreesboro', branchNumber: 4118, address1: '1231 Bridgestone Pkwy', city: 'La Vergne', state: 'TN', zip: 37086 },
  { branchName: 'Myrtle Beach', branchNumber: 4142, address1: '695 Century Cir', city: 'Conway', state: 'SC', zip: 29526 },
  { branchName: 'Nashville', branchNumber: 4052, address1: '2927 Brick Church Pike', city: 'Nashville', state: 'TN', zip: 37207 },
  { branchName: 'Nashville (Specialty)', branchNumber: 4149, address1: '2927 Brick Church Pike', city: 'Nashville', state: 'TN', zip: 37207 },
  { branchName: 'New Castle', branchNumber: 4126, address1: '9 Bellecor Dr', city: 'New Castle', state: 'DE', zip: 19720 },
  { branchName: 'New Orleans', branchNumber: 4070, address1: '4202 Almonaster Ave', city: 'New Orleans', state: 'LA', zip: 70126 },
  { branchName: 'North Charlotte', branchNumber: 4114, address1: '1150 Biscayne Dr', city: 'Concord', state: 'NC', zip: 28027 },
  { branchName: 'North Phoenix', branchNumber: 4093, address1: '2040 W Pinnacle Peak Rd', city: 'Phoenix', state: 'AZ', zip: 85027 },
  { branchName: 'North Raleigh', branchNumber: 4102, address1: '2701 Connector Dr', city: 'Wake Forest', state: 'NC', zip: 27587 },
  { branchName: 'Ocala', branchNumber: 4143, address1: '1800 NW 58th Ln', city: 'Ocala', state: 'FL', zip: 34475 },
  { branchName: 'Ogden', branchNumber: 4120, address1: '1723 W 1350 S', city: 'Ogden', state: 'UT', zip: 84401 },
  { branchName: 'Oklahoma City', branchNumber: 4026, address1: '10700 NW 4th St', city: 'Yukon', state: 'OK', zip: 73099 },
  { branchName: 'Opelika', branchNumber: 4089, address1: '1870 Columbus Pkwy', city: 'Opelika', state: 'AL', zip: 36804 },
  { branchName: 'Orlando', branchNumber: 4021, address1: '1102 Crown Park Cir', city: 'Winter Garden', state: 'FL', zip: 34787 },
  { branchName: 'Palm Bay', branchNumber: 4121, address1: '6625 Babcock St SE', city: 'Malabar', state: 'FL', zip: 32950 },
  { branchName: 'Palm Bay (Specialty)', branchNumber: 4172, address1: '6625 Babcock St SE', city: 'Malabar', state: 'FL', zip: 32950 },
  { branchName: 'Panama City', branchNumber: 4087, address1: '127 Griffin Blvd', city: 'Panama City Beach', state: 'FL', zip: 32413 },
  { branchName: 'Pasadena', branchNumber: 4063, address1: '10050 New Decade Dr', city: 'Pasadena', state: 'TX', zip: 77507 },
  { branchName: 'Pensacola', branchNumber: 4185, address1: '3381 Bill Metzger Ln', city: 'Pensacola', state: 'FL', zip: 32514 },
  { branchName: 'Peoria', branchNumber: 1305, address1: '1945 N Morton Ave', city: 'Morton', state: 'IL', zip: 61550 },
  { branchName: 'Philadelphia', branchNumber: 4123, address1: '2500 Wheatsheaf Ln', city: 'Philadelphia', state: 'PA', zip: 19137 },
  { branchName: 'Phoenix', branchNumber: 4040, address1: '4010 S 22nd St', city: 'Phoenix', state: 'AZ', zip: 85040 },
  { branchName: 'Phoenix (Specialty)', branchNumber: 4173, address1: '4010 S 22nd St', city: 'Phoenix', state: 'AZ', zip: 85040 },
  { branchName: 'Pompano Beach', branchNumber: 4031, address1: '1660 N Powerline Rd', city: 'Pompano Beach', state: 'FL', zip: 33069 },
  { branchName: 'Port Allen', branchNumber: 4152, address1: '4247 I-10 Frontage Rd', city: 'Port Allen', state: 'LA', zip: 70767 },
  { branchName: 'Prineville', branchNumber: 4086, address1: '2541 SW High Desert Dr', city: 'Prineville', state: 'OR', zip: 97754 },
  { branchName: 'Pueblo', branchNumber: 4144, address1: '3001 N Freeway Rd', city: 'Pueblo', state: 'CO', zip: 81008 },
  { branchName: 'Raleigh', branchNumber: 1117, address1: '3821 Generosity Ct', city: 'Garner', state: 'NC', zip: 27529 },
  { branchName: 'Raleigh (Specialty)', branchNumber: 4150, address1: '2701 Connector Dr', city: 'Wake Forest', state: 'NC', zip: 27587 },
  { branchName: 'Reno', branchNumber: 4039, address1: '845 N Hills Blvd', city: 'Reno', state: 'NV', zip: 89506 },
  { branchName: 'Sacramento', branchNumber: 4051, address1: '4800 Straus Dr', city: 'Sacramento', state: 'CA', zip: 95838 },
  { branchName: 'Salt Lake City', branchNumber: 4034, address1: '5052 W 2400 S, Bldg A', city: 'Salt Lake City', state: 'UT', zip: 84120 },
  { branchName: 'San Angelo', branchNumber: 4153, address1: '6728 Hwy 853', city: 'San Angelo', state: 'TX', zip: 76901 },
  { branchName: 'San Antonio', branchNumber: 4008, address1: '5327 Tex-Con Rd', city: 'San Antonio', state: 'TX', zip: 78220 },
  { branchName: 'San Diego', branchNumber: 1053, address1: '6006 Miramar Rd', city: 'San Diego', state: 'CA', zip: 92121 },
  { branchName: 'San Francisco', branchNumber: 4064, address1: '4381 Bettencourt Way', city: 'Union City', state: 'CA', zip: 94587 },
  { branchName: 'San Jose', branchNumber: 4069, address1: '2066 S 10th St', city: 'San Jose', state: 'CA', zip: 95112 },
  { branchName: 'Santa Maria', branchNumber: 4164, address1: '1429 S Blosser Rd', city: 'Santa Maria', state: 'CA', zip: 93458 },
  { branchName: 'Savannah', branchNumber: 4075, address1: '510 Bourne Ave', city: 'Savannah', state: 'GA', zip: 31408 },
  { branchName: 'Schertz (Specialty)', branchNumber: 4098, address1: '18115 I-35 N', city: 'Schertz', state: 'TX', zip: 78154 },
  { branchName: 'Seattle', branchNumber: 4061, address1: '8810 S 208th St', city: 'Kent', state: 'WA', zip: 98031 },
  { branchName: 'Shreveport', branchNumber: 4023, address1: '3775 Old Shed Rd', city: 'Bossier City', state: 'LA', zip: 71111 },
  { branchName: 'South Lafayette', branchNumber: 1301, address1: '2835 Concord Rd', city: 'Lafayette', state: 'IN', zip: 47909 },
  { branchName: 'South Orlando', branchNumber: 4124, address1: '950 Jetstream Dr', city: 'Orlando', state: 'FL', zip: 32824 },
  { branchName: 'Springfield', branchNumber: 4175, address1: '2520 N Eastgate Ave', city: 'Springfield', state: 'MO', zip: 65803 },
  { branchName: 'St. George', branchNumber: 4037, address1: '4319 S River Rd', city: 'St. George', state: 'UT', zip: 84790 },
  { branchName: 'St. Louis', branchNumber: 1304, address1: '10 Central Industrial Dr Ste 8', city: 'Granite City', state: 'IL', zip: 62040 },
  { branchName: 'Statesville', branchNumber: 4151, address1: '160 Ebenezer Rd', city: 'Statesville', state: 'NC', zip: 28625 },
  { branchName: 'Suwanee', branchNumber: 4076, address1: '745 Brogdon Rd', city: 'Suwanee', state: 'GA', zip: 30024 },
  { branchName: 'Tallahassee', branchNumber: 4090, address1: '461 Commerce Blvd', city: 'Midway', state: 'FL', zip: 32343 },
  { branchName: 'Tampa', branchNumber: 4020, address1: '6227 E Adamo Dr', city: 'Tampa', state: 'FL', zip: 33619 },
  { branchName: 'Temple', branchNumber: 4099, address1: '597 Northpoint Dr', city: 'Temple', state: 'TX', zip: 76501 },
  { branchName: 'Terre Haute', branchNumber: 1306, address1: '1151 E Park Ave', city: 'Terre Haute', state: 'IN', zip: 47805 },
  { branchName: 'Texarkana', branchNumber: 4158, address1: '4300 Gazola St', city: 'Texarkana', state: 'TX', zip: 75501 },
  { branchName: 'Tucson', branchNumber: 4041, address1: '6155 S Campbell Ave', city: 'Tucson', state: 'AZ', zip: 85706 },
  { branchName: 'Tulsa', branchNumber: 4025, address1: '5644 W 55th St', city: 'Tulsa', state: 'OK', zip: 74107 },
  { branchName: 'Ventura', branchNumber: 4163, address1: '2509 N Ventura Ave', city: 'Ventura', state: 'CA', zip: 93001 },
  { branchName: 'Warrenton', branchNumber: 1114, address1: '6571 Merchant Pl', city: 'Warrenton', state: 'VA', zip: 20187 },
  { branchName: 'West Phoenix', branchNumber: 4176, address1: '1102 N 85th Ave', city: 'Tolleson', state: 'AZ', zip: 85353 },
  { branchName: 'West San Antonio', branchNumber: 4133, address1: '402 Callaghan Rd', city: 'San Antonio', state: 'TX', zip: 78228 },
  { branchName: 'Wichita', branchNumber: 4155, address1: '3540 S Hoover Rd', city: 'Wichita', state: 'KS', zip: 67215 },
  { branchName: 'Wilmington', branchNumber: 4141, address1: '851 Sunnyvale Dr', city: 'Wilmington', state: 'NC', zip: 28412 },
];

export function main() {
  console.log(GLOBALVARS.currentPage);
  document.title = 'H&E Rentals Print Store';
  const kitWorkflow = new KitWorkflow(kits);
  kitWorkflow.run();

  $('.linkS').on('click', () => {
    localStorage.removeItem('shouldRedirectToCatalog');
  });

  const shoppingCartLinks = $('.linkS a');
  shoppingCartLinks.each((index, link) => {
    $(link).html($(link).text().replace('SHOPPING CART', '<i class="fa-solid fa-cart-shopping"></i>'));
  });

  $('.linkC a').attr('href', '/catalog/?g=3073&y=6985');
  $('#navWrapper').append(`<i class="fa-solid fa-bars hamburger-icon"></i>`);
  $('#mainContainerSF').append(`<div id="hamburger-overlay">
						<i class="fa-solid fa-xmark hamburger-exit"></i>
						<ul id="mobile-menu">
							<li class="menuY linkH">
								<a href="../page.php?id=7">HOME</a>
  							</li>
							<li class="menuY linkC">
								<a href="/catalog/?g=3073&amp;y=6985">CATALOG</a>
  							</li>
							<li class="menuG linkA">
								<a href="/account/index.php">MY ACCOUNT</a>
  							</li>
							<li class="menuY linkS">
								<a href="/cart/index.php">${$('.linkS a').text()}</a>
  							</li>
						</ul>
  					</div>`);
  $('.hamburger-icon').on('click', () => {
    $('#hamburger-overlay').show();
  });
  $('.hamburger-exit').on('click', () => {
    $('#hamburger-overlay').hide();
  });

  if (GLOBALVARS.currentPage === StorefrontPage.ADDTOCART) {
    const product = $('.tablesorter tbody tr td').eq(1);
    const productName = $(product).text().trim();

    localStorage.setItem('shouldRedirectToCatalog', 'true');

    if ($('#returnToCartButton').css('display') === 'block') {
      $('#addToCartButton').remove();
    }

    if (productName === 'Holiday Card and Envelope') {
      $('#quantityCol').css('display', 'flex');
      $('#quantityCol').append(
        `<p class="eachQty" style="margin-left:12px;font-weight:bold;color:red">${$('input#quantity').attr('value')} Packs = ${
          $('input#quantity').attr('value') ?? 0 * 25
        } Cards and Envelopes</p>`
      );
      $('input#quantity').on('keyup', (e) => {
        const enteredQty = Number((e.target as HTMLSelectElement).value.replace(/\D/g, '')) ?? 0;
        $('.eachQty').text(`${enteredQty} Packs = ${enteredQty * 25} Cards and Envelopes`);
      });
    }
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CART) {
    if (localStorage.getItem('shouldRedirectToCatalog')) {
      $('.tableMain_wrap, footer').hide();
      window.location.pathname = '/catalog';
    }
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CATALOG) {
    // Categories that should have a toggle arrow
    const parentCategories = ['Decals', 'Flyers', 'Forms', 'Recruiting', 'Signage', 'Stationery', 'Training'];

    // Categories that should be wrapped in dropdown-container div
    // .JK_Drop_
    const dropdownMenus = [
      ['Equipment', 'Rough Textured Surface', 'Inspection', 'Water Trucks and Towers', 'Tools'],
      ['Recruiting Flyers', 'Sales Flyers', 'Specialty Flyers'],
      ['Admin', 'Parts', 'Rentals', 'Service', 'Vehicle Compliance'],
      ['Banners‎ ', 'Business Cards‎ ', 'Flyers‎ ', 'Recruiting Cards‎ ', 'Thank You Cards‎ '],
      ['Banners', 'Office', 'Safety', 'Sign Bases', 'Yard Signs'],
      ['Business Cards', 'Envelopes', 'Holiday Cards', 'Labels', 'Letterhead', 'Recruiting Cards', 'Thank You Cards'],
      ['Booklets', 'Cards', 'Certificates'],
    ];

    function renderDropDown() {
      const storedHTML = sessionStorage.getItem('JK_Dropdown');

      function adjustHTML() {
        // $(`li.TCbullet[style="text-indent:10px;"]`).each((index, item) => {
        //   $(item).attr('style', 'margin-left:10px;');
        // });
        // $(`li.TCbullet[style="text-indent:20px;"]`).each((index, item) => {
        //   $(item).attr('style', 'margin-left:20px;');
        // });
        // $(`li.TCbullet[style="text-indent:30px;"]`).each((index, item) => {
        //   $(item).attr('style', 'margin-left:30px;');
        // });
        //Find parent categories, add dropdown-btn class and JK_Drop_${categoryName} class
        parentCategories.forEach((category) => {
          if ($(`a[alt="${category}"]`)[0] === undefined) return;
          ($(`a[alt="${category}"]`)[0].parentElement as HTMLElement).classList.add('dropdown-btn');
        });
        $('.anchorCategory').each((index, item) => {
          let category = 'JK_Drop_' + item.innerHTML;
          category = category.replace(/\s+/g, '').replace('(', '').replace(')', '');
          (item.parentElement as HTMLElement).classList.add(category);
        });

        dropdownMenus.forEach((catArr) => {
          catArr.forEach((cat, index) => {
            catArr[index] = `.JK_Drop_${cat.replace(/\s/g, '')}`;
          });
          let selector = catArr.join(',');
          if ($(selector) === undefined) return;
          $(selector).wrapAll(`<div class="dropdown-container"/>`);
        });
        $('.dropdown-btn').append(`<i class="fa-solid fa-caret-down"></i><i class="fa-solid fa-caret-left"></i>`);
      }
      function addListeners() {
        //Toggle dropdown when clicked
        let dropdown = document.getElementsByClassName('dropdown-btn');
        for (let i = 0; i < dropdown.length; i++) {
          dropdown[i].children[1].addEventListener('click', function () {
            dropdown[i].classList.toggle('active');
            let dropdownContent = dropdown[i].nextElementSibling;
            console.log(dropdownContent);
            if ((dropdownContent as HTMLElement).style.display === 'block') {
              (dropdownContent as HTMLElement).style.display = 'none';
            } else {
              (dropdownContent as HTMLElement).style.display = 'block';
            }
            sessionStorage.setItem('JK_Dropdown', $('.TreeControl')[0].outerHTML);
          });
          dropdown[i].children[2].addEventListener('click', function () {
            dropdown[i].classList.toggle('active');
            let dropdownContent = dropdown[i].nextElementSibling;
            if ((dropdownContent as HTMLElement).style.display === 'block') {
              (dropdownContent as HTMLElement).style.display = 'none';
            } else {
              (dropdownContent as HTMLElement).style.display = 'block';
            }
            sessionStorage.setItem('JK_Dropdown', $('.TreeControl')[0].outerHTML);
          });
        }
      }

      if (storedHTML !== null) {
        if ($('#active').length === 0) {
          $('.TreeControl')[0].outerHTML = storedHTML.replace(`id="active"`, ``);
          addListeners();
          return;
        }
        const activeCategory = $('#active')[0].outerText;
        console.log(activeCategory);
        $('.TreeControl')[0].outerHTML = storedHTML.replace(`id="active"`, ``);
        $('.TCbullet').each((index, item) => {
          if (item.outerText === activeCategory) item.setAttribute('id', 'active');
        });
        addListeners();
      } else {
        adjustHTML();
        addListeners();
      }
      $('.TreeControl').css('display', 'block');
    }
    $('.TreeControl').css('display', 'none');
    setTimeout(renderDropDown, 50);

    $('.meta .ui-state-error').each((index, item) => {
      item.innerText = 'Available 0';
    });
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTADDRESS) {
    $('#addressBook, #newAddress').hide();
    $('#shipToCompany button.btnEdit').remove();
    $(`button[rel="Ship to company"]`).text('Ship to My Branch');
    $('#PorCAddress .ui-box header span').text('Choose a shipping address');
    $('#shipToMyAddress').empty();
    $('#PorCAddress table tbody tr td')
      .eq(1)
      .html(
        `<button id="ship-to-diff-add-btn" class="jqButton btnArrowRight btnRight ui-button ui-corner-all ui-widget" type="button">Ship to another address</button>`
      );
    $('#ship-to-diff-add-btn').on('click', () => {
      $('#addressBook, #newAddress').show();
    });
    $("select.country option:not(:contains('United States'))").remove();
    $(
      "select.state option[value='AS'], select.state option[value='AA'], select.state option[value='AE'], select.state option[value='AP'], select.state option[value='GU'], select.state option[value='MH'], select.state option[value='MP'], select.state option[value='PR'], select.state option[value='UM'], select.state option[value='VI']"
    ).remove();
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTCONFIRMATION) {
    $('#orderMoreOptions li:nth-of-type(1), #orderMoreOptions li:nth-of-type(3)').remove();
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTPAYMENT) {
    $('#quoteName').attr('placeholder', 'This field is NOT required');
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTREVIEW) {
    const shippingMethod = $('#orderShippingMethod');
    const shippingMethodHTML = shippingMethod.html();
    shippingMethod.html(shippingMethodHTML.replace('<br>\n\t\t\t\t\t\t\tTurnaround: Standard\t\t\t\t\t\t\t', ''));
    $('#specialInstructionsBox section').prepend(
      "<p style='text-align:center'>NOTE: Entering any special instructions will cause your order to be reviewed by the next available Customer Services Representative.<br><span style='color:red;font-weight:bold'>Please be advised this will delay your order going into production and is some cases could cause your order to miss the daily shipping cut-off time.</span></p>"
    );
    $('textarea[name="comments"]').attr('placeholder', 'Enter Special Instructions Here');
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CHECKOUTSHIPPING) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CREATEEDITACCOUNT) {
  }
  if (GLOBALVARS.currentPage === StorefrontPage.CUSTOMIZETEMPLATE) {
    const activeTemplate = $('.templateName a').text().trim();
    if (activeTemplate.includes('Business Card') || activeTemplate.includes('BC Label')) {
      $('#show_userform').prepend(
        `<div class="format_rules"><h1>Formatting Rules</h1><ol><li>Title should be case sensitive, not all caps, or lower case.</li><li>Title should contain and or of, no ampersands (&), forward slashes (/), or hyphens (-).</li><li>Title abbreviations should be acronyms, not shortened words (SVP vs. Senior VP or Sr. VP).</li></ol></div>`
      );
    }
    if (activeTemplate.includes('New Branch Startup Kit')) {
      $('#customizePager').prepend(
        '<h1>New Branch Startup Kit</h1><h2>This kit includes folders, forms, flyers, banners, office and safety signage, recruiting and thank you cards, and all tags to get a new branch started.  Please see the list for all items and quantities.  All items can be ordered separately from the store if additional quantities are needed at a later date.</h2>'
      );
    }
  }
  if (GLOBALVARS.currentPage === StorefrontPage.MYACCOUNT) {
    $('.copyright a').text('print@he-equipment.com').attr('href', 'mailto:print@he-equipment.com?subject=Print%20Store%20Question');
  }
  if (GLOBALVARS.currentPage === StorefrontPage.VIEWORDERS) {
    //Removes "Payment Pending" and "Waiting Approval" filters
    $(`#searchScope optgroup[label="By Order Status"] option[value="-2"],#searchScope optgroup[label="By Order Status"] option[value="-3"]`).remove();
  }
  if (GLOBALVARS.currentPage === StorefrontPage.BILLINGADDRESS) {
    $("select.country option:not(:contains('United States'))").remove();
    $(
      "select.state option[value='AS'], select.state option[value='AA'], select.state option[value='AE'], select.state option[value='AP'], select.state option[value='GU'], select.state option[value='MH'], select.state option[value='MP'], select.state option[value='PR'], select.state option[value='UM'], select.state option[value='VI']"
    ).remove();

    $('#billAdrOnFileBox').after(`
      <div class="ui-box">
          <header>Address Book</header>
          <section>
              <select id="billAddressSelect" value="Default">
                  <option value="Default">Choose an Address</option>
              </select>
          </section>
      </div>
      `);

    billingAddresses.forEach((address) => {
      $(`#billAddressSelect`).append(`<option value="${address.branchNumber}">${address.branchName}</option>`);
    });

    $('#billAddressSelect').on('change', (e) => {
      const selectedBranch = billingAddresses.find((val) => val.branchNumber.toString() === (e.target as HTMLSelectElement).value);
      $(`input[name="fullName"]`).val(selectedBranch?.branchName ?? '');
      $(`input[name="street"]`).val(selectedBranch?.address1 ?? '');
      $(`input[name="city"]`).val(selectedBranch?.city ?? '');
      $(`select[name="state"]`).val(selectedBranch?.state ?? '');
      $(`input[name="zip"]`).val(selectedBranch?.zip ?? '');
      $(`select[name="country"]`).val('US');
    });
  }
}
