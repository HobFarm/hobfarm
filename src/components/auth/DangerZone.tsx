import { useEffect, useState } from "react";
import { fetchMe, logout, deleteAccount, type UserPayload } from "@/lib/auth";

const secondaryButtonClass =
  "px-4 py-2 border border-base-700 text-base-300 text-sm hover:border-base-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const dangerButtonClass =
  "px-4 py-2 border border-red-900 text-red-400 text-sm hover:border-red-500 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const inputClass =
  "w-full px-3 py-2 bg-base-900 border-l border-l-red-500 border-transparent text-white placeholder-base-500 focus:border-red-500 focus:bg-base-950 focus:outline-none transition-colors text-sm font-mono";

export default function DangerZone() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMe().then((u) => {
      if (!u) return;
      setUser(u);
    });
  }, []);

  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    await logout();
    window.location.href = "/";
  }

  async function handleDelete() {
    if (busy) return;
    setError("");
    if (!user) return;
    if (confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
      setError("Type your email exactly to confirm.");
      return;
    }
    setBusy(true);
    const ok = await deleteAccount();
    if (!ok) {
      setBusy(false);
      setError("Delete failed. Try again or visit Customer Help.");
      return;
    }
    window.location.href = "/?deleted=1";
  }

  return (
    <div className="border border-base-800 p-6 space-y-6">
      <p className="text-xs font-mono text-accent-500 uppercase tracking-wider">Account</p>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleLogout} disabled={busy} className={secondaryButtonClass}>
          {busy ? "..." : "Log out"}
        </button>
      </div>

      <div className="border-t border-base-800 pt-6 space-y-4">
        <p className="text-xs font-mono text-red-400 uppercase tracking-wider">Danger zone</p>
        <p className="text-sm text-base-400">
          Deleting your account drops all sessions and stored API keys, and anonymizes your email so it can be reused.
        </p>

        {!confirming ? (
          <button
            type="button"
            onClick={() => {
              setConfirming(true);
              setError("");
            }}
            className={dangerButtonClass}
          >
            Delete account
          </button>
        ) : (
          <div className="space-y-3">
            <label htmlFor="confirm-email" className="block text-xs font-mono text-base-500">
              Type your email to confirm
            </label>
            <input
              id="confirm-email"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={user?.email ?? ""}
              className={inputClass}
              autoFocus
            />
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleDelete} disabled={busy} className={dangerButtonClass}>
                {busy ? "Deleting..." : "Confirm delete"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  setConfirmEmail("");
                  setError("");
                }}
                disabled={busy}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
