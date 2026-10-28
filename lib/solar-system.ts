export type SolarSystemObject = {
  slug: string;
  name: string;
  kind: "Star" | "Planet" | "Dwarf planet" | "Natural satellite";
  group: "The Sun" | "Rocky worlds" | "Giant worlds" | "Distant worlds";
  symbol: string;
  color: string;
  summary: string;
  detail: string;
  fact: string;
  orionPath?: string;
  sourceTitle: string;
  sourceUrl: string;
};

export const solarSystemObjects: SolarSystemObject[] = [
  { slug:"sun", name:"Sun", kind:"Star", group:"The Sun", symbol:"☼", color:"#f5bd68", summary:"The star at the heart of our planetary system.", detail:"The Sun’s gravity holds the Solar System together. Its energy comes from nuclear fusion in its core, and sunlight powers much of the life and weather we know on Earth.", fact:"The Sun contains more than 99% of the Solar System’s mass.", sourceTitle:"The Sun", sourceUrl:"https://science.nasa.gov/sun/" },
  { slug:"mercury", name:"Mercury", kind:"Planet", group:"Rocky worlds", symbol:"●", color:"#b6b5c0", summary:"The smallest planet, closest to the Sun.", detail:"Mercury is a rocky world covered with impact craters. With almost no substantial atmosphere to retain heat, its surface experiences extreme temperature swings.", fact:"Mercury completes one orbit around the Sun in about 88 Earth days.", sourceTitle:"Mercury Facts", sourceUrl:"https://science.nasa.gov/mercury/facts/" },
  { slug:"venus", name:"Venus", kind:"Planet", group:"Rocky worlds", symbol:"●", color:"#e5b77c", summary:"A cloud-covered world with an intensely hot surface.", detail:"Venus has a thick carbon-dioxide atmosphere and a powerful greenhouse effect. Its surface is hot enough to melt lead, making it a striking example of how atmospheres shape planetary climates.", fact:"Venus is the hottest planet in our Solar System.", sourceTitle:"Venus Facts", sourceUrl:"https://science.nasa.gov/venus/facts/" },
  { slug:"earth", name:"Earth", kind:"Planet", group:"Rocky worlds", symbol:"●", color:"#69bce9", summary:"Our ocean-rich home and the only world known to host life.", detail:"Earth’s liquid-water oceans, active geology and atmosphere create a complex, changing home for life. It is the only place where life has been confirmed so far.", fact:"About 71% of Earth’s surface is covered by water.", orionPath:"/subjects/earth", sourceTitle:"Facts About Earth", sourceUrl:"https://science.nasa.gov/earth/facts/" },
  { slug:"mars", name:"Mars", kind:"Planet", group:"Rocky worlds", symbol:"●", color:"#e98568", summary:"A cold desert world with a record of ancient water.", detail:"Mars has volcanoes, canyons, polar ice and landscapes shaped by water in the distant past. Robotic missions study whether ancient environments could once have supported microbial life.", fact:"Mars is home to Olympus Mons, the largest known volcano in the Solar System.", orionPath:"/subjects/mars", sourceTitle:"Mars Facts", sourceUrl:"https://science.nasa.gov/mars/facts/" },
  { slug:"jupiter", name:"Jupiter", kind:"Planet", group:"Giant worlds", symbol:"●", color:"#d5a47e", summary:"The largest planet, with immense storms and many moons.", detail:"Jupiter is a gas giant made mostly of hydrogen and helium. Its cloud bands and long-lived storms reveal a dynamic atmosphere, while its moons form worlds of their own.", fact:"Jupiter is more than twice as massive as all the other planets combined.", sourceTitle:"Jupiter Facts", sourceUrl:"https://science.nasa.gov/jupiter/facts/" },
  { slug:"saturn", name:"Saturn", kind:"Planet", group:"Giant worlds", symbol:"◉", color:"#e4d19a", summary:"A gas giant surrounded by a spectacular ring system.", detail:"Saturn’s rings are made of countless pieces of ice and rocky debris. The planet’s many moons include worlds with subsurface oceans and unusual chemistry.", fact:"Saturn’s average density is lower than that of water.", sourceTitle:"Saturn Facts", sourceUrl:"https://science.nasa.gov/saturn/facts/" },
  { slug:"uranus", name:"Uranus", kind:"Planet", group:"Giant worlds", symbol:"●", color:"#8dd8d9", summary:"An ice giant that rotates at an extreme tilt.", detail:"Uranus has a blue-green appearance from methane in its atmosphere. Its unusual axial tilt means it rotates almost on its side, producing extreme seasonal patterns.", fact:"Uranus has an axial tilt of about 98 degrees.", sourceTitle:"Uranus Facts", sourceUrl:"https://science.nasa.gov/uranus/facts/" },
  { slug:"neptune", name:"Neptune", kind:"Planet", group:"Giant worlds", symbol:"●", color:"#678cf5", summary:"A distant, deep-blue ice giant with powerful winds.", detail:"Neptune lies far beyond Uranus and receives very little sunlight. Despite the cold, its atmosphere is active, with storms and some of the fastest winds measured on a planet.", fact:"Neptune was the first planet located through mathematical predictions before direct observation.", sourceTitle:"Neptune Facts", sourceUrl:"https://science.nasa.gov/neptune/facts/" },
  { slug:"pluto", name:"Pluto", kind:"Dwarf planet", group:"Distant worlds", symbol:"◌", color:"#c8a8a1", summary:"An icy dwarf planet with mountains, glaciers and five known moons.", detail:"Pluto orbits in the Kuiper Belt beyond Neptune. NASA’s New Horizons flyby revealed a varied landscape, including nitrogen-ice plains and mountains of water ice.", fact:"Pluto takes about 248 Earth years to complete one orbit around the Sun.", orionPath:"/subjects/pluto", sourceTitle:"Pluto Facts", sourceUrl:"https://science.nasa.gov/dwarf-planets/pluto/facts/" },
  { slug:"moon", name:"Earth’s Moon", kind:"Natural satellite", group:"Rocky worlds", symbol:"◐", color:"#c8cee0", summary:"Earth’s natural companion, preserving a record of impacts and exploration.", detail:"The Moon influences Earth’s tides and preserves an ancient surface shaped by impacts. Crewed Apollo missions and robotic spacecraft have transformed our understanding of this nearby world.", fact:"The Moon is moving slowly away from Earth over time.", sourceTitle:"Earth’s Moon", sourceUrl:"https://science.nasa.gov/moon/" }
];

export const solarSystemGroups = ["The Sun", "Rocky worlds", "Giant worlds", "Distant worlds"] as const;
export function getSolarSystemObject(slug: string) {
  return solarSystemObjects.find((object) => object.slug === slug);
}
