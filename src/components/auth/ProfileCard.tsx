import { useEffect, useState, type SubmitEvent } from "react";
import { fetchMe, requestEmailChange, verifyEmailChange, type UserPayload } from "@/lib/auth";

type EmailChangeStage = "idle" | "enter-email" | "enter-code" | "success";
type Status = "idle" | "submitting" | "error";

const inputClass =
  "w-full px-3 py-3 bg-base-900 border-l border-l-white border-transparent text-white placeholder-base-500 focus:border-white focus:bg-base-950 focus:outline-none transition-colors text-sm";

const buttonClass =
  "px-4 py-2 bg-white text-base-950 text-sm font-medium hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const secondaryButtonClass =
  "px-4 py-2 border border-base-700 text-base-300 text-sm hover:border-base-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const linkButtonClass =
  "text-base-500 hover:text-base-300 text-xs font-mono cursor-pointer transition-colors";

function formatDate(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function errorMessage(status: number, error?: string): string {
  if (status === 409) return "That email is already in use by another account.";
  if (status === 429) return "Too many requests. Wait a minute and try again.";
  if (status === 400 && error === "same_email") return "That's already your current email.";
  if (status === 400 && error === "invalid_email") return "Please enter a valid email address.";
  if (status === 400) return "Please enter a valid email address.";
  if (status === 410) return "Code expired. Request a new one.";
  if (status === 404) return "No pending change found. Start over.";
  return "Something went wrong, please try again.";
}

export default function ProfileCard() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Email change flow state.
  const [changeStage, setChangeStage] = useState<EmailChangeStage>("idle");
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMe().then((u) => {
      if (!u) {
        const path = `${window.location.pathname}${window.location.search}${window.location.hash}` || "/account";
        window.location.replace(`/login?${new URLSearchParams({ next: path }).toString()}`);
        return;
      }
      setUser(u);
      setLoaded(true);
    });
  }, []);

  function resetEmailChange() {
    setChangeStage("idle");
    setNewEmail("");
    setCode("");
    setError("");
    setStatus("idle");
  }

  async function handleRequestCode(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");

    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) {
      setError("Enter an email address.");
      setStatus("error");
      return;
    }

    const result = await requestEmailChange(trimmed);
    if (result.ok) {
      setNewEmail(trimmed);
      setChangeStage("enter-code");
      setStatus("idle");
      return;
    }
    setError(errorMessage(result.status, result.error));
    // On 410/404, reset to enter-email stage.
    if (result.status === 410 || result.status === 404) {
      setChangeStage("enter-email");
    }
    setStatus("error");
  }

  async function handleVerifyCode(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");

    const cleaned = code.replace(/\D/g, "");
    if (cleaned.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      setStatus("error");
      return;
    }

    const result = await verifyEmailChange(cleaned);
    if (result.ok && result.user) {
      setUser(result.user);
      setChangeStage("success");
      setStatus("idle");
      // Auto-collapse after 3 seconds.
      setTimeout(() => resetEmailChange(), 3000);
      return;
    }
    setError(errorMessage(result.status, result.error));
    // On 410/404/409, reset to enter-email stage.
    if (result.status === 410 || result.status === 404 || result.status === 409) {
      setChangeStage("enter-email");
      setCode("");
    }
    setStatus("error");
  }

  if (!loaded) {
    return (
      <div className="border border-base-800 p-6 min-h-[140px]">
        <p className="text-xs font-mono text-base-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="border border-base-800 p-6 space-y-4">
      <p className="text-xs font-mono text-accent-500 uppercase tracking-wider">Profile</p>

      <div className="space-y-2">
        <p className="text-xs font-mono text-base-500">Email</p>
        <div className="flex items-center gap-4">
          <p className="text-sm text-white font-mono">{user.email}</p>
          {changeStage === "idle" && (
            <button
              type="button"
              onClick={() => setChangeStage("enter-email")}
              className={linkButtonClass}
            >
              Change
            </button>
          )}
        </div>
      </div>

      {/* Email change: enter new email */}
      {changeStage === "enter-email" && (
        <form onSubmit={handleRequestCode} className="space-y-3 border-t border-base-800 pt-4">
          <label htmlFor="new-email" className="block text-xs font-mono text-base-500">
            New email address
          </label>
          <input
            id="new-email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
          {status === "error" && error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={status === "submitting"} className={buttonClass}>
              {status === "submitting" ? "Sending..." : "Send verification code"}
            </button>
            <button type="button" onClick={resetEmailChange} className={secondaryButtonClass}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Email change: enter code */}
      {changeStage === "enter-code" && (
        <form onSubmit={handleVerifyCode} className="space-y-3 border-t border-base-800 pt-4">
          <p className="text-sm text-base-400">
            Code sent to <span className="font-mono text-white">{newEmail}</span>. Check your inbox.
          </p>
          <label htmlFor="change-code" className="block text-xs font-mono text-base-500">
            Verification code
          </label>
          <input
            id="change-code"
            type="text"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className={`${inputClass} font-mono tracking-[0.4em] text-center text-lg`}
            placeholder="••••••"
          />
          {status === "error" && error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={status === "submitting"} className={buttonClass}>
              {status === "submitting" ? "Verifying..." : "Verify"}
            </button>
            <button type="button" onClick={resetEmailChange} className={secondaryButtonClass}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Email change: success */}
      {changeStage === "success" && (
        <div className="border-t border-base-800 pt-4">
          <p className="text-sm text-green-400 font-mono">
            Email updated to {user.email}.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-mono text-base-500">Member since</p>
        <p className="text-sm text-white">{formatDate(user.created_at)}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-mono text-base-500">Email verified</p>
        <p className="text-sm text-white">
          {user.email_verified_at ? formatDate(user.email_verified_at) : "Not yet"}
        </p>
      </div>
    </div>
  );
}
