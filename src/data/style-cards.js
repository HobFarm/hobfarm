// StyleFusion showcase card data
// Used by StyleShowcase.tsx on the home page

export const BASELINE_VARIANTS = [
  {
    intent: "Cybernetic Neo-Burlesque Portrait",
    archetype: "Cyber-Elf Socialite",
    mood: "Neon-Noir Pin-up",
    colors: ["#800080", "#32CD32", "#E6E6FA", "#000000", "#008080"],
    setting: "Minimalist white studio with subtle volumetric haze",
    lighting: "High-key studio lighting, neon green rim highlights, soft purple fill",
    render: "Photorealistic, Octane render style",
    textures: ["Polished patent leather", "Crushed purple velvet", "Intricate black floral lace"],
  },
  {
    intent: "Cybernetic Neo-Burlesque Portrait",
    archetype: "Cyber-Elf Socialite",
    mood: "Neon-Noir Pin-up",
    colors: ["#8B0000", "#32CD32", "#E6E6FA", "#000000", "#2F4F4F"],
    setting: "Minimalist white studio",
    lighting: "High-key studio lighting, neon green rim highlights, soft crimson fill",
    render: "Photorealistic, Octane render style",
    textures: ["Polished patent leather", "Deep crimson velvet", "Crisp black satin", "Sheer emerald chiffon"],
  },
];

export const BAROQUE_VARIANTS = [
  {
    intent: "Cyber-Rococo Digital Banquet Synthesis",
    archetype: "Cyber-Elven Aristocrat",
    mood: "Neon-Baroque, dark and decadent with high-tech contrast",
    colors: ["#5D1F7D", "#00FF41", "#FFB347", "#00E5FF", "#0D0D0D"],
    setting: "Opulent 18th-century Rococo dining hall fused with a digital void",
    lighting: "Dual-source: warm flickering candlelight, harsh neon green/cyan phosphor glow",
    render: "Photorealistic with oil painting texture overlays, UE5 ray-tracing",
    textures: ["Crushed purple velvet", "Delicate floral lace", "Polished gold filigree", "Liquid light", "Glowing phosphor"],
  },
];

export const INDUSTRIAL_VARIANTS = [
  {
    intent: "Cyber-industrial noir synthesis",
    archetype: "Gothic Cyber-Aristocrat",
    mood: "Neon-Expressionist Noir",
    colors: ["#5D0E7F", "#00FFFF", "#000000", "#FFFFFF", "#1A1A1A"],
    setting: "Retro-futuristic power plant hall with Art Deco machinery",
    lighting: "High-contrast chiaroscuro, cyan neon key light, electric arc flashes",
    render: "Octane render, ray-traced glass and velvet",
    textures: ["Crushed velvet", "Cold brushed steel", "Luminous liquid"],
  },
];

export const ANIME_VARIANTS = [
  {
    intent: "Cyber-Gothic aristocrat in 1990s dark fantasy anime",
    archetype: "Cyber-Gothic Aristocrat",
    mood: "Neon-Noir Gothic",
    colors: ["#00FFFF", "#4B0082", "#000000", "#8B0000", "#F0F0F0"],
    setting: "Jagged pagoda rooftop overlooking desolate techno-ruin landscape",
    lighting: "Extreme rim lighting from moon, cyan bioluminescent glow, deep red ambient fill",
    render: "Hand-drawn 1990s dark fantasy anime, heavy line weights, cel-shading",
    textures: ["Crushed velvet", "Weathered stone", "Glowing phosphor", "Ink-washed shadows"],
  },
];

export const STYLE_CARDS = [
  { id: 1, slug: "baseline", label: "HobGal", isBaseline: true, variants: BASELINE_VARIANTS },
  { id: 2, slug: "baroque", label: "Baroque Matrix", variants: BAROQUE_VARIANTS },
  { id: 3, slug: "industrial", label: "Cyber-Industrial", variants: INDUSTRIAL_VARIANTS },
  { id: 4, slug: "anime", label: "Dark Anime", variants: ANIME_VARIANTS },
];
