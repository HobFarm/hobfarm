export const trashMountainMediaBase = "https://cdn.hob.farm/articles/trash-mountain";
export const ownedTrashMediaBase = `${trashMountainMediaBase}/source`;
export const trashMountainGoogleEarthBase = `${trashMountainMediaBase}/google-earth`;

export type TrashMountainPhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export const overflowPhotos: TrashMountainPhoto[] = [
  {
    src: `${ownedTrashMediaBase}/trash-001-overflow-comforter-grass-2020-05-13.jpg`,
    alt: "An overflowing blue sidewalk trash basket surrounded by bags, a dirty white comforter and a tray of green grass.",
    caption: "Bedding, bags, food waste and a rectangle of grass collect around a street container on May 13, 2020.",
    width: 1536,
    height: 2048,
  },
  {
    src: `${ownedTrashMediaBase}/trash-002-overflow-blue-bin-2020-05-13.jpg`,
    alt: "A blue sidewalk trash basket piled above the rim with paper, plastic and a discarded black panel.",
    caption: "The container still exists. Its usable capacity is already gone.",
    width: 1536,
    height: 2048,
  },
  {
    src: `${ownedTrashMediaBase}/trash-003-mcdonalds-counter-overflow-2016-07-21.jpg`,
    alt: "Used cups, lids, napkins and bags piled across a McDonald’s waste counter.",
    caption: "A restaurant waste station between customer use and the next collection step, July 21, 2016.",
    width: 1152,
    height: 2048,
  },
];

export const transferPhotos: TrashMountainPhoto[] = [
  {
    src: `${ownedTrashMediaBase}/trash-004-metal-cans-container-2016-09-01.jpg`,
    alt: "A large metal container filled edge to edge with used food cans of many sizes and labels.",
    caption: "Separated metal cans may still be material rather than disposal, September 1, 2016.",
    width: 1152,
    height: 2048,
  },
  {
    src: `${ownedTrashMediaBase}/trash-005-restaurant-bin-vietnamese-signage-2017-11-20.jpg`,
    alt: "An open restaurant waste cabinet and full bin piled with bowls, cups, bottles, napkins and food packaging.",
    caption: "The bin is full, the cabinet door is open, and the waste has begun occupying the station. The exact location is unconfirmed.",
    width: 1152,
    height: 2048,
  },
  {
    src: `${ownedTrashMediaBase}/trash-006-hot-water-station-vietnamese-signage-2017-11-20.jpg`,
    alt: "A hot-water station with wrappers and containers across the counter, a full trash bin below and litter on the floor.",
    caption: "The service point keeps operating after its waste capacity has failed. The exact location is unconfirmed.",
    width: 1152,
    height: 2048,
  },
];

export const curbsidePhotos: TrashMountainPhoto[] = [
  {
    src: `${ownedTrashMediaBase}/trash-007-lexington-bin-mcdonalds-2018-11-25.jpg`,
    alt: "A dark sidewalk trash can overflowing with drink cups, bags and McDonald’s packaging at an urban intersection.",
    caption: "A full street bin becomes a temporary pile before the truck arrives, November 25, 2018.",
    width: 1152,
    height: 2048,
  },
  {
    src: `${ownedTrashMediaBase}/trash-008-mall-pizza-box-spill-2019-12-24.jpg`,
    alt: "A full concrete trash receptacle beside flattened pizza boxes, paper bags and loose litter on a walkway at night.",
    caption: "The excess finds adjacent ground, December 24, 2019.",
    width: 2048,
    height: 1536,
  },
  {
    src: `${ownedTrashMediaBase}/trash-009-shopping-carts-possessions-trash-date-unknown.jpg`,
    alt: "Several shopping carts loaded with cardboard, clothing, papers and bags beside a metal fence.",
    caption: "Objects can sit between possessions, recoverable material and what a city classifies as waste. No people or circumstances are inferred from the image.",
    width: 2048,
    height: 1536,
  },
  {
    src: `${ownedTrashMediaBase}/trash-010-discarded-furry-chair-bicycle-tires-2020-05-13.jpg`,
    alt: "A discarded white furry chair, bicycle tires, a cardboard box and bags beside an overflowing blue street bin.",
    caption: "Bulky objects exceed the design of the ordinary street container and assemble beside it, May 13, 2020.",
    width: 1536,
    height: 2048,
  },
];

export type FatalWasteSlopeEvent = {
  id: string;
  date: string;
  site: string;
  place: string;
  country: string;
  confirmed: string;
  missing?: string;
  reachedHomes: "yes" | "no" | "unclear";
  confidence: string;
  note: string;
  sourceUrl: string;
};

const globalReview =
  "https://www.engineeringx.org/media/1trjwb2z/global-review-on-safer-end-of-engineered-life.pdf";

