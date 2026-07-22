#!/usr/bin/env python3
"""Build the local visual package for The Censor Eats Its Own Tail."""

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import shutil
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
REPORT_ROOT = ROOT / "reports" / "the-censor-eats-its-own-tail"
ASSET_ROOT = REPORT_ROOT / "assets"
PUBLIC_PREFIX = "articles/the-censor-eats-its-own-tail"
PUBLIC_HOST = "https://cdn.hob.farm"

DOWNLOADS = {
    "masses-letter-source.jpg": "https://www.loc.gov/static/exhibitions/world-war-i-american-experiences/images/objects/over-here/wwi0093p1-standard.jpg",
    "pca-certificate-source.jpg": "https://blogs.loc.gov/now-see-hear/files/2014/07/PCASeal1-300x230.jpg",
    "comics-hearing-transcript-source.png": "https://blogs.loc.gov/law/files/2022/10/transcript-juvenile-delinquency.png",
    "comics-newsstand-source.png": "https://blogs.loc.gov/law/files/2022/10/st-louis-newsstand.png",
    "hollywood-ten-statement-source.jpg": "https://visit.archives.gov/sites/default/files/inline-images/ring-lardner-huac-hollywood-blacklist.jpg",
}

HERO_PROMPT = """Create an original editorial magazine-cover illustration for an article titled “The Censor Eats Its Own Tail,” but do not render the title or any other readable text. A large ouroboros loops around a small independent creator’s printing and editing desk. The snake visibly eats its own tail and changes material around the circle: perforated 1930s film strip, red editor’s pencil, generic approval-seal ribbon, generic comic censorship stamp, radio microphone cable, blacklist file folder, generic warning sticker, generic yellow monetization disk, recommendation eye with arrows, and an AI prompt cursor. Original mid-century satirical editorial collage, cream newsprint, structural black, deep red, sparse poisonous green, with no logos, likenesses, copyrighted characters, readable text, or watermark."""


def download(url: str, destination: Path) -> None:
    if destination.exists():
        return
    request = Request(url, headers={"User-Agent": "HobFarm editorial production/1.0"})
    with urlopen(request, timeout=45) as response:
        destination.write_bytes(response.read())


