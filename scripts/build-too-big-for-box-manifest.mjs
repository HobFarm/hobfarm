import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetRoot = "assets/too-big-for-box";
const reportRoot = join(root, "reports", "too-big-for-box");
const manifestPath = join(reportRoot, "asset-manifest.json");
const referenceManifestPath = join(reportRoot, "reference-manifest.json");
const bucket = "hobfarm-cdn";
const publicHostname = "https://cdn.hob.farm";
const prefix = "articles/too-big-for-box/";

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const asset = ({
  id,
  filename,
  purpose,
  caption,
  alt,
  credit = "HobFarm",
  rights,
  generation = null,
}) => ({
  asset_id: id,
  source_file: `${assetRoot}/${filename}`,
  destination_bucket: bucket,
  destination_key: `${prefix}${filename}`,
  public_url: `${publicHostname}/${prefix}${filename}`,
  classification: "public-editorial",
  related_content: ["article:too-big-for-the-box"],
  purpose,
  caption,
  alt_text: alt,
  credit,
  rights_basis: rights,
  generation,
});

const assets = [
  asset({
    id: "too-big-for-the-box-hero",
    filename: "too-big-for-the-box-hero.jpg",
    purpose: "Article hero and Open Graph image",
    caption:
      "A continuous editorial cutaway moves from a timeshared terminal through physical media and distributed infrastructure to a wearable terminal at the first Wonderland door.",
    alt:
      "A mainframe and amber text terminal lead to a game disc opening into a strategy world, then distributed server racks and display glasses facing a rabbit at a glowing doorway.",
    credit: "HobFarm / generated with OpenAI image generation under human direction",
    rights: "Original HobFarm editorial illustration.",
    generation: {
      provider: "OpenAI image generation",
      model: "Provider-managed image generation model; exact model identifier not returned",
      calls: 1,
      reported_cost_usd: null,
      note: "The tool did not return per-call pricing. The PNG generation was converted to a high-quality editorial JPEG without changing its composition.",
    },
  }),
  asset({
    id: "where-the-game-lives",
    filename: "where-the-game-lives.svg",
    purpose: "Historical and architectural comparison diagram",
    caption:
      "Three common arrangements compare a terminal and timeshared host, a disc and local computer, and a thin client and remote service.",
    alt:
      "A three-part diagram compares a terminal connected to a timeshared mainframe, a disc installed on a home computer, and a thin client connected to a remote service.",
    rights: "Original HobFarm editorial graphic.",
  }),
  asset({
    id: "the-box-empties",
    filename: "the-box-empties.svg",
    purpose: "Physical-media timeline",
    caption:
      "Three documented changes show a physical game package losing its old installation role without claiming that all games are cloud-rendered.",
    alt:
      "A timeline shows Civilization V requiring Steamworks, a Grand Theft Auto VI package with a download code but no disc, and the announced end of new PlayStation disc production.",
    rights: "Original HobFarm editorial graphic based on cited public facts.",
  }),
  asset({
    id: "bounded-wonder-machine",
    filename: "bounded-wonder-machine.svg",
    purpose: "Wonder Machine technical boundary diagram",
    caption:
      "Grimoire authors and compiles an immutable pack; Wonder Machine code owns mutable sessions, deterministic outcomes, saves, and replay.",
    alt:
      "A diagram shows Grimoire authored sources compiling into an immutable world pack used by deterministic Wonder Machine sessions with limited AI adapters.",
    rights: "Original HobFarm technical and editorial graphic.",
  }),
  asset({
    id: "dark-factory-bullshit-factory",
    filename: "dark-factory-bullshit-factory.svg",
    purpose: "Evidence-structure comparison diagram",
    caption:
      "A dark software factory builds validation around generated code; a bullshit factory routes an unsupported result claim toward a sales funnel.",
    alt:
      "A comparison diagram contrasts intent, external scenarios, generation, and validation with an income claim, prompts, a social post, and a funnel.",
    rights: "Original HobFarm editorial graphic.",
  }),
  asset({
    id: "claude-solved-capitalism-montage",
    filename: "claude-solved-capitalism-montage.png",
    purpose: "Documentary claim montage",
    caption:
      "Seven public Instagram posts supplied to HobFarm, cropped to foreground recurring AI-income and audience-growth claims.",
    alt:
      "A documentary montage presents seven cropped Instagram claims about income, followers, reach, views, prompts, and automation.",
    rights:
      "Author-supplied screenshots of public promotional posts, cropped and arranged for criticism, commentary, and media analysis. No standalone resale, endorsement implication, or unsupported accusation of fraud.",
  }),
];

for (const item of assets) {
  const absolute = join(root, item.source_file);
  const bytes = await readFile(absolute);
  const fileStat = await stat(absolute);
  const extension = extname(absolute).toLowerCase();
  const metadata = await sharp(bytes).metadata();

  Object.assign(item, {
    content_type: mimeTypes[extension],
    bytes: fileStat.size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    width: metadata.width,
    height: metadata.height,
    replacement_policy: "new-key-only; version filename on conflict; never overwrite",
    upload_status: "planned",
    verification_status: "not-checked",
  });
}

