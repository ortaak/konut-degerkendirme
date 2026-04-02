import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GitCompare, ArrowRight, Trophy, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { KATEGORILER, toplamPuanHesapla, skorSinifi } from '../data/kriterler'
import SkorDairesi from '../components/SkorDairesi'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts'

const RENKLER = ['#3b82f6', '#16a34a', '#ea580c', '#9333ea', '#e11d48']

export default function Karsilastirma() {
  const { evler, kriterler } = useApp()
  const [secilen, setSecilen] = useState([])

  const aktifKriterler = kriterler.filter(k => k.aktif)
  const puanlananEvler = evler.filter(e => Object.keys(e.puanlar || {}).length > 0)

  const toggleSec = (id) => {
    setSecilen(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 5 ? [...prev, id] : prev
    )
  }

  const seciliEvler = evler.filter(e => secilen.includes(e.id))

  const radarVerisi = Object.values(KATEGORILER).map(kat => {
    const katKriterler = aktifKriterler.filter(k => k.kategoriId === kat.id)
    const veri = { kategori: kat.ikon + ' ' + kat.ad.split(' ')[0] }
    seciliEvler.forEach(ev => {
      veri[ev.id] = toplamPuanHesapla(katKriterler, ev.puanlar || {}).yuzde
    })
    return veri
  }).filter(v => {
    return seciliEvler.some(ev => v[ev.id] > 0)
  })

  const evSkorlari = seciliEvler.map(ev => ({
    ev,
    skor: toplamPuanHesapla(aktifKriterler, ev.puanlar || {}),
    sinif: skorSinifi(toplamPuanHesapla(aktifKriterler, ev.puanlar || {}).yuzde),
  })).sort((a, b) => b.skor.yuzde - a.skor.yuzde)

  if (evler.length === 0) {
    return (
      <div className="card text-center py-16">
        <GitCompare size={48} className="mx-auto text-gray-200 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Karşılaştırılacak ev yok</h3>
        <p className="text-gray-500 text-sm mb-5">Önce birkaç ev ekleyin ve değerlendirin.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          Ev Ekle
          <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  if (puanlananEvler.length === 0) {
    return (
      <div className="card text-center py-16">
        <AlertCircle size={48} className="mx-auto text-amber-200 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz değerlendirilen ev yok</h3>
        <p className="text-gray-500 text-sm mb-5">Karşılaştırmak için en az bir evi değerlendirin.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          Evleri Değerlendir
          <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Karşılaştırma</h2>
        <p className="text-sm text-gray-500 mt-0.5">Max 5 ev seçin, bilimsel skor ile karşılaştırın</p>
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ev Seçin</p>
        <div className="space-y-2">
          {puanlananEvler.map((ev, i) => {
            const { yuzde } = toplamPuanHesapla(aktifKriterler, ev.puanlar || {})
            const sinif = skorSinifi(yuzde)
            const secili = secilen.includes(ev.id)
            return (
              <button
                key={ev.id}
                onClick={() => toggleSec(ev.id)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  secili ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: secili ? RENKLER[secilen.indexOf(ev.id)] : '#e5e7eb' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{ev.ad}</p>
                  {ev.adres && <p className="text-xs text-gray-500 truncate">{ev.adres}</p>}
                </div>
                <span className={`text-sm font-bold px-2 py-1 rounded-lg ${sinif.bg} ${sinif.text}`}>{yuzde}</span>
              </button>
            )
          })}
        </div>
      </div>

      {seciliEvler.length >= 2 && (
        <>
          <div className="card mb-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              Sıralama
            </h3>
            <div className="space-y-3">
              {evSkorlari.map(({ ev, skor, sinif }, i) => (
                <div key={ev.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: i === 0 ? '#fef3c7' : i === 1 ? '#f1f5f9' : '#fef9f0', color: i === 0 ? '#92400e' : '#475569' }}>
                    {i + 1}
                  </div>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: RENKLER[secilen.indexOf(ev.id)] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ev.ad}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${skor.yuzde}%`,
                          backgroundColor: RENKLER[secilen.indexOf(ev.id)],
                        }}
                      />
                    </div>
                  </div>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${sinif.bg} ${sinif.text}`}>
                    {skor.yuzde}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {radarVerisi.length > 0 && (
            <div className="card mb-5">
              <h3 className="font-semibold text-gray-800 mb-4">Kategori Karşılaştırması</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarVerisi}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="kategori" tick={{ fontSize: 10 }} />
                  {seciliEvler.map((ev, i) => (
                    <Radar
                      key={ev.id}
                      name={ev.ad}
                      dataKey={ev.id}
                      stroke={RENKLER[i]}
                      fill={RENKLER[i]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend
                    formatter={(value) => {
                      const ev = seciliEvler.find(e => e.id === value)
                      return <span className="text-xs">{ev?.ad}</span>
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Kriter Detay Karşılaştırması</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-3 font-semibold text-gray-600 w-40">Kriter</th>
                    {seciliEvler.map((ev, i) => (
                      <th key={ev.id} className="text-center py-2 px-2 font-semibold" style={{ color: RENKLER[i] }}>
                        {ev.ad.length > 12 ? ev.ad.slice(0, 12) + '…' : ev.ad}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {aktifKriterler.map(kriter => {
                    const puanlar = seciliEvler.map(ev => ev.puanlar?.[kriter.id])
                    const maxPuan = Math.max(...puanlar.filter(p => p !== undefined))
                    return (
                      <tr key={kriter.id} className="border-b border-gray-50">
                        <td className="py-2 pr-3 text-gray-700 font-medium leading-tight">{kriter.ad}</td>
                        {seciliEvler.map((ev, i) => {
                          const p = ev.puanlar?.[kriter.id]
                          return (
                            <td key={ev.id} className="text-center py-2 px-2">
                              {p !== undefined ? (
                                <span className={`font-bold ${
                                  p === maxPuan && maxPuan > 0 ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                  {p}
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {seciliEvler.length === 1 && (
        <div className="card text-center py-6 text-sm text-gray-500">
          Karşılaştırma için en az 2 ev seçin
        </div>
      )}
    </div>
  )
}
