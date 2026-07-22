import { useState } from "react";
import type { Snippet } from "@/data/avatar-content-system";

interface Props {
  snippets: Snippet[];
}

export default function SnippetCards({ snippets }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  async function copySnippet(snippet: Snippet) {
    setFailed(null);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(snippet.body);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = snippet.body;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copyCommand = (document as unknown as { execCommand(commandId: string): boolean })
          .execCommand;
        const ok = copyCommand.call(document, "copy");
        document.body.removeChild(textarea);
        if (!ok) throw new Error("copy_failed");
      }
      setCopied(snippet.title);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
      setFailed(snippet.title);
      window.setTimeout(() => setFailed(null), 1600);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {snippets.map((snippet) => (
        <article key={snippet.title} className="border border-base-800 bg-base-950/60 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">
                {snippet.title}
              </h3>
              {snippet.note ? (
                <p className="mt-2 text-xs leading-relaxed text-base-500">{snippet.note}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => copySnippet(snippet)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-base-700 px-4 text-xs font-medium text-base-300 transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-green-bright motion-reduce:transition-none"
            >
              {copied === snippet.title ? "Copied" : failed === snippet.title ? "Copy failed" : "Copy"}
            </button>
          </div>
          <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap border-l border-l-accent-green bg-base-900/70 p-4 text-xs leading-relaxed text-base-300">
            {snippet.body}
          </pre>
        </article>
      ))}
    </div>
  );
}
