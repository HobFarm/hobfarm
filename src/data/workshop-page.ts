export const workshopMethod = [
  {
    number: "01",
    title: "Conceptualize and research",
    description:
      "Begin with an idea, question, problem, photograph, archive, object, experiment, application need, or visual concept. Find the premise and the evidence it needs.",
    output: "Working premise + source record",
  },
  {
    number: "02",
    title: "Define the base",
    description:
      "Identify the form, identity, geometry, evidence, rules, or other traits that must remain stable.",
    output: "Stable base",
  },
  {
    number: "03",
    title: "Build the transformation",
    description:
      "Apply a style, condition, era, persona, narrative idea, visual language, or functional change.",
    output: "Transformation system",
  },
  {
    number: "04",
    title: "Direct and test",
    description:
      "Choose the camera, composition, environment, voice, motion, interface, typography, and format. Compare the result with the project rules and revise it.",
    output: "Directed and tested result",
  },
  {
    number: "05",
    title: "Publish and extend",
    description:
      "Finish the work as an article, image set, video, character pack, product, application, campaign, lesson, or production asset.",
    output: "Published work",
  },
] as const;

export const workshopLayers = [
  {
    label: "Style DNA",
    description: "How the world is drawn: line, shape, color, eyes, light, texture, finish, and exclusions.",
    accent: "#19e3e3",
  },
  {
    label: "Character DNA",
    description: "Who the figure is: face, body, silhouette, markings, species traits, attitude, and continuity locks.",
    accent: "#a06bff",
  },
  {
    label: "Lane DNA",
    description: "Which life she is living: wardrobe, palette, subculture, environment, props, and product purpose.",
    accent: "#f24da6",
  },
] as const;

export const workshopBenches = [
  {
    label: "Character systems",
    description: "Mannequins, eye tests, canonical plates, model sheets, turnarounds, identity locks, and controlled variation.",
    href: "/visual-systems/",
    action: "Open visual systems",
  },
  {
    label: "World and scene design",
    description: "Move from a stable subject into environments, props, atmosphere, story clues, and a larger visual world.",
    href: "/workshop/seed-to-world/",
    action: "See seed to world",
  },
  {
    label: "Camera and motion",
    description: "Lens, angle, pose, shot size, aspect ratio, parallax, transitions, timing, editing, and sound-ready sequences.",
    href: "/workshop/motion/",
    action: "Open motion process",
  },
  {
    label: "StyleFusion application",
    description: "Assign approved reference images to subject, style, and composition roles, extract them through specialized agents, and compile an Intermediate Representation plus a model-ready document.",
    href: "/workshop/stylefusion/",
    action: "Explore StyleFusion",
  },
  {
    label: "Project memory",
    description: "Keep references, decisions, vocabulary, prompts, failures, and useful connections available for the next production pass.",
    href: "/grimoire/",
    action: "Enter the Grimoire",
  },
  {
    label: "Publishing and products",
    description: "Package the finished work for the site, galleries, social cuts, courses, digital assets, commissions, and storefronts.",
    href: "/shop/",
    action: "Browse finished work",
  },
] as const;

export const workshopResearch = [
  {
    label: "Visual development",
    source: "Walt Disney Animation Studios",
    description:
      "Visual development establishes a production's characters and worlds through color, design, composition, story, and appeal.",
    href: "https://www.disneyanimation.com/process/visual-development/",
  },
  {
    label: "Staying on model",
    source: "Walt Disney Animation Studios",
    description:
      "Disney's hand-drawn process describes clean-up artists preserving the animator's intent while keeping characters consistent throughout a film.",
    href: "https://www.disneyanimation.com/process/hand-drawn-animation/",
  },
  {
    label: "Camera and composition",
    source: "Walt Disney Animation Studios",
    description:
      "Layout artists stage characters, sets, props, and cameras shot by shot, using cinematography and composition to make the narrative clear.",
    href: "https://www.disneyanimation.com/process/layout/",
  },
  {
    label: "Learning through fundamentals",
    source: "The Museum of Modern Art",
    description:
      "MoMA's Bauhaus material connects hands-on exercises with training in color, composition, form, function, and materials.",
    href: "https://www.moma.org/collection/works/419299",
  },
  {
    label: "Designing for the frame",
    source: "Adobe Premiere",
    description:
      "Adobe's format guidance shows why 16:9, 9:16, 4:5, and 1:1 require different framing decisions for film, video, and social delivery.",
    href: "https://www.adobe.com/creativecloud/video/discover/crop-video-in-premiere-pro.html",
  },
  {
    label: "One camera idea at a time",
    source: "Runway",
    description:
      "Runway separates camera angle from shot type and recommends clear, compatible camera language instead of contradictory direction.",
    href: "https://runwayml.com/resources/ai-camera-angle-shot-type-tips",
  },
] as const;
