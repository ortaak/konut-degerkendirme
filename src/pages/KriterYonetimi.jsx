import { useState } from 'react'
import { Plus, Edit2, Trash2, Check, RefreshCw, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { KATEGORILER, AGIRLIK_ETIKETLER } from '../data/kriterler'

const KATEGORI_RENKLER = {
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  teal: 'bg-teal-100 text-teal-700 border-teal-200',
  cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

function KriterSatiri({ kriter, onGuncelle, onSil }) {
  const [duzenle, setDuzenle] = useState(false)
  const [aciklama, setAciklama] = useState(false)
  const [form, setForm] = useState({ ad: kriter.ad, agirlik: kriter.agirlik })
  const kategori = Object.values(KATEGORILER).find(k => k.id === kriter.kategoriId)

  const handleKaydet = () => {
    if (!form.ad.trim()) return
    onGuncelle(kriter.id, { ad: form.ad, agirlik: form.agirlik })
    setDuzenle(false)
  }

  return (
    <div className={`border rounded-lg p-3 transition-all ${kriter.aktif ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onGuncelle(kriter.id, { aktif: !kriter.aktif })}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            kriter.aktif ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
          }`}
        >
          {kriter.aktif && <Check size={12} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          {duzenle ? (
            <div className="space-y-2">
              <input
                className="input text-sm"
                value={form.ad}
                onChange={e => setForm(p => ({ ...p, ad: e.target.value }))}
              />
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-600 whitespace-nowrap">Önem:</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={form.agirlik}
                  onChange={e => setForm(p => ({ ...p, agirlik: Number(e.target.value) }))}
                  className="flex-1"
                />
                <span className="text-xs font-semibold text-blue-700 whitespace-nowrap w-20">
                  {form.agirlik}/5 – {AGIRLIK_ETIKETLER[form.agirlik]}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleKaydet} className="btn-primary text-xs py-1 px-3">Kaydet</button>
                <button onClick={() => setDuzenle(false)} className="btn-secondary text-xs py-1 px-3">İptal</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-medium text-sm ${kriter.aktif ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                  {kriter.ad}
                </span>
                {kriter.id.startsWith('ozel_') && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Özel</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <div
                      key={n}
                      className={`h-1.5 w-4 rounded-full ${n <= kriter.agirlik ? 'bg-blue-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{AGIRLIK_ETIKETLER[kriter.agirlik]}</span>
              </div>
              {aciklama && kriter.aciklama && (
                <p className="text-xs text-gray-500 mt-2 leading-relaxed bg-gray-50 rounded p-2">
                  {kriter.aciklama}
                </p>
              )}
            </>
          )}
        </div>

        {!duzenle && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {kriter.aciklama && (
              <button
                onClick={() => setAciklama(p => !p)}
                className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors"
              >
                <Info size={14} />
              </button>
            )}
            <button
              onClick={() => setDuzenle(true)}
              className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors"
            >
              <Edit2 size={14} />
            </button>
            {kriter.id.startsWith('ozel_') && (
              <button
                onClick={() => onSil(kriter.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function YeniKriterForm({ onEkle, onKapat }) {
  const [form, setForm] = useState({ ad: '', kategoriId: 'yapi_kalite', agirlik: 3, aciklama: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.ad.trim()) return
    onEkle(form)
    onKapat()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Yeni Kriter Ekle</h2>
          <p className="text-sm text-gray-500 mt-0.5">Size özel bir değerlendirme kriteri ekleyin</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Kriter Adı *</label>
            <input
              className="input"
              placeholder="Örn: Balkonda musluk, Evcil hayvan uyumlu..."
              value={form.ad}
              onChange={e => setForm(p => ({ ...p, ad: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Kategori</label>
            <select
              className="input"
              value={form.kategoriId}
              onChange={e => setForm(p => ({ ...p, kategoriId: e.target.value }))}
            >
              {Object.values(KATEGORILER).map(k => (
                <option key={k.id} value={k.id}>{k.ikon} {k.ad}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Önem Derecesi: {form.agirlik}/5 – {AGIRLIK_ETIKETLER[form.agirlik]}</label>
            <input
              type="range"
              min={1}
              max={5}
              value={form.agirlik}
              onChange={e => setForm(p => ({ ...p, agirlik: Number(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="label">Açıklama (opsiyonel)</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Bu kriteri nasıl değerlendirmeliyim?"
              value={form.aciklama}
              onChange={e => setForm(p => ({ ...p, aciklama: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onKapat} className="btn-secondary flex-1">İptal</button>
            <button type="submit" className="btn-primary flex-1">Ekle</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function KriterYonetimi() {
  const { kriterler, kriterEkle, kriterGuncelle, kriterSil, kriterleriSifirla } = useApp()
  const [modalAcik, setModalAcik] = useState(false)
  const [acikKategoriler, setAcikKategoriler] = useState(
    Object.values(KATEGORILER).reduce((acc, k) => ({ ...acc, [k.id]: true }), {})
  )
  const [sifirlaOnay, setSifirlaOnay] = useState(false)

  const toggleKategori = (id) => setAcikKategoriler(p => ({ ...p, [id]: !p[id] }))

  const aktifSayisi = kriterler.filter(k => k.aktif).length

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kriterlerim</h2>
          <p className="text-sm text-gray-500 mt-0.5">{aktifSayisi}/{kriterler.length} aktif kriter</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (sifirlaOnay) { kriterleriSifirla(); setSifirlaOnay(false) }
              else { setSifirlaOnay(true); setTimeout(() => setSifirlaOnay(false), 3000) }
            }}
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
            title="Varsayılana sıfırla"
          >
            <RefreshCw size={18} />
          </button>
          <button onClick={() => setModalAcik(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} />
            Kriter Ekle
          </button>
        </div>
      </div>

      {sifirlaOnay && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
          Tüm kriterleri varsayılana sıfırlamak için tekrar dokunun. Bu işlem özel kriterlerinizi silecek.
        </div>
      )}

      <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Bilimsel Temel:</strong> Kriterler 8 kategoride sistematik literatür taramasından (Wimalasena et al., 2022; Brkanić Mihić, 2023), 
          WHO Sağlıklı Konut Standartları ve Türkiye TBDY-2018'den derlenmiştir. 
          Her kriterin önem derecesi <strong>Ağırlıklı MCDM</strong> yöntemiyle toplam puana yansır.
        </p>
      </div>

      <div className="space-y-3">
        {Object.values(KATEGORILER).map(kategori => {
          const kategoridekiler = kriterler.filter(k => k.kategoriId === kategori.id)
          if (kategoridekiler.length === 0) return null
          const aktif = kategoridekiler.filter(k => k.aktif).length
          const renk = KATEGORI_RENKLER[kategori.renk]

          return (
            <div key={kategori.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleKategori(kategori.id)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="text-lg">{kategori.ikon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800 text-sm">{kategori.ad}</span>
                  <span className="ml-2 text-xs text-gray-500">{aktif}/{kategoridekiler.length} aktif</span>
                </div>
                {acikKategoriler[kategori.id] ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {acikKategoriler[kategori.id] && (
                <div className="p-3 space-y-2">
                  {kategoridekiler.map(kriter => (
                    <KriterSatiri
                      key={kriter.id}
                      kriter={kriter}
                      onGuncelle={kriterGuncelle}
                      onSil={kriterSil}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {modalAcik && (
        <YeniKriterForm onEkle={kriterEkle} onKapat={() => setModalAcik(false)} />
      )}
    </div>
  )
}
