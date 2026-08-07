import { useEffect, useState } from "react";

export default function CheckoutNotice() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const state = new URLSearchParams(window.location.search).get("checkout");
    if (state === "not-active") {
      setMessage("Permanent purchase is not active yet. No charge was created. Membership access is still available.");
    } else if (state === "cancelled") {
      setMessage("Checkout was cancelled. No course access was granted and no new payment is needed.");
    }
  }, []);

  return message ? (
    <p className="mt-5 max-w-2xl border-l-2 border-amber-300 bg-amber-200/5 px-4 py-3 text-sm text-amber-100" role="status">
      {message}
    </p>
  ) : null;
}
