import {getSubject,subjects} from "./content";

export type HubMember={slug:string;tag:string;image:string;imageAlt:string;imageCredit:string};
export type HubGroup={title:string;members:HubMember[];coming?:{title:string;text:string}};
export type HubSpotlightFact={value:string;text:string;sourceTitle:string;sourcePublisher:string;sourceUrl:string};
export type HubPlannedGroup={title:string;note:string};
export type Hub={slug:string;title:string;eyebrow:string;description:string;status:"live"|"coming";heroImage:string|null;heroImageAlt:string;heroImageCredit:string;startHere:{slug:string;teaser:string}[];spotlightFacts:HubSpotlightFact[];groups:HubGroup[];plannedGroups:HubPlannedGroup[]};

export const hubs:Hub[]=[
 {slug:"trees",title:"Trees",eyebrow:"NATURE HUB",description:"Giants that outlive empires, orchards that feed nations, and miniature forests in a pot. One world, many ways in.",status:"live",
  heroImage:"https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Baobab_Adansonia_digitata.jpg/1280px-Baobab_Adansonia_digitata.jpg",heroImageAlt:"A baobab tree with a massive trunk and wide green canopy, standing in open savanna",heroImageCredit:"Muhammad Mahdi Karim, GFDL 1.2, via Wikimedia Commons",
  startHere:[
   {slug:"baobab",teaser:"The upside-down tree with a trunk like a reservoir."},
   {slug:"coast-redwood",teaser:"The tallest living things on Earth."},
   {slug:"bonsai",teaser:"A whole forest, kept in a tray by pruning and patience."}
  ],
  spotlightFacts:[
   {value:"9 m",text:"Diameter a baobab's water-storing trunk can reach.",sourceTitle:"Baobab",sourcePublisher:"Encyclopaedia Britannica",sourceUrl:"https://www.britannica.com/plant/baobab-tree-genus"},
   {value:"350 ft+",text:"Height a coast redwood trunk reaches — the tallest tree in the world.",sourceTitle:"Coast Redwood",sourcePublisher:"U.S. National Park Service",sourceUrl:"https://www.nps.gov/articles/000/coast-redwood.htm"},
   {value:"6,000 yrs",text:"How long the mango has been grown in India.",sourceTitle:"Mango",sourcePublisher:"National Library Board, Singapore",sourceUrl:"https://www.nlb.gov.sg/main/article-detail?cmsuuid=19f989c8-6334-4912-ae59-0c464ad557c9"},
   {value:"3,020",text:"Cherry trees gifted by Japan to the United States in 1912.",sourceTitle:"History of the Cherry Trees",sourcePublisher:"U.S. National Park Service",sourceUrl:"https://www.nps.gov/subjects/cherryblossom/history-of-the-cherry-trees.htm"}
  ],
  groups:[
   {title:"Giants & ancients",members:[
    {slug:"baobab",tag:"MADAGASCAR · AFRICA · AUSTRALIA",image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Baobab_Adansonia_digitata.jpg/330px-Baobab_Adansonia_digitata.jpg",imageAlt:"A baobab tree with a massive trunk and wide green canopy",imageCredit:"Muhammad Mahdi Karim, GFDL 1.2, via Wikimedia Commons"},
    {slug:"coast-redwood",tag:"NORTH AMERICA · CONIFER",image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/US_199_Redwood_Highway.jpg/330px-US_199_Redwood_Highway.jpg",imageAlt:"Towering coast redwood trunks beside a highway",imageCredit:"Acroterion, CC BY-SA 4.0, via Wikimedia Commons"}
   ]},
   {title:"Fruit trees",members:[
    {slug:"mango-tree",tag:"SOUTH ASIA · NATIONAL TREE OF BANGLADESH",image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Mangoes_%28Magnifera_indica%29_from_India.jpg/330px-Mangoes_%28Magnifera_indica%29_from_India.jpg",imageAlt:"Unripe green mangoes growing on a branch",imageCredit:"Billjones94, CC BY-SA 4.0, via Wikimedia Commons"}
   ],coming:{title:"Apple · Olive · Fig · Citrus",text:"The orchard grows one verified subject at a time. Each joins this group the day it is published."}},
   {title:"Art & culture",members:[
    {slug:"bonsai",tag:"JAPAN · LIVING ART",image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Bonsai%2C_Kenshin_Toge.jpg/330px-Bonsai%2C_Kenshin_Toge.jpg",imageAlt:"The Kenshin Tōge bonsai on museum display",imageCredit:"Order of the Rose, CC BY 4.0, via Wikimedia Commons"},
    {slug:"cherry-blossom",tag:"JAPAN · HANAMI",image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Sakura_and_Moss_Pink_-_%E6%A1%9C%28%E3%81%95%E3%81%8F%E3%82%89%29%E3%81%A8%E8%8A%9D%E6%A1%9C%28%E3%81%97%E3%81%B0%E3%81%96%E3%81%8F%E3%82%89%29.jpg/330px-Sakura_and_Moss_Pink_-_%E6%A1%9C%28%E3%81%95%E3%81%8F%E3%82%89%29%E3%81%A8%E8%8A%9D%E6%A1%9C%28%E3%81%97%E3%81%B0%E3%81%96%E3%81%8F%E3%82%89%29.jpg",imageAlt:"Cherry blossom canopy over a field of pink moss phlox",imageCredit:"TANAKA Juuyoh, CC BY 2.0, via Wikimedia Commons"}
   ]}
  ],
  plannedGroups:[]},
 {slug:"birds",title:"Birds",eyebrow:"NATURE HUB",description:"Songbirds, raptors, seabirds, flightless birds — the same pattern as Trees: one eye-catching hub, many subjects inside, photos openly licensed.",status:"coming",
  heroImage:null,heroImageAlt:"",heroImageCredit:"",
  startHere:[],spotlightFacts:[],groups:[],
  plannedGroups:[
   {title:"Songbirds",note:"The voices of the dawn chorus — warblers, thrushes, finches and more."},
   {title:"Raptors",note:"Eagles, hawks, owls and falcons — hunters of the open sky."},
   {title:"Seabirds",note:"Albatrosses, puffins and gulls — birds that live by the ocean."},
   {title:"Flightless birds",note:"Ostriches, penguins and kiwis — birds that gave up the sky."}
  ]}
];

export function getHub(slug:string){return hubs.find(hub=>hub.slug===slug);}
export function getHubMembers(hub:Hub){return hub.groups.flatMap(group=>group.members);}
export function getHubMemberSubjects(hub:Hub){return getHubMembers(hub).map(member=>getSubject(member.slug)).filter((subject):subject is (typeof subjects)[number]=>Boolean(subject));}
export function getHubForSubject(slug:string){return hubs.find(hub=>getHubMembers(hub).some(member=>member.slug===slug));}
