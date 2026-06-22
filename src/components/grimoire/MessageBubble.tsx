import FeedbackButtons from "./FeedbackButtons";

export interface GrimoireRef {
  id: string;
  text: string;
  category?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  grimoire_refs?: GrimoireRef[];
  created_at?: string;
}

interface MessageBubbleProps {
  message: Message;
  onFeedback: (messageId: string, signal: "up" | "down") => void;
}

export default function MessageBubble({ message, onFeedback }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-base-500 font-sans">
            {isUser ? "You" : "Grimoire"}
          </span>
        </div>

        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? "bg-accent-600/80 text-white"
              : "bg-base-900 text-base-200 border border-base-700"
          }`}
        >
          <p className="font-sans text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>

        {!isUser && message.grimoire_refs && message.grimoire_refs.length > 0 && (
          <div className="mt-1.5">
            <p className="text-[10px] font-mono text-base-500 uppercase tracking-wider mb-1">
              Grimoire context returned
            </p>
            <div className="flex flex-wrap gap-1">
              {message.grimoire_refs.map((ref) => (
                <span
                  key={ref.id}
                  className="inline-block px-1.5 py-0.5 text-[10px] font-mono text-base-400 bg-base-800 border border-base-700 rounded"
                  title={ref.category || "atom"}
                >
                  {ref.text}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isUser && (
          <FeedbackButtons messageId={message.id} onFeedback={onFeedback} />
        )}
      </div>
    </div>
  );
}
