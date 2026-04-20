import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [kriterler, setKriterler] = useState([])
  const [sablonlar, setSablonlar] = useState([])
  const [evler, setEvler] = useState([])
  const [hazir, setHazir] = useState(false)

  const yukle = async () => {
    const data = await api.bootstrap()
    setKriterler(data.kriterler || [])
    setSablonlar(data.sablonlar || [])
    setEvler(data.evler || [])
    setHazir(true)
  }

  useEffect(() => { yukle() }, [])

  const kriterEkle = async (yeniKriter) => {
    const kriter = await api.kriterEkle(yeniKriter)
    setKriterler(prev => [...prev, kriter])
    return kriter
  }

  const kriterGuncelle = async (id, degisiklikler) => {
    await api.kriterGuncelle(id, degisiklikler)
    setKriterler(prev => prev.map(k => k.id === id ? { ...k, ...degisiklikler } : k))
  }

  const kriterSil = async (id) => {
    await api.kriterSil(id)
    setKriterler(prev => prev.filter(k => k.id !== id))
    setSablonlar(prev => prev.map(s => ({ ...s, kriterIds: (s.kriterIds || []).filter(k => k !== id) })))
  }

  const kriterleriSifirla = async () => {
    const data = await api.kriterleriSifirla()
    setKriterler(data.kriterler || [])
    setSablonlar(data.sablonlar || [])
    setEvler(data.evler || [])
  }

  const sablonEkle = async (payload) => { const s = await api.sablonEkle(payload); setSablonlar(prev => [...prev, s]); return s }
  const sablonGuncelle = async (id, payload) => { await api.sablonGuncelle(id, payload); setSablonlar(prev => prev.map(s => s.id === id ? { ...s, ...payload } : s)) }
  const sablonSil = async (id) => { await api.sablonSil(id); setSablonlar(prev => prev.filter(s => s.id !== id)); setEvler(prev => prev.map(e => ({ ...e, templateIds: (e.templateIds || []).filter(t => t !== id), puanlarByTemplate: Object.fromEntries(Object.entries(e.puanlarByTemplate || {}).filter(([k]) => Number(k) !== id)) }))) }

  const evEkle = async (ev) => {
    const yeniEv = await api.evEkle(ev)
    setEvler(prev => [yeniEv, ...prev])
    return yeniEv
  }

  const evGuncelle = async (id, degisiklikler) => {
    await api.evGuncelle(id, degisiklikler)
    setEvler(prev => prev.map(e => e.id === id ? { ...e, ...degisiklikler } : e))
  }

  const evSil = async (id) => {
    await api.evSil(id)
    setEvler(prev => prev.filter(e => e.id !== id))
  }

  const evSablonlariGuncelle = async (evId, templateIds) => {
    await api.evSablonlariGuncelle(evId, { templateIds })
    setEvler(prev => prev.map(e => e.id === evId ? { ...e, templateIds } : e))
  }

  const puanKaydet = async (evId, templateId, kriterKayitlar) => {
    await api.puanKaydet(evId, { templateId, kriterKayitlar })
    setEvler(prev => prev.map(e => e.id !== evId ? e : { ...e, puanlarByTemplate: { ...(e.puanlarByTemplate || {}), [templateId]: { ...((e.puanlarByTemplate || {})[templateId] || {}), ...kriterKayitlar } } }))
  }

  const value = useMemo(() => ({
    hazir, kriterler, sablonlar, evler,
    kriterEkle, kriterGuncelle, kriterSil, kriterleriSifirla,
    sablonEkle, sablonGuncelle, sablonSil,
    evEkle, evGuncelle, evSil, evSablonlariGuncelle, puanKaydet,
  }), [hazir, kriterler, sablonlar, evler])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
