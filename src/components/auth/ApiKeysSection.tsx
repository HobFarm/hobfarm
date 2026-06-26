import { useEffect, useState, type SubmitEvent } from "react";
import {
  fetchKeys,
  putKey,
  deleteKey,
  ALLOWED_PROVIDERS,
  type KeyEntry,
  type Provider,
} from "@/lib/auth";

const inputClass =
  "w-full px-3 py-2 bg-base-900 border-l border-l-white border-transparent text-white placeholder-base-500 focus:border-white focus:bg-base-950 focus:outline-none transition-colors text-sm font-mono";

const primaryButtonClass =
  "px-4 py-2 bg-white text-base-950 text-sm font-medium hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const secondaryButtonClass =
  "px-3 py-1.5 border border-base-700 text-base-300 text-xs hover:border-base-500 hover:text-white transition-colors cursor-pointer";

const dangerButtonClass =
  "px-3 py-1.5 border border-red-900 text-red-400 text-xs hover:border-red-500 hover:text-red-300 transition-colors cursor-pointer";

export default function ApiKeysSection() {
  const [keys, setKeys] = useState<KeyEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<Provider | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Add-new form state.
  const [newProvider, setNewProvider] = useState<Provider>("fal");
  const [newKey, setNewKey] = useState("");

  // Edit-in-place state.
  const [editKeyValue, setEditKeyValue] = useState("");

  async function refresh() {
    const list = await fetchKeys();
    setKeys(list);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  const taken = new Set(keys.map((k) => k.provider));
  const availableProviders = ALLOWED_PROVIDERS.filter((p) => !taken.has(p));

  async function handleAdd(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError("");
    if (!newKey.trim()) {
      setError("Enter a key value.");
      return;
    }
    if (taken.has(newProvider)) {
      setError(`A ${newProvider} key already exists. Edit it instead.`);
      return;
    }
    setBusy(true);
    const res = await putKey(newProvider, newKey.trim());
    setBusy(false);
    if (!res.ok) {
      setError(`Couldn't save: ${res.error ?? "unknown error"}`);
      return;
    }
    setNewKey("");
    if (availableProviders.length > 1) {
      setNewProvider(availableProviders.find((p) => p !== newProvider) ?? availableProviders[0]);
    }
    await refresh();
  }

  async function handleEditSave(provider: Provider) {
    if (busy) return;
    setError("");
    if (!editKeyValue.trim()) {
      setError("Enter the new key value.");
      return;
    }
    setBusy(true);
    const res = await putKey(provider, editKeyValue.trim());
    setBusy(false);
    if (!res.ok) {
      setError(`Couldn't update: ${res.error ?? "unknown error"}`);
      return;
    }
    setEditKeyValue("");
    setEditing(null);
    await refresh();
  }

  async function handleDelete(provider: Provider) {
    if (busy) return;
    setError("");
    setBusy(true);
    // Optimistic UI: remove from local list immediately.
    const prev = keys;
    setKeys(keys.filter((k) => k.provider !== provider));
    const ok = await deleteKey(provider);
    setBusy(false);
    setConfirmingDelete(null);
    if (!ok) {
      setError("Delete failed; restored the row.");
      setKeys(prev);
    }
  }

  return (
    <div className="border border-base-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-accent-500 uppercase tracking-wider">API keys</p>
        {keys.length > 0 && (
          <p className="text-xs font-mono text-base-500">{keys.length} stored</p>
        )}
      </div>

      <p className="text-xs text-base-500">
        Encrypted at rest with a per-account key. Plaintext is never returned by the API or shown in this UI.
      </p>

      {!loaded ? (
        <p className="text-xs font-mono text-base-500">Loading...</p>
      ) : keys.length === 0 ? (
        <p className="text-sm text-base-400">No keys yet. Add a key to use member tools that need it.</p>
      ) : (
        <ul className="divide-y divide-base-800 border-y border-base-800">
          {keys.map((k) => (
            <li key={k.provider} className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-white font-mono uppercase">{k.provider}</p>
                <p className="text-xs font-mono text-base-500">{k.hint}</p>
              </div>

              <div className="flex items-center gap-2">
                {editing === k.provider ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editKeyValue}
                      onChange={(e) => setEditKeyValue(e.target.value)}
                      placeholder="New key value"
                      className={`${inputClass} w-64`}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleEditSave(k.provider)}
                      disabled={busy}
                      className={primaryButtonClass}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null);
                        setEditKeyValue("");
                        setError("");
                      }}
                      className={secondaryButtonClass}
                    >
                      Cancel
                    </button>
                  </div>
                ) : confirmingDelete === k.provider ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-300">Delete {k.provider} key?</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(k.provider)}
                      disabled={busy}
                      className={dangerButtonClass}
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(null)}
                      className={secondaryButtonClass}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(k.provider);
                        setEditKeyValue("");
                        setError("");
                      }}
                      className={secondaryButtonClass}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(k.provider)}
                      className={dangerButtonClass}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {availableProviders.length > 0 && (
        <form onSubmit={handleAdd} className="space-y-3 pt-2">
          <p className="text-xs font-mono text-base-500 uppercase tracking-wider">Add a key</p>
          <div className="flex flex-wrap gap-3">
            <select
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value as Provider)}
              className={`${inputClass} w-32 cursor-pointer appearance-none`}
            >
              {availableProviders.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Paste key"
              className={`${inputClass} flex-1 min-w-[16rem]`}
            />
            <button type="submit" disabled={busy} className={primaryButtonClass}>
              {busy ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
