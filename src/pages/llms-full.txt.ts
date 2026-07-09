import { buildFullLlms, textResponse } from "@/lib/agent-corpus";

export async function GET() {
  return textResponse(await buildFullLlms());
}
