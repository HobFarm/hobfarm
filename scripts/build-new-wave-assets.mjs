import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const articleSlug = "new-wave-future-of-rock-and-roll";
const outputRoot = resolve("public/articles", articleSlug);
const reportRoot = resolve("reports", articleSlug);

await mkdir(outputRoot, { recursive: true });
await mkdir(reportRoot, { recursive: true });

const colors = {
  ink: "#111619",
  cream: "#eee6cf",
  paper: "#d8cfb7",
  red: "#e54b4b",
  blue: "#168eaa",
  cyan: "#7bdbea",
  yellow: "#f0c74f",
  gray: "#89928e",
  dark: "#080d10",
};

const defs = `
  <defs>
    <pattern id="paper" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="${colors.cream}"/>
      <path d="M0 5H24M0 17H24" stroke="#b9af96" stroke-width="0.6" opacity="0.23"/>
      <circle cx="4" cy="12" r="0.8" fill="#7c7463" opacity="0.18"/>
      <circle cx="19" cy="3" r="0.6" fill="#7c7463" opacity="0.15"/>
    </pattern>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#9eaaab" stroke-width="1" opacity="0.12"/>
    </pattern>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10Z" fill="${colors.red}"/>
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10Z" fill="${colors.blue}"/>
    </marker>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="9" dy="11" stdDeviation="0" flood-color="#000" flood-opacity="0.28"/>
    </filter>
  </defs>`;

