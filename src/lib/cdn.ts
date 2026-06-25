const CDN_BASE = 'https://cdn.hob.farm'

export const cdn = {
  gallery: (folder: string, file: string) =>
    `${CDN_BASE}/${folder.replace(/^\/+|\/+$/g, "")}/${file.replace(/^\/+/, "")}`,
  project: (slug: string, filename: string) =>
    `${CDN_BASE}/projects/${slug}/images/${filename}`,
  agent: (agent: string, filename: string) =>
    `${CDN_BASE}/agents/${agent}/${filename}`,
  page: (page: string, filename: string) =>
    `${CDN_BASE}/pages/${page}/${filename}`,
}
