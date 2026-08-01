import {
  characterMarkdown,
  getPublicAgentCharacters,
  markdownResponse,
} from "@/lib/agent-corpus";

export function getStaticPaths() {
  return getPublicAgentCharacters().map((character) => ({
    params: { character: character.slug },
    props: { character },
  }));
}

export function GET({
  props,
}: {
  props: { character: ReturnType<typeof getPublicAgentCharacters>[number] };
}) {
  return markdownResponse(characterMarkdown(props.character));
}
