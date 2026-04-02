/**
 * Bilimsel Kaynak:
 * - Housing Quality Indicators: A Systematic Review (Wimalasena et al., 2022) - 8 kategori, 66 gösterge
 * - Housing Quality Assessment Model (Brkanić Mihić, 2023) - ağırlıklı MCDM
 * - HUD Housing Quality Standards (HQS) - sağlık ve güvenlik kriterleri
 * - WHO Housing and Health Guidelines - sağlıklı konut standartları
 * - Türkiye Bina Deprem Yönetmeliği (TBDY-2018)
 * - TS 825 Isı Yalıtım Standardı
 *
 * Puanlama Yöntemi: Ağırlıklı Çok Kriterli Karar Analizi (Weighted MCDA)
 * - Her kriter için kullanıcı 1-5 arası ÖNEMİNİ belirler (ağırlık)
 * - Gezilen evde her kriter 0-5 arası PUANLANIR
 * - Toplam Puan = Σ(puan × ağırlık) / Σ(5 × ağırlık) × 100
 */

export const KATEGORILER = {
  YAPI_KALITE: { id: 'yapi_kalite', ad: 'Yapı ve İnşaat Kalitesi', ikon: '🏗️', renk: 'blue' },
  MEKAN_TASARIM: { id: 'mekan_tasarim', ad: 'Mekansal Tasarım', ikon: '📐', renk: 'purple' },
  KONFOR: { id: 'konfor', ad: 'Kullanıcı Konforu', ikon: '🌡️', renk: 'orange' },
  LOKASYON: { id: 'lokasyon', ad: 'Lokasyon ve Çevre', ikon: '📍', renk: 'green' },
  ALTYAPI: { id: 'altyapi', ad: 'Altyapı ve Tesisatlar', ikon: '⚡', renk: 'yellow' },
  GUVENLIK: { id: 'guvenlik', ad: 'Güvenlik', ikon: '🔒', renk: 'red' },
  HUKUKI_MALI: { id: 'hukuki_mali', ad: 'Hukuki ve Mali Durum', ikon: '📋', renk: 'indigo' },
  SURDURULEBILIR: { id: 'surdurulebilir', ad: 'Sürdürülebilirlik', ikon: '🌿', renk: 'teal' },
}

