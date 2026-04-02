import { toplamPuanHesapla, skorSinifi } from '../data/kriterler'

export default function SkorDairesi({ kriterler, puanlar, boyut = 120 }) {
  const { yuzde, tamamlananKriter } = toplamPuanHesapla(kriterler, puanlar)
  const sinif = skorSinifi(yuzde)

  const r = 45
  const cevre = 2 * Math.PI * r
  const doluluk = (yuzde / 100) * cevre

  const renkMap = {
    green: '#16a34a',
    blue: '#2563eb',
    yellow: '#ca8a04',
    orange: '#ea580c',
    red: '#dc2626',
    gray: '#9ca3af',
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: boyut, height: boyut }} className="relative">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={renkMap[sinif.renk]}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={cevre}
            strokeDashoffset={cevre - doluluk}
            className="score-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{yuzde}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sinif.bg} ${sinif.text}`}>
        {sinif.etiket}
      </span>
      {tamamlananKriter !== undefined && (
        <span className="text-xs text-gray-400">{tamamlananKriter} kriter değerlendirildi</span>
      )}
    </div>
  )
}