function svg(width, height, body, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${defs}${body}</svg>`;
}

function titleBlock(kicker, title, subtitle, width) {
  return `
    <text x="70" y="74" fill="${colors.red}" font-family="Consolas, monospace" font-size="19" font-weight="700" letter-spacing="3">${kicker}</text>
    <text x="70" y="126" fill="${colors.cream}" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="800">${title}</text>
    <text x="70" y="163" fill="#aeb8b5" font-family="Arial, Helvetica, sans-serif" font-size="21">${subtitle}</text>
    <path d="M70 188H${width - 70}" stroke="${colors.yellow}" stroke-width="5"/>`;
}

function box(x, y, w, h, heading, lines, accent = colors.blue) {
  return `
    <g filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#11181b" stroke="${accent}" stroke-width="3"/>
      <rect x="${x}" y="${y}" width="12" height="${h}" fill="${accent}"/>
      <text x="${x + 30}" y="${y + 42}" fill="${colors.cream}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800">${heading}</text>
      ${lines.map((line, i) => `<text x="${x + 30}" y="${y + 76 + i * 29}" fill="#aeb8b5" font-family="Consolas, monospace" font-size="17">${line}</text>`).join("")}
    </g>`;
}

const heroSvg = svg(1600, 900, `
  <rect width="1600" height="900" fill="url(#paper)"/>
  <rect x="0" y="0" width="1600" height="66" fill="${colors.ink}"/>
  <text x="62" y="43" fill="${colors.cream}" font-family="Consolas, monospace" font-size="20" font-weight="700" letter-spacing="4">HOBFARM / MUSIC / 1981 SIGNAL MAP</text>
  <g transform="rotate(-2 760 470)" filter="url(#shadow)">
    <rect x="255" y="174" width="1040" height="620" rx="28" fill="#171b1b" stroke="#0d1011" stroke-width="8"/>
    <rect x="295" y="214" width="960" height="540" rx="18" fill="#75604c"/>
    <path d="M295 356H1255M550 214V754M990 214V754" stroke="#96785e" stroke-width="6" opacity="0.65"/>
    <circle cx="480" cy="470" r="118" fill="#e9e1ca" stroke="#161b1d" stroke-width="8"/>
    <circle cx="480" cy="470" r="67" fill="#d0cab9" stroke="#b0a894" stroke-width="3"/>
    <path d="M442 484C470 449 511 453 535 484" fill="none" stroke="#b4454d" stroke-width="11" stroke-linecap="round"/>
    <circle cx="1100" cy="370" r="80" fill="#e9e1ca" stroke="#161b1d" stroke-width="8"/>
    <circle cx="1100" cy="370" r="50" fill="#1e292b"/>
    <path d="M1168 350C1220 341 1226 416 1173 424" fill="none" stroke="#e9e1ca" stroke-width="19"/>
    <rect x="670" y="292" width="256" height="337" rx="4" fill="#f2ead6" stroke="#171b1b" stroke-width="5"/>
    <text x="702" y="337" fill="#7a7262" font-family="Consolas, monospace" font-size="18">CHECK NO. 1981</text>
    <path d="M704 365H893M704 396H893M704 427H893M704 458H893M704 489H893" stroke="#a99f89" stroke-width="2"/>
    <text x="700" y="548" fill="${colors.red}" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="900">NEW WAVE!</text>
    <text x="716" y="583" fill="#49443b" font-family="Consolas, monospace" font-size="17">THE FUTURE / TABLE 9</text>
    <path d="M338 650L425 614M346 674L437 634" stroke="#181c1d" stroke-width="8" stroke-linecap="round"/>
  </g>
  <g fill="none" stroke-width="8" stroke-linecap="round">
    <path d="M805 635C810 725 630 732 614 833" stroke="${colors.red}"/>
    <path d="M861 631C902 723 1010 713 1055 820" stroke="${colors.blue}"/>
    <path d="M738 629C701 687 482 676 370 808" stroke="${colors.yellow}"/>
  </g>
  <g font-family="Consolas, monospace" font-weight="700" font-size="20" text-anchor="middle">
    ${[[245,746,"ENO"],[414,828,"BOWIE / FRIPP"],[600,846,"TALKING HEADS"],[794,824,"DEVO"],[1000,849,"XTC / GABRIEL"],[1201,807,"JAPAN"],[1374,700,"ELFMAN"]].map(([x,y,t],i)=>`<g><rect x="${x-86}" y="${y-27}" width="172" height="54" rx="27" fill="${i%2 ? colors.ink : '#f4ecd8'}" stroke="${i%2 ? colors.cyan : colors.red}" stroke-width="3"/><text x="${x}" y="${y+7}" fill="${i%2 ? colors.cream : colors.ink}">${t}</text></g>`).join("")}
  </g>
  <g transform="translate(94 205) rotate(-8)">
    <rect width="230" height="118" fill="${colors.red}"/>
    <text x="18" y="40" fill="#fff5df" font-family="Consolas, monospace" font-size="17" font-weight="700">THE FUTURE OF</text>
    <text x="18" y="75" fill="#fff5df" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="900">ROCK &amp; ROLL</text>
    <text x="18" y="101" fill="#fff5df" font-family="Consolas, monospace" font-size="14">IS BEING IGNORED</text>
  </g>
  <g transform="translate(1280 194)">
    <path d="M84 12C32 57 39 122 71 153C96 177 107 218 77 258" fill="none" stroke="${colors.ink}" stroke-width="18" stroke-linecap="round"/>
    <path d="M74 260C33 261 17 310 57 328C97 346 135 316 117 278" fill="none" stroke="${colors.ink}" stroke-width="16"/>
    <circle cx="85" cy="3" r="14" fill="${colors.yellow}" stroke="${colors.ink}" stroke-width="6"/>
    <text x="-6" y="365" fill="${colors.ink}" font-family="Consolas, monospace" font-size="18" font-weight="700">SPRINGSTEEN LANE</text>
  </g>
`, "An illustrated restaurant table sends diagram lines toward New Wave names while a separate saxophone lane represents Bruce Springsteen.");

const nodeData = [
  [600,250,"BRIAN ENO","hub"],[600,410,"DAVID BOWIE","person"],[350,410,"ROBERT FRIPP","person"],[850,410,"TALKING HEADS","group"],[1010,250,"GIORGIO MORODER","hub"],[1010,410,"JAPAN","group"],[1010,560,"DAFT PUNK","group"],[190,250,"KRAFTWERK","hub"],[190,410,"ROXY MUSIC","group"],[600,560,"DEVO","group"],[820,700,"MARK MOTHERSBAUGH","person"],[1030,700,"PAUL REUBENS","person"],[1080,850,"DANNY ELFMAN","person"],[850,850,"OINGO BOINGO","group"],[400,650,"XTC","group"],[250,790,"STEVE LILLYWHITE","person"],[465,815,"HUGH PADGHAM","person"],[410,980,"PETER GABRIEL","person"],[230,1110,"PHIL COLLINS","person"],[600,1110,"TONY LEVIN","person"],[760,980,"KING CRIMSON","group"],[760,1250,"ADRIAN BELEW","person"],[1010,1040,"PRIMUS","group"],[980,1220,"MTV","platform"],[865,560,"DAVID BYRNE","person"],
];

function meshNode([x,y,label,type]) {
  const fill = type === "hub" ? colors.red : type === "group" ? "#172226" : type === "platform" ? colors.yellow : colors.cream;
  const textFill = type === "person" || type === "platform" ? colors.ink : colors.cream;
  const splitAt = label.lastIndexOf(" ");
  const parts = label.length > 12 && splitAt > 0
    ? [label.slice(0, splitAt), label.slice(splitAt + 1)]
    : [label];
  const nodeLabel = parts.length === 1
    ? `<text x="${x}" y="${y+6}" fill="${textFill}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800">${parts[0]}</text>`
    : `<text x="${x}" y="${y-4}" fill="${textFill}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="800"><tspan x="${x}" dy="0">${parts[0]}</tspan><tspan x="${x}" dy="19">${parts[1]}</tspan></text>`;
  if (type === "person") {
    return `<g><circle cx="${x}" cy="${y}" r="60" fill="${fill}" stroke="${colors.blue}" stroke-width="4"/>${nodeLabel}</g>`;
  }
  if (type === "hub") {
    return `<g><path d="M${x-78} ${y-48}L${x+78} ${y-48}L${x+94} ${y}L${x+78} ${y+48}L${x-78} ${y+48}L${x-94} ${y}Z" fill="${fill}" stroke="${colors.yellow}" stroke-width="4"/>${nodeLabel}</g>`;
  }
  return `<g><rect x="${x-82}" y="${y-43}" width="164" height="86" rx="${type === 'platform' ? 43 : 7}" fill="${fill}" stroke="${type === 'platform' ? colors.red : colors.cyan}" stroke-width="4"/><text x="${x}" y="${y+7}" fill="${textFill}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800">${label}</text></g>`;
}

