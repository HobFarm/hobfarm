export type ComedyNodeKind = "person" | "film" | "institution" | "event";

export type ComedyEdgeKind =
  | "acted-in"
  | "wrote"
  | "directed"
  | "produced"
  | "alumni"
  | "considered"
  | "early-version";

export type ComedyMeshNode = {
  id: string;
  label: string;
  kind: ComedyNodeKind;
  x: number;
  y: number;
  note: string;
};

export type ComedyMeshEdge = {
  id: string;
  source: string;
  target: string;
  kind: ComedyEdgeKind;
  label: string;
  routes: string[];
};

export type ComedyMeshRoute = {
  id: string;
  label: string;
  description: string;
  nodes: string[];
};

export const comedyMeshNodes: ComedyMeshNode[] = [
  { id: "national-lampoon", label: "National Lampoon", kind: "institution", x: 8, y: 8, note: "Magazine, radio, stage, and film work put several members of this network in the same orbit." },
  { id: "second-city", label: "Second City", kind: "institution", x: 25, y: 8, note: "The Chicago and Toronto stages trained performers who later crossed into SCTV, SNL, and studio film." },
  { id: "snl", label: "SNL", kind: "institution", x: 42, y: 8, note: "Saturday Night Live repeatedly turned sketch performers and writers into film collaborators." },
  { id: "sctv", label: "SCTV", kind: "institution", x: 59, y: 8, note: "Second City Television carried the Toronto company into a durable screen ensemble." },
  { id: "groundlings", label: "The Groundlings", kind: "institution", x: 76, y: 8, note: "The Los Angeles improv company connected Paul Reubens, Phil Hartman, and Jon Lovitz." },
  { id: "comic-relief", label: "Comic Relief", kind: "event", x: 92, y: 8, note: "The HBO benefits hosted by Whoopi Goldberg, Billy Crystal, and Robin Williams became another common room for working comics." },

  { id: "john-belushi", label: "John Belushi", kind: "person", x: 9, y: 25, note: "Aykroyd said the earliest Ghostbusters conception was written for Belushi and himself." },
  { id: "john-candy", label: "John Candy", kind: "person", x: 19, y: 25, note: "Considered for Louis Tully; a Second City and SCTV route into the same comedy world." },
  { id: "dan-aykroyd", label: "Dan Aykroyd", kind: "person", x: 32, y: 24, note: "Co-writer and performer in Ghostbusters; also the SNL source of Coneheads." },
  { id: "harold-ramis", label: "Harold Ramis", kind: "person", x: 45, y: 24, note: "Co-writer and performer in Ghostbusters, with Second City and National Lampoon routes behind him." },
  { id: "ivan-reitman", label: "Ivan Reitman", kind: "person", x: 56, y: 24, note: "Director and producer of Ghostbusters; producer of National Lampoon's Animal House." },
  { id: "paul-reubens", label: "Paul Reubens", kind: "person", x: 73, y: 24, note: "Appeared in early Gozer planning before the screen version changed direction." },
  { id: "phil-hartman", label: "Phil Hartman", kind: "person", x: 84, y: 24, note: "Groundlings and SNL performer who appears in Jumpin' Jack Flash and Coneheads." },
  { id: "jon-lovitz", label: "Jon Lovitz", kind: "person", x: 94, y: 27, note: "Groundlings and SNL performer who appears in Jumpin' Jack Flash and Coneheads." },

  { id: "eddie-murphy", label: "Eddie Murphy", kind: "person", x: 10, y: 42, note: "Part of Aykroyd's early Ghostbusters thinking, but not securely documented as a final, contracted Winston casting." },
  { id: "trading-places", label: "Trading Places", kind: "film", x: 22, y: 43, note: "The 1983 John Landis comedy paired Dan Aykroyd and Eddie Murphy immediately before Ghostbusters." },
  { id: "ghostbusters", label: "Ghostbusters", kind: "film", x: 43, y: 42, note: "The 1984 junction: a finished cast and an unrealized cast assembled from the same surrounding comedy routes." },
  { id: "annie-potts", label: "Annie Potts", kind: "person", x: 57, y: 39, note: "The clean bridge from Ghostbusters to Jumpin' Jack Flash." },
  { id: "jumpin-jack-flash", label: "Jumpin' Jack Flash", kind: "film", x: 70, y: 43, note: "Penny Marshall's 1986 feature combines Whoopi Goldberg with Annie Potts, Michael McKean, Phil Hartman, Jon Lovitz, and Tony Hendra." },
  { id: "penny-marshall", label: "Penny Marshall", kind: "person", x: 85, y: 40, note: "Director of Jumpin' Jack Flash, her feature directing debut." },
  { id: "tony-hendra", label: "Tony Hendra", kind: "person", x: 94, y: 44, note: "National Lampoon editor and performer who appears in Jumpin' Jack Flash." },

  { id: "bill-murray", label: "Bill Murray", kind: "person", x: 8, y: 60, note: "A Ghostbuster with Second City, National Lampoon, and SNL routes, then the center of the Scrooged branch." },
  { id: "scrooged", label: "Scrooged", kind: "film", x: 19, y: 62, note: "Bill Murray and Bobcat Goldthwait share Richard Donner's 1988 Christmas comedy." },
  { id: "bobcat-goldthwait", label: "Bobcat Goldthwait", kind: "person", x: 31, y: 65, note: "Connects Scrooged to Burglar and Whoopi Goldberg." },
  { id: "whoopi-goldberg", label: "Whoopi Goldberg", kind: "person", x: 43, y: 62, note: "Lead of Jumpin' Jack Flash and Burglar, and one of Comic Relief's three principal hosts." },
  { id: "burglar", label: "Burglar", kind: "film", x: 52, y: 72, note: "The 1987 comedy pairs Whoopi Goldberg and Bobcat Goldthwait." },
  { id: "michael-mckean", label: "Michael McKean", kind: "person", x: 64, y: 58, note: "The transfer cable: Jumpin' Jack Flash, Coneheads, and Airheads." },
  { id: "coneheads", label: "Coneheads", kind: "film", x: 74, y: 57, note: "A 1993 SNL-derived film that mixes Aykroyd and McKean with Hartman, Lovitz, Farley, and Sandler." },
  { id: "adam-sandler", label: "Adam Sandler", kind: "person", x: 86, y: 56, note: "A small Coneheads role leads directly into the central trio of Airheads." },
  { id: "chris-farley", label: "Chris Farley", kind: "person", x: 95, y: 59, note: "Appears in Coneheads and Airheads during the early-1990s SNL handoff." },

  { id: "rick-moranis", label: "Rick Moranis", kind: "person", x: 8, y: 79, note: "SCTV performer, Ghostbusters' Louis Tully, and the lead of Little Shop of Horrors." },
  { id: "little-shop", label: "Little Shop of Horrors", kind: "film", x: 21, y: 80, note: "The 1986 musical recombines Moranis, Murray, Candy, Steve Martin, Frank Oz, and Tisha Campbell." },
  { id: "tisha-campbell", label: "Tisha Campbell", kind: "person", x: 34, y: 87, note: "One of Little Shop's street-urchin chorus, carrying the ensemble into another generation." },
  { id: "steve-martin", label: "Steve Martin", kind: "person", x: 39, y: 80, note: "A Little Shop guest star with his own recurring routes through 1970s and 1980s comedy." },
  { id: "frank-oz", label: "Frank Oz", kind: "person", x: 47, y: 89, note: "Director of Little Shop of Horrors and a performer in Trading Places." },
  { id: "john-landis", label: "John Landis", kind: "person", x: 54, y: 82, note: "Directed Trading Places and National Lampoon's Animal House, another bridge between Lampoon talent and studio comedy." },
  { id: "ernie-hudson", label: "Ernie Hudson", kind: "person", x: 64, y: 79, note: "Winston in Ghostbusters and Sergeant O'Malley in Airheads." },
  { id: "airheads", label: "Airheads", kind: "film", x: 76, y: 78, note: "A 1994 handoff point where Ramis, Hudson, and McKean meet Sandler, Farley, Fraser, Buscemi, Nelson, and Mantegna." },
  { id: "brendan-fraser", label: "Brendan Fraser", kind: "person", x: 88, y: 76, note: "The lead singer of Airheads' fictional band, one of the film's clearest 1990s faces." },
  { id: "steve-buscemi", label: "Steve Buscemi", kind: "person", x: 96, y: 75, note: "Airheads' Rex, arriving from a different independent-film and character-actor route." },
  { id: "judd-nelson", label: "Judd Nelson", kind: "person", x: 86, y: 89, note: "Airheads' record executive adds another established 1980s screen route." },
  { id: "joe-mantegna", label: "Joe Mantegna", kind: "person", x: 96, y: 89, note: "Airheads' radio DJ adds a Chicago theater and character-actor route." },
];

