import { useReducer, useEffect, useRef, useCallback } from "react";
import ConversationList, { type Conversation } from "./ConversationList";
import MessageBubble, { type Message } from "./MessageBubble";
import ChatInput from "./ChatInput";
import { fetchMe, type UserPayload } from "@/lib/auth";

const API_BASE = ""; // same-origin proxy at /api/chat/*
const MAX_MESSAGE_CHARS = 4000;
const MAX_DERIVED_TITLE_CHARS = 60;
const LOGIN_HREF = "/login?next=%2Fgrimoire%2F%23ask";

function isConversation(v: unknown): v is Conversation {
  if (!v || typeof v !== "object") return false;
  const c = v as Conversation;
  return (
    typeof c.id === "string" &&
    (typeof c.title === "string" || c.title === null) &&
    typeof c.created_at === "string"
  );
}

function isMessage(v: unknown): v is Message {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as Message).id === "string" &&
    ((v as Message).role === "user" || (v as Message).role === "assistant") &&
    typeof (v as Message).content === "string"
  );
}

// State

interface State {
  conversations: Conversation[];
  activeId: string | null;
  messages: Message[];
  streaming: "idle" | "streaming" | "error";
  sidebarOpen: boolean;
  apiAvailable: boolean;
  apiChecking: boolean;
  streamingContent: string;
  me: UserPayload | null;
  authChecking: boolean;
  lastError: string | null;
}

type Action =
  | { type: "SET_CONVERSATIONS"; data: Conversation[] }
  | { type: "SET_ACTIVE"; id: string | null; messages: Message[] }
  | { type: "ADD_CONVERSATION"; data: Conversation }
  | { type: "ADD_USER_MESSAGE"; message: Message }
  | { type: "START_STREAM"; assistantId: string }
  | { type: "APPEND_TOKEN"; token: string }
  | { type: "FINISH_STREAM"; grimoire_refs?: Message["grimoire_refs"] }
  | { type: "STREAM_ERROR"; message?: string }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "API_UNAVAILABLE" }
  | { type: "API_CHECKING" }
  | { type: "RETRY" }
  | { type: "SET_ME"; user: UserPayload | null }
  | { type: "RESET_FOR_NEW" };

const initialState: State = {
  conversations: [],
  activeId: null,
  messages: [],
  streaming: "idle",
  sidebarOpen: false,
  apiAvailable: true,
  apiChecking: true,
  streamingContent: "",
  me: null,
  authChecking: true,
  lastError: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.data, apiAvailable: true, apiChecking: false };
    case "SET_ACTIVE":
      return { ...state, activeId: action.id, messages: action.messages };
    case "ADD_CONVERSATION":
      return {
        ...state,
        conversations: [action.data, ...state.conversations],
        activeId: action.data.id,
        messages: [],
      };
    case "ADD_USER_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "START_STREAM":
      return {
        ...state,
        streaming: "streaming",
        streamingContent: "",
        messages: [
          ...state.messages,
          { id: action.assistantId, role: "assistant", content: "" },
        ],
      };
    case "APPEND_TOKEN": {
      const newContent = state.streamingContent + action.token;
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === "assistant") {
        msgs[msgs.length - 1] = { ...last, content: newContent };
      }
      return { ...state, streamingContent: newContent, messages: msgs };
    }
    case "FINISH_STREAM": {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === "assistant" && action.grimoire_refs) {
        msgs[msgs.length - 1] = { ...last, grimoire_refs: action.grimoire_refs };
      }
      return { ...state, streaming: "idle", streamingContent: "", messages: msgs };
    }
    case "STREAM_ERROR":
      return { ...state, streaming: "error", lastError: action.message ?? null };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "API_UNAVAILABLE":
      return { ...state, apiAvailable: false, apiChecking: false };
    case "API_CHECKING":
      return { ...state, apiChecking: true };
    case "RETRY":
      return { ...state, apiAvailable: true, apiChecking: true };
    case "SET_ME":
      return {
        ...state,
        me: action.user,
        authChecking: false,
        apiChecking: action.user ? state.apiChecking : false,
      };
    case "RESET_FOR_NEW":
      return {
        ...state,
        activeId: null,
        messages: [],
        streaming: "idle",
        streamingContent: "",
        lastError: null,
      };
    default:
      return state;
  }
}

// Component