export const VARSAYILAN_KRITERLER = [
  // 1. YAPI VE İNŞAAT KALİTESİ
  {
    id: 'deprem_dayanimi',
    kategoriId: 'yapi_kalite',
    ad: 'Deprem Dayanımı',
    aciklama: 'TBDY-2018 kapsamında yapı güvenlik sertifikası, zemin etüdü, deprem bölgesi riski. Bina inşaat yılı ve yönetmeliğe uygunluğu.',
    varsayilanAgirlik: 5,
  },
  {
    id: 'yapi_yas_durum',
    kategoriId: 'yapi_kalite',
    ad: 'Yapı Yaşı ve Durumu',
    aciklama: 'Binanın yapım yılı, genel bakım durumu, cephe ve çatı kalitesi, görünür çatlak/rutubet izi yokluğu.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'izolasyon_kalitesi',
    kategoriId: 'yapi_kalite',
    ad: 'Isı & Ses İzolasyonu',
    aciklama: 'TS 825 standardı uyumlu ısı yalıtımı, dışarıdan gelen ses düzeyi, kat arası ses yalıtımı kalitesi.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'insaat_malzeme',
    kategoriId: 'yapi_kalite',
    ad: 'İnşaat Malzeme Kalitesi',
    aciklama: 'Zemin kaplaması, duvar/tavan işçiliği, pencere ve kapı kalitesi, boya/sıva durumu.',
    varsayilanAgirlik: 3,
  },
  {
    id: 'iskan_ruhsat',
    kategoriId: 'yapi_kalite',
    ad: 'İskan Ruhsatı Uygunluğu',
    aciklama: 'Yapı ruhsatı, iskan (yapı kullanma izin belgesi) mevcudiyeti. Kaçak veya ruhsatsız bölüm yokluğu.',
    varsayilanAgirlik: 5,
  },

  // 2. MEKANSAL TASARIM
  {
    id: 'net_alan',
    kategoriId: 'mekan_tasarim',
    ad: 'Net Kullanım Alanı',
    aciklama: 'Brüt m² değil net yaşam alanı. Kişi başına düşen alan. WHO standardı: kişi başı min 14m² net alan.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'oda_boyutlari',
    kategoriId: 'mekan_tasarim',
    ad: 'Oda Boyutları ve Oranları',
    aciklama: 'Yatak odası min 9m², oturma odası min 16m², mutfak min 6m². Tavan yüksekliği min 2.4m.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'pencere_yonelim',
    kategoriId: 'mekan_tasarim',
    ad: 'Pencere Yönelimi ve Boyutu',
    aciklama: 'Güney/güneydoğu cephe tercih. Pencere alanı/zemin alanı oranı min %10. Doğal ışık yeterliliği.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'dogal_havalandirma',
    kategoriId: 'mekan_tasarim',
    ad: 'Doğal Havalandırma',
    aciklama: 'Çapraz havalandırma imkanı, mutfak ve banyoda pencere/havalandırma, yaşam alanlarında yeterli hava akışı.',
    varsayilanAgirlik: 5,
  },
  {
    id: 'depolama_alanlari',
    kategoriId: 'mekan_tasarim',
    ad: 'Depolama Alanları',
    aciklama: 'Gömme dolap, kiler, balkon/depo, gardırop alanları yeterliliği.',
    varsayilanAgirlik: 2,
  },
  {
    id: 'islevsel_duzenleme',
    kategoriId: 'mekan_tasarim',
    ad: 'İşlevsel Mekan Düzeni',
    aciklama: 'Mutfak-yemek-oturma geçiş mantığı, yatak odaları mahremiyet mesafesi, WC konumu uygunluğu.',
    varsayilanAgirlik: 3,
  },

  // 3. KULLANICI KONFORU
  {
    id: 'termal_konfor',
    kategoriId: 'konfor',
    ad: 'Termal Konfor',
    aciklama: 'Isıtma sistemi (merkezi/kombi/yerden ısıtma), doğalgaz bağlantısı, klima/soğutma imkanı.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'dogal_isik',
    kategoriId: 'konfor',
    ad: 'Doğal Aydınlatma',
    aciklama: 'Gün boyu güneş alan oda sayısı, bodrum/yarı bodrum kat değil, yeterli pencere alanı.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'hava_kalitesi',
    kategoriId: 'konfor',
    ad: 'İç Hava Kalitesi',
    aciklama: 'Nem-rutubet sorunu yokluğu, küf izi yokluğu, radon bölgesinde değil, toz/pis koku yok.',
    varsayilanAgirlik: 5,
  },
  {
    id: 'ses_konfor',
    kategoriId: 'konfor',
    ad: 'Akustik Konfor',
    aciklama: 'Cadde/trafik gürültüsü düzeyi, üst/alt kat sesi geçirgenliği, komşu sesi yalıtımı.',
    varsayilanAgirlik: 3,
  },
  {
    id: 'gorunum_manzara',
    kategoriId: 'konfor',
    ad: 'Görünüm ve Manzara',
    aciklama: 'Pencerelerden açık/yeşil/deniz manzarası, duvar/bina manzarası yokluğu, psikolojik etki.',
    varsayilanAgirlik: 3,
  },

  // 4. LOKASYON VE ÇEVRE
  {
    id: 'ulasim_toplu',
    kategoriId: 'lokasyon',
    ad: 'Toplu Taşıma Erişimi',
    aciklama: 'Metrobüs/metro/otobüs durak mesafesi (ideal: 500m altı), sefer sıklığı, bağlantı çeşitliliği.',
    varsayilanAgirlik: 5,
  },
  {
    id: 'egitim_kurumlar',
    kategoriId: 'lokasyon',
    ad: 'Eğitim Kurumları',
    aciklama: 'Yürüme mesafesinde okul (kreş, ilkokul, lise), semt olarak eğitim kalitesi.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'saglik_hizmetleri',
    kategoriId: 'lokasyon',
    ad: 'Sağlık Hizmetleri',
    aciklama: 'Aile sağlığı merkezi, hastane, eczane yakınlığı. Acil servis erişimi.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'market_alisveris',
    kategoriId: 'lokasyon',
    ad: 'Market ve Alışveriş',
    aciklama: 'Yürüme mesafesinde market, pazar, bakkal erişilebilirliği. Günlük ihtiyaç kolaylığı.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'yesil_alan',
    kategoriId: 'lokasyon',
    ad: 'Yeşil Alan ve Park',
    aciklama: 'Çevre park/bahçe, çocuk oyun alanı, spor sahası erişimi. WHO: kişi başı min 9m² yeşil alan.',
    varsayilanAgirlik: 3,
  },
  {
    id: 'semt_guvenlik',
    kategoriId: 'lokasyon',
    ad: 'Semt Güvenliği',
    aciklama: 'Semtin genel güvenlik düzeyi, gece aydınlatması, sosyal yapısı.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'calisma_uzaklik',
    kategoriId: 'lokasyon',
    ad: 'İş Yerine Uzaklık',
    aciklama: 'İş yerine ulaşım süresi ve maliyeti. Günlük komüt stres seviyesi.',
    varsayilanAgirlik: 4,
  },

  // 5. ALTYAPI VE TESİSATLAR
  {
    id: 'su_tesisati',
    kategoriId: 'altyapi',
    ad: 'Su Tesisatı',
    aciklama: 'Sıcak/soğuk su basıncı, doğalgaz kombisi ya da merkezi sistem, su sayacı, kaçak/pas sorunu yokluğu.',
    varsayilanAgirlik: 5,
  },
  {
    id: 'elektrik_tesisati',
    kategoriId: 'altyapi',
    ad: 'Elektrik Tesisatı',
    aciklama: 'Yeterli priz sayısı, sigortaların yeterliliği, klima hattı, topraklama sistemi.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'internet_altyapi',
    kategoriId: 'altyapi',
    ad: 'İnternet ve Telekomünikasyon',
    aciklama: 'Fiber altyapı mevcut, mobil sinyal gücü, kablo TV bağlantısı.',
    varsayilanAgirlik: 3,
  },
  {
    id: 'asansor',
    kategoriId: 'altyapi',
    ad: 'Asansör',
    aciklama: 'Asansör mevcudiyeti ve bakım durumu. Kat yüksekliği dikkate alınarak değerlendirilir.',
    varsayilanAgirlik: 3,
  },
  {
    id: 'otopark',
    kategoriId: 'altyapi',
    ad: 'Otopark',
    aciklama: 'Kapalı otopark, açık park yeri, araç sayısına yeterliliği.',
    varsayilanAgirlik: 3,
  },

  // 6. GÜVENLİK
  {
    id: 'giris_guvenlik',
    kategoriId: 'guvenlik',
    ad: 'Bina Giriş Güvenliği',
    aciklama: 'Güvenlik görevlisi/kapıcı, kameralı gözetleme sistemi, kimlik doğrulama sistemi, interkom.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'yangin_guvenlik',
    kategoriId: 'guvenlik',
    ad: 'Yangın Güvenliği',
    aciklama: 'Duman dedektörü, sprinkler sistemi, yangın merdiveni, yangın tüpü mevcudiyeti.',
    varsayilanAgirlik: 5,
  },
  {
    id: 'dogalgaz_guvenlik',
    kategoriId: 'guvenlik',
    ad: 'Doğalgaz Güvenliği',
    aciklama: 'Doğalgaz detektörü, otomatik kesme vanası, son bakım tarihi.',
    varsayilanAgirlik: 4,
  },

  // 7. HUKUKİ VE MALİ DURUM
  {
    id: 'tapu_durumu',
    kategoriId: 'hukuki_mali',
    ad: 'Tapu ve Hukuki Durum',
    aciklama: 'Temiz tapu (ipotek/haciz yok), kat mülkiyeti tapusu (arsa payı tapusu değil), imar uygunluğu.',
    varsayilanAgirlik: 5,
  },
  {
    id: 'aidat_giderler',
    kategoriId: 'hukuki_mali',
    ad: 'Aidat ve Ortak Giderler',
    aciklama: 'Aylık aidat miktarı, yakıt/ısıtma paylaşım sistemi, yönetim planı kalitesi.',
    varsayilanAgirlik: 3,
  },
  {
    id: 'dask_sigorta',
    kategoriId: 'hukuki_mali',
    ad: 'DASK ve Sigorta',
    aciklama: 'Zorunlu DASK (deprem sigortası) geçerliliği, konut sigortası durumu.',
    varsayilanAgirlik: 4,
  },
  {
    id: 'fiyat_deger',
    kategoriId: 'hukuki_mali',
    ad: 'Fiyat/Değer Oranı',
    aciklama: 'Ekspertiz değerine oranla fiyat uygunluğu. Emsal kira/satış fiyatlarıyla karşılaştırma.',
    varsayilanAgirlik: 4,
  },

  // 8. SÜRDÜRÜLEBİLİRLİK
  {
    id: 'enerji_verimliligi',
    kategoriId: 'surdurulebilir',
    ad: 'Enerji Verimliliği',
    aciklama: 'Binanın enerji kimlik belgesi (A-G sınıfı). Çift cam, dış cephe yalıtımı, akıllı sayaç.',
    varsayilanAgirlik: 3,
  },
  {
    id: 'atik_yonetim',
    kategoriId: 'surdurulebilir',
    ad: 'Atık Yönetimi',
    aciklama: 'Geri dönüşüm kumbaraları, çöp ayrıştırma sistemi, temiz çevre yönetimi.',
    varsayilanAgirlik: 2,
  },
]

