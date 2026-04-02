# Konut Değerlendirme Uygulaması

Gezilen evleri bilimsel kriterlere göre puanlamanızı ve karşılaştırmanızı sağlayan React tabanlı web uygulaması.

## Özellikler

- **Ev Ekleme & Yönetimi** — Gezdiğiniz evleri adres, fiyat ve tip bilgileriyle kaydedin
- **Çok Kriterli Puanlama** — 8 kategori altında 30+ kriter ile her evi 0-5 üzerinden puanlayın
- **Ağırlıklı Skor Hesabı** — Her kriterin önem ağırlığını (1-5) kendiniz belirleyin; toplam puan ağırlıklı MCDA yöntemiyle hesaplanır
- **Karşılaştırma** — Birden fazla evi yan yana radar grafiği ve kategori bazlı tablo ile karşılaştırın
- **Kriter Yönetimi** — Varsayılan kriterleri düzenleyin, aktif/pasif yapın veya ağırlıklarını değiştirin
- **Yerel Depolama** — Tüm veriler tarayıcının localStorage alanına kaydedilir

## Puanlama Kategorileri

| Kategori | Örnek Kriterler |
|---|---|
| Yapı ve İnşaat Kalitesi | Deprem dayanımı, ısı izolasyonu, iskan ruhsatı |
| Mekansal Tasarım | Net kullanım alanı, doğal havalandırma, pencere yönelimi |
| Kullanıcı Konforu | Termal konfor, akustik konfor, iç hava kalitesi |
| Lokasyon ve Çevre | Toplu taşıma, eğitim kurumları, yeşil alan |
| Altyapı ve Tesisatlar | Su/elektrik tesisatı, internet altyapısı, asansör |
| Güvenlik | Bina giriş güvenliği, yangın güvenliği, doğalgaz dedektörü |
| Hukuki ve Mali Durum | Tapu durumu, DASK sigortası, fiyat/değer oranı |
| Sürdürülebilirlik | Enerji verimliliği (A-G belgesi), atık yönetimi |

## Puanlama Yöntemi

```
Toplam Puan = Σ(puan × ağırlık) / Σ(5 × ağırlık) × 100
```

Bilimsel kaynaklar: Housing Quality Indicators (Wimalasena et al., 2022), WHO Housing and Health Guidelines, TBDY-2018, TS 825.

## Teknolojiler

- React 18 + Vite
- React Router DOM
- Tailwind CSS
- Recharts
- Lucide React

## Kurulum ve Çalıştırma

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

```bash
npm run build    # Üretim build
npm run preview  # Build önizleme
```