export const fatalWasteSlopeEvents: FatalWasteSlopeEvent[] = [
  {
    id: "E01",
    date: "1996-09-10",
    site: "Bens / O Portiño dump",
    place: "A Coruña / O Portiño",
    country: "Spain",
    confirmed: "1",
    reachedHomes: "yes",
    confidence: "medium",
    note: "A large waste mass reached homes. Kept in the ledger pending a stronger Spanish-language archive receipt.",
    sourceUrl: globalReview,
  },
  {
    id: "E02",
    date: "2000-07-10",
    site: "Payatas landfill",
    place: "Quezon City, Metro Manila",
    country: "Philippines",
    confirmed: "218 official / 278 recovered in engineering account",
    reachedHomes: "yes",
    confidence: "high",
    note: "More than 330 people were buried after extreme rain. The two death records remain separate instead of being averaged.",
    sourceUrl: "https://scholarlycommons.pacific.edu/soecs-facarticles/209/",
  },
  {
    id: "E03",
    date: "2005-02-21",
    site: "Leuwigajah dumpsite",
    place: "Bandung / Cimahi, West Java",
    country: "Indonesia",
    confirmed: "143",
    reachedHomes: "yes",
    confidence: "high",
    note: "Heavy rain, saturation, gas and deep internal fire contributed to a roughly one-kilometre runout that buried 71 houses.",
    sourceUrl: "https://hal.science/hal-01262274/file/Leuwigadjah.pdf",
  },
  {
    id: "E04",
    date: "2006",
    site: "Bantargebang landfill",
    place: "Bekasi, West Java",
    country: "Indonesia",
    confirmed: "28",
    reachedHomes: "unclear",
    confidence: "low",
    note: "Provisional technical-inventory row. No satisfactory independent contemporary source was located.",
    sourceUrl: globalReview,
  },
  {
    id: "E05",
    date: "2008-06",
    site: "Guatemala City municipal dump",
    place: "Guatemala City",
    country: "Guatemala",
    confirmed: "8",
    reachedHomes: "no",
    confidence: "medium-low",
    note: "Earlier 2008 dump collapse referenced by reporting on a second failure; Spanish-language archive work remains open.",
    sourceUrl: globalReview,
  },
  {
    id: "E06",
    date: "2008-07-25",
    site: "Guatemala City municipal dump",
    place: "Guatemala City",
    country: "Guatemala",
    confirmed: "4",
    missing: "14–20",
    reachedHomes: "no",
    confidence: "medium",
    note: "Rain-saturated waste struck people working in the dump. Missing people are not counted as confirmed deaths.",
    sourceUrl: globalReview,
  },
  {
    id: "E07",
    date: "2010-03-16",
    site: "Galuga dump",
    place: "Bogor, West Java",
    country: "Indonesia",
    confirmed: "4",
    reachedHomes: "no",
    confidence: "low",
    note: "Provisional technical-inventory row pending an independent Indonesian-language source.",
    sourceUrl: globalReview,
  },
  {
    id: "E08",
    date: "2011-08-27",
    site: "Irisan dump",
    place: "Baguio",
    country: "Philippines",
    confirmed: "6",
    reachedHomes: "yes",
    confidence: "medium-high",
    note: "A retaining-wall failure followed three days of Typhoon Mina rain and reached houses below the dump.",
    sourceUrl: globalReview,
  },
  {
    id: "E09",
    date: "2016-04-27",
    site: "Guatemala City municipal dump",
    place: "Guatemala City",
    country: "Guatemala",
    confirmed: "4",
    missing: "24",
    reachedHomes: "no",
    confidence: "medium",
    note: "The source record sometimes turns the missing count into fatalities. This ledger does not.",
    sourceUrl: globalReview,
  },
  {
    id: "E10",
    date: "2016-05-30",
    site: "Hrybovychi landfill",
    place: "near Lviv",
    country: "Ukraine",
    confirmed: "4",
    reachedHomes: "no",
    confidence: "high",
    note: "The slope failed while firefighters and emergency personnel were responding to a major landfill fire.",
    sourceUrl: globalReview,
  },
  {
    id: "E11",
    date: "2017-03-11",
    site: "Koshe / Repi landfill",
    place: "Addis Ababa",
    country: "Ethiopia",
    confirmed: "116",
    reachedHomes: "yes",
    confidence: "high",
    note: "The waste mass overran homes and informal structures. UN-Habitat uses 116 deaths; other reports use 113.",
    sourceUrl:
      "https://unhabitat.org/news/05-jul-2019/after-the-tragic-landslide-that-killed-116-koshe-landfill-in-addis-ababa-is-safer",
  },
  {
    id: "E12",
    date: "2017-04-14",
    site: "Meethotamulla dump",
    place: "Colombo",
    country: "Sri Lanka",
    confirmed: "32",
    missing: "8",
    reachedHomes: "yes",
    confidence: "high",
    note: "The waste mountain collapsed into a residential area; reports describe 145 houses destroyed or damaged.",
    sourceUrl:
      "https://www.reuters.com/article/world/sri-lanka-landslide-death-toll-rises-to-29-unknown-number-still-missing-idUSKBN17J1ES/",
  },
  {
    id: "E13",
    date: "2017-08-21",
    site: "Dar-es-Salam / La Minière dump",
    place: "Conakry",
    country: "Guinea",
    confirmed: "at least 10",
    reachedHomes: "yes",
    confidence: "high",
    note: "Early reports used lower totals. Amnesty International later recorded at least ten deaths, including two children.",
    sourceUrl:
      "https://www.amnesty.org/en/wp-content/uploads/2021/05/POL1067002018ENGLISH.pdf",
  },
  {
    id: "E14",
    date: "2017-09-01",
    site: "Ghazipur landfill",
    place: "Delhi",
    country: "India",
    confirmed: "2",
    reachedHomes: "no",
    confidence: "high",
    note: "Waste swept vehicles and people from a road into a canal.",
    sourceUrl: globalReview,
  },
  {
    id: "E15",
    date: "2018-02-19",
    site: "Hulene dump",
    place: "Maputo",
    country: "Mozambique",
    confirmed: "17",
    reachedHomes: "yes",
    confidence: "high",
    note: "A roughly fifteen-metre waste pile collapsed at night after heavy rain and buried seven houses.",
    sourceUrl: globalReview,
  },
  {
    id: "E16",
    date: "2020-02-06",
    site: "Zaldibar landfill",
    place: "Basque Country",
    country: "Spain",
    confirmed: "2",
    reachedHomes: "no",
    confidence: "high",
    note: "Nearly 500,000 tonnes of industrial waste collapsed onto the A-8 motorway; fire and asbestos complicated recovery.",
    sourceUrl: globalReview,
  },
  {
    id: "E17",
    date: "2024-08-09",
    site: "Kiteezi landfill",
    place: "Kampala / Wakiso",
    country: "Uganda",
    confirmed: "35",
    missing: "28 in the latest strong missing-person update located",
    reachedHomes: "yes",
    confidence: "high for deaths; missing unresolved",
    note: "A large section failed after torrential rain and buried homes. A March 2026 UN update still used 35 deaths.",
    sourceUrl: "https://uganda.un.org/en/311606-disaster-recovery-restoring-safety-kiteezi-landfill",
  },
  {
    id: "E18",
    date: "2026-01-08",
    site: "Binaliw landfill",
    place: "Cebu City",
    country: "Philippines",
    confirmed: "36 direct",
    reachedHomes: "no",
    confidence: "high",
    note: "All reported people were accounted for by January 18. A later responder death remains separate from the direct toll.",
    sourceUrl:
      "https://www.gmanetwork.com/news/topstories/regions/973233/cebu-landfill-landslide-victims-now-all-accounted-for-with-last-missing-body-found/story/",
  },
  {
    id: "E19",
    date: "2026-02-20",
    site: "Rodriguez private dump",
    place: "Rodriguez, Rizal",
    country: "Philippines",
    confirmed: "1 official / 3 in later technical reporting",
    missing: "2 in the February 24 official update",
    reachedHomes: "no",
    confidence: "disputed current record",
    note: "The audit total uses the later three-death account; the strongest official update located still separated one confirmed death from two missing people.",
    sourceUrl: "https://www.pna.gov.ph/articles/1269725",
  },
  {
    id: "E20",
    date: "2026-03-08",
    site: "Bantargebang landfill",
    place: "Bekasi, West Java",
    country: "Indonesia",
    confirmed: "7",
    reachedHomes: "no",
    confidence: "high",
    note: "Reuters reported that everyone at the site was accounted for when rescue operations ended.",
    sourceUrl:
      "https://www.reuters.com/business/environment/indonesia-says-7-killed-landfill-collapse-rescue-operation-ends-2026-03-10/",
  },
  {
    id: "E21",
    date: "2026-05-20",
    site: "New Carmen landfill",
    place: "Davao City",
    country: "Philippines",
    confirmed: "2",
    missing: "1 as of May 27",
    reachedHomes: "yes",
    confidence: "medium-high; current record",
    note: "Water accumulated beneath waste after heavy rain and part of the mound moved into houses.",
    sourceUrl: "https://www.pna.gov.ph/articles/1275943",
  },
  {
    id: "E22",
    date: "2026-07-08",
    site: "Moshi legacy-waste mound",
    place: "Pune",
    country: "India",
    confirmed: "9",
    reachedHomes: "no",
    confidence: "high for toll; cause under investigation",
    note: "A legacy-waste mound struck an administrative building at a waste-processing facility. The final body was recovered July 12.",
    sourceUrl:
      "https://indianexpress.com/article/cities/pune/pune-building-moshi-garbage-dump-collapse-death-toll-final-body-recovered-10782814/",
  },
];