const referenceInputs = [
  [
    "instagram-01-automated-business-15000-month.jpg",
    "01-automated-business-15000-month.jpg",
    "3aef3b82e22cc608dadd932b024d06f80b9df06e5e98dcb5fbc439bed1dcfb12",
    "One automated business generating $500 a day or $15,000 a month.",
  ],
  [
    "instagram-02-claude-audit-million-reach.jpg",
    "02-claude-instagram-audit-million-reach.jpg",
    "788953a40a922ad6caf91436f16122d9e80d319276cb3e63ab9cc66bd1e21962",
    "Claude audit associated with one million reach and 7,000 followers.",
  ],
  [
    "instagram-03-trained-claude-194k-followers.jpg",
    "03-trained-claude-194k-followers.jpg",
    "7e751d22f7f6a6cb9c02d219b8f2f4e06ce20d1a9d567864c59b48e14b8cf79a",
    "Claude content associated with 194,000 followers and seven prompts.",
  ],
  [
    "instagram-04-pinterest-2000-day-faceless.jpg",
    "04-pinterest-2000-day-faceless.jpg",
    "d9f2321c0d4671fc6ae3a25cc97e3935fc3f5a33852983c48b9fd2aa0e7746a2",
    "Faceless Pinterest strategy associated with up to $2,000 a day.",
  ],
  [
    "instagram-05-claude-instagram-5767-month.jpg",
    "05-claude-instagram-5767-month.jpg",
    "6d87216ea381f75f74383a16c5e547126e3dd7a22b00ecde2256bd1748f1a009",
    "Claude plus Instagram associated with $5,767 per month.",
  ],
  [
    "instagram-06-duplicate-reels-unlimited-reach.jpg",
    "06-duplicate-reels-unlimited-reach.jpg",
    "6e0e35c91db03d2131471741d470db2bc04609eb21d3f30dbf3e41b37351255e",
    "Duplicate reels associated with unlimited non-follower reach.",
  ],
  [
    "instagram-07-five-prompts-25m-views.jpg",
    "07-five-prompts-25m-views.jpg",
    "19f5c4a6f9b8ccf978cc1b48d2f900dddd74f788b6f7ee24eaa0bc5cf586e8d6",
    "Five prompts associated with 2.5 million views in 28 days.",
  ],
];

const references = [];
for (const [localName, packetName, expectedSha256, claimSummary] of referenceInputs) {
  const sourceFile = `${assetRoot}/sources/${localName}`;
  const bytes = await readFile(join(root, sourceFile));
  const metadata = await sharp(bytes).metadata();
  const sha256 = createHash("sha256").update(bytes).digest("hex");

  if (sha256 !== expectedSha256) {
    throw new Error(`Checksum mismatch for ${sourceFile}: ${sha256}`);
  }

  references.push({
    source_file: sourceFile,
    packet_filename: packetName,
    sha256,
    bytes: bytes.length,
    width: metadata.width,
    height: metadata.height,
    platform: "Instagram",
    source_class: "author-supplied screenshot of a public promotional post",
    intended_use: "criticism, commentary, media analysis, and documentary montage",
    claim_summary: claimSummary,
    evidence_limit:
      "Documents the public claim and its packaging; does not establish truth, falsity, typicality, attribution, or repeatability.",
    published_individually: false,
  });
}

const manifest = {
  version: 1,
  article_slug: "too-big-for-the-box",
  generated_at: new Date().toISOString(),
  bucket,
  public_hostname: publicHostname,
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    delete_or_rename_existing: false,
    dry_run_before_upload: true,
    allowed_prefixes: [prefix],
  },
  assets,
};

const referenceManifest = {
  version: 1,
  generated_at: new Date().toISOString(),
  source_packet: "too-big-for-box-codex-task.zip",
  editorial_treatment:
    "Only the combined montage is public. Crops emphasize claim text, remove account handles, and substantially reduce faces while retaining enough interface context to identify public social posts.",
  rights_record: {
    source_class: "author-supplied screenshots of public promotional posts",
    intended_use: "criticism, commentary, media analysis",
    publication_scale: "low-traffic independent editorial site",
    restrictions: [
      "no standalone resale",
      "no implication of endorsement",
      "no private-person identification beyond the public post",
      "no unsupported accusation of fraud",
    ],
  },
  references,
};

await mkdir(reportRoot, { recursive: true });
await Promise.all([
  writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
  writeFile(
    referenceManifestPath,
    `${JSON.stringify(referenceManifest, null, 2)}\n`,
    "utf8",
  ),
]);

console.log(`Wrote ${assets.length} public assets to ${manifestPath}`);
console.log(`Verified ${references.length} supplied screenshots in ${referenceManifestPath}`);
