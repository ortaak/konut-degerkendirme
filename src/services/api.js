const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function iste(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `HTTP ${response.status}`)
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  bootstrap: () => iste('/bootstrap'),
  kriterEkle: (payload) => iste('/criteria', { method: 'POST', body: JSON.stringify(payload) }),
  kriterGuncelle: (id, payload) => iste(`/criteria/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  kriterSil: (id) => iste(`/criteria/${id}`, { method: 'DELETE' }),
  kriterleriSifirla: () => iste('/criteria/reset', { method: 'POST' }),
  sablonEkle: (payload) => iste('/templates', { method: 'POST', body: JSON.stringify(payload) }),
  sablonGuncelle: (id, payload) => iste(`/templates/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  sablonSil: (id) => iste(`/templates/${id}`, { method: 'DELETE' }),
  evEkle: (payload) => iste('/houses', { method: 'POST', body: JSON.stringify(payload) }),
  evGuncelle: (id, payload) => iste(`/houses/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  evSil: (id) => iste(`/houses/${id}`, { method: 'DELETE' }),
  evSablonlariGuncelle: (id, payload) => iste(`/houses/${id}/templates`, { method: 'PUT', body: JSON.stringify(payload) }),
  puanKaydet: (id, payload) => iste(`/houses/${id}/scores`, { method: 'PUT', body: JSON.stringify(payload) }),
}
