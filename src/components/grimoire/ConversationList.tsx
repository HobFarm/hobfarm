export interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ConversationListProps) {
  const sorted = [...conversations].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full h-9 px-4 py-2 rounded-full bg-linear-to-t from-accent-600 to-accent-500 text-base-950 text-xs font-medium shadow-dimensional hover:from-accent-500 hover:to-accent-600 transition-colors"
        >
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {sorted.length === 0 && (
          <p className="text-base-500 text-xs font-sans text-center mt-8 px-4">
            No conversations yet. Start one above.
          </p>
        )}
        {sorted.map((conv) => (
          <div
            key={conv.id}
            className={`group relative flex items-center rounded-lg mb-1 transition-colors ${
              activeId === conv.id
                ? "bg-base-800 border-l-2 border-accent-500"
                : "hover:bg-base-800/50"
            }`}
          >
            <button
              onClick={() => onSelect(conv.id)}
              className="flex-1 text-left px-3 py-2.5 min-w-0"
            >
              <span className="block text-sm font-sans text-white truncate">
                {conv.title || "Untitled"}
              </span>
              <span className="block text-[11px] text-base-500 mt-0.5">
                {formatDate(conv.created_at)}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="hidden group-hover:flex items-center justify-center w-7 h-7 mr-1 rounded text-base-500 hover:text-red-400 hover:bg-base-700 transition-colors shrink-0"
              aria-label="Delete conversation"
              title="Delete conversation"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
