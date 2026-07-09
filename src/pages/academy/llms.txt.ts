import { absoluteUrl, buildSectionLlms, textResponse } from "@/lib/agent-corpus";

export async function GET() {
  return textResponse(
    await buildSectionLlms(
      "HobFarm Academy Agent Index",
      "Public learning paths and course entry points. Paid lesson files, private downloads, and account-gated material are excluded.",
      [
        {
          title: "Academy",
          url: absoluteUrl("/academy/"),
          description: "Public overview of HobFarm learning paths.",
        },
        {
          title: "Avatar Content System",
          url: absoluteUrl("/academy/avatar-content-system/"),
          description: "Course overview for avatar workflows and production systems.",
        },
        {
          title: "Free avatar overview",
          url: absoluteUrl("/academy/avatar-content-system/free/"),
          description: "Free public overview for the avatar content workflow.",
        },
      ],
    ),
  );
}
