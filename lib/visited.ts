// First-visit orientation state, kept only in the visitor's own browser.
// No accounts, no tracking: a dismissed welcome and a list of visited
// subjects, stored under keys namespaced to Orion.
export const VISITED_KEY="orion:visited-subjects";
export const WELCOME_KEY="orion:welcome-dismissed";
export const MAX_VISITED=200;

export type VisitStorage=Pick<Storage,"getItem"|"setItem">;

export function loadVisited(storage:VisitStorage):string[]{
  try{
    const raw=storage.getItem(VISITED_KEY);
    if(!raw)return [];
    const parsed=JSON.parse(raw);
    if(!Array.isArray(parsed))return [];
    return parsed.filter((slug):slug is string=>typeof slug==="string");
  }catch{
    return [];
  }
}

export function recordVisit(storage:VisitStorage,slug:string):string[]{
  const visited=loadVisited(storage).filter(item=>item!==slug);
  visited.push(slug);
  const trimmed=visited.slice(-MAX_VISITED);
  try{storage.setItem(VISITED_KEY,JSON.stringify(trimmed));}catch{/* storage unavailable: progress simply is not kept */}
  return trimmed;
}

export function isWelcomeDismissed(storage:VisitStorage):boolean{
  try{return storage.getItem(WELCOME_KEY)==="1";}catch{return false;}
}

export function dismissWelcome(storage:VisitStorage):void{
  try{storage.setItem(WELCOME_KEY,"1");}catch{/* storage unavailable: the welcome shows again next visit */}
}
