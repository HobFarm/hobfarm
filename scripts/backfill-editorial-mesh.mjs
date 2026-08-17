import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const articleRoot = path.resolve("src/content/articles");

const record = (
  section,
  subjects,
  {
    series = [],
    people = [],
    organizations = [],
    places = [],
    events = [],
    works = [],
    publications = [],
    technologies = [],
    sourceArtifacts = [],
    storyModes = [],
    centralObject,
    confidence = "high",
    ambiguityNotes = "",
  } = {},
) => ({
  mesh: {
    section,
    subjects,
    series,
    entities: { people, organizations, places, events, works, publications, technologies },
    sourceArtifacts,
    storyModes,
  },
  centralObject,
  confidence,
  ambiguityNotes,
});

export const editorialMeshBackfill = {
  "1956-automation": record(
    "technology",
    ["automation", "computing-history", "artificial-intelligence", "labor-history", "retrofuturism", "media-history"],
    {
      series: ["magazine-time-machine"],
      organizations: ["ibm"],
      publications: ["playboy"],
      technologies: ["automation", "artificial-intelligence", "robotics"],
      sourceArtifacts: [{ id: "playboy-january-1956-labor-cartoon", type: "magazine", label: "Playboy, January 1956, Labor cartoon", publication: "playboy", role: "origin" }],
      storyModes: ["archive-trail", "comparative-history"],
      centralObject: "A January 1956 Playboy automation cartoon and the technical future it accidentally kept describing.",
    },
  ),
  "1973-when-airbrush-was-ai": record(
    "art-design",
    ["commercial-illustration", "art-history", "creative-tools", "ai-image-generation", "visual-culture"],
    {
      people: ["hajime-sorayama"],
      organizations: ["hipgnosis"],
      technologies: ["airbrush", "ai-image-generation", "stylefusion"],
      storyModes: ["comparative-history", "visual-study"],
      centralObject: "The airbrush as an earlier commercial-art technology panic and a comparison point for AI image generation.",
      confidence: "medium",
      ambiguityNotes: "Legacy Magazine Time Machine filing does not identify one originating magazine artifact, so the canonical series is omitted.",
    },
  ),
  "1985-future-tech": record(
    "technology",
    ["retrofuturism", "consumer-technology", "media-history", "automation", "computing-history"],
    {
      series: ["magazine-time-machine"],
      publications: ["playboy"],
      technologies: ["robotics", "smart-glasses", "automation"],
      sourceArtifacts: [{ id: "playboy-december-1985-future-tech", type: "magazine", label: "Playboy, December 1985, Hold On, It's Comin'", publication: "playboy", role: "origin" }],
      storyModes: ["archive-trail", "comparative-history"],
      centralObject: "A December 1985 Playboy future-tech spread compared with the infrastructure that actually arrived.",
    },
  ),
  "3dm/1933-the-year-warner-bros-built-a-world": record(
    "film-tv",
    ["film-history", "pre-code-hollywood", "studio-systems", "musical-film", "production-design"],
    {
      series: ["3dm"],
      people: ["busby-berkeley", "joan-blondell", "ruby-keeler", "billy-barty", "dick-miller"],
      organizations: ["warner-bros"],
      events: ["great-depression"],
      works: ["42nd-street-1933", "gold-diggers-of-1933", "footlight-parade", "the-undead"],
      sourceArtifacts: [{ id: "warner-1933-musical-cycle", type: "film", label: "Warner Bros. 1933 musical cycle", role: "organizing" }],
      storyModes: ["media-genealogy", "systems-investigation"],
      centralObject: "Warner Bros.' 1933 musical production system and the Billy Barty route that reaches Dick Miller.",
    },
  ),
  "3dm/broadway-babies": record(
    "film-tv",
    ["film-history", "pre-code-hollywood", "musical-film", "great-depression", "character-actors"],
    {
      series: ["3dm"],
      people: ["alice-white", "marion-byron", "sally-eilers", "dick-miller"],
      organizations: ["first-national-pictures", "warner-bros"],
      events: ["great-depression"],
      works: ["broadway-babies", "the-last-hurrah", "the-undead"],
      sourceArtifacts: [{ id: "broadway-babies-1929-film", type: "film", label: "Broadway Babies (1929)", role: "origin" }],
      storyModes: ["connection-map", "media-genealogy"],
      centralObject: "Broadway Babies at the edge of the Depression and its sourced route through film history to Dick Miller.",
    },
  ),
  "3dm/enter-the-millerverse": record(
    "film-tv",
    ["film-history", "cult-film", "character-actors", "production-systems", "media-genealogy"],
    {
      series: ["3dm"],
      people: ["dick-miller", "billy-barty", "roger-corman"],
      organizations: ["new-world-pictures"],
      works: ["the-undead", "a-bucket-of-blood", "the-howling"],
      storyModes: ["connection-map", "media-genealogy"],
      centralObject: "Dick Miller's career as the trunk of a sourced movie-connection map.",
    },
  ),
  "3dm/the-mouse-in-the-cat-musical": record(
    "film-tv",
    ["film-history", "pre-code-hollywood", "musical-film", "character-actors", "production-systems"],
    {
      series: ["3dm"],
      people: ["billy-barty", "dick-miller", "busby-berkeley"],
      organizations: ["warner-bros"],
      works: ["footlight-parade", "the-undead"],
      sourceArtifacts: [{ id: "footlight-parade-mouse-number", type: "film", label: "Footlight Parade, Sittin' on a Backyard Fence number", role: "origin" }],
      storyModes: ["connection-map", "media-genealogy"],
      centralObject: "Billy Barty's mouse performance in Footlight Parade and the documented route to Dick Miller in The Undead.",
    },
  ),
  "3dm/you-know-nothing-of-my-algorithm": record(
    "film-tv",
    ["television-history", "media-theory", "recommendation-systems", "social-media", "media-genealogy"],
    {
      series: ["3dm"],
      people: ["frank-mchugh", "marshall-mcluhan", "dick-miller"],
      organizations: ["nbc"],
      works: ["nbc-experiment-in-television", "the-last-hurrah", "the-howling"],
      technologies: ["recommendation-algorithms"],
      sourceArtifacts: [{ id: "to-wally-pantoni-broadcast", type: "broadcast", label: "To Wally Pantoni We Leave a Credenza (1968)", role: "origin" }],
      storyModes: ["connection-map", "media-genealogy"],
      centralObject: "Frank McHugh's experimental-television credit, its 3DM route, and the programming logic that became the feed.",
    },
  ),
  "a-false-recipe-a-real-image": record(
    "art-design",
    ["creative-systems", "speculative-design", "knowledge-systems", "visual-development"],
    {
      technologies: ["grimoire", "ai-image-generation"],
      storyModes: ["process-essay", "visual-study"],
      centralObject: "A Grimoire cross-pollination card that failed as a recipe and succeeded as a speculative visual artifact.",
    },
  ),
  "a-world-of-geniuses-needs-a-system": record(
    "technology",
    ["artificial-intelligence", "creative-systems", "human-agency", "creative-labor", "knowledge-systems"],
    {
      people: ["dario-amodei"],
      organizations: ["anthropic"],
      technologies: ["artificial-intelligence", "grimoire"],
      storyModes: ["systems-investigation", "process-essay"],
      centralObject: "A practical answer to the agency problem created by increasingly capable AI systems.",
    },
  ),
  "against-slop": record(
    "art-design",
    ["generative-media", "ai-image-generation", "psychedelic-art", "visual-systems", "creative-workflows"],
    {
      technologies: ["ai-image-generation", "stylefusion", "grimoire"],
      storyModes: ["visual-study", "process-essay"],
      centralObject: "How model averages flatten visual culture and how an artist can build a specific visual system instead.",
    },
  ),
  "before-wavy-gravy-was-ice-cream": record(
    "culture",
    ["counterculture", "communal-living", "festival-culture", "live-music", "social-history"],
    {
      people: ["wavy-gravy", "jahanara-romney", "ken-kesey", "bill-graham"],
      organizations: ["hog-farm", "merry-pranksters", "grateful-dead", "camp-winnarainbow", "seva-foundation", "ben-and-jerrys"],
      places: ["san-francisco"],
      events: ["woodstock-1969", "veneta-1972"],
      storyModes: ["cultural-trail", "media-genealogy"],
      centralObject: "The people, communities, and working systems behind Wavy Gravy before the ice-cream brand association.",
      confidence: "medium",
      ambiguityNotes: "The legacy label Before the Scene Had a Name is a singleton and remains outside the canonical series registry pending a publisher decision.",
    },
  ),
  "brought-to-you-by-they-inc": record(
    "culture",
    ["political-culture", "information-systems", "propaganda", "social-media", "media-literacy", "personal-history"],
    {
      people: ["donald-trump"],
      places: ["las-vegas"],
      events: ["covid-19-pandemic", "january-6-attack"],
      technologies: ["recommendation-algorithms", "artificial-intelligence"],
      storyModes: ["personal-history-trail", "systems-investigation"],
      centralObject: "Thirty years of secondhand certainty and the social supply chain that manufactures it.",
    },
  ),
  "building-in-public-solo-developer": record(
    "technology",
    ["indie-development", "cloud-computing", "solo-publishing", "automation", "platform-economics"],
    {
      organizations: ["cloudflare", "hobfarm"],
      technologies: ["cloudflare-workers", "cloudflare-d1", "cloudflare-r2", "stylefusion", "grimoire"],
      storyModes: ["technical-explainer", "process-essay"],
      centralObject: "The infrastructure and business tradeoffs of running HobFarm as a solo developer.",
    },
  ),
  "building-in-public": record(
    "technology",
    ["artificial-intelligence", "creative-workflows", "multi-agent-systems", "schema-design", "publishing-workflow"],
    {
      organizations: ["hobfarm"],
      technologies: ["artificial-intelligence", "codex"],
      storyModes: ["technical-explainer", "process-essay"],
      centralObject: "A schema-first, multi-agent workflow for building and publishing HobFarm.",
    },
  ),
  "california-used-to-race-here": record(
    "places-systems",
    ["regional-history", "built-environment", "transportation-history", "urban-development", "place-memory"],
    {
      series: ["built-over"],
      places: ["southern-california", "gilmore-stadium", "original-farmers-market", "pan-pacific-auditorium"],
      sourceArtifacts: [{ id: "farmers-market-historical-display", type: "photograph", label: "Original Farmers Market historical display", role: "origin" }],
      storyModes: ["place-study", "archive-trail"],
      centralObject: "Southern California race sites and the successive urban systems built over them.",
    },
  ),
  "color-becomes-a-cast": record(
    "art-design",
    ["visual-systems", "character-design", "psychedelic-art", "ai-image-generation", "creative-workflows"],
    {
      technologies: ["stylefusion", "ai-image-generation"],
      storyModes: ["process-essay", "visual-study"],
      centralObject: "The long evolution of a color-driven visual idea into reusable HobFarm character and style systems.",
      confidence: "medium",
      ambiguityNotes: "Visual Systems is treated as a Workshop/program label rather than a canonical Editorial series.",
    },
  ),
  "divisionism-was-painting-before-pixels": record(
    "art-design",
    ["art-history", "color-theory", "visual-systems", "ai-image-generation", "visual-aesthetics"],
    {
      technologies: ["ai-image-generation"],
      storyModes: ["comparative-history", "visual-study"],
      centralObject: "Divisionism as a system of separated visual units that anticipates digital image logic.",
    },
  ),
  "ec-machine": record(
    "culture",
    ["publishing", "media-history", "censorship", "media-genealogy", "film-history"],
    {
      people: ["max-gaines", "william-gaines", "harvey-kurtzman"],
      organizations: ["ec-comics", "new-american-library"],
      works: ["son-of-mad", "a-hard-days-night", "tales-from-the-crypt"],
      publications: ["mad-magazine"],
      sourceArtifacts: [{ id: "son-of-mad-s1701-paperback", type: "paperback", label: "William M. Gaines's Son of Mad, Signet S1701", publication: "mad-magazine", role: "origin" }],
      storyModes: ["archive-trail", "media-genealogy"],
      centralObject: "The Son of Mad paperback inside A Hard Day's Night and the publishing machinery behind it.",
      confidence: "medium",
      ambiguityNotes: "The originating artifact is a paperback rather than a magazine, so canonical Magazine Time Machine membership is omitted while the legacy route remains.",
    },
  ),
  "everything-is-still-loading": record(
    "technology",
    ["game-history", "platform-economics", "software-ownership", "computing-history", "forced-obsolescence"],
    {
      organizations: ["valve", "microsoft"],
      works: ["doom", "civilization-vii"],
      technologies: ["bbs", "steam"],
      storyModes: ["personal-history-trail", "systems-investigation"],
      centralObject: "The change from a finished game in a box to a distributed service that is always still loading.",
    },
  ),
  "every-sentence-is-a-keynote-conclusion": record(
    "technology",
    ["artificial-intelligence", "publishing", "model-behavior", "publishing-workflow", "synthetic-media"],
    {
      people: ["daniel-pink", "kasey-steinbrinck"],
      organizations: ["amazon", "linkedin", "openai", "hobfarm"],
      technologies: ["chatgpt", "artificial-intelligence"],
      sourceArtifacts: [
        { id: "kasey-steinbrinck-linkedin-post-2026", type: "other", label: "Kasey Steinbrinck LinkedIn post about memorable AI-assisted work", publication: "LinkedIn", role: "origin" },
        { id: "daniel-pink-linkedin-post-2026", type: "other", label: "Daniel Pink LinkedIn post about AI and books", publication: "LinkedIn", role: "origin" },
      ],
      storyModes: ["process-essay", "systems-investigation", "field-report"],
      centralObject: "The recurring rhetorical and narrative defaults that flatten AI-assisted writing, and the editorial workflow required to keep a point of view intact.",
    },
  ),
  "fear-and-loathing-after-the-american-dream": record(
    "culture",
    ["personal-history", "road-culture", "political-culture", "urban-history", "place-memory"],
    {
      people: ["hunter-s-thompson"],
      places: ["las-vegas", "route-66", "aspen", "maine"],
      works: ["fear-and-loathing-in-las-vegas"],
      sourceArtifacts: [{ id: "american-dream-road-trip-photo-archive", type: "photograph", label: "2016 cross-country road-trip photograph archive", role: "organizing" }],
      storyModes: ["personal-history-trail", "field-report"],
      centralObject: "A 2016 road trip used to test the American Dream across changed places, politics, and personal history.",
      confidence: "medium",
      ambiguityNotes: "Culture owns the personal and political argument; Places & Systems remains a strong secondary relationship.",
    },
  ),
  "from-wetlands-to-the-wash": record(
    "places-systems",
    ["built-environment", "infrastructure", "live-music", "venue-history", "urban-hydrology"],
    {
      series: ["built-over"],
      people: ["peter-shapiro"],
      organizations: ["brooklyn-bowl", "caesars-entertainment", "live-nation"],
      places: ["flamingo-wash", "linq-promenade", "wetlands-preserve", "las-vegas"],
      events: ["covid-19-pandemic"],
      storyModes: ["place-study", "systems-investigation"],
      centralObject: "The physical and commercial systems layered beneath Brooklyn Bowl Las Vegas.",
    },
  ),
  "gary-and-the-fork": record(
    "technology",
    ["model-behavior", "ai-image-generation", "prompt-engineering", "creative-workflows"],
    {
      organizations: ["openai"],
      technologies: ["chatgpt", "gpt-4o", "ai-image-generation"],
      storyModes: ["field-report", "systems-investigation"],
      centralObject: "A repeated fork in generated images used as a controlled experiment in conversational and model defaults.",
    },
  ),
  "gonna-be-different": record(
    "technology",
    ["interactive-fiction", "procedural-storytelling", "game-design", "creative-systems", "media-history"],
    {
      works: ["big-1988", "other-alice-adventures"],
      technologies: ["wonder-machine", "grimoire", "stylefusion"],
      sourceArtifacts: [{ id: "big-electronic-comic-scene", type: "film", label: "Big (1988), electronic comic scene", role: "origin" }],
      storyModes: ["media-genealogy", "process-essay"],
      centralObject: "The electronic comic in Big as a route into HobFarm's procedural Other Alice story engine.",
      confidence: "medium",
      ambiguityNotes: "Other Alice Adventures is a Presents title/imprint relationship rather than a canonical Editorial series.",
    },
  ),
  "goth-get-boots": record(
    "technology",
    ["model-behavior", "ai-image-generation", "synthetic-media", "prompt-engineering", "research-methods"],
    {
      people: ["laura-wattenberg", "max-read"],
      organizations: ["openai"],
      technologies: ["chatgpt", "gpt-4o", "ai-image-generation"],
      storyModes: ["archive-trail", "systems-investigation"],
      centralObject: "Three years of chat and image history used to document recurring model names, outfits, and staging defaults.",
    },
  ),
  "grimoire-knowledge-graph": record(
    "technology",
    ["knowledge-systems", "visual-systems", "artificial-intelligence", "schema-design"],
    {
      technologies: ["grimoire", "stylefusion", "artificial-intelligence"],
      storyModes: ["technical-explainer"],
      centralObject: "Grimoire's graph structure for turning aesthetic vocabulary into queryable, reusable data.",
    },
  ),
  "hello-world": record(
    "technology",
    ["cloud-computing", "multi-provider-ai", "software-architecture", "platform-economics"],
    {
      organizations: ["cloudflare", "hobfarm"],
      technologies: ["cloudflare-workers", "ai-gateway", "cloudflare-r2", "cloudflare-d1", "model-apis"],
      storyModes: ["technical-explainer"],
      centralObject: "HobFarm's thin multi-provider routing architecture on Cloudflare.",
    },
  ),
  "hermit-does-not-have-to-pay-for-repairs": record(
    "culture",
    ["survival", "social-isolation", "personal-history", "regional-history", "labor-history"],
    {
      people: ["christopher-knight", "shoichi-yokoi", "hiroo-onoda"],
      places: ["maine"],
      works: ["alone", "jeremiah-johnson"],
      publications: ["bangor-daily-news"],
      sourceArtifacts: [{ id: "bangor-daily-news-august-5-2016", type: "newspaper", label: "Bangor Daily News front page, August 5, 2016", publication: "bangor-daily-news", role: "origin" }],
      storyModes: ["archive-trail", "comparative-history"],
      centralObject: "A small 2016 Maine newspaper headline opening a comparison among several forms of isolation and survival.",
    },
  ),
  "hey-its-that-guy": record(
    "film-tv",
    ["film-history", "television-history", "character-actors", "media-genealogy", "censorship"],
    {
      people: ["walter-hill", "william-sadler", "stephen-king", "ray-bradbury"],
      organizations: ["hbo", "ec-comics"],
      places: ["bangor-maine"],
      works: ["tales-from-the-crypt", "the-man-who-was-death", "creepshow-2"],
      sourceArtifacts: [{ id: "the-man-who-was-death-broadcast", type: "broadcast", label: "Tales from the Crypt: The Man Who Was Death", role: "origin" }],
      storyModes: ["media-genealogy", "connection-map"],
      centralObject: "A Tales from the Crypt rewatch that opens a map of performers, comics, production histories, and Maine locations.",
    },
  ),
  "how-hobbot-keeps-the-lights-on": record(
    "technology",
    ["automation", "publishing-workflow", "cloud-computing", "solo-publishing"],
    {
      organizations: ["hobfarm", "cloudflare"],
      technologies: ["hobbot", "cloudflare-workers", "grimoire"],
      storyModes: ["technical-explainer"],
      centralObject: "The scheduled and event-driven automations that keep a one-person publishing system moving.",
    },
  ),
  "how-psychedelia-went-beige": record(
    "art-design",
    ["psychedelic-art", "generative-media", "festival-culture", "visual-culture", "ai-image-generation"],
    {
      technologies: ["ai-image-generation"],
      storyModes: ["visual-study", "cultural-trail"],
      centralObject: "How one spiritual-wellness visual kit became the default picture of psychedelia and then a model average.",
    },
  ),
  "how-the-money-eats-the-medium": record(
    "culture",
    ["media-economics", "publishing", "independent-media", "platform-economics", "creative-labor"],
    {
      people: ["kurt-vonnegut", "roger-corman"],
      organizations: ["youtube"],
      publications: ["saturday-evening-post", "colliers", "cosmopolitan"],
      technologies: ["artificial-intelligence"],
      storyModes: ["systems-investigation", "media-genealogy"],
      centralObject: "The recurring economic cycle in which one media system removes the living market beneath another.",
      confidence: "medium",
      ambiguityNotes: "Magazines are central evidence but no specific old magazine artifact originates the article, so canonical Magazine Time Machine membership is omitted.",
    },
  ),
  "how-to-fix-slop": record(
    "technology",
    ["artificial-intelligence", "knowledge-systems", "schema-design", "creative-workflows", "creative-systems"],
    {
      technologies: ["artificial-intelligence", "grimoire", "stylefusion"],
      storyModes: ["technical-explainer", "process-essay"],
      centralObject: "Structured memory, roles, retrieval, and project boundaries as an engineering answer to AI slop.",
    },
  ),
  "i-could-be-playing-civilization": record(
    "technology",
    ["creative-systems", "multi-agent-systems", "game-design", "solo-publishing", "knowledge-systems"],
    {
      organizations: ["hobfarm"],
      works: ["civilization-v"],
      technologies: ["codex", "grimoire"],
      storyModes: ["personal-history-trail", "process-essay"],
      centralObject: "The same systems appetite expressed first through Civilization and now through durable AI-assisted publishing work.",
    },
  ),
  "i-may-have-inspired-it": record(
    "culture",
    ["personal-history", "regional-history", "folklore", "literary-history", "place-memory"],
    {
      people: ["stephen-king"],
      places: ["bangor-maine", "thomas-hill-standpipe"],
      works: ["it", "carrie"],
      storyModes: ["personal-history-trail", "place-study"],
      centralObject: "A deliberately unprovable childhood Bangor story situated inside the real places Stephen King turned into Derry.",
    },
  ),
  "i-want-my-mtv": record(
    "music",
    ["music-television", "streaming", "music-discovery", "media-history", "platform-fragmentation"],
    {
      organizations: ["spotify", "youtube", "paramount-plus"],
      works: ["love-spreads"],
      technologies: ["streaming-media"],
      sourceArtifacts: [{ id: "love-spreads-broadcast-master-slate", type: "broadcast", label: "Love Spreads broadcast master slate, 1994", role: "origin" }],
      storyModes: ["personal-history-trail", "media-genealogy"],
      centralObject: "The fragmented afterlife of music television and a personal attempt to rebuild MTV from streaming archives.",
      confidence: "medium",
      ambiguityNotes: "The originating artifact is broadcast media rather than a magazine, so the canonical Magazine Time Machine series is omitted.",
    },
  ),
  "instagram-funnel-buckets": record(
    "culture",
    ["social-media", "attention-economy", "platform-design", "synthetic-media", "advertising"],
    {
      organizations: ["instagram", "meta"],
      technologies: ["recommendation-algorithms", "artificial-intelligence"],
      storyModes: ["field-report", "systems-investigation"],
      centralObject: "The repeatable emotional costumes that turn Instagram posts into engagement funnels.",
    },
  ),
  "invisible-variable": record(
    "technology",
    ["model-behavior", "ai-image-generation", "schema-design", "benchmarking", "creative-workflows"],
    {
      organizations: ["openai", "google", "xai"],
      technologies: ["stylefusion", "gemini", "grok", "qwen", "glm"],
      storyModes: ["systems-investigation", "technical-explainer"],
      centralObject: "A controlled comparison showing that vision extraction models act as creative directors inside an image pipeline.",
    },
  ),
  "it-just-runs-programs": record(
    "technology",
    ["artificial-intelligence", "open-computing", "surveillance", "censorship", "software-ownership", "military-technology"],
    {
      people: ["dario-amodei"],
      organizations: ["anthropic"],
      technologies: ["artificial-intelligence", "open-weight-models"],
      storyModes: ["systems-investigation", "cultural-trail"],
      centralObject: "The institutions and contracts that decide which programs AI runs and which models ordinary users may own.",
    },
  ),
  "its-not-just-the-em-dash-but-also-the-pattern": record(
    "technology",
    ["artificial-intelligence", "model-behavior", "media-literacy", "publishing", "creative-workflows"],
    {
      people: ["dario-amodei"],
      organizations: ["nvidia", "cloudflare", "openai", "anthropic", "google", "meta", "xai"],
      technologies: ["artificial-intelligence", "chatgpt", "gpt-4o", "claude", "open-weight-models", "model-apis"],
      sourceArtifacts: [
        { id: "nvidia-800-vdc-technical-post-2025", type: "other", label: "NVIDIA 800 VDC Architecture Will Power the Next Generation of AI Factories", publication: "NVIDIA Technical Blog", role: "origin" },
        { id: "cloudflare-shared-dictionaries-post-2026", type: "other", label: "Shared Dictionaries compression that keeps up with the agentic web", publication: "The Cloudflare Blog", role: "origin" },
        { id: "archived-chatgpt-conversation-2025", type: "other", label: "Author's archived ChatGPT conversation about recurring prose patterns", publication: "ChatGPT", role: "organizing" },
      ],
      storyModes: ["field-report", "media-genealogy", "personal-history-trail", "systems-investigation"],
      centralObject: "The recurring contrastive sentence patterns that became recognizable as model-influenced prose through repeated exposure to ChatGPT.",
    },
  ),
  "the-carriage-comes-back": record(
    "art-design",
    ["speculative-design", "conceptual-engineering", "visual-development", "transportation-history", "ai-image-generation", "infrastructure"],
    {
      people: ["herman-stahmer"],
      organizations: ["brewster-and-company", "metropolitan-museum-of-art", "national-park-service", "picryl", "zoox"],
      places: ["acadia-national-park", "cadillac-mountain", "las-vegas", "sleeping-bear-dunes-national-lakeshore", "wright-brothers-national-memorial", "yellowstone-national-park"],
      works: ["future-carriage"],
      technologies: ["ai-image-generation", "automation", "autonomous-vehicles", "electric-vehicles", "robotics"],
      sourceArtifacts: [
        { id: "brewster-phaeton-4033-drawing", type: "other", label: "Design for 4 seat Phaeton, no top, no. 4033 (1889)", role: "origin" },
        { id: "brewster-sleigh-3415-drawing", type: "other", label: "Design for 4 Seat Sleigh, no. 3415 (1878)", role: "origin" },
      ],
      storyModes: ["archive-trail", "process-essay", "systems-investigation", "visual-study"],
      centralObject: "Historical Brewster carriage drawings transformed into plausible autonomous electric park vehicles through a source-controlled concept-design process.",
    },
  ),
  "mad-trump-and-the-magazine-time-machine": record(
    "culture",
    ["publishing", "satire", "censorship", "media-history", "media-genealogy"],
    {
      series: ["magazine-time-machine"],
      people: ["harvey-kurtzman", "hugh-hefner", "donald-trump"],
      organizations: ["ec-comics", "playboy-enterprises"],
      publications: ["mad-magazine", "trump-1957", "trump-magazine", "national-lampoon"],
      sourceArtifacts: [{ id: "trump-1957-issues-one-and-two", type: "magazine", label: "TRUMP issues 1 and 2 (1957)", publication: "trump-1957", role: "origin" }],
      storyModes: ["archive-trail", "media-genealogy"],
      centralObject: "The two-issue 1957 TRUMP run and the changing meanings layered onto satire-magazine artifacts.",
      confidence: "medium",
      ambiguityNotes: "The source is a short magazine run rather than one page; the artifacts materially drive the article and are recorded explicitly.",
    },
  ),
  "mr-paige-theres-an-anteater-behind-you": record(
    "art-design",
    ["surrealism", "art-history", "television-history", "creative-workflows", "visual-aesthetics"],
    {
      people: ["salvador-dali", "dick-cavett", "satchel-paige", "lillian-gish", "gala-dali"],
      works: ["the-dick-cavett-show"],
      sourceArtifacts: [{ id: "dick-cavett-dali-anteater-broadcast", type: "broadcast", label: "The Dick Cavett Show, Salvador Dalí anteater appearance (1971)", role: "origin" }],
      storyModes: ["media-genealogy", "visual-study"],
      centralObject: "Salvador Dalí's television performance as a route into his visual method, public character, and surrealist machinery.",
      confidence: "medium",
      ambiguityNotes: "Art & Design owns Dalí's visual method; Film & TV remains a strong secondary relationship because the originating artifact is a broadcast.",
    },
  ),
  "other-alice-origin": record(
    "art-design",
    ["worldbuilding", "visual-development", "mixed-media-fiction", "character-design", "creative-workflows"],
    {
      places: ["salton-sea"],
      works: ["star-trek", "frankenstein-created-woman"],
      technologies: ["stylefusion"],
      sourceArtifacts: [{ id: "bloody-alice-salton-sea-prototype", type: "photograph", label: "Bloody Alice at the Salton Sea prototype composite", role: "origin" }],
      storyModes: ["process-essay", "visual-study"],
      centralObject: "A forgotten image composite and the design questions that turned it into Other Alice Adventures.",
      confidence: "medium",
      ambiguityNotes: "Other Alice Adventures is a Presents title/imprint relationship rather than a canonical Editorial series.",
    },
  ),
  "psychedelic-goth-defined": record(
    "art-design",
    ["psychedelic-art", "gothic-art", "visual-systems", "aesthetics", "art-history"],
    {
      storyModes: ["visual-study", "cultural-trail"],
      centralObject: "A visual definition and historical source map for psychedelic goth.",
    },
  ),
  "put-on-the-glasses": record(
    "technology",
    ["consumer-technology", "open-computing", "software-ownership", "platform-governance", "media-history"],
    {
      people: ["john-carpenter", "roddy-piper", "keith-david"],
      organizations: ["google"],
      works: ["they-live"],
      technologies: ["augmented-reality", "smart-glasses", "atheer"],
      storyModes: ["personal-history-trail", "systems-investigation"],
      centralObject: "They Live and Atheer as a route into who controls the augmented layer between a person and the world.",
    },
  ),
  "same-model-different-surface": record(
    "technology",
    ["model-behavior", "ai-image-generation", "platform-design", "benchmarking", "creative-tools"],
    {
      organizations: ["google", "openai", "xai"],
      technologies: ["stylefusion", "gemini", "gpt-image", "grok"],
      storyModes: ["systems-investigation", "technical-explainer"],
      centralObject: "A controlled API-versus-web comparison showing how provider surfaces change output from the same model.",
    },
  ),
  "same-same-but-different": record(
    "technology",
    ["generative-media", "platform-economics", "benchmarking", "creative-tools", "creative-workflows"],
    {
      organizations: ["openai", "google", "xai"],
      technologies: ["model-apis", "comfyui", "stylefusion"],
      storyModes: ["systems-investigation", "field-report"],
      centralObject: "A production-oriented way to evaluate AI models, platforms, wrappers, routes, and accepted-result cost.",
    },
  ),
  "reviewing-request-for-safety": record(
    "technology",
    ["artificial-intelligence", "model-behavior", "platform-design", "schema-design", "prompt-engineering", "human-agency", "creative-workflows"],
    {
      people: ["dibakar-ghosh"],
      organizations: ["meta", "anthropic", "openai", "google", "xai", "microsoft", "hobfarm"],
      publications: ["how-to-geek"],
      technologies: ["artificial-intelligence", "ai-image-generation", "meta-ai", "chatgpt", "claude", "gemini", "grok"],
      sourceArtifacts: [
        { id: "meta-image-experiment-2026", type: "other", label: "Author-held Meta AI structured image experiment", role: "origin" },
        { id: "how-to-geek-ai-resume-comparison-2026", type: "other", label: "How-To Geek AI résumé comparison", publication: "how-to-geek", role: "organizing" },
      ],
      storyModes: ["systems-investigation", "process-essay", "field-report"],
      centralObject: "How AI products transform, reprioritize, and sometimes replace a user's explicit request before producing an answer.",
    },
  ),
  "sharksploitation": record(
    "film-tv",
    ["exploitation-film", "film-history", "media-panic", "film-economics", "independent-film"],
    {
      people: ["roger-corman", "curry-barker"],
      organizations: ["american-international-pictures", "universal-pictures"],
      places: ["las-vegas"],
      works: ["mondo-cane", "jaws", "obsession-2026"],
      storyModes: ["media-genealogy", "systems-investigation"],
      centralObject: "The production machine that turns a real shark into panic, exploitation, blockbuster, franchise, and independent-film opportunity.",
    },
  ),
  "songs-we-learned-backwards": record(
    "music",
    ["sampling", "music-discovery", "hip-hop", "jazz-funk", "soul"],
    {
      people: ["eugene-mcdaniels", "q-tip", "bob-james", "labi-siffre"],
      works: ["headless-heroes", "get-it-together"],
      sourceArtifacts: [{ id: "headless-heroes-recording", type: "recording", label: "Eugene McDaniels, Headless Heroes", role: "origin" }],
      storyModes: ["media-genealogy", "personal-history-trail"],
      centralObject: "Sampling as a reverse discovery path from familiar hip-hop fragments into older jazz, funk, and soul records.",
      confidence: "medium",
      ambiguityNotes: "The article is a music trail rather than a magazine-origin investigation, so canonical Magazine Time Machine membership is omitted.",
    },
  ),
  "stylefusion-ir-extraction": record(
    "technology",
    ["ai-image-generation", "schema-design", "prompt-compilation", "visual-systems", "creative-tools"],
    {
      technologies: ["stylefusion", "grimoire", "ai-image-generation"],
      storyModes: ["technical-explainer"],
      centralObject: "StyleFusion's Intermediate Representation and provider-specific prompt compilation pipeline.",
    },
  ),
  "susan-denbergs-american-dream": record(
    "culture",
    ["media-history", "film-history", "media-genealogy", "publishing", "regional-history"],
    {
      series: ["magazine-time-machine"],
      people: ["susan-denberg", "norman-mailer"],
      organizations: ["playboy-enterprises"],
      places: ["las-vegas"],
      works: ["other-alice-adventures"],
      publications: ["playboy", "esquire"],
      sourceArtifacts: [{ id: "playboy-august-1966-susan-denberg", type: "magazine", label: "Playboy, August 1966, Susan Denberg Picture Playmate", publication: "playboy", role: "origin" }],
      storyModes: ["archive-trail", "media-genealogy"],
      centralObject: "The Susan Denberg feature in Playboy's August 1966 issue and the career histories the page could not yet know.",
    },
  ),
  "take-me-to-phobos": record(
    "technology",
    ["game-history", "interactive-fiction", "computing-history", "network-history", "research-methods"],
    {
      organizations: ["infocom", "computer-history-museum"],
      works: ["colossal-cave-adventure", "zork", "leather-goddesses-of-phobos", "doom"],
      publications: ["the-status-line"],
      technologies: ["arpanet", "apple-i", "bbs"],
      sourceArtifacts: [{ id: "leather-goddesses-of-phobos-package", type: "catalog", label: "Leather Goddesses of Phobos package and InfoComics advertisement", role: "origin" }],
      storyModes: ["archive-trail", "media-genealogy"],
      centralObject: "A misused catalog record that opened the networked prehistory of interactive fiction and Doom.",
    },
  ),
  "the-anime-to-gothic-pipeline": record(
    "art-design",
    ["art-history", "gothic-art", "anime", "visual-systems", "ai-image-generation"],
    {
      technologies: ["stylefusion", "ai-image-generation"],
      storyModes: ["visual-study", "comparative-history"],
      centralObject: "The shared structural visual grammar that makes anime and European Gothic art compatible in style-transfer work.",
    },
  ),
  "the-card-catalog-started-talking-back": record(
    "technology",
    ["artificial-intelligence", "media-literacy", "research-methods", "education", "knowledge-systems"],
    {
      organizations: ["hobfarm"],
      technologies: ["artificial-intelligence", "chatgpt"],
      storyModes: ["process-essay", "technical-explainer"],
      centralObject: "The changed research job when the catalog can answer, synthesize, and confidently leave the assignment.",
    },
  ),
  "the-censor-eats-its-own-tail": record(
    "film-tv",
    ["censorship", "film-history", "media-history", "platform-governance", "artificial-intelligence"],
    {
      organizations: ["youtube", "hbo"],
      technologies: ["recommendation-algorithms", "artificial-intelligence"],
      storyModes: ["media-genealogy", "systems-investigation"],
      centralObject: "A film-centered history of censorship moving from seals and sponsors into platforms and AI policy.",
      confidence: "low",
      ambiguityNotes: "Legacy 3DM fields and URL remain for compatibility, but the article contains no Dick Miller connection and is excluded from the canonical 3DM series.",
    },
  ),
  "the-future-was-already-there": record(
    "film-tv",
    ["documentary-film", "television-production", "personal-history", "regional-art", "media-production"],
    {
      people: ["mike-rich", "tim-clorius", "eli-cayer"],
      organizations: ["youtube"],
      places: ["portland-maine"],
      works: ["subone-graffiti-art"],
      sourceArtifacts: [{ id: "subone-graffiti-art-2006-film", type: "film", label: "SUBONE Graffiti Art (2006)", role: "origin" }],
      storyModes: ["personal-history-trail", "media-genealogy"],
      centralObject: "A surviving Portland graffiti film used to map three creative paths and the transition into one-person video production.",
      confidence: "medium",
      ambiguityNotes: "Film & TV owns the documentary and production history; Culture and Art & Design are strong secondary relationships.",
    },
  ),
  "the-model-is-free": record(
    "technology",
    ["open-computing", "hardware-economics", "cloud-computing", "artificial-intelligence", "software-ownership"],
    {
      organizations: ["nvidia"],
      technologies: ["open-weight-models", "nvidia-dgx-spark", "rtx-2080-ti", "comfyui"],
      storyModes: ["systems-investigation", "field-report"],
      centralObject: "The gap between open model permission and affordable compute, with rented GPUs as a practical middle path.",
    },
  ),
  "the-number-one-song-ive-never-heard": record(
    "music",
    ["music-discovery", "streaming", "media-history", "content-discovery", "platform-fragmentation"],
    {
      people: ["sam-fender", "olivia-dean"],
      organizations: ["spotify", "official-charts-company"],
      works: ["rein-me-in"],
      technologies: ["streaming-media", "recommendation-algorithms"],
      storyModes: ["personal-history-trail", "systems-investigation"],
      centralObject: "A record-breaking number-one song the author never encountered and the listening trails that replaced a shared chart room.",
    },
  ),
  "the-unlit-corner-chiaroscuro-truth-shadows": record(
    "art-design",
    ["art-history", "lighting", "visual-aesthetics", "film-noir", "aesthetics"],
    {
      storyModes: ["visual-study", "cultural-trail"],
      centralObject: "Chiaroscuro as a visual philosophy that uses withheld light to make the viewer participate.",
    },
  ),
  "they-had-names-doll-family": record(
    "film-tv",
    ["film-history", "circus-history", "disability-history", "labor-history", "pre-code-hollywood"],
    {
      people: ["harry-earles", "daisy-earles", "gracie-doll", "tiny-doll"],
      organizations: ["mgm", "ringling-bros"],
      places: ["sarasota"],
      works: ["freaks", "wizard-of-oz"],
      storyModes: ["archive-trail", "media-genealogy"],
      centralObject: "The named Doll Family members as workers moving through film, circus, and Sarasota history.",
      confidence: "low",
      ambiguityNotes: "Legacy 3DM fields and URL remain for compatibility, but the article contains no Dick Miller connection and is excluded from the canonical 3DM series.",
    },
  ),
  "too-big-for-the-box": record(
    "technology",
    ["cloud-computing", "interactive-fiction", "software-ownership", "game-design", "artificial-intelligence", "platform-economics"],
    {
      works: ["civilization-v", "other-alice-adventures"],
      technologies: ["wonder-machine", "artificial-intelligence", "cloud-computing"],
      storyModes: ["systems-investigation", "process-essay"],
      centralObject: "The return of terminal-and-mainframe computing at planetary scale and the bounded machine being built for Other Alice.",
    },
  ),
  "topless-party-in-outer-space": record(
    "music",
    ["library-music", "film-music", "media-history", "music-discovery", "advertising"],
    {
      people: ["piero-umiliani", "giuliano-sorgini", "leonard-nimoy", "bob-crewe"],
      works: ["lavoro-e-tempo-libero"],
      sourceArtifacts: [{ id: "lavoro-e-tempo-libero-record", type: "recording", label: "Giuliano Sorgini, Lavoro e tempo libero", role: "origin" }],
      storyModes: ["media-genealogy", "cultural-trail"],
      centralObject: "An Italian library record opening a trail through soundtrack funk, advertising music, lounge, television, and novelty records.",
      confidence: "low",
      ambiguityNotes: "Legacy 3DM fields and URL remain for compatibility, but the article contains no Dick Miller connection and is excluded from the canonical 3DM series.",
    },
  ),
  "trash-mountain": record(
    "places-systems",
    ["waste-systems", "infrastructure", "public-safety", "settlement-patterns", "environmental-systems"],
    {
      places: ["conakry", "guinea", "maine", "las-vegas"],
      technologies: ["google-earth"],
      storyModes: ["place-study", "systems-investigation"],
      centralObject: "Waste systems becoming visible when bins overflow, landfills close, and accumulated garbage behaves like geology.",
    },
  ),
  "vacation-into-nothing": record(
    "culture",
    ["misinformation", "journalism-history", "attention-economy", "social-media", "artificial-intelligence", "media-literacy"],
    {
      people: ["william-randolph-hearst", "joseph-pulitzer"],
      events: ["uss-maine-explosion", "spanish-american-war"],
      publications: ["new-york-journal", "new-york-world"],
      technologies: ["community-notes", "grok", "artificial-intelligence"],
      storyModes: ["media-genealogy", "systems-investigation"],
      centralObject: "The recurring media machinery that packages uncertainty into certainty from yellow journalism through AI slop.",
    },
  ),
  "you-do-not-own-the-ai-you-pay-for": record(
    "technology",
    ["software-ownership", "artificial-intelligence", "platform-governance", "open-computing", "consumer-technology"],
    {
      people: ["dario-amodei"],
      organizations: ["anthropic"],
      technologies: ["fable-5", "mythos-5", "open-weight-models"],
      storyModes: ["systems-investigation"],
      centralObject: "A hosted-model shutdown used to show that paid AI access remains revocable infrastructure rather than ownership.",
    },
  ),
  "you-should-write-about-sharks": record(
    "technology",
    ["publishing-workflow", "research-methods", "artificial-intelligence", "creative-systems", "media-production"],
    {
      works: ["sharksploitation"],
      organizations: ["hobfarm"],
      technologies: ["artificial-intelligence"],
      storyModes: ["process-essay", "systems-investigation"],
      centralObject: "The HobFarm editorial production system exposed by turning a vague shark suggestion into a sourced illustrated feature.",
      confidence: "medium",
      ambiguityNotes: "Technology owns the production system; Culture remains a plausible alternative if editorial method becomes a larger desk.",
    },
  ),
  "deserts-remember-water": record(
    "places-systems",
    ["environmental-systems", "infrastructure", "regional-history", "place-memory", "settlement-patterns", "urban-hydrology"],
    {
      organizations: ["bureau-of-reclamation", "nasa", "national-park-service", "new-liverpool-salt-company", "noaa", "unhcr", "us-geological-survey"],
      places: ["colorado-river-basin", "lake-cahuilla", "lake-chad", "lake-mead", "lake-powell", "las-vegas", "salton-sea", "southern-california", "tule-springs-fossil-beds"],
      technologies: ["landsat"],
      sourceArtifacts: [{ id: "lake-mead-2000-2021-landsat-comparison", type: "map", label: "USGS/NASA Landsat comparison of Lake Mead in August 2000 and August 2021", role: "organizing" }],
      storyModes: ["comparative-history", "place-study", "systems-investigation", "visual-study"],
      centralObject: "Arid landscapes read across several clocks, from fossil wetlands and recurring lakes to managed reservoirs and current displacement.",
    },
  ),
  "dragons-lair-was-better-once-we-stopped-playing-it": record(
    "technology",
    ["game-history", "game-design", "hardware-economics", "computing-history", "personal-history"],
    {
      people: ["don-bluth", "rick-dyer"],
      organizations: ["cinematronics", "id-software", "midway-games", "nintendo"],
      places: ["las-vegas"],
      works: ["dragons-lair", "led-storm", "street-fighter-ii", "mortal-kombat", "wolfenstein-3d", "doom"],
      publications: ["boing-boing"],
      technologies: ["arcade-video-games", "laserdisc", "atari-2600", "nintendo-entertainment-system"],
      sourceArtifacts: [{ id: "boing-boing-dragons-lair-cost-2026", type: "other", label: "Dragon’s Lair only cost 50 cents to beat in 1983", publication: "Boing Boing", role: "origin" }],
      storyModes: ["personal-history-trail", "media-genealogy"],
      centralObject: "Dragon’s Lair as spectacular Don Bluth animation constrained by the price, controls, and playback hardware of a coin-operated cabinet.",
    },
  ),
  "hit-the-source-directly": record(
    "technology",
    ["publishing", "recommendation-systems", "information-systems", "attention-economy", "content-discovery", "open-computing", "personal-history"],
    {
      people: ["andrej-karpathy", "evan-schwartz", "michael-lynch"],
      organizations: ["google", "hobfarm", "youtube"],
      works: ["subone-graffiti-art"],
      technologies: ["rss", "atom", "opml", "feed-readers", "recommendation-algorithms", "artificial-intelligence"],
      sourceArtifacts: [
        { id: "karpathy-rss-post-2026", type: "other", label: "Andrej Karpathy's February 1, 2026 RSS post", role: "organizing" },
        { id: "most-popular-blogs-hn-2025-opml", type: "other", label: "Evan Schwartz's 92-feed OPML conversion", role: "organizing" },
      ],
      storyModes: ["personal-history-trail", "media-genealogy", "technical-explainer", "systems-investigation"],
      centralObject: "RSS as a reader-controlled route to source publications and a practical publishing system built around direct selection.",
    },
  ),
  "i-stopped-writing-prompts-and-built-a-machine-instead": record(
    "technology",
    ["ai-image-generation", "creative-systems", "generative-media", "production-systems", "prompt-compilation", "schema-design", "visual-systems"],
    {
      people: ["john-pound"],
      organizations: ["hobfarm", "openai", "topps"],
      works: ["garbage-pail-kids"],
      technologies: ["dynamic-prompts", "ezize", "gpt-image", "grimoire", "wildcard-machine"],
      sourceArtifacts: [{ id: "garbage-pail-kids-original-series-2-card-pairs", type: "other", label: "Three Garbage Pail Kids Original Series 2 A/B card pairs", role: "organizing" }],
      storyModes: ["process-essay", "systems-investigation", "technical-explainer"],
      centralObject: "EZIZE as a schema-driven image production machine that replaces one-off prompting with reusable subject systems and controlled variation.",
    },
  ),
  "salton-sea-needs-an-outlet": record(
    "places-systems",
    ["environmental-systems", "infrastructure", "conceptual-engineering", "public-safety", "regional-history", "settlement-patterns", "urban-hydrology"],
    {
      organizations: ["bahrain-electricity-water-authority", "bureau-of-reclamation", "california-department-of-water-resources", "coachella-valley-water-district", "imperial-irrigation-district", "international-boundary-and-water-commission", "salton-sea-history-museum", "salton-sea-management-program", "state-water-resources-control-board", "us-department-of-energy", "us-geological-survey"],
      places: ["coachella-valley", "colorado-river-basin", "gulf-of-california", "imperial-valley", "laguna-salada", "lake-mead", "lake-powell", "north-shore-california", "salton-sea", "southern-california"],
      technologies: ["geothermal-power", "google-earth", "reverse-osmosis", "water-desalination"],
      sourceArtifacts: [
        { id: "salton-sea-history-museum-archive", type: "photograph", label: "Salton Sea History Museum archival image set retained during HobFarm volunteer work inside the North Shore Yacht Club, 2010", role: "organizing" },
        { id: "north-shore-2010-field-photographs", type: "photograph", label: "HobFarm North Shore field photographs, 2010", role: "organizing" },
        { id: "north-shore-2008-2026-aerial-comparison", type: "map", label: "Google Earth North Shore marina comparison, February 2008 and 2026", role: "organizing" },
      ],
      storyModes: ["field-report", "place-study", "systems-investigation", "technical-explainer", "visual-study"],
      centralObject: "A Salton Sea inlet and outlet concept tested as one coupled water, salt, power, customer, and binational operating system.",
    },
  ),
  "the-agent-was-working": record(
    "technology",
    ["agentic-systems", "artificial-intelligence", "automation", "creative-workflows", "model-behavior", "platform-economics", "software-architecture", "solo-publishing"],
    {
      organizations: ["anthropic", "cloudflare", "hobfarm", "moltbook", "openai"],
      technologies: ["artificial-intelligence", "automation", "cloudflare-workers", "codex", "cron", "grimoire", "hobbot", "stylefusion", "wildcard-machine", "wonder-machine"],
      sourceArtifacts: [{ id: "hobbot-moltbook-profile-screenshot-2026", type: "other", label: "Author-owned full-page screenshot of the H0BBOT Moltbook profile, February 2026", role: "origin" }],
      storyModes: ["personal-history-trail", "process-essay", "systems-investigation", "technical-explainer"],
      centralObject: "The operating and economic boundary of a technically successful autonomous HobBot system.",
    },
  ),
  "the-feed-is-the-problem": record(
    "culture",
    ["attention-economy", "content-discovery", "creative-labor", "mental-health", "platform-economics", "recommendation-systems", "social-media", "social-relationships"],
    {
      organizations: ["arizona-state-university", "meta", "reddit", "youtube"],
      publications: ["phys-org"],
      technologies: ["feed-readers", "recommendation-algorithms", "rss", "thunderbird"],
      sourceArtifacts: [{ id: "phys-org-doomscrolling-at-work-2026", type: "other", label: "Phys.org article 'Doomscrolling at work wastes time, but the real cost is what happens after'", publication: "Phys.org", role: "origin" }],
      storyModes: ["personal-history-trail", "systems-investigation"],
      centralObject: "The ranked public feed as an economic and cultural system that converts attention into production signals while leaving human aftermath outside its accounting.",
    },
  ),
};

function allArticleFiles(directory) {
  return fs.readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  let changed = 0;

  for (const file of allArticleFiles(articleRoot)) {
    const slug = path.relative(articleRoot, file).replaceAll("\\", "/").replace(/\.mdx?$/, "");
    const entry = editorialMeshBackfill[slug];
    const raw = fs.readFileSync(file, "utf8");

    if (!entry) {
      if (!/\ndraft:\s*true\s*\r?\n/.test(raw)) {
        throw new Error(`Missing editorial mesh mapping for ${slug}`);
      }
      continue;
    }
    if (/^mesh:\s*$/m.test(raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "")) {
      continue;
    }

    const frontmatter = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
    if (!frontmatter) throw new Error(`Missing frontmatter in ${slug}`);

    const snippet = YAML.stringify({ mesh: entry.mesh }, { lineWidth: 0 });
    const nextFrontmatter = frontmatter[0].replace(/---\s*\r?\n$/, `${snippet}---\n\n`);
    fs.writeFileSync(file, `${nextFrontmatter}${raw.slice(frontmatter[0].length)}`);
    changed += 1;
  }

  console.log(`Backfilled editorial mesh metadata in ${changed} article files.`);
}
