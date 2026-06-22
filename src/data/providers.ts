/**
 * Provider metadata map for StyleFusion gallery entries.
 * Maps provider slugs (matching filenames) to display info.
 * Reused across all gallery pages for consistent badge rendering.
 */
export interface ProviderInfo {
  name: string;
  color: string;
  description: string;
  webui?: boolean;
}

export const providers: Record<string, ProviderInfo> = {
  'nano-banana-2': {
    name: 'Nano Banana 2',
    color: '#4CAF50',
    description: 'Gemini-powered, strong illustration adherence',
  },
  'flux2pro': {
    name: 'Flux 2 Pro',
    color: '#2196F3',
    description: 'Black Forest Labs, photorealistic tendency',
  },
  'flux2max': {
    name: 'Flux 2 Max',
    color: '#1565C0',
    description: 'Black Forest Labs, maximum detail mode',
  },
  'seedream': {
    name: 'Seedream 4.5',
    color: '#FF9800',
    description: 'ByteDance, balanced style range',
  },
  'qwen-image-2512': {
    name: 'Qwen Image',
    color: '#9C27B0',
    description: 'Alibaba, strong anime/illustration',
  },
  'qwen-image-pro': {
    name: 'Qwen Image Pro',
    color: '#7B1FA2',
    description: 'Alibaba pro tier, higher detail',
  },
  'recraft-v4-pro': {
    name: 'Recraft V4 Pro',
    color: '#E91E63',
    description: 'Vector-native, clean edges, supports SVG',
  },
  'z_ai-glm-image': {
    name: 'Z.AI GLM Image',
    color: '#607D8B',
    description: 'Zhipu AI, semi-realistic rendering',
  },
  'chatgpt': {
    name: 'GPT Image 1.5',
    color: '#10A37F',
    description: 'OpenAI, mood-forward interpretation',
  },
  'chatgpt-web': {
    name: 'ChatGPT Web',
    color: '#10A37F',
    description: 'OpenAI, browser-based Web UI generation',
    webui: true,
  },
  'grok-imagine-pro': {
    name: 'Grok Imagine Pro',
    color: '#1DA1F2',
    description: 'xAI, expressive style range',
  },
  'gemini-web': {
    name: 'Gemini (Web)',
    color: '#4285F4',
    description: 'Google, browser-based generation',
    webui: true,
  },
  'grok-web': {
    name: 'Grok (Web)',
    color: '#1DA1F2',
    description: 'xAI, browser-based generation',
    webui: true,
  },
  'bria-fibo': {
    name: 'Bria FIBO',
    color: '#FF5722',
    description: 'Bria AI, commercially licensed output',
  },
  'google-flow': {
    name: 'Google Flow',
    color: '#34A853',
    description: 'Veo 3.1, image-to-video animation',
  },
  'higgsfield': {
    name: 'Higgsfield',
    color: '#FF6F00',
    description: 'Character animation, motion transfer',
  },
  'grok-i2v': {
    name: 'Grok Image-to-Video',
    color: '#1DA1F2',
    description: 'xAI, image-to-video generation',
  },
  'qwen-image-2': {
    name: 'Qwen Image 2',
    color: '#AB47BC',
    description: 'Alibaba, next-gen illustration engine',
  },
  'qwen-image2-pro': {
    name: 'Qwen Image 2 Pro',
    color: '#6A1B9A',
    description: 'Alibaba pro tier, maximum detail',
  },
  'recraft-v4': {
    name: 'Recraft V4',
    color: '#C2185B',
    description: 'Vector-native engine, clean illustration',
  },
  'grok-imagine-1.5': {
    name: 'Grok Imagine 1.5',
    color: '#1DA1F2',
    description: 'xAI, next-gen expressive style',
  },
} as const;

/**
 * Resolve a provider slug from a filename.
 * e.g. "nano-banana-2.png" -> "nano-banana-2"
 * e.g. "chatgpt-image-1.5.png" -> "chatgpt"
 */
export function resolveProviderSlug(filename: string): string | undefined {
  const base = filename.replace(/\.[^.]+$/, ''); // strip extension
  // Direct match
  if (providers[base]) return base;
  // Partial match: find longest matching key
  const sorted = Object.keys(providers).sort((a, b) => b.length - a.length);
  return sorted.find((key) => base.startsWith(key));
}
