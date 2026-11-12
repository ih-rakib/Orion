import {subjects} from "./content";

export type LearningPath={slug:string;title:string;eyebrow:string;description:string;level:"Beginner"|"Curious explorer"|"Deep dive";estimatedMinutes:number;subjectSlugs:string[];whyItMatters:string};
export const learningPaths:LearningPath[]=[
 {slug:"start-here",title:"Start here: the story of everything",eyebrow:"FIRST VISIT · THE BIG PICTURE",description:"New to Orion? Six stops carry you from the universe itself to the first footprints on the Moon — the fastest way to find your bearings.",level:"Beginner",estimatedMinutes:30,subjectSlugs:["universe","stars","earth","evolution","human-origins","moon-landing"],whyItMatters:"Everything in Orion connects to this spine: the cosmos, the stars, our planet, life, humanity, and the moment we left Earth. Walk it once, and the rest of the library falls into place."},
 {slug:"cosmic-address",title:"Find our place in the cosmos",eyebrow:"COSMOS · SCALE",description:"Travel from our home planet outward to the galaxy and the wider universe.",level:"Beginner",estimatedMinutes:20,subjectSlugs:["earth","milky-way","galaxies","universe"],whyItMatters:"A sense of scale makes it easier to understand where our observations fit into the larger cosmic story."},
 {slug:"story-of-life",title:"The long story of life",eyebrow:"LIFE · DEEP TIME",description:"Connect evolution, ancient animals, human origins, and the societies that followed.",level:"Beginner",estimatedMinutes:25,subjectSlugs:["evolution","dinosaurs","whales","human-origins","ancient-civilizations"],whyItMatters:"Life is not a list of isolated species; it is a branching history shaped by environments, adaptation, and time."},
 {slug:"living-planet",title:"Understand our living planet",eyebrow:"EARTH · SYSTEMS",description:"Explore how Earth, oceans, climate, and living things influence one another.",level:"Curious explorer",estimatedMinutes:20,subjectSlugs:["earth","oceans","climate-change","whales","evolution"],whyItMatters:"Seeing Earth as an interconnected system helps explain environmental change and why healthy ecosystems matter."},
 {slug:"math-to-machine-intelligence",title:"From mathematics to AI",eyebrow:"MATHEMATICS · TECHNOLOGY",description:"Follow the ideas that help computers learn patterns and model complex questions.",level:"Curious explorer",estimatedMinutes:15,subjectSlugs:["mathematics","artificial-intelligence","climate-change"],whyItMatters:"Modern AI is not magic: mathematical tools turn data into models, which can then be applied to problems such as climate analysis."},
 {slug:"worlds-and-life",title:"Worlds that might host life",eyebrow:"PLANETS · ASTROBIOLOGY",description:"Compare Earth with Mars and distant exoplanets to understand the search for habitable environments.",level:"Deep dive",estimatedMinutes:20,subjectSlugs:["earth","mars","exoplanets","universe"],whyItMatters:"Studying very different worlds helps researchers refine what makes an environment potentially suitable for life."}
];
export function getLearningPath(slug:string){return learningPaths.find(path=>path.slug===slug);}
export function getPathSubjects(path:LearningPath){return path.subjectSlugs.map(slug=>subjects.find(subject=>subject.slug===slug)).filter((subject):subject is (typeof subjects)[number]=>Boolean(subject));}
export type NextJourneyStep={path:LearningPath;stepIndex:number;next:(typeof subjects)[number]};
export function getNextJourneyStep(slug:string):NextJourneyStep|null{
  for(const path of learningPaths){
    const stepIndex=path.subjectSlugs.indexOf(slug);
    if(stepIndex===-1||stepIndex>=path.subjectSlugs.length-1)continue;
    const next=subjects.find(subject=>subject.slug===path.subjectSlugs[stepIndex+1]);
    if(next)return {path,stepIndex,next};
  }
  return null;
}