export const comedyMeshRoutes: ComedyMeshRoute[] = [
  {
    id: "backbone",
    label: "Main route",
    description: "Annie Potts gets the route out of Ghostbusters. Michael McKean carries it through the next three films.",
    nodes: ["ghostbusters", "annie-potts", "jumpin-jack-flash", "michael-mckean", "coneheads", "airheads"],
  },
  {
    id: "origins",
    label: "Ghostbusters origins",
    description: "The finished movie and the movie that almost existed draw from the same comedy institutions.",
    nodes: ["national-lampoon", "second-city", "snl", "sctv", "ghostbusters", "dan-aykroyd", "harold-ramis", "ivan-reitman", "bill-murray", "rick-moranis", "annie-potts", "ernie-hudson", "john-belushi", "eddie-murphy", "john-candy", "paul-reubens"],
  },
  {
    id: "potts",
    label: "Annie Potts route",
    description: "Ghostbusters leads to Jumpin' Jack Flash, where several surrounding comedy routes recombine.",
    nodes: ["ghostbusters", "annie-potts", "jumpin-jack-flash", "penny-marshall", "michael-mckean", "whoopi-goldberg", "phil-hartman", "jon-lovitz", "tony-hendra", "national-lampoon", "snl", "groundlings"],
  },
  {
    id: "mckean",
    label: "McKean route",
    description: "Michael McKean turns three separate cast lists into one continuous line from 1986 to 1994.",
    nodes: ["jumpin-jack-flash", "michael-mckean", "coneheads", "dan-aykroyd", "snl", "phil-hartman", "jon-lovitz", "adam-sandler", "chris-farley", "airheads"],
  },
  {
    id: "airheads",
    label: "Airheads handoff",
    description: "The earlier mesh meets a plainly 1990s ensemble inside one radio-station comedy.",
    nodes: ["airheads", "adam-sandler", "chris-farley", "steve-buscemi", "brendan-fraser", "judd-nelson", "joe-mantegna", "ernie-hudson", "harold-ramis", "michael-mckean", "snl"],
  },
  {
    id: "murray",
    label: "Murray route",
    description: "Bill Murray reaches Whoopi Goldberg and Comic Relief through Scrooged, Bobcat Goldthwait, and Burglar.",
    nodes: ["bill-murray", "scrooged", "bobcat-goldthwait", "burglar", "whoopi-goldberg", "comic-relief", "ghostbusters", "jumpin-jack-flash"],
  },
  {
    id: "moranis",
    label: "Moranis route",
    description: "Rick Moranis carries Ghostbusters into Little Shop of Horrors and another compact all-star ensemble.",
    nodes: ["rick-moranis", "ghostbusters", "little-shop", "bill-murray", "john-candy", "steve-martin", "frank-oz", "tisha-campbell", "sctv", "second-city"],
  },
];

