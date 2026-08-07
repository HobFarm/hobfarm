export class BodyTooLargeError extends Error {
  constructor() {
    super("request_body_too_large");
    this.name = "BodyTooLargeError";
  }
}

export function isBodyTooLargeError(error: unknown): error is BodyTooLargeError {
  return error instanceof BodyTooLargeError;
}

export async function readTextBodyLimited(request: Request, maxBytes: number): Promise<string> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) throw new BodyTooLargeError();

  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel("request_body_too_large").catch(() => undefined);
      throw new BodyTooLargeError();
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

export async function readJsonBodyLimited<T>(request: Request, maxBytes: number): Promise<T> {
  const raw = await readTextBodyLimited(request, maxBytes);
  return JSON.parse(raw) as T;
}

