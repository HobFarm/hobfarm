import { useState, useEffect, useRef, type SubmitEvent } from "react";

const TURNSTILE_SITEKEY = "0x4AAAAAACnfEXz9mYmnu2N6";

const subjects = [
  { value: "support", label: "Support" },
  { value: "billing", label: "Billing / Payments" },
  { value: "refund", label: "Refund Request" },
  { value: "general", label: "General Inquiry" },
  { value: "stylefusion", label: "StyleFusion" },
  { value: "grimoire", label: "Grimoire" },
  { value: "membership", label: "Membership" },
  { value: "business", label: "Business / Partnership" },
  { value: "custom-character", label: "Custom Character" },
  { value: "bug", label: "Bug Report" },
  { value: "security", label: "Security Report" },
];

const DEFAULT_SUBJECT = "support";
const subjectValues = new Set(subjects.map((subject) => subject.value));

export default function ContactForm() {
  const [initialSubject, setInitialSubject] = useState(DEFAULT_SUBJECT);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: DEFAULT_SUBJECT,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [token, setToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const requestedSubject = new URLSearchParams(window.location.search).get("subject") || DEFAULT_SUBJECT;
    const safeSubject = subjectValues.has(requestedSubject) ? requestedSubject : DEFAULT_SUBJECT;
    setInitialSubject(safeSubject);
    setForm((current) => ({ ...current, subject: safeSubject }));
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (turnstileRef.current && (window as any).turnstile) {
        (window as any).turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          callback: (t: string) => setToken(t),
          theme: "dark",
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setErrorMsg("Please complete the verification.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token }),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: initialSubject, message: "" });
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-accent-500/30 p-8">
        <p className="text-accent-500 font-mono text-sm">Message sent.</p>
        <p className="text-base-400 text-sm mt-2">
          We'll get back to you soon.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-3 bg-base-900 border-l border-l-white border-transparent text-white placeholder-base-500 focus:border-white focus:bg-base-950 focus:outline-none transition-colors text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-xs font-mono text-base-500 mb-2">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-mono text-base-500 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs font-mono text-base-500 mb-2">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-mono text-base-500 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-y`}
          placeholder="What's on your mind?"
        />
      </div>

      <div ref={turnstileRef} />

      {status === "error" && errorMsg && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-6 py-3 bg-white text-base-950 text-sm font-medium hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