export default function GrimoireChat() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const sendInFlightRef = useRef(false);

  // Health check with retry
  const retryRef = useRef(0);

  const checkApi = useCallback(async () => {
    const maxRetries = 3;
    const baseDelay = 2000;

    dispatch({ type: "API_CHECKING" });
    retryRef.current = 0;

    const attempt = async (): Promise<void> => {
      try {
        const r = await fetch(`${API_BASE}/api/chat/conversations`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        dispatch({ type: "SET_CONVERSATIONS", data: Array.isArray(data) ? data : [] });
      } catch {
        retryRef.current++;
        if (retryRef.current < maxRetries) {
          await new Promise((res) => setTimeout(res, baseDelay * Math.pow(2, retryRef.current - 1)));
          return attempt();
        }
        dispatch({ type: "API_UNAVAILABLE" });
      }
    };

    return attempt();
  }, []);

  // Auth gate: resolve session before touching /api/chat/*
  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((user) => {
        if (!cancelled) dispatch({ type: "SET_ME", user });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "SET_ME", user: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Only load conversations once we know the visitor is authenticated
  useEffect(() => {
    if (state.authChecking) return;
    if (!state.me) return;
    checkApi();
  }, [state.authChecking, state.me, checkApi]);

  // Auto-scroll
  useEffect(() => {
    if (!userScrolledUp.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.messages]);

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const threshold = 100;
    userScrolledUp.current = el.scrollHeight - el.scrollTop - el.clientHeight > threshold;
  }, []);

  // Select conversation
  const selectConversation = async (id: string) => {
    try {
      const r = await fetch(`${API_BASE}/api/chat/conversations/${id}`);
      if (!r.ok) throw new Error("Failed to load conversation");
      const data = (await r.json()) as { messages?: unknown };
      dispatch({
        type: "SET_ACTIVE",
        id,
        messages: Array.isArray(data.messages) ? data.messages.filter(isMessage) : [],
      });
      dispatch({ type: "TOGGLE_SIDEBAR" }); // close mobile drawer
      userScrolledUp.current = false;
    } catch {
      dispatch({ type: "STREAM_ERROR" });
    }
  };

  // New conversation: pure client-side reset. Row is created lazily on first send.
  const newConversation = () => {
    dispatch({ type: "RESET_FOR_NEW" });
    if (state.sidebarOpen) dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  // Send message with SSE streaming. Lazily creates the conversation on first send.
  const sendMessage = async (content: string) => {
    if (state.streaming === "streaming" || sendInFlightRef.current) return;
    if (!state.me) return;

    sendInFlightRef.current = true;
    let conversationId = state.activeId;

    try {
      if (conversationId === null) {
        const trimmed = content.trim();
        const derived = trimmed.slice(0, MAX_DERIVED_TITLE_CHARS);
        const body = derived ? JSON.stringify({ title: derived }) : "{}";

        let created: unknown;
        try {
          const r = await fetch(`${API_BASE}/api/chat/conversations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          created = await r.json();
        } catch {
          dispatch({ type: "STREAM_ERROR", message: "Failed to start conversation. Try again." });
          return;
        }

        if (!isConversation(created)) {
          dispatch({ type: "STREAM_ERROR", message: "Unexpected response from chat service." });
          return;
        }

        conversationId = created.id;
        dispatch({ type: "ADD_CONVERSATION", data: created });
      }

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
      };
      dispatch({ type: "ADD_USER_MESSAGE", message: userMsg });
      userScrolledUp.current = false;

      const assistantId = `assistant-${Date.now()}`;
      dispatch({ type: "START_STREAM", assistantId });

      const r = await fetch(
        `${API_BASE}/api/chat/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (!r.ok || !r.body) {
        dispatch({ type: "STREAM_ERROR" });
        return;
      }

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event = JSON.parse(raw);
            if (event.type === "token") {
              dispatch({ type: "APPEND_TOKEN", token: event.text });
            } else if (event.type === "done") {
              receivedDone = true;
              dispatch({
                type: "FINISH_STREAM",
                grimoire_refs: event.grimoire_refs,
              });
            }
          } catch {
            // non-JSON line, skip
          }
        }
      }

      // If stream ended without a "done" event
      if (!receivedDone) {
        dispatch({ type: "FINISH_STREAM" });
      }
    } catch {
      dispatch({ type: "STREAM_ERROR" });
    } finally {
      sendInFlightRef.current = false;
    }
  };

  // Delete conversation
  const deleteConversation = async (id: string) => {
    try {
      const r = await fetch(`${API_BASE}/api/chat/conversations/${id}`, {
        method: "DELETE",
      });
      if (!r.ok) return;
      dispatch({
        type: "SET_CONVERSATIONS",
        data: state.conversations.filter((c) => c.id !== id),
      });
      if (state.activeId === id) {
        dispatch({ type: "SET_ACTIVE", id: null, messages: [] });
      }
    } catch {
      // silent fail
    }
  };

  // Feedback handler
  const handleFeedback = async (messageId: string, signal: "up" | "down") => {
    try {
      await fetch(`${API_BASE}/api/chat/messages/${messageId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signal }),
      });
    } catch {
      // silent fail on feedback
    }
  };

  // Auth gate: resolve session first
  if (state.authChecking) {
    return (
      <div className="flex items-center justify-center h-full bg-base-950">
        <div className="text-center px-6">
          <div className="text-5xl mb-4 opacity-60">&#x1F56F;</div>
          <h2 className="text-xl font-sans text-base-200 mb-2">Verifying session...</h2>
        </div>
      </div>
    );
  }

  if (!state.me) {
    return (
      <div className="flex items-center justify-center h-full bg-base-950">
        <div className="text-center px-6 max-w-sm">
          <div className="text-5xl mb-4 opacity-60">&#x1F56F;</div>
          <h2 className="text-xl font-sans text-base-200 mb-2">Login to chat</h2>
          <p className="text-sm text-base-500 font-sans mb-5">
            Chat with the Grimoire is for logged-in users. Public Grimoire
            context below remains open to anyone.
          </p>
          <a
            href={LOGIN_HREF}
            className="inline-block h-9 px-5 py-2 rounded-full bg-linear-to-t from-accent-600 to-accent-500 text-base-950 text-xs font-medium shadow-dimensional hover:from-accent-500 hover:to-accent-600 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  // Connecting / unavailable fallback
  if (!state.apiAvailable || state.apiChecking) {
    return (
      <div className="flex items-center justify-center h-full bg-base-950">
        <div className="text-center px-6">
          <div className="text-5xl mb-4 opacity-60">&#x1F56F;</div>
          <h2 className="text-xl font-sans text-base-200 mb-2">
            {state.apiChecking ? "Opening substrate channel..." : "Substrate channel unavailable"}
          </h2>
          <p className="text-sm text-base-500 font-sans max-w-sm">
            {state.apiChecking
              ? "Reaching the substrate..."
              : "The public notes below are still available. The chat will reconnect when the worker responds."}
          </p>
          {!state.apiChecking && (
            <button
              onClick={() => {
                dispatch({ type: "RETRY" });
                checkApi();
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-base-100 bg-base-800 border border-base-600 rounded-full hover:bg-base-700 transition-colors"
            >
              Retry channel
            </button>
          )}
        </div>
      </div>
    );
  }

  // No active conversation
  const showEmptyState = state.activeId === null;

  return (
    <div className="flex h-full bg-base-950 relative">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
        className="absolute top-3 left-3 z-30 lg:hidden p-2 rounded-full bg-base-800 text-base-300 hover:bg-base-700 transition-colors"
        aria-label="Toggle conversations"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Sidebar overlay (mobile) */}
      {state.sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-20
          w-72 bg-base-900 border-r border-base-700
          transform transition-transform duration-200
          ${state.sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:block
        `}
      >
        <div className="h-full pt-2">
          <div className="px-4 py-3 border-b border-base-700">
            <h2 className="text-sm font-sans font-medium text-white tracking-wide uppercase">
              Conversations
            </h2>
          </div>
          <ConversationList
            conversations={state.conversations}
            activeId={state.activeId}
            onSelect={selectConversation}
            onNew={newConversation}
            onDelete={deleteConversation}
          />
        </div>
      </aside>

      {/* Chat panel */}
      <main className="flex-1 flex flex-col min-w-0">
        {showEmptyState ? (
          <>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6 max-w-md">
                <h2 className="text-lg font-sans text-base-300 mb-2">
                  Ask about atoms, correspondences, prompt compilation, or identity lock.
                </h2>
                <p className="text-sm text-base-500 font-sans">
                  Your first message starts a new conversation.
                </p>
                {state.streaming === "error" && state.lastError && (
                  <p className="mt-3 text-xs text-red-400 font-sans">{state.lastError}</p>
                )}
              </div>
            </div>
            <ChatInput
              onSend={sendMessage}
              disabled={state.streaming === "streaming"}
              maxLength={MAX_MESSAGE_CHARS}
            />
          </>
        ) : (
          <>
            {/* Messages area */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-6 lg:px-8"
            >
              {state.messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-base-500 text-sm font-sans">
                    Ask about atoms, correspondences, prompt compilation, or identity lock.
                  </p>
                </div>
              )}
              {state.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onFeedback={handleFeedback}
                />
              ))}
              {state.streaming === "error" && (
                <div className="text-center py-2">
                  <span className="text-red-400 text-xs font-sans">
                    Channel error. Try again.
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
              onSend={sendMessage}
              disabled={state.streaming === "streaming"}
              maxLength={MAX_MESSAGE_CHARS}
            />
          </>
        )}
      </main>
    </div>
  );
}