export const PUAN_ETIKETLER = {
  0: { etiket: 'Yok / Geçersiz', renk: 'gray' },
  1: { etiket: 'Çok Kötü', renk: 'red' },
  2: { etiket: 'Kötü', renk: 'orange' },
  3: { etiket: 'Orta', renk: 'yellow' },
  4: { etiket: 'İyi', renk: 'blue' },
  5: { etiket: 'Mükemmel', renk: 'green' },
}

export const AGIRLIK_ETIKETLER = {
  1: 'Düşük Önce',
  2: 'Az Önemli',
  3: 'Orta Önem',
  4: 'Önemli',
  5: 'Çok Kritik',
}

export function toplamPuanHesapla(kriterler, puanlar) {
  let toplamAgirlikliPuan = 0
  let toplamMaxPuan = 0

  kriterler.forEach(kriter => {
    if (!kriter.aktif) return
    const puan = puanlar[kriter.id]
    if (puan === undefined || puan === null) return
    toplamAgirlikliPuan += puan * kriter.agirlik
    toplamMaxPuan += 5 * kriter.agirlik
  })

  if (toplamMaxPuan === 0) return { yuzde: 0, ham: 0, max: 0 }
  return {
    yuzde: Math.round((toplamAgirlikliPuan / toplamMaxPuan) * 100),
    ham: toplamAgirlikliPuan,
    max: toplamMaxPuan,
    tamamlananKriter: Object.keys(puanlar).length,
  }
}

export function skorSinifi(yuzde) {
  if (yuzde >= 85) return { etiket: 'Mükemmel', renk: 'green', bg: 'bg-green-100', text: 'text-green-800' }
  if (yuzde >= 70) return { etiket: 'İyi', renk: 'blue', bg: 'bg-blue-100', text: 'text-blue-800' }
  if (yuzde >= 55) return { etiket: 'Orta', renk: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800' }
  if (yuzde >= 40) return { etiket: 'Zayıf', renk: 'orange', bg: 'bg-orange-100', text: 'text-orange-800' }
  return { etiket: 'Yetersiz', renk: 'red', bg: 'bg-red-100', text: 'text-red-800' }
}
