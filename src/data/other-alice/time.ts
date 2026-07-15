import { otherAliceCanon } from "./canon";

export const chronologyRail = [
 { label:"Arrival",value:`Age ${otherAliceCanon.arrivedAge}`,note:"Alice chooses to follow the White Rabbit into Wonderland." },
 { label:"Lived time",value:`${otherAliceCanon.wonderlandYears} years`,note:"Her body, skills, relationships, and home develop here." },
 { label:"Present",value:`Age ${otherAliceCanon.presentAge}`,note:"Alice reads Wonderland as an adult resident." },
 { label:"Outside",value:otherAliceCanon.outsideYears.replace(/^./,(letter)=>letter.toUpperCase()),note:"No stable conversion ratio should be inferred." },
] as const;

export const timeLayers = [
 { id:"body",title:"Body time",text:"Breath, pulse, hunger, sleep, healing, growth, memory, and age continue to matter." },
 { id:"civic",title:"Civic time",text:"Shifts, crop cycles, debts, markets, route schedules, reigns, and maintenance calendars keep shared life coordinated." },
 { id:"outside",title:"Outside time",text:"Connected worlds change on their own clocks. A portal does not establish a universal conversion rate." },
] as const;