const edgeData = [
  [600,250,190,410,"member of","solid"],[600,250,600,410,"collaborated","dash"],[600,250,350,410,"collaborated","dash"],[600,250,850,410,"produced","solid"],[600,250,600,560,"produced","solid"],[600,250,865,560,"collaborated","dash"],[1010,250,1010,410,"produced","solid"],[1010,250,1010,560,"collaborated","dash"],[350,410,600,410,"performed","dot"],[865,560,850,410,"member of","solid"],[820,700,600,560,"member of","solid"],[820,700,1030,700,"screen","screen"],[1030,700,1080,850,"screen","screen"],[1080,850,850,850,"member of","solid"],[400,650,250,790,"produced","solid"],[400,650,465,815,"engineered","dot"],[250,790,410,980,"produced","solid"],[465,815,410,980,"engineered","dot"],[230,1110,410,980,"performed","dot"],[600,1110,410,980,"performed","dot"],[600,1110,760,980,"member of","solid"],[760,1250,760,980,"member of","solid"],[760,1250,850,410,"performed","dot"],[1010,1040,400,650,"covered","screen"],[1010,1040,410,980,"covered","screen"],[1010,1040,1030,700,"sampled","screen"],[980,1220,850,410,"amplified","screen"],
];

const networkSvg = svg(1200, 1450, `
  <rect width="1200" height="1450" fill="${colors.dark}"/>
  <rect width="1200" height="1450" fill="url(#grid)"/>
  ${titleBlock("TYPED-EDGE NETWORK", "THE NEW WAVE MESH", "Credits, personnel, covers and screen work. No line means merely nearby.", 1200)}
  <g fill="none" stroke-width="3" opacity="0.74">
    ${edgeData.map(([x1,y1,x2,y2,label,type])=>`<g><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${type==='solid' ? colors.cyan : type==='dash' ? colors.yellow : type==='dot' ? '#d2d6d2' : colors.red}" stroke-dasharray="${type==='dash' ? '13 9' : type==='dot' ? '3 10' : type==='screen' ? '18 7 3 7' : 'none'}"/><text x="${(x1+x2)/2}" y="${(y1+y2)/2-8}" fill="#aeb8b5" font-family="Consolas, monospace" font-size="12" text-anchor="middle">${label}</text></g>`).join("")}
  </g>
  ${nodeData.map(meshNode).join("")}
  <g transform="translate(70 1350)" font-family="Consolas, monospace" font-size="14" fill="#b5bfbc">
    <circle cx="18" cy="18" r="14" fill="${colors.cream}" stroke="${colors.blue}" stroke-width="3"/><text x="43" y="23">PERSON</text>
    <rect x="180" y="4" width="34" height="28" fill="#172226" stroke="${colors.cyan}" stroke-width="3"/><text x="225" y="23">GROUP</text>
    <path d="M355 4H389L397 18L389 32H355L347 18Z" fill="${colors.red}" stroke="${colors.yellow}" stroke-width="3"/><text x="408" y="23">ROUTER</text>
    <path d="M570 18H655" stroke="${colors.cyan}" stroke-width="3"/><text x="667" y="23">CREDIT</text>
    <path d="M800 18H885" stroke="${colors.yellow}" stroke-width="3" stroke-dasharray="13 9"/><text x="897" y="23">COLLABORATION</text>
  </g>
`, "A typed-edge network centered on Eno and Moroder connects bands, musicians, production credits, covers and screen collaborations.");

const transatlanticSvg = svg(1400, 900, `
  <rect width="1400" height="900" fill="${colors.dark}"/>
  <rect width="1400" height="900" fill="url(#grid)"/>
  ${titleBlock("GEOGRAPHY AS FEEDBACK", "THE ATLANTIC KEEPS SENDING THE SIGNAL BACK", "The projects move both ways. The arrows name the actual vehicle.", 1400)}
  <path d="M120 300C270 210 430 220 560 310C655 375 734 350 820 280C945 178 1110 216 1280 320L1275 690C1090 743 910 720 770 635C640 555 523 574 400 670C308 741 207 716 105 650Z" fill="#10191d" stroke="#263238" stroke-width="4"/>
  <text x="225" y="280" fill="#59696c" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900">NORTH AMERICA</text>
  <text x="920" y="280" fill="#59696c" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900">EUROPE</text>
  ${[[270,420,"NEW YORK","Talking Heads"],[180,535,"AKRON","Devo"],[330,670,"LOS ANGELES","Reubens / Elfman"],[930,400,"LONDON","Eno / Bowie / XTC"],[1130,520,"WOLPERATH","Conny Plank studio"],[1010,670,"MUNICH","Moroder"]].map(([x,y,city,note],i)=>`<g><circle cx="${x}" cy="${y}" r="15" fill="${i%2 ? colors.red : colors.yellow}" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y-30}" fill="${colors.cream}" text-anchor="middle" font-family="Consolas, monospace" font-size="22" font-weight="800">${city}</text><text x="${x}" y="${y+42}" fill="#98a5a3" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18">${note}</text></g>`).join("")}
  <g fill="none" stroke-width="5">
    <path d="M895 415C700 300 530 310 300 410" stroke="${colors.blue}" marker-end="url(#arrow-blue)"/>
    <path d="M210 520C500 435 760 450 1095 510" stroke="${colors.red}" stroke-dasharray="16 10" marker-end="url(#arrow-red)"/>
    <path d="M990 650C760 755 555 730 360 675" stroke="${colors.blue}" marker-end="url(#arrow-blue)"/>
    <path d="M355 645C575 555 760 560 970 640" stroke="${colors.red}" stroke-dasharray="16 10" marker-end="url(#arrow-red)"/>
  </g>
  <g font-family="Consolas, monospace" font-size="18" font-weight="700">
    <rect x="500" y="270" width="320" height="54" rx="27" fill="#11191c" stroke="${colors.blue}" stroke-width="3"/><text x="660" y="304" fill="${colors.cream}" text-anchor="middle">ENO + TALKING HEADS / 1978-80</text>
    <rect x="505" y="430" width="318" height="54" rx="27" fill="#11191c" stroke="${colors.red}" stroke-width="3"/><text x="664" y="464" fill="${colors.cream}" text-anchor="middle">DEVO TO GERMANY / 1978</text>
    <rect x="560" y="700" width="290" height="54" rx="27" fill="#11191c" stroke="${colors.blue}" stroke-width="3"/><text x="705" y="734" fill="${colors.cream}" text-anchor="middle">MORODER TO FILM + POP</text>
    <rect x="510" y="545" width="380" height="54" rx="27" fill="#11191c" stroke="${colors.red}" stroke-width="3"/><text x="700" y="579" fill="${colors.cream}" text-anchor="middle">FUNK / R&amp;B / AFROBEAT FEEDBACK</text>
  </g>
  <text x="70" y="846" fill="#8e9997" font-family="Consolas, monospace" font-size="15">SOLID = DOCUMENTED COLLABORATION OR RELEASE PATH   DASHED = BROADER CULTURAL AND RHYTHMIC EXCHANGE DISCUSSED IN PROSE</text>
`, "A flat map connects London, New York, Akron, Los Angeles, Wolperath and Munich with labeled project and cultural exchange arrows.");

const drumSvg = svg(1400, 1100, `
  <rect width="1400" height="1100" fill="${colors.dark}"/>
  <rect width="1400" height="1100" fill="url(#grid)"/>
  ${titleBlock("ONE CONCRETE TRANSFER", "XTC TO GABRIEL", "A production team carries a drum experiment from one record into the structure of another.", 1400)}
  ${box(90,245,350,210,"XTC",["DRUMS AND WIRES / 1979","STEVE LILLYWHITE / PRODUCER","HUGH PADGHAM / ENGINEER"],colors.yellow)}
  ${box(525,245,350,240,"PETER GABRIEL 3",["1980","PHIL COLLINS / DRUMS","INTRUDER / OPENING TRACK","NO CYMBALS ON THE ALBUM"],colors.red)}
  ${box(960,245,350,210,"THE SONG",["DRUM SOUND AS STRUCTURE","SPACE + REPETITION","HUGE, THEN ABRUPTLY CUT"],colors.blue)}
  <path d="M442 348H510" stroke="${colors.red}" stroke-width="7" marker-end="url(#arrow-red)"/>
  <path d="M877 348H945" stroke="${colors.red}" stroke-width="7" marker-end="url(#arrow-red)"/>
  <text x="476" y="327" fill="#b8c2bf" text-anchor="middle" font-family="Consolas, monospace" font-size="15">TEAM</text>
  <text x="911" y="327" fill="#b8c2bf" text-anchor="middle" font-family="Consolas, monospace" font-size="15">COMPOSITION</text>
  <text x="90" y="575" fill="${colors.yellow}" font-family="Consolas, monospace" font-size="18" font-weight="700" letter-spacing="2">SIMPLIFIED MECHANISM</text>
  ${[[150,"1","ROOM MICS","Capture the space around the kit"],[470,"2","COMPRESSION","Emphasize the room and impact"],[790,"3","NOISE GATE","Close the signal at a threshold"],[1110,"4","CUT TAIL","Huge hit, unnatural stop"]].map(([x,n,h,note],i)=>`<g><circle cx="${x}" cy="710" r="62" fill="${i%2 ? colors.red : colors.blue}" stroke="${colors.cream}" stroke-width="4"/><text x="${x}" y="726" fill="#fff" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="43" font-weight="900">${n}</text><text x="${x}" y="810" fill="${colors.cream}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="800">${h}</text><text x="${x}" y="843" fill="#aab4b1" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17">${note}</text>${i<3 ? `<path d="M${x+78} 710H${x+232}" stroke="${colors.yellow}" stroke-width="5" marker-end="url(#arrow-red)"/>` : ''}</g>`).join("")}
  <rect x="90" y="930" width="1220" height="105" fill="#11181b" stroke="#334044" stroke-width="3"/>
  <text x="120" y="972" fill="${colors.red}" font-family="Consolas, monospace" font-size="18" font-weight="700">LIMIT OF THE DIAGRAM</text>
  <text x="120" y="1008" fill="#acb6b3" font-family="Arial, Helvetica, sans-serif" font-size="20">This explains the audible principle. It is not every studio's exact wiring diagram or a single-person invention claim.</text>
`, "A flow diagram connects XTC's Drums and Wires through Lillywhite and Padgham to Peter Gabriel's Intruder, then explains room microphones, compression, a noise gate and the cut drum tail.");

const reubensSvg = svg(1200, 1250, `
  <rect width="1200" height="1250" fill="${colors.dark}"/>
  <rect width="1200" height="1250" fill="url(#grid)"/>
  ${titleBlock("SCREEN BRIDGE", "PAUL REUBENS'S NEW WAVE ROUTE", "The line fits the performance culture around him. It does not prove private intent.", 1200)}
  ${box(100,240,430,175,"THE GROUNDLINGS",["PAUL REUBENS","PHIL HARTMAN","CHARACTER WORK + REVUES"],colors.yellow)}
  ${box(670,240,430,175,"CHEECH &amp; CHONG",["NEXT MOVIE / 1980","PEE-WEE ON FILM","NICE DREAMS / 1981 / HOWIE"],colors.blue)}
  <path d="M532 328H654" stroke="${colors.red}" stroke-width="7" marker-end="url(#arrow-red)"/>
  <g filter="url(#shadow)">
    <rect x="300" y="520" width="600" height="150" rx="75" fill="${colors.red}" stroke="${colors.yellow}" stroke-width="5"/>
    <text x="600" y="585" fill="#fff5df" text-anchor="middle" font-family="Consolas, monospace" font-size="22">NICE DREAMS / 1981</text>
    <text x="600" y="633" fill="#fff5df" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900">NEW WAVE!</text>
  </g>
  ${box(25,520,240,150,"PRIMUS",["HAMBURGER TRAIN","PORK SODA / 1993","SAMPLES THIS SCENE"],colors.yellow)}
  <path d="M300 595H280" stroke="${colors.yellow}" stroke-width="7" marker-end="url(#arrow-red)"/>
  <path d="M600 670V745H310V790M600 745H890V790" fill="none" stroke="${colors.red}" stroke-width="7" marker-end="url(#arrow-red)"/>
  ${box(80,800,470,225,"PEE-WEE'S BIG ADVENTURE",["1985","DANNY ELFMAN / SCORE","OINGO BOINGO / BAND ROUTE","HARTMAN / CO-WRITER"],colors.red)}
  ${box(650,800,470,225,"PEE-WEE'S PLAYHOUSE",["1986","MARK MOTHERSBAUGH / MUSIC","DEVO / BAND ROUTE","SCREEN-COMPOSING TURN"],colors.blue)}
  <path d="M315 1028V1110M885 1028V1110" stroke="${colors.yellow}" stroke-width="7" marker-end="url(#arrow-red)"/>
  <text x="315" y="1160" fill="${colors.cream}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="800">FILM SCORING</text>
  <text x="885" y="1160" fill="${colors.cream}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="800">TELEVISION MUSIC</text>
`, "A diagram connects the Groundlings, Paul Reubens and Phil Hartman to Cheech and Chong films, the Nice Dreams New Wave scene, Primus's Hamburger Train sample, Pee-wee's Big Adventure with Danny Elfman and Pee-wee's Playhouse with Mark Mothersbaugh.");

const timelineEvents = [
  [1973,"Fripp and Eno release (No Pussyfooting). Cheech &amp; Chong headline a New Jersey bill with Springsteen."],
  [1977,"Bowie's Low and Heroes period. Donna Summer and Moroder release I Feel Love."],
  [1978,"Eno produces Talking Heads and Devo projects."],
  [1979,"Drums and Wires. Life in Tokyo. Quiet Life."],
  [1980,"Peter Gabriel 3. Remain in Light. Cheech &amp; Chong's Next Movie."],
  [1981,"Nice Dreams. Discipline. Tin Drum. MTV. My Life in the Bush of Ghosts."],
  [1982,"Beat. Peter Gabriel 4. Cat People."],
  [1984,"Three of a Perfect Pair. The NeverEnding Story."],
  [1985,"Pee-wee's Big Adventure. Danny Elfman's score."],
  [1986,"Pee-wee's Playhouse. Mark Mothersbaugh's music."],
  [1992,"Primus releases Miscellaneous Debris."],
  [1993,"Primus releases Hamburger Train on Pork Soda, opening with the Nice Dreams scene."],
  [1998,"Primus releases Rhinoplasty."],
  [2013,"Daft Punk releases Giorgio by Moroder."],
];

const timelineSvg = svg(1400, 1500, `
  <rect width="1400" height="1500" fill="${colors.dark}"/>
  <rect width="1400" height="1500" fill="url(#grid)"/>
  ${titleBlock("1973-2013", "THE FUTURE ARRIVES IN PIECES", "Howie's 1981 speech lands after the experiments begin and before they become ordinary.", 1400)}
  <path d="M268 250V1385" stroke="${colors.cream}" stroke-width="7"/>
  ${timelineEvents.map(([year,label],i)=>{
    const y=260+i*78;
    const hot=year===1981;
    return `<g><circle cx="268" cy="${y}" r="${hot?24:15}" fill="${hot?colors.red:(i%2?colors.blue:colors.yellow)}" stroke="#fff" stroke-width="3"/><text x="220" y="${y+9}" fill="${hot?colors.red:colors.cream}" text-anchor="end" font-family="Consolas, monospace" font-size="${hot?31:25}" font-weight="800">${year}</text><rect x="320" y="${y-33}" width="970" height="66" rx="7" fill="${hot?'#251318':'#11181b'}" stroke="${hot?colors.red:'#2e3b3f'}" stroke-width="${hot?4:2}"/><text x="348" y="${y+7}" fill="${hot?'#fff0df':'#bcc5c2'}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="${hot?800:500}">${label}</text></g>`;
  }).join("")}
  <g transform="translate(840 1327) rotate(-2)" filter="url(#shadow)">
    <rect width="450" height="95" fill="${colors.red}"/>
    <text x="225" y="40" fill="#fff6e3" text-anchor="middle" font-family="Consolas, monospace" font-size="18">THE FUTURE ARRIVED.</text>
    <text x="225" y="72" fill="#fff6e3" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="900">SPRINGSTEEN WAS STILL IN IT.</text>
  </g>
`, "A timeline from 1973 to 2013 places the 1981 Nice Dreams scene among milestones involving Eno, Moroder, XTC, Peter Gabriel, King Crimson, Japan, MTV, Pee-wee, Primus and Daft Punk.");

const files = [
  ["01-new-wave-future-hero-master.svg", heroSvg],
  ["02-new-wave-mesh-v1.svg", networkSvg],
  ["03-transatlantic-new-wave-map-v1.svg", transatlanticSvg],
  ["04-xtc-gabriel-drum-transfer-v1.svg", drumSvg],
  ["05-reubens-new-wave-bridge-v1.svg", reubensSvg],
  ["06-new-wave-timeline-v1.svg", timelineSvg],
];

for (const [filename, contents] of files) {
  await writeFile(resolve(outputRoot, filename), contents, "utf8");
}

const heroSource = Buffer.from(heroSvg);
const derivatives = [
  ["01-new-wave-future-hero-v1.webp", 1600, 900, "webp"],
  ["01-new-wave-future-social-v1.png", 1200, 630, "png"],
  ["01-new-wave-future-portrait-v1.webp", 1080, 1350, "webp"],
  ["01-new-wave-future-square-v1.webp", 1080, 1080, "webp"],
];

for (const [filename, width, height, format] of derivatives) {
  let pipeline = sharp(heroSource, { density: 180 })
    .resize({ width, height, fit: "contain", background: colors.cream });
  pipeline = format === "png" ? pipeline.png({ compressionLevel: 9 }) : pipeline.webp({ quality: 88, effort: 6 });
  await pipeline.toFile(resolve(outputRoot, filename));
}

const manifest = [];
for (const [filename] of [...files, ...derivatives]) {
  const path = resolve(outputRoot, filename);
  const [bytes, info, metadata] = await Promise.all([readFile(path), stat(path), sharp(path).metadata()]);
  manifest.push({
    asset_id: filename.replace(/\.(svg|webp|png)$/, ""),
    local_path: `public/articles/${articleSlug}/${filename}`,
    mime: filename.endsWith(".svg") ? "image/svg+xml" : filename.endsWith(".png") ? "image/png" : "image/webp",
    width: metadata.width,
    height: metadata.height,
    bytes: info.size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    r2_key: `articles/${articleSlug}/${filename}`,
    public_url: `https://hob.farm/articles/${articleSlug}/${filename}`,
    status: "source-controlled local asset; R2 not uploaded",
  });
}

await writeFile(resolve(reportRoot, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Built ${manifest.length} New Wave article assets in ${outputRoot}`);
