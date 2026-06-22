import { useState } from "react";
import { requestCode, verifyCode, validateReturnUrl } from "@/lib/auth";

type Stage = "email" | "code";
type Status = "idle" | "submitting" | "error";

const inputClass =
  "w-full px-3 py-3 bg-base-900 border-l border-l-white border-transparent text-white placeholder-base-500 focus:border-white focus:bg-base-950 focus:outline-none transition-colors text-sm";

const buttonClass =
  "px-6 py-3 bg-white text-base-950 text-sm font-medium hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const linkButtonClass =
  "text-base-500 hover:text-base-300 text-xs font-mono cursor-pointer transition-colors";

export default function LoginForm() {
  const [stage, setStage] = useState<Stage>("email");
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [nextUrl] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    // `?next=` is canonical. `?return=` is a legacy fallback for stale
    // bookmarks and emails; remove it once cached references have expired.
    const raw = params.get("next") ?? params.get("return");
    return validateReturnUrl(raw);
  });

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Enter an email.");
      setStatus("error");
      return;
    }

    // Per Brief #1, /api/auth/request always 200s unless format-invalid.
    // Either way, advance to code stage; no existence leak.
    await requestCode(trimmed);
    setEmail(trimmed);
    setCode("");
    setStage("code");
    setStatus("idle");
  }

  async function handleCodeSubmit(e: React.FormEvent) {
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

    const result = await verifyCode(email, cleaned);
    if (result.ok) {
      window.location.href = nextUrl ?? "/account";
      return;
    }
    setError("Invalid or expired code, try again.");
    setStatus("error");
  }

  function backToEmail() {
    setStage("email");
    setCode("");
    setError("");
    setStatus("idle");
  }

  if (stage === "code") {
    return (
      <form onSubmit={handleCodeSubmit} className="space-y-6">
        <p className="text-sm text-base-400">
          Code sent to <span className="font-mono text-white">{email}</span>. Check your inbox.
        </p>

        <div>
          <label htmlFor="code" className="block text-xs font-mono text-base-500 mb-2">
            Verification code
          </label>
          <input
            id="code"
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
        </div>

        {status === "error" && error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <div className="flex items-center gap-6">
          <button type="submit" disabled={status === "submitting"} className={buttonClass}>
            {status === "submitting" ? "Verifying..." : "Verify"}
          </button>
          <button type="button" onClick={backToEmail} className={linkButtonClass}>
            Use a different email
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div>
        <label htmlFor="login-email" className="block text-xs font-mono text-base-500 mb-2">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      {status === "error" && error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button type="submit" disabled={status === "submitting"} className={buttonClass}>
        {status === "submitting" ? "Sending..." : "Send code"}
      </button>

      <p className="text-xs text-base-500 font-mono">
        New here? Enter your email; we'll create an account when you verify.
      </p>
    </form>
  );
}
