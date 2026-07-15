export const accessStages = [
 { n:"01",title:"Resonance",text:"An ordinary place repeats a pattern that belongs somewhere else." },
 { n:"02",title:"Lure",text:"Wonderland arranges a personal invitation: a wrong clock, delayed reflection, rabbit, scent, song, or misplaced door." },
 { n:"03",title:"Choice",text:"The traveler follows, opens, answers, drinks, descends, signs, or steps. Wonderland cannot take the final step for them." },
 { n:"04",title:"Local rule",text:"The action enters a system whose physical and social rules differ from the approach." },
 { n:"05",title:"Cost",text:"The crossing changes a body, object, relationship, debt, or route." },
 { n:"06",title:"Residue",text:"A stain, object, mark, habit, or altered reflection remains after passage." },
] as const;

export const ecologyLoops = [
 { title:"Water → settlement → waste → repair",text:"Reservoirs support kitchens, workshops, bodies, gardens, and fungi; maintenance returns usable material to the water system." },
 { title:"Crop → market → residue → adaptation",text:"Cultivation enters Diamond circulation, fails under use, and returns to Spade workers as seed, waste, method, or repair problem." },
 { title:"Road → freight → settlement → road",text:"Club reach creates depots and settlements whose demand, labor, and weather reshape the route." },
] as const;

export const populationLayers = [
 { label:"Named residents",text:"People and creatures documented closely enough to carry a stable public identity." },
 { label:"Institutions",text:"Courts, markets, depots, workshops, kitchens, guilds, hotels, and offices that persist beyond one person." },
 { label:"Work populations",text:"Shifts, crews, households, carriers, growers, repairers, clerks, cooks, guards, and seasonal labor." },
 { label:"Living infrastructure",text:"Fungi, roots, animals, water, and built organisms doing civic work." },
] as const;

export const boundaryConversions = [
 ["water","salt mirror"], ["vine","cable"], ["curve","tile"], ["diffuse glow","separated color planes"],
] as const;
