export interface AcademyFaqItem {
  id: string;
  courseSlug: string | null;
  question: string;
  answer: string;
  route?: string;
}

export const academyFaq: AcademyFaqItem[] = [
  { id: "access-difference", courseSlug: null, question: "What is the difference between a course purchase and membership?", answer: "A one-time purchase grants permanent access to that course on the purchasing account unless it is refunded, disputed, revoked, or corrected by support. The $5 monthly membership includes eligible Academy courses only while membership is active.", route: "/account/" },
  { id: "member-buys", courseSlug: null, question: "Can a member buy a course permanently?", answer: "Yes. The direct purchase is a separate grant and remains after membership ends. You do not need to buy a course just to use it while an active membership already includes it." },
  { id: "missing-access", courseSlug: null, question: "I paid or joined, but the lesson is still locked. What should I do?", answer: "Sign in with the account used at checkout and open Account. If the grant is still missing, use Customer Help and include the support reference shown beside the course plus the Stripe receipt or order ID. Do not send card details.", route: "/helpcenter/" },
  { id: "refund", courseSlug: null, question: "Where do refunds and billing questions go?", answer: "Use Customer Help. Refund eligibility follows the current public policy and the verified payment record. A refund or dispute can suspend the matching permanent course grant.", route: "/legal/refunds/" },
  { id: "tools-cost", courseSlug: null, question: "Are model, avatar, or voice-tool costs included?", answer: "No. Each course card names likely outside accounts and costs. Course access covers HobFarm lessons and included working files, not third-party subscriptions, API use, stock, hosting, or licenses." },
  { id: "progress", courseSlug: null, question: "How is progress saved?", answer: "A lesson first saves a small progress record in the browser. When you are signed in it also syncs to the HobFarm Academy ledger, so Account can continue the course on another browser. Completing a lesson twice is safe." },
  { id: "avatar-tools", courseSlug: "avatar-content-system", question: "Do I need every avatar tool on day one?", answer: "No. The public setup starts with a project folder and a writing workflow. Paid lessons introduce the worked tools in order, and the durable file, scripting, and review method can be adapted to practical alternatives." },
  { id: "avatar-honesty", courseSlug: "avatar-content-system", question: "Does the avatar course teach fake-person or get-rich content?", answer: "No. The worked introduction identifies the avatar as an avatar, credits the human creator, and builds one reusable publishing loop without earnings claims or fake urgency." },
  { id: "character-consistency", courseSlug: "keep-the-character", question: "Does Keep the Character guarantee consistent generations?", answer: "No. It teaches identity, wardrobe, style, scene, and evidence boundaries so drift can be found and repaired. Model output remains variable." },
  { id: "character-sale", courseSlug: "keep-the-character", question: "Why can I see previews but not buy the Character course?", answer: "The source-backed draft still needs a clean first-time operator walkthrough, exact failure correction record, and paid-access validation. It will not be sold before those checks pass." },
];
