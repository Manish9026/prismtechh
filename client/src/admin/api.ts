export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export function apiFetch<T>(path: string, options: { method?: HttpMethod; token?: string; body?: any } = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (options.token) headers['Authorization'] = `Bearer ${options.token}`
  return fetch(path.startsWith('/api') ? path : `/api${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  }).then(async (r) => {
    if (!r.ok) {
      const text = await r.text().catch(() => '')
      throw new Error(text || `Request failed ${r.status}`)
    }
    return (await r.json()) as T
  })
}

export async function uploadFile(path: string, file: File, token?: string): Promise<{ filename: string, url: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(path.startsWith('/api') ? path : `/api${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}


