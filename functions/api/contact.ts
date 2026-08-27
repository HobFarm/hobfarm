interface ContactEnv {
  TURNSTILE_SECRET: string;
  COMMERCE?: Fetcher;
}

interface ContactBody {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  token?: unknown;
}

const MAX_BODY_BYTES = 16 * 1024;
const MAX_NAME_CHARS = 120;
const MAX_EMAIL_CHARS = 254;
const MAX_MESSAGE_CHARS = 4000;
const SUPPORT_DESTINATION = "support@hob.farm";
const GENERAL_DESTINATION = "hey@hob.farm";

interface ContactRoute {
  destination: typeof SUPPORT_DESTINATION | typeof GENERAL_DESTINATION;
  label: string;
}

const subjectRoutes = {
  support: { destination: SUPPORT_DESTINATION, label: "Support" },
  billing: { destination: SUPPORT_DESTINATION, label: "Billing / Payments" },
  refund: { destination: SUPPORT_DESTINATION, label: "Refund Request" },
  stylefusion: { destination: SUPPORT_DESTINATION, label: "StyleFusion" },
  grimoire: { destination: SUPPORT_DESTINATION, label: "Grimoire" },
  membership: { destination: SUPPORT_DESTINATION, label: "Membership" },
  bug: { destination: SUPPORT_DESTINATION, label: "Bug Report" },
  security: { destination: SUPPORT_DESTINATION, label: "Security Report" },
  general: { destination: GENERAL_DESTINATION, label: "General Inquiry" },
  employment: { destination: GENERAL_DESTINATION, label: "Employment / Work Inquiry" },
  editorial: { destination: GENERAL_DESTINATION, label: "Editorial / Research / Media" },
  collaboration: { destination: GENERAL_DESTINATION, label: "Collaboration" },
  "creative-project": { destination: GENERAL_DESTINATION, label: "Creative Project / Commission" },
  "custom-character": { destination: GENERAL_DESTINATION, label: "Custom Character" },
  business: { destination: GENERAL_DESTINATION, label: "Business / Partnership" },
} satisfies Record<string, ContactRoute>;

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status, headers: jsonHeaders });
}

function isSameOriginMutation(request: Request): boolean {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  const secFetchSite = request.headers.get("sec-fetch-site");

  if (origin && origin !== requestUrl.origin) return false;
  if (secFetchSite === "cross-site") return false;

  return true;
}

function normalizeField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;
  return normalized;
}

function isValidEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_CHARS && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character] ?? character;
  });
}

function emailSubject(route: ContactRoute, name: string): string {
  const safeName = name.replace(/[\r\n]+/g, " ").slice(0, 80);
  return `[HobFarm] ${route.label} from ${safeName}`;
}

function plainTextMessage(route: ContactRoute, name: string, email: string, message: string): string {
  return [
    "A visitor sent a message through the HobFarm contact form.",
    "",
    `Route: ${route.label}`,
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
    "",
    "Reply to this email to answer the visitor directly.",
  ].join("\n");
}

function htmlMessage(route: ContactRoute, name: string, email: string, message: string): string {
  const messageHtml = escapeHtml(message).replace(/\r?\n/g, "<br>");

  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="margin:0;padding:24px;background:#f4f1e8;color:#151515;font-family:Arial,Helvetica,sans-serif;">
    <main style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d8d2c3;padding:28px;">
      <p style="margin:0 0 20px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#686152;">HobFarm contact form</p>
      <h1 style="margin:0 0 24px;font-size:24px;line-height:1.2;">${escapeHtml(route.label)}</h1>
      <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr><th scope="row" style="padding:8px 12px 8px 0;text-align:left;vertical-align:top;font-size:13px;">Name</th><td style="padding:8px 0;font-size:14px;">${escapeHtml(name)}</td></tr>
        <tr><th scope="row" style="padding:8px 12px 8px 0;text-align:left;vertical-align:top;font-size:13px;">Email</th><td style="padding:8px 0;font-size:14px;">${escapeHtml(email)}</td></tr>
      </table>
      <div style="border-top:1px solid #d8d2c3;padding-top:20px;font-size:15px;line-height:1.6;">${messageHtml}</div>
      <p style="margin:28px 0 0;font-size:12px;color:#686152;">Reply to this email to answer the visitor directly.</p>
    </main>
  </body>
</html>`;
}

async function readLimitedText(request: Request): Promise<string | Response> {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      return jsonError("Request body is too large", 413);
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
}

export const onRequestPost: PagesFunction<ContactEnv> = async (context) => {
  const { request, env } = context;

  if (!isSameOriginMutation(request)) {
    return jsonError("Cross-origin contact requests are not allowed", 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonError("Content-Type must be application/json", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError("Request body is too large", 413);
  }

  const rawBody = await readLimitedText(request);
  if (rawBody instanceof Response) return rawBody;

  let body: ContactBody;
  try {
    body = JSON.parse(rawBody) as ContactBody;
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  const name = normalizeField(body.name, MAX_NAME_CHARS);
  const email = normalizeField(body.email, MAX_EMAIL_CHARS)?.toLowerCase() ?? null;
  const subject = normalizeField(body.subject, 40);
  const message = normalizeField(body.message, MAX_MESSAGE_CHARS);
  const token = normalizeField(body.token, 4096);

  if (!name || !email || !subject || !message || !token) {
    return jsonError("All fields are required", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("Enter a valid email address", 400);
  }

  const route = subjectRoutes[subject as keyof typeof subjectRoutes];
  if (!route) {
    return jsonError("Invalid contact subject", 400);
  }

  if (!env.TURNSTILE_SECRET) {
    return jsonError("Contact verification is not configured", 500);
  }

  if (!env.COMMERCE) {
    return jsonError("Contact delivery is not configured", 500);
  }

  // Verify Turnstile token
  const verifyBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token,
  });
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) verifyBody.set("remoteip", remoteIp);

  let verify: { success: boolean };
  try {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: verifyBody,
      }
    );

    if (!verifyRes.ok) {
      return jsonError("Verification service is unavailable", 502);
    }
    verify = (await verifyRes.json()) as { success: boolean };
  } catch {
    return jsonError("Verification service is unavailable", 502);
  }

  if (!verify.success) {
    return jsonError("Verification failed", 403);
  }

  let delivery: { messageId: string };
  try {
    const deliveryResponse = await env.COMMERCE.fetch(
      new Request("https://commerce.internal/internal/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          to: route.destination,
          replyTo: email,
          subject: emailSubject(route, name),
          text: plainTextMessage(route, name, email, message),
          html: htmlMessage(route, name, email, message),
        }),
      }),
    );
    const result = (await deliveryResponse.json()) as { messageId?: unknown };
    if (!deliveryResponse.ok || typeof result.messageId !== "string") {
      throw Object.assign(new Error("Contact mailer rejected the message"), {
        code: `contact_mailer_${deliveryResponse.status}`,
      });
    }
    delivery = { messageId: result.messageId };
  } catch (error) {
    const errorCode =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "unknown";
    console.error("Contact email delivery failed", { subject, errorCode });
    return jsonError(
      "Message delivery failed. Please try again or use the direct email option in Customer Help.",
      502,
    );
  }

  // Keep message contents and visitor details out of Cloudflare logs. The
  // message itself belongs in the destination inbox, not in application logs.
  console.log("Contact email accepted", {
    subject,
    destination: route.destination,
    messageId: delivery.messageId,
  });

  return Response.json({ success: true }, { headers: jsonHeaders });
};

export const onRequestGet: PagesFunction = async () => {
  return jsonError("Method not allowed", 405);
};
