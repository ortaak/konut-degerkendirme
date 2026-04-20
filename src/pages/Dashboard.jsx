import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MapPin, DollarSign, Trash2, ChevronRight, Home, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { toplamPuanHesapla, skorSinifi } from '../data/kriterler'
import SkorDairesi from '../components/SkorDairesi'

function EvEkleModal({ onKapat, onEkle, sablonlar }) {
  const [form, setForm] = useState({
    ad: '',
    adres: '',
    fiyat: '',
    tip: 'satilik',
    not: '',
    templateIds: sablonlar.length ? [sablonlar[0].id] : [],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.ad.trim()) return
    onEkle(form)
    onKapat()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Yeni Ev Ekle</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gezdığiniz evi kaydedin, ardından kriterleri puanlayın</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Ev Adı / Kodu *</label>
            <input
              className="input"
              placeholder="Örn: Kadıköy 3+1, Beşiktaş Dairesi..."
              value={form.ad}
              onChange={e => setForm(p => ({ ...p, ad: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Adres</label>
            <input
              className="input"
              placeholder="Mahalle, ilçe, şehir..."
              value={form.adres}
              onChange={e => setForm(p => ({ ...p, adres: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Fiyat (₺)</label>
              <input
                className="input"
                type="number"
                placeholder="0"
                value={form.fiyat}
                onChange={e => setForm(p => ({ ...p, fiyat: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Tip</label>
              <select
                className="input"
                value={form.tip}
                onChange={e => setForm(p => ({ ...p, tip: e.target.value }))}
              >
                <option value="satilik">Satılık</option>
                <option value="kiralik">Kiralık</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Not</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="İlk izlenimler, emlakçı bilgisi, vb."
              value={form.not}
              onChange={e => setForm(p => ({ ...p, not: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Değerlendirme Şablonları</label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {sablonlar.map(s => (
                <label key={s.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.templateIds.includes(s.id)}
                    onChange={(e) => setForm(prev => ({
                      ...prev,
                      templateIds: e.target.checked
                        ? [...prev.templateIds, s.id]
                        : prev.templateIds.filter(id => id !== s.id),
                    }))}
                  />
                  {s.ad}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onKapat} className="btn-secondary flex-1">İptal</button>
            <button type="submit" className="btn-primary flex-1">Kaydet ve Değerlendir</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EvKarti({ ev, kriterler, sablonlar, onSil }) {
  const seciliSablonlar = sablonlar.filter(s => (ev.templateIds || []).includes(s.id))
  const sablonSkorlari = seciliSablonlar.map(sablon => {
    const sablonKriterler = kriterler.filter(k => (sablon.kriterIds || []).includes(k.id) && k.aktif)
    const puanlar = (ev.puanlarByTemplate || {})[sablon.id] || {}
    const skor = toplamPuanHesapla(sablonKriterler, puanlar)
    return { sablon, skor, puanlar }
  })
  const ilkSkor = sablonSkorlari[0]?.skor?.yuzde || 0
  const sinif = skorSinifi(ilkSkor)
  const tamamlanan = sablonSkorlari.reduce((acc, item) => acc + Object.keys(item.puanlar || {}).length, 0)
  const toplam = sablonSkorlari.reduce((acc, item) => acc + kriterler.filter(k => (item.sablon.kriterIds || []).includes(k.id) && k.aktif).length, 0)
  const ilerleme = toplam > 0 ? Math.round((tamamlanan / toplam) * 100) : 0

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              ev.tip === 'kiralik' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {ev.tip === 'kiralik' ? 'Kiralık' : 'Satılık'}
            </span>
            {tamamlanan === 0 && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle size={12} />
                Değerlendirilmedi
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 truncate">{ev.ad}</h3>
          {ev.adres && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={12} />
              <span className="truncate">{ev.adres}</span>
            </p>
          )}
          {ev.fiyat && (
            <p className="text-sm font-medium text-gray-700 flex items-center gap-1 mt-0.5">
              <DollarSign size={12} />
              {Number(ev.fiyat).toLocaleString('tr-TR')} ₺
              {ev.tip === 'kiralik' ? '/ay' : ''}
            </p>
          )}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{tamamlanan}/{toplam} kriter</span>
              <span>{ilerleme}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${ilerleme}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          {sablonSkorlari.length > 0 ? (
            <SkorDairesi
              kriterler={kriterler.filter(k => sablonSkorlari[0].sablon.kriterIds?.includes(k.id) && k.aktif)}
              puanlar={sablonSkorlari[0].puanlar || {}}
              boyut={90}
            />
          ) : (
            <div className="w-[90px] h-[90px] rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xs text-center leading-tight">Puan<br/>Yok</span>
            </div>
          )}
        </div>
      </div>
      {sablonSkorlari.length > 0 && (
        <div className="mt-3 space-y-1">
          {sablonSkorlari.map(({ sablon, skor }) => (
            <p key={sablon.id} className="text-xs text-gray-600">
              {sablon.ad} şablonu: <span className={`font-semibold ${sinif.text}`}>{skor.yuzde}</span>
            </p>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
        <Link to={`/ev/${ev.id}`} className="btn-primary flex-1 text-center text-sm flex items-center justify-center gap-1">
          Değerlendir
          <ChevronRight size={16} />
        </Link>
        <button
          onClick={() => onSil(ev.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { evler, kriterler, sablonlar, evEkle, evSil, hazir } = useApp()
  const [modalAcik, setModalAcik] = useState(false)
  const [silOnay, setSilOnay] = useState(null)

  const handleSil = (id) => {
    if (silOnay === id) {
      evSil(id)
      setSilOnay(null)
    } else {
      setSilOnay(id)
      setTimeout(() => setSilOnay(null), 3000)
    }
  }

  const aktifKriterler = kriterler.filter(k => k.aktif)

  if (!hazir) {
    return <div className="card text-sm text-gray-500">Yükleniyor...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Evlerim</h2>
          <p className="text-sm text-gray-500 mt-0.5">{evler.length} ev kaydedildi</p>
        </div>
        <button onClick={() => setModalAcik(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Ev Ekle
        </button>
      </div>

      {evler.length === 0 ? (
        <div className="card text-center py-16">
          <Home size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz ev eklenmedi</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Gezdiğiniz evleri buraya ekleyin ve bilimsel kriterlerle puanlayın.
            Kafanız karışmadan en doğru evi seçin.
          </p>
          <button onClick={() => setModalAcik(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            İlk Evi Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evler.map(ev => (
            <EvKarti
              key={ev.id}
              ev={ev}
              kriterler={aktifKriterler}
              sablonlar={sablonlar}
              onSil={handleSil}
            />
          ))}
        </div>
      )}

      {silOnay && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg">
          Silmek için tekrar dokunun
        </div>
      )}

      {modalAcik && (
        <EvEkleModal
          onKapat={() => setModalAcik(false)}
          onEkle={evEkle}
          sablonlar={sablonlar}
        />
      )}
    </div>
  )
}
