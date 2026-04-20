import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Info, Check, MessageSquare, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { KATEGORILER, PUAN_ETIKETLER, toplamPuanHesapla, skorSinifi } from '../data/kriterler'
import SkorDairesi from '../components/SkorDairesi'

const PUAN_RENKLER = {
  0: 'bg-gray-100 border-gray-300 text-gray-500',
  1: 'bg-red-100 border-red-400 text-red-700',
  2: 'bg-orange-100 border-orange-400 text-orange-700',
  3: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  4: 'bg-blue-100 border-blue-400 text-blue-700',
  5: 'bg-green-100 border-green-400 text-green-700',
}

function PuanSecici({ kriterAdi, kriterAciklama, mevcutPuan, onPuanSec }) {
  const [aciklama, setAciklama] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-900">{kriterAdi}</span>
            {kriterAciklama && (
              <button onClick={() => setAciklama(p => !p)} className="text-gray-400 hover:text-blue-500">
                <Info size={14} />
              </button>
            )}
          </div>
          {aciklama && (
            <p className="text-xs text-gray-500 mt-1 bg-gray-50 rounded p-2 leading-relaxed">{kriterAciklama}</p>
          )}
        </div>
        {mevcutPuan !== undefined && mevcutPuan !== null && (
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${PUAN_RENKLER[mevcutPuan]}`}>
            {mevcutPuan}/5
          </span>
        )}
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4, 5].map(p => (
          <button
            key={p}
            onClick={() => onPuanSec(p)}
            title={PUAN_ETIKETLER[p].etiket}
            className={`flex-1 py-2 rounded-lg border-2 text-xs font-bold transition-all ${
              mevcutPuan === p
                ? `${PUAN_RENKLER[p]} border-current shadow-sm scale-105`
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {p === 0 ? '—' : p}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 px-1">
        <span>Yok</span>
        <span>Çok Kötü</span>
        <span></span>
        <span>Orta</span>
        <span></span>
        <span>Mükemmel</span>
      </div>
    </div>
  )
}

function NotModal({ onKapat, mevcutNot, onKaydet }) {
  const [not, setNot] = useState(mevcutNot || '')
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold">Genel Not</h2>
        </div>
        <div className="p-5">
          <textarea
            className="input resize-none"
            rows={5}
            placeholder="Bu ev hakkındaki genel notlarınız, izlenimleriniz..."
            value={not}
            onChange={e => setNot(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3 mt-4">
            <button onClick={onKapat} className="btn-secondary flex-1">İptal</button>
            <button onClick={() => { onKaydet(not); onKapat() }} className="btn-primary flex-1">Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EvDetay() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { evler, kriterler, sablonlar, evGuncelle, evSablonlariGuncelle, puanKaydet } = useApp()
  const [notModal, setNotModal] = useState(false)
  const [acikKategoriler, setAcikKategoriler] = useState(
    Object.values(KATEGORILER).reduce((acc, k) => ({ ...acc, [k.id]: true }), {})
  )
  const [gosterDetay, setGosterDetay] = useState(false)
  const [aktifSablonId, setAktifSablonId] = useState(null)

  const ev = evler.find(e => e.id === id)

  useEffect(() => {
    if (!ev) return
    const secili = sablonlar.filter(s => (ev.templateIds || []).includes(s.id))
    if (!aktifSablonId && secili[0]) {
      setAktifSablonId(secili[0].id)
    } else if (aktifSablonId && !secili.some(s => s.id === aktifSablonId)) {
      setAktifSablonId(secili[0]?.id || null)
    }
  }, [ev, sablonlar, aktifSablonId])

  if (!ev) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Ev bulunamadı.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">Anasayfaya Dön</button>
      </div>
    )
  }

  const aktifKriterler = kriterler.filter(k => k.aktif)
  const seciliSablonlar = sablonlar.filter(s => (ev.templateIds || []).includes(s.id))
  const aktifSablon = seciliSablonlar.find(s => s.id === aktifSablonId) || seciliSablonlar[0] || null
  const aktifSablonKriterleri = aktifKriterler.filter(k => aktifSablon?.kriterIds?.includes(k.id))
  const aktifSablonPuanlari = aktifSablon ? ((ev.puanlarByTemplate || {})[aktifSablon.id] || {}) : {}
  const { tamamlananKriter } = toplamPuanHesapla(aktifSablonKriterleri, aktifSablonPuanlari)

  const sablonSkorlari = seciliSablonlar.map(sablon => {
    const sablonKriterleri = aktifKriterler.filter(k => sablon.kriterIds?.includes(k.id))
    const puanlar = (ev.puanlarByTemplate || {})[sablon.id] || {}
    return { sablon, ...toplamPuanHesapla(sablonKriterleri, puanlar) }
  })

  const handleSablonSecimi = (templateId, secili) => {
    const sonraki = secili
      ? [...new Set([...(ev.templateIds || []), templateId])]
      : (ev.templateIds || []).filter(t => t !== templateId)
    evSablonlariGuncelle(ev.id, sonraki)
  }

  const handlePuan = (kriterId, kriterPuan) => {
    if (!aktifSablon) return
    puanKaydet(id, aktifSablon.id, { [kriterId]: kriterPuan })
  }

  const toggleKategori = (katId) => setAcikKategoriler(p => ({ ...p, [katId]: !p[katId] }))

  const kategoriIstatistik = (katId) => {
    const katKriterler = aktifSablonKriterleri.filter(k => k.kategoriId === katId)
    const puanlanan = katKriterler.filter(k => aktifSablonPuanlari[k.id] !== undefined)
    const katYuzde = puanlanan.length > 0 ? toplamPuanHesapla(katKriterler, aktifSablonPuanlari).yuzde : null
    return { toplam: katKriterler.length, puanlanan: puanlanan.length, yuzde: katYuzde }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">{ev.ad}</h2>
          {ev.adres && <p className="text-sm text-gray-500 truncate">{ev.adres}</p>}
        </div>
      </div>

      <div className="card mb-5">
        <div className="mb-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Değerlendirme Şablonları</p>
          <div className="flex flex-wrap gap-2">
            {sablonlar.map(s => {
              const secili = (ev.templateIds || []).includes(s.id)
              return (
                <label
                  key={s.id}
                  className={`px-2 py-1 rounded-lg border text-xs cursor-pointer ${
                    secili ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={secili}
                    onChange={e => handleSablonSecimi(s.id, e.target.checked)}
                  />
                  {s.ad}
                </label>
              )
            })}
          </div>
          {seciliSablonlar.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {seciliSablonlar.map(s => (
                <button
                  key={s.id}
                  onClick={() => setAktifSablonId(s.id)}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    aktifSablon?.id === s.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {s.ad}
                </button>
              ))}
            </div>
          )}
        </div>

        {aktifSablon ? (
          <div className="flex items-center gap-5">
            <SkorDairesi kriterler={aktifSablonKriterleri} puanlar={aktifSablonPuanlari} boyut={110} />
            <div className="flex-1">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">Aktif: {aktifSablon.ad}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Değerlendirilen</span>
                  <span className="font-semibold text-gray-900">{tamamlananKriter}/{aktifSablonKriterleri.length}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{
                      width: `${aktifSablonKriterleri.length > 0 ? (tamamlananKriter / aktifSablonKriterleri.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                {ev.fiyat && (
                  <p className="text-sm text-gray-700 font-medium">
                    {Number(ev.fiyat).toLocaleString('tr-TR')} ₺
                    {ev.tip === 'kiralik' ? '/ay' : ''}
                  </p>
                )}
                {ev.not && <p className="text-xs text-gray-500 italic line-clamp-2">"{ev.not}"</p>}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setGosterDetay(p => !p)}
                  className="btn-secondary text-xs py-1.5 flex items-center gap-1"
                >
                  <BarChart2 size={14} />
                  Detay
                </button>
                <button
                  onClick={() => setNotModal(true)}
                  className="btn-secondary text-xs py-1.5 flex items-center gap-1"
                >
                  <MessageSquare size={14} />
                  {ev.not ? 'Notu Düzenle' : 'Not Ekle'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Değerlendirme için yukarıdan en az bir şablon seçin.</p>
        )}

        {sablonSkorlari.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
            {sablonSkorlari.map(item => {
              const sinif = skorSinifi(item.yuzde)
              return (
                <div key={item.sablon.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{item.sablon.ad}:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${sinif.bg} ${sinif.text}`}>
                    {item.yuzde}% ({item.tamamlananKriter}/{item.toplamKriter})
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {gosterDetay && aktifSablon && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              {aktifSablon.ad} — Kategori Özeti
            </p>
            <div className="space-y-2">
              {Object.values(KATEGORILER).map(kat => {
                const { toplam, puanlanan, yuzde: katYuzde } = kategoriIstatistik(kat.id)
                if (toplam === 0) return null
                const sinif = katYuzde !== null ? skorSinifi(katYuzde) : null
                return (
                  <div key={kat.id} className="flex items-center gap-2 text-xs">
                    <span className="w-4">{kat.ikon}</span>
                    <span className="flex-1 text-gray-700 truncate">{kat.ad}</span>
                    <span className="text-gray-400">{puanlanan}/{toplam}</span>
                    {sinif && (
                      <span className={`px-2 py-0.5 rounded-full font-medium ${sinif.bg} ${sinif.text}`}>
                        {katYuzde}%
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {aktifSablon ? (
        <div className="space-y-3">
          {Object.values(KATEGORILER).map(kat => {
            const katKriterler = aktifSablonKriterleri.filter(k => k.kategoriId === kat.id)
            if (katKriterler.length === 0) return null
            const { puanlanan } = kategoriIstatistik(kat.id)

            return (
              <div key={kat.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleKategori(kat.id)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-lg">{kat.ikon}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800 text-sm">{kat.ad}</span>
                    <span className="ml-2 text-xs text-gray-500">{puanlanan}/{katKriterler.length} değerlendirildi</span>
                  </div>
                  {puanlanan === katKriterler.length && puanlanan > 0 && (
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                  )}
                  {acikKategoriler[kat.id]
                    ? <ChevronUp size={16} className="text-gray-400" />
                    : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {acikKategoriler[kat.id] && (
                  <div className="p-4 space-y-5 divide-y divide-gray-50">
                    {katKriterler.map((kriter, i) => (
                      <div key={kriter.id} className={i > 0 ? 'pt-4' : ''}>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(n => (
                              <div
                                key={n}
                                className={`h-1 w-3 rounded-full ${n <= kriter.agirlik ? 'bg-blue-400' : 'bg-gray-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">Önem</span>
                        </div>
                        <PuanSecici
                          kriterAdi={kriter.ad}
                          kriterAciklama={kriter.aciklama}
                          mevcutPuan={aktifSablonPuanlari[kriter.id]}
                          onPuanSec={p => handlePuan(kriter.id, p)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card text-center py-10 text-sm text-gray-500">Değerlendirme için yukarıdan bir şablon seçin.</div>
      )}

      {notModal && (
        <NotModal
          mevcutNot={ev.not}
          onKapat={() => setNotModal(false)}
          onKaydet={not => evGuncelle(id, { not })}
        />
      )}
    </div>
  )
}
