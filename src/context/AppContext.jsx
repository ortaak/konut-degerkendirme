import { createContext, useContext, useEffect, useState } from 'react'
import { VARSAYILAN_KRITERLER } from '../data/kriterler'

const AppContext = createContext(null)

function yukle(key, varsayilan) {
  try {
    const veri = localStorage.getItem(key)
    return veri ? JSON.parse(veri) : varsayilan
  } catch {
    return varsayilan
  }
}

function kaydet(key, veri) {
  localStorage.setItem(key, JSON.stringify(veri))
}

export function AppProvider({ children }) {
  const [kriterler, setKriterler] = useState(() =>
    yukle('kriterler', VARSAYILAN_KRITERLER.map(k => ({
      ...k,
      agirlik: k.varsayilanAgirlik,
      aktif: true,
    })))
  )
  const [evler, setEvler] = useState(() => yukle('evler', []))

  useEffect(() => { kaydet('kriterler', kriterler) }, [kriterler])
  useEffect(() => { kaydet('evler', evler) }, [evler])

  const kriterEkle = (yeniKriter) => {
    const kriter = {
      ...yeniKriter,
      id: 'ozel_' + Date.now(),
      agirlik: yeniKriter.agirlik || 3,
      aktif: true,
    }
    setKriterler(prev => [...prev, kriter])
    return kriter
  }

  const kriterGuncelle = (id, degisiklikler) => {
    setKriterler(prev => prev.map(k => k.id === id ? { ...k, ...degisiklikler } : k))
  }

  const kriterSil = (id) => {
    setKriterler(prev => prev.filter(k => k.id !== id))
  }

  const evEkle = (ev) => {
    const yeniEv = {
      ...ev,
      id: 'ev_' + Date.now(),
      olusturulmaTarihi: new Date().toISOString(),
      puanlar: {},
      notlar: {},
    }
    setEvler(prev => [yeniEv, ...prev])
    return yeniEv
  }

  const evGuncelle = (id, degisiklikler) => {
    setEvler(prev => prev.map(e => e.id === id ? { ...e, ...degisiklikler } : e))
  }

  const evSil = (id) => {
    setEvler(prev => prev.filter(e => e.id !== id))
  }

  const puanKaydet = (evId, kriterKayitlar) => {
    setEvler(prev => prev.map(e =>
      e.id === evId
        ? { ...e, puanlar: { ...e.puanlar, ...kriterKayitlar } }
        : e
    ))
  }

  const kriterleriSifirla = () => {
    setKriterler(VARSAYILAN_KRITERLER.map(k => ({
      ...k,
      agirlik: k.varsayilanAgirlik,
      aktif: true,
    })))
  }

  return (
    <AppContext.Provider value={{
      kriterler,
      evler,
      kriterEkle,
      kriterGuncelle,
      kriterSil,
      evEkle,
      evGuncelle,
      evSil,
      puanKaydet,
      kriterleriSifirla,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