export const comedyMeshEdges: ComedyMeshEdge[] = [
  { id: "belushi-lampoon", source: "national-lampoon", target: "john-belushi", kind: "alumni", label: "performed through", routes: ["origins"] },
  { id: "ramis-lampoon", source: "national-lampoon", target: "harold-ramis", kind: "alumni", label: "wrote and performed through", routes: ["origins"] },
  { id: "murray-lampoon", source: "national-lampoon", target: "bill-murray", kind: "alumni", label: "performed through", routes: ["origins"] },
  { id: "reitman-lampoon", source: "national-lampoon", target: "ivan-reitman", kind: "produced", label: "produced Animal House", routes: ["origins"] },
  { id: "ramis-second-city", source: "second-city", target: "harold-ramis", kind: "alumni", label: "came through", routes: ["origins", "airheads"] },
  { id: "murray-second-city", source: "second-city", target: "bill-murray", kind: "alumni", label: "came through", routes: ["origins", "murray"] },
  { id: "candy-second-city", source: "second-city", target: "john-candy", kind: "alumni", label: "came through", routes: ["origins", "moranis"] },
  { id: "moranis-sctv", source: "sctv", target: "rick-moranis", kind: "alumni", label: "performed in", routes: ["origins", "moranis"] },
  { id: "candy-sctv", source: "sctv", target: "john-candy", kind: "alumni", label: "performed in", routes: ["origins", "moranis"] },
  { id: "aykroyd-snl", source: "snl", target: "dan-aykroyd", kind: "alumni", label: "cast member", routes: ["origins", "mckean"] },
  { id: "belushi-snl", source: "snl", target: "john-belushi", kind: "alumni", label: "cast member", routes: ["origins"] },
  { id: "murray-snl", source: "snl", target: "bill-murray", kind: "alumni", label: "cast member", routes: ["origins", "murray"] },
  { id: "murphy-snl", source: "snl", target: "eddie-murphy", kind: "alumni", label: "cast member", routes: ["origins"] },
  { id: "hartman-snl", source: "snl", target: "phil-hartman", kind: "alumni", label: "cast member", routes: ["potts", "mckean"] },
  { id: "lovitz-snl", source: "snl", target: "jon-lovitz", kind: "alumni", label: "cast member", routes: ["potts", "mckean"] },
  { id: "sandler-snl", source: "snl", target: "adam-sandler", kind: "alumni", label: "cast member", routes: ["mckean", "airheads"] },
  { id: "farley-snl", source: "snl", target: "chris-farley", kind: "alumni", label: "cast member", routes: ["mckean", "airheads"] },
  { id: "reubens-groundlings", source: "groundlings", target: "paul-reubens", kind: "alumni", label: "came through", routes: ["origins", "potts"] },
  { id: "hartman-groundlings", source: "groundlings", target: "phil-hartman", kind: "alumni", label: "came through", routes: ["potts"] },
  { id: "lovitz-groundlings", source: "groundlings", target: "jon-lovitz", kind: "alumni", label: "came through", routes: ["potts"] },

  { id: "aykroyd-ghostbusters", source: "dan-aykroyd", target: "ghostbusters", kind: "wrote", label: "co-wrote and performed in", routes: ["origins"] },
  { id: "ramis-ghostbusters", source: "harold-ramis", target: "ghostbusters", kind: "wrote", label: "co-wrote and performed in", routes: ["origins"] },
  { id: "reitman-ghostbusters", source: "ivan-reitman", target: "ghostbusters", kind: "directed", label: "directed and produced", routes: ["origins"] },
  { id: "murray-ghostbusters", source: "bill-murray", target: "ghostbusters", kind: "acted-in", label: "performed in", routes: ["origins", "murray"] },
  { id: "moranis-ghostbusters", source: "rick-moranis", target: "ghostbusters", kind: "acted-in", label: "performed in", routes: ["origins", "moranis"] },
  { id: "potts-ghostbusters", source: "annie-potts", target: "ghostbusters", kind: "acted-in", label: "performed in", routes: ["backbone", "origins", "potts"] },
  { id: "hudson-ghostbusters", source: "ernie-hudson", target: "ghostbusters", kind: "acted-in", label: "performed in", routes: ["origins"] },
  { id: "belushi-ghostbusters", source: "john-belushi", target: "ghostbusters", kind: "early-version", label: "original conception", routes: ["origins"] },
  { id: "murphy-ghostbusters", source: "eddie-murphy", target: "ghostbusters", kind: "early-version", label: "part of early version", routes: ["origins"] },
  { id: "candy-ghostbusters", source: "john-candy", target: "ghostbusters", kind: "considered", label: "considered for Louis", routes: ["origins"] },
  { id: "reubens-ghostbusters", source: "paul-reubens", target: "ghostbusters", kind: "considered", label: "early Gozer idea", routes: ["origins"] },

  { id: "aykroyd-trading", source: "dan-aykroyd", target: "trading-places", kind: "acted-in", label: "performed in", routes: ["origins"] },
  { id: "murphy-trading", source: "eddie-murphy", target: "trading-places", kind: "acted-in", label: "performed in", routes: ["origins"] },
  { id: "landis-trading", source: "john-landis", target: "trading-places", kind: "directed", label: "directed", routes: ["origins"] },

  { id: "potts-jjf", source: "annie-potts", target: "jumpin-jack-flash", kind: "acted-in", label: "performed in", routes: ["backbone", "potts"] },
  { id: "mckean-jjf", source: "michael-mckean", target: "jumpin-jack-flash", kind: "acted-in", label: "performed in", routes: ["backbone", "potts", "mckean"] },
  { id: "whoopi-jjf", source: "whoopi-goldberg", target: "jumpin-jack-flash", kind: "acted-in", label: "performed in", routes: ["potts", "murray"] },
  { id: "hartman-jjf", source: "phil-hartman", target: "jumpin-jack-flash", kind: "acted-in", label: "performed in", routes: ["potts"] },
  { id: "lovitz-jjf", source: "jon-lovitz", target: "jumpin-jack-flash", kind: "acted-in", label: "performed in", routes: ["potts"] },
  { id: "hendra-jjf", source: "tony-hendra", target: "jumpin-jack-flash", kind: "acted-in", label: "performed in", routes: ["potts"] },
  { id: "marshall-jjf", source: "penny-marshall", target: "jumpin-jack-flash", kind: "directed", label: "directed", routes: ["potts"] },
  { id: "hendra-lampoon", source: "national-lampoon", target: "tony-hendra", kind: "alumni", label: "editor and performer", routes: ["potts"] },

  { id: "mckean-coneheads", source: "michael-mckean", target: "coneheads", kind: "acted-in", label: "performed in", routes: ["backbone", "mckean"] },
  { id: "aykroyd-coneheads", source: "dan-aykroyd", target: "coneheads", kind: "wrote", label: "co-wrote and performed in", routes: ["mckean"] },
  { id: "hartman-coneheads", source: "phil-hartman", target: "coneheads", kind: "acted-in", label: "performed in", routes: ["mckean"] },
  { id: "lovitz-coneheads", source: "jon-lovitz", target: "coneheads", kind: "acted-in", label: "performed in", routes: ["mckean"] },
  { id: "sandler-coneheads", source: "adam-sandler", target: "coneheads", kind: "acted-in", label: "performed in", routes: ["mckean"] },
  { id: "farley-coneheads", source: "chris-farley", target: "coneheads", kind: "acted-in", label: "performed in", routes: ["mckean"] },

  { id: "mckean-airheads", source: "michael-mckean", target: "airheads", kind: "acted-in", label: "performed in", routes: ["backbone", "mckean", "airheads"] },
  { id: "hudson-airheads", source: "ernie-hudson", target: "airheads", kind: "acted-in", label: "performed in", routes: ["airheads"] },
  { id: "ramis-airheads", source: "harold-ramis", target: "airheads", kind: "acted-in", label: "cameo in", routes: ["airheads"] },
  { id: "sandler-airheads", source: "adam-sandler", target: "airheads", kind: "acted-in", label: "performed in", routes: ["airheads"] },
  { id: "farley-airheads", source: "chris-farley", target: "airheads", kind: "acted-in", label: "performed in", routes: ["airheads"] },
  { id: "fraser-airheads", source: "brendan-fraser", target: "airheads", kind: "acted-in", label: "performed in", routes: ["airheads"] },
  { id: "buscemi-airheads", source: "steve-buscemi", target: "airheads", kind: "acted-in", label: "performed in", routes: ["airheads"] },
  { id: "nelson-airheads", source: "judd-nelson", target: "airheads", kind: "acted-in", label: "performed in", routes: ["airheads"] },
  { id: "mantegna-airheads", source: "joe-mantegna", target: "airheads", kind: "acted-in", label: "performed in", routes: ["airheads"] },

  { id: "murray-scrooged", source: "bill-murray", target: "scrooged", kind: "acted-in", label: "performed in", routes: ["murray"] },
  { id: "bobcat-scrooged", source: "bobcat-goldthwait", target: "scrooged", kind: "acted-in", label: "performed in", routes: ["murray"] },
  { id: "bobcat-burglar", source: "bobcat-goldthwait", target: "burglar", kind: "acted-in", label: "performed in", routes: ["murray"] },
  { id: "whoopi-burglar", source: "whoopi-goldberg", target: "burglar", kind: "acted-in", label: "performed in", routes: ["murray"] },
  { id: "whoopi-comic-relief", source: "whoopi-goldberg", target: "comic-relief", kind: "acted-in", label: "hosted", routes: ["murray"] },

  { id: "moranis-little-shop", source: "rick-moranis", target: "little-shop", kind: "acted-in", label: "performed in", routes: ["moranis"] },
  { id: "murray-little-shop", source: "bill-murray", target: "little-shop", kind: "acted-in", label: "performed in", routes: ["moranis"] },
  { id: "candy-little-shop", source: "john-candy", target: "little-shop", kind: "acted-in", label: "performed in", routes: ["moranis"] },
  { id: "martin-little-shop", source: "steve-martin", target: "little-shop", kind: "acted-in", label: "performed in", routes: ["moranis"] },
  { id: "campbell-little-shop", source: "tisha-campbell", target: "little-shop", kind: "acted-in", label: "performed in", routes: ["moranis"] },
  { id: "oz-little-shop", source: "frank-oz", target: "little-shop", kind: "directed", label: "directed", routes: ["moranis"] },
];

export const comedyEdgeLabels: Record<ComedyEdgeKind, string> = {
  "acted-in": "acted in / hosted",
  wrote: "wrote",
  directed: "directed",
  produced: "produced",
  alumni: "came through",
  considered: "considered",
  "early-version": "early version",
};