def cover_crop(image: Image.Image, size: tuple[int, int], y_bias: float = 0.5) -> Image.Image:
    target_width, target_height = size
    source_ratio = image.width / image.height
    target_ratio = target_width / target_height
    if source_ratio > target_ratio:
        crop_width = round(image.height * target_ratio)
        left = max(0, (image.width - crop_width) // 2)
        box = (left, 0, left + crop_width, image.height)
    else:
        crop_height = round(image.width / target_ratio)
        top = round((image.height - crop_height) * y_bias)
        top = min(max(0, top), image.height - crop_height)
        box = (0, top, image.width, top + crop_height)
    return image.crop(box).resize(size, Image.Resampling.LANCZOS)


def fit_width(image: Image.Image, width: int = 1600) -> Image.Image:
    if image.width <= width:
        return image.copy()
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def save_webp(image: Image.Image, destination: Path, quality: int = 86) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(destination, "WEBP", quality=quality, method=6)


def blur_region(image: Image.Image, box: tuple[int, int, int, int], radius: int = 10) -> None:
    clipped = (
        max(0, box[0]),
        max(0, box[1]),
        min(image.width, box[2]),
        min(image.height, box[3]),
    )
    image.paste(image.crop(clipped).filter(ImageFilter.GaussianBlur(radius)), clipped)


def image_record(
    *,
    asset_id: str,
    path: Path,
    key: str,
    source_page: str,
    direct_asset_url: str,
    creator: str,
    work_title: str,
    date: str,
    rights_statement: str,
    license_name: str,
    public_domain: bool,
    rationale: str,
    edit: str,
    caption: str,
    credit: str,
    alt: str,
    retrieved_at: str,
) -> dict:
    with Image.open(path) as image:
        width, height = image.size
        image_format = image.format
    data = path.read_bytes()
    mime = mimetypes.guess_type(path.name)[0]
    if not mime and image_format:
        mime = Image.MIME.get(image_format)
    relative = path.relative_to(ROOT).as_posix()
    return {
        "id": asset_id,
        "local_file": relative,
        "r2_key": key,
        "public_url": f"{PUBLIC_HOST}/{key}",
        "source_page": source_page,
        "direct_asset_url": direct_asset_url,
        "creator_or_institution": creator,
        "work_title": work_title,
        "date": date,
        "rights_statement": rights_statement,
        "license": license_name,
        "public_domain": public_domain,
        "editorial_rationale": rationale,
        "crop_or_edit": edit,
        "caption": caption,
        "credit": credit,
        "alt": alt,
        "retrieved_at": retrieved_at,
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
        "width": width,
        "height": height,
        "mime": mime,
    }


def write_credits(records: list[dict]) -> Path:
    destination = ASSET_ROOT / "credits.md"
    lines = [
        "# The Censor Eats Its Own Tail — visual credits",
        "",
        "Every public image is tied to a source and rights basis in the repository rights ledger.",
        "",
    ]
    for record in records:
        lines.extend(
            [
                f"## {record['work_title']}",
                "",
                record["caption"],
                "",
                f"- Credit: {record['credit']}",
                f"- Source: {record['source_page']}",
                f"- Rights basis: {record['rights_statement']}",
                f"- Public URL: {record['public_url']}",
                "",
            ]
        )
    destination.write_text("\n".join(lines), encoding="utf-8")
    return destination


def write_manifests(records: list[dict], generated_at: str, credits: Path) -> None:
    public_manifest = {
        "article": "The Censor Eats Its Own Tail",
        "slug": "the-censor-eats-its-own-tail",
        "generated_at": generated_at,
        "hero_generation": {
            "tool": "OpenAI built-in image generation",
            "date": "2026-07-22",
            "prompt": HERO_PROMPT,
            "rights_basis": "Original HobFarm editorial artwork generated for this article; no supplied reference images, logos, likenesses, or copyrighted characters.",
        },
        "assets": records,
    }
    public_manifest_path = ASSET_ROOT / "manifest.json"
    public_manifest_path.write_text(json.dumps(public_manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    uploader_assets = []
    for record in records:
        uploader_assets.append(
            {
                "source_file": record["local_file"],
                "destination_bucket": "hobfarm-cdn",
                "destination_key": record["r2_key"],
                "public_url": record["public_url"],
                "content_type": record["mime"],
                "bytes": record["bytes"],
                "sha256": record["sha256"],
                "upload_status": "not-started",
                "verification_status": "not-started",
            }
        )

    for path, key, content_type in [
        (public_manifest_path, f"{PUBLIC_PREFIX}/manifest.json", "application/json; charset=utf-8"),
        (credits, f"{PUBLIC_PREFIX}/credits.md", "text/markdown; charset=utf-8"),
    ]:
        data = path.read_bytes()
        uploader_assets.append(
            {
                "source_file": path.relative_to(ROOT).as_posix(),
                "destination_bucket": "hobfarm-cdn",
                "destination_key": key,
                "public_url": f"{PUBLIC_HOST}/{key}",
                "content_type": content_type,
                "bytes": len(data),
                "sha256": hashlib.sha256(data).hexdigest(),
                "upload_status": "not-started",
                "verification_status": "not-started",
            }
        )

    uploader_manifest = {
        "generated_at": generated_at,
        "bucket": "hobfarm-cdn",
        "public_hostname": PUBLIC_HOST,
        "policy": {
            "new_keys_only": True,
            "overwrite_existing": False,
            "allowed_prefixes": [f"{PUBLIC_PREFIX}/"],
        },
        "assets": uploader_assets,
    }
    (REPORT_ROOT / "asset-manifest.json").write_text(
        json.dumps(uploader_manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--packet", type=Path, required=True)
    parser.add_argument("--hero", type=Path, required=True)
    args = parser.parse_args()

    packet = args.packet.resolve()
    hero_source = args.hero.resolve()
    if not packet.exists() or not hero_source.exists():
        raise SystemExit("Packet or generated hero source is missing.")

    source_dir = ASSET_ROOT / "sources"
    hero_dir = ASSET_ROOT / "hero"
    archival_dir = ASSET_ROOT / "archival"
    process_dir = ASSET_ROOT / "process"
    for directory in (source_dir, hero_dir, archival_dir, process_dir):
        directory.mkdir(parents=True, exist_ok=True)

    for name, url in DOWNLOADS.items():
        download(url, source_dir / name)

    master = hero_dir / "censor-ouroboros-hero-master.png"
    shutil.copy2(hero_source, master)
    with Image.open(master) as image:
        hero = image.convert("RGB")
        web = cover_crop(hero, (1600, 900), 0.48)
        web.save(hero_dir / "censor-ouroboros-hero.webp", "WEBP", quality=88, method=6)
        try:
            web.save(hero_dir / "censor-ouroboros-hero.avif", "AVIF", quality=70)
        except (KeyError, OSError):
            pass
        cover_crop(hero, (1200, 630), 0.47).save(hero_dir / "censor-ouroboros-hero-social-1200x630.jpg", "JPEG", quality=91, optimize=True)
        cover_crop(hero, (1080, 1080), 0.48).save(hero_dir / "censor-ouroboros-hero-square.jpg", "JPEG", quality=91, optimize=True)
        cover_crop(hero, (1080, 1350), 0.46).save(hero_dir / "censor-ouroboros-hero-vertical.jpg", "JPEG", quality=91, optimize=True)

    archive_outputs = {
        "masses-letter-source.jpg": "1917-the-masses-mail-censorship.webp",
        "pca-certificate-source.jpg": "1934-pca-certificate.webp",
        "comics-hearing-transcript-source.png": "1954-comics-hearing-transcript.webp",
        "comics-newsstand-source.png": "1939-comics-newsstand.webp",
        "hollywood-ten-statement-source.jpg": "1947-hollywood-ten-statement.webp",
    }
    for source_name, output_name in archive_outputs.items():
        with Image.open(source_dir / source_name) as image:
            save_webp(fit_width(image.convert("RGB")), archival_dir / output_name)

    references = packet / "references"
    with Image.open(references / "rumble-homepage.png") as image:
        crop_height = min(image.height, max(720, round(image.width * 0.72)))
        save_webp(fit_width(image.crop((0, 0, image.width, crop_height)).convert("RGB")), process_dir / "rumble-homepage-visit.webp")

    with Image.open(references / "psycho-instagram-factoid.png") as image:
        top = round(image.height * 0.48)
        crop = image.crop((0, top, image.width, image.height)).convert("RGB")
        blur_region(crop, (0, 48, round(crop.width * 0.68), min(128, crop.height)))
        save_webp(crop, process_dir / "psycho-factoid-specimen.webp")

    with Image.open(references / "ai-accent-not-x-but-y.png") as image:
        crop = image.convert("RGB")
        blur_region(crop, (0, 0, min(430, crop.width), min(38, crop.height)))
        save_webp(crop, process_dir / "ai-accent-specimen.webp")

    retrieved_at = datetime.now(timezone.utc).isoformat()
    records: list[dict] = []

    hero_rights = dict(
        source_page="Original HobFarm production",
        direct_asset_url="",
        creator="HobFarm with OpenAI built-in image generation",
        date="2026-07-22",
        rights_statement="Original editorial artwork generated for HobFarm without supplied reference images, logos, likenesses, or copyrighted characters.",
        license_name="HobFarm original editorial art",
        public_domain=False,
        rationale="Unifies a century of changing media gates without borrowing a copyrighted cover or celebrity likeness.",
        retrieved_at=retrieved_at,
    )
    hero_variants = [
        ("hero-webp", hero_dir / "censor-ouroboros-hero.webp", "hero/censor-ouroboros-hero.webp", "Web hero crop", "Responsive 16:9 crop and WebP conversion"),
        ("hero-og", hero_dir / "censor-ouroboros-hero-social-1200x630.jpg", "hero/censor-ouroboros-hero-social-1200x630.jpg", "Open Graph hero crop", "1200 × 630 social crop and JPEG conversion"),
        ("hero-square", hero_dir / "censor-ouroboros-hero-square.jpg", "hero/censor-ouroboros-hero-square.jpg", "Square social hero crop", "1080 × 1080 social crop and JPEG conversion"),
        ("hero-vertical", hero_dir / "censor-ouroboros-hero-vertical.jpg", "hero/censor-ouroboros-hero-vertical.jpg", "Vertical social hero crop", "1080 × 1350 social crop and JPEG conversion"),
    ]
    avif_path = hero_dir / "censor-ouroboros-hero.avif"
    if avif_path.exists():
        hero_variants.insert(1, ("hero-avif", avif_path, "hero/censor-ouroboros-hero.avif", "AVIF web hero crop", "Responsive 16:9 crop and AVIF conversion"))
    for asset_id, path, suffix, work_title, edit in hero_variants:
        records.append(
            image_record(
                asset_id=asset_id,
                path=path,
                key=f"{PUBLIC_PREFIX}/{suffix}",
                work_title=work_title,
                edit=edit,
                caption="The gate changed shape: office, seal, blacklist, sponsor, sticker, algorithm, and prompt box.",
                credit="Original HobFarm editorial art",
                alt="A paper-collage ouroboros made from film, approval marks, media hardware, recommendation symbols, and an AI cursor loops around an independent creator's desk.",
                **hero_rights,
            )
        )

    archive_specs = [
        (
            "the-masses-letter",
            archival_dir / "1917-the-masses-mail-censorship.webp",
            "archival/1917-the-masses-mail-censorship.webp",
            "https://www.loc.gov/exhibitions/world-war-i-american-experiences/about-this-exhibition/over-here/surveillance-and-censorship/suppression-of-the-masses/",
            DOWNLOADS["masses-letter-source.jpg"],
            "Max Eastman / Library of Congress",
            "Editor Max Eastman to Woodrow Wilson",
            "1917",
            "1917 manuscript reproduced by the Library of Congress; U.S. copyright term has expired.",
            "Public domain",
            True,
            "Documents the dispute surrounding the Post Office's decision that The Masses could not be mailed.",
            "Color-normalized WebP derivative; no content removed.",
            "The Post Office did not need to ban every copy of The Masses. Declaring the issue unmailable cut the magazine off from national distribution.",
            "Max Eastman letter, Woodrow Wilson Papers, Library of Congress",
            "A 1917 typewritten letter from The Masses editor Max Eastman to President Woodrow Wilson.",
        ),
        (
            "pca-certificate",
            archival_dir / "1934-pca-certificate.webp",
            "archival/1934-pca-certificate.webp",
            "https://blogs.loc.gov/now-see-hear/2014/07/when-pre-met-code-eighty-years-ago-today/",
            DOWNLOADS["pca-certificate-source.jpg"],
            "Motion Picture Producers and Distributors of America / Library of Congress",
            "PCA Certificate No. 1 for The World Moves On",
            "1934",
            "Rights status is not stated on the LOC blog; this limited reproduction of the exact certificate supports historical criticism and identification.",
            "Limited editorial use",
            False,
            "Shows the approval document that converted moral judgment into a release requirement.",
            "Small LOC reproduction converted to WebP; no substantive content altered.",
            "Beginning July 15, 1934, films from MPPDA members needed PCA approval before release. The moral argument became a document in the pipeline.",
            "Library of Congress, Now See Hear",
            "The first Production Code Administration certificate, numbered one for The World Moves On.",
        ),
        (
            "comics-hearing-transcript",
            archival_dir / "1954-comics-hearing-transcript.webp",
            "archival/1954-comics-hearing-transcript.webp",
            "https://blogs.loc.gov/law/2022/10/the-senate-comic-book-hearings-of-1954/",
            DOWNLOADS["comics-hearing-transcript-source.png"],
            "U.S. Senate / Library of Congress",
            "Juvenile Delinquency (Comic Books) hearing transcript excerpt",
            "1954",
            "Work of the United States government.",
            "Public domain",
            True,
            "Documents the Gaines-Kefauver argument over horror-comic context and good taste.",
            "WebP conversion; no transcript text altered.",
            "William Gaines argued that the challenged cover fit the standards of a horror comic. The hearing wanted one answer to good taste.",
            "U.S. Senate hearing transcript via the Library of Congress",
            "A 1954 Senate hearing transcript excerpt showing questions to publisher William Gaines about a horror-comic cover.",
        ),
        (
            "comics-newsstand",
            archival_dir / "1939-comics-newsstand.webp",
            "archival/1939-comics-newsstand.webp",
            "https://blogs.loc.gov/law/2022/10/the-senate-comic-book-hearings-of-1954/",
            DOWNLOADS["comics-newsstand-source.png"],
            "Arthur Rothstein / Farm Security Administration / Library of Congress",
            "Magazines and comic books on a newsstand in St. Louis",
            "1939",
            "Farm Security Administration photograph; Library of Congress records FSA/OWI material as having no known restrictions.",
            "Public domain / no known restrictions",
            True,
            "Shows the retail rack that industry seals and distributor pressure controlled.",
            "WebP conversion; no crop.",
            "The Comics Code did not make disapproved books illegal. It made ordinary racks much harder to reach.",
            "Arthur Rothstein, FSA, Library of Congress",
            "A 1939 black-and-white photograph of magazines and comic books packed onto a St. Louis newsstand.",
        ),
        (
            "hollywood-ten-statement",
            archival_dir / "1947-hollywood-ten-statement.webp",
            "archival/1947-hollywood-ten-statement.webp",
            "https://visit.archives.gov/whats-on/explore-exhibits/remembering-hollywood-10-screenwriter-ring-lardner-jr",
            DOWNLOADS["hollywood-ten-statement-source.jpg"],
            "Ring Lardner Jr. / Records of the U.S. House of Representatives / National Archives",
            "Statement of Ring Lardner Jr. to HUAC",
            "1947",
            "U.S. House committee record held by the National Archives.",
            "Public domain government record",
            True,
            "Shows the government document behind a system that combined subpoenas, conviction, prison, and private employment exclusion.",
            "WebP conversion; no content removed.",
            "HUAC removed Ring Lardner Jr. before he could read this statement. Government punishment and studio blacklisting then reinforced each other.",
            "National Archives, Records of the U.S. House of Representatives",
            "Ring Lardner Jr.'s typed 1947 statement to the House Un-American Activities Committee.",
        ),
    ]
    for spec in archive_specs:
        records.append(
            image_record(
                asset_id=spec[0], path=spec[1], key=f"{PUBLIC_PREFIX}/{spec[2]}",
                source_page=spec[3], direct_asset_url=spec[4], creator=spec[5],
                work_title=spec[6], date=spec[7], rights_statement=spec[8],
                license_name=spec[9], public_domain=spec[10], rationale=spec[11],
                edit=spec[12], caption=spec[13], credit=spec[14], alt=spec[15],
                retrieved_at=retrieved_at,
            )
        )

    process_specs = [
        (
            "rumble-homepage",
            process_dir / "rumble-homepage-visit.webp",
            "process/rumble-homepage-visit.webp",
            "https://rumble.com/",
            "User-supplied screenshot; original capture URL not recorded",
            "Rumble interface captured by the HobFarm author",
            "One Rumble homepage visit",
            "2026-07",
            "Limited website screenshot used to document and critique one dated product experience; it does not characterize every page or user.",
            "Editorial screenshot use",
            False,
            "The exact homepage mix is the first-person incident that opens the article.",
            "Cropped to the visible upper homepage; no account data present.",
            "One homepage visit, not a platform census. The writer opened Rumble looking for a creative-video home and found a political lobby.",
            "HobFarm process capture",
            "A dated Rumble homepage crop showing political commentary, news, podcasts, gaming, and other category rows.",
        ),
        (
            "psycho-factoid",
            process_dir / "psycho-factoid-specimen.webp",
            "process/psycho-factoid-specimen.webp",
            "User-supplied Instagram screenshot; source post URL not provided",
            "User-supplied screenshot",
            "Public Instagram post, account identity obscured",
            "Psycho factoid caption specimen",
            "2026",
            "Small transformed crop of the exact public caption criticized in the article; the film frame and account identity were removed.",
            "Limited editorial quotation / commentary",
            False,
            "Shows how a complex archival negotiation was compressed into a mastermind narrative.",
            "Cropped to caption text; film still removed; account identity blurred.",
            "The factoid version turns a documented negotiation into one genius, one room of fools, and one secret trick.",
            "User-supplied process screenshot",
            "An Instagram caption describing a simplified story about Hitchcock, Psycho, and the censors; the account identity is blurred.",
        ),
        (
            "ai-accent",
            process_dir / "ai-accent-specimen.webp",
            "process/ai-accent-specimen.webp",
            "User-supplied X screenshot; source post URL not provided",
            "User-supplied screenshot",
            "Public X post, account identity obscured",
            "Not X but Y AI-accent specimen",
            "2026",
            "Small transformed crop of the exact public post discussed in the article; account identity was removed.",
            "Limited editorial quotation / commentary",
            False,
            "Documents reader recognition of a prose cadence associated with generated writing without claiming the pattern proves authorship.",
            "Account avatar, display name, and handle blurred; post text retained.",
            "The post proves that readers recognize an AI-associated cadence. It does not prove every sentence using the pattern was generated.",
            "User-supplied process screenshot",
            "A short social post complaining about sentences shaped as Not X but Y; the account identity is blurred.",
        ),
    ]
    for spec in process_specs:
        records.append(
            image_record(
                asset_id=spec[0], path=spec[1], key=f"{PUBLIC_PREFIX}/{spec[2]}",
                source_page=spec[3], direct_asset_url=spec[4], creator=spec[5],
                work_title=spec[6], date=spec[7], rights_statement=spec[8],
                license_name=spec[9], public_domain=spec[10], rationale=spec[11],
                edit=spec[12], caption=spec[13], credit=spec[14], alt=spec[15],
                retrieved_at=retrieved_at,
            )
        )

    credits = write_credits(records)
    write_manifests(records, retrieved_at, credits)
    print(f"Built {len(records)} public image records in {ASSET_ROOT}")


if __name__ == "__main__":
    main()
