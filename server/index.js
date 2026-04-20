import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { Pool } from 'pg'
import { VARSAYILAN_KRITERLER } from '../src/data/kriterler.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../dist')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ev_puanlama',
})

app.use(cors())
app.use(express.json())
app.use(express.static(distPath))

async function sorgu(sql, params = []) {
  const sonuc = await pool.query(sql, params)
  return sonuc.rows
}

async function semaHazirla() {
  await sorgu(`
    create table if not exists criteria (
      id text primary key,
      kategori_id text not null,
      ad text not null,
      aciklama text,
      agirlik integer not null default 3,
      aktif boolean not null default true,
      ozel boolean not null default false,
      sira integer not null default 0
    );

    create table if not exists templates (
      id serial primary key,
      ad text not null unique,
      olusturulma_tarihi timestamptz not null default now()
    );

    create table if not exists template_criteria (
      template_id integer not null references templates(id) on delete cascade,
      criterion_id text not null references criteria(id) on delete cascade,
      primary key (template_id, criterion_id)
    );

    create table if not exists houses (
      id text primary key,
      ad text not null,
      adres text,
      fiyat numeric,
      tip text not null default 'satilik',
      not text,
      olusturulma_tarihi timestamptz not null default now()
    );

    create table if not exists house_templates (
      house_id text not null references houses(id) on delete cascade,
      template_id integer not null references templates(id) on delete cascade,
      primary key (house_id, template_id)
    );

    create table if not exists house_scores (
      house_id text not null references houses(id) on delete cascade,
      template_id integer not null references templates(id) on delete cascade,
      criterion_id text not null references criteria(id) on delete cascade,
      score integer not null,
      primary key (house_id, template_id, criterion_id)
    );
  `)
}

async function kriterleriBaslat() {
  const countRows = await sorgu('select count(*)::int as count from criteria')
  if (countRows[0].count > 0) return
  let sira = 1
  for (const k of VARSAYILAN_KRITERLER) {
    await sorgu(
      'insert into criteria (id, kategori_id, ad, aciklama, agirlik, aktif, ozel, sira) values ($1,$2,$3,$4,$5,true,false,$6)',
      [k.id, k.kategoriId, k.ad, k.aciklama || '', k.varsayilanAgirlik, sira++]
    )
  }
}

async function genelSablonBaslat() {
  const rows = await sorgu("select id from templates where ad = 'Genel'")
  let templateId = rows[0]?.id
  if (!templateId) {
    const created = await sorgu("insert into templates (ad) values ('Genel') returning id")
    templateId = created[0].id
  }
  const kriterler = await sorgu('select id from criteria where aktif = true')
  for (const k of kriterler) {
    await sorgu(
      'insert into template_criteria (template_id, criterion_id) values ($1,$2) on conflict do nothing',
      [templateId, k.id]
    )
  }
}

function houseMapOlustur(evRows, evTemplateRows, scoreRows) {
  const evMap = new Map(evRows.map(e => [e.id, {
    ...e,
    fiyat: e.fiyat !== null ? Number(e.fiyat) : '',
    templateIds: [],
    puanlarByTemplate: {},
  }]))

  for (const row of evTemplateRows) {
    const ev = evMap.get(row.house_id)
    if (ev) ev.templateIds.push(row.template_id)
  }

  for (const row of scoreRows) {
    const ev = evMap.get(row.house_id)
    if (!ev) continue
    if (!ev.puanlarByTemplate[row.template_id]) ev.puanlarByTemplate[row.template_id] = {}
    ev.puanlarByTemplate[row.template_id][row.criterion_id] = row.score
  }

  return Array.from(evMap.values()).sort((a, b) => new Date(b.olusturulma_tarihi) - new Date(a.olusturulma_tarihi))
}

async function bootstrapYukle() {
  const kriterler = await sorgu('select id, kategori_id, ad, aciklama, agirlik, aktif from criteria order by sira asc, ad asc')
  const sablonlar = await sorgu('select id, ad, olusturulma_tarihi from templates order by olusturulma_tarihi asc')
  const templateKriterRows = await sorgu('select template_id, criterion_id from template_criteria')
  const evRows = await sorgu('select * from houses order by olusturulma_tarihi desc')
  const evTemplateRows = await sorgu('select house_id, template_id from house_templates')
  const scoreRows = await sorgu('select house_id, template_id, criterion_id, score from house_scores')

  const sablonMap = new Map(sablonlar.map(s => [s.id, { ...s, kriterIds: [] }]))
  for (const row of templateKriterRows) {
    const s = sablonMap.get(row.template_id)
    if (s) s.kriterIds.push(row.criterion_id)
  }

  return {
    kriterler: kriterler.map(k => ({
      id: k.id,
      kategoriId: k.kategori_id,
      ad: k.ad,
      aciklama: k.aciklama,
      agirlik: k.agirlik,
      aktif: k.aktif,
    })),
    sablonlar: Array.from(sablonMap.values()),
    evler: houseMapOlustur(evRows, evTemplateRows, scoreRows),
  }
}

app.get('/api/bootstrap', async (_, res) => {
  const data = await bootstrapYukle()
  res.json(data)
})

app.post('/api/criteria', async (req, res) => {
  const id = `ozel_${Date.now()}`
  const { kategoriId, ad, aciklama = '', agirlik = 3, aktif = true } = req.body
  await sorgu(
    'insert into criteria (id, kategori_id, ad, aciklama, agirlik, aktif, ozel, sira) values ($1,$2,$3,$4,$5,$6,true,$7)',
    [id, kategoriId, ad, aciklama, agirlik, aktif, Date.now()]
  )
  res.json({ id, kategoriId, ad, aciklama, agirlik, aktif })
})

app.put('/api/criteria/:id', async (req, res) => {
  const { id } = req.params
  const { kategoriId, ad, aciklama, agirlik, aktif } = req.body
  await sorgu(
    'update criteria set kategori_id=$2, ad=$3, aciklama=$4, agirlik=$5, aktif=$6 where id=$1',
    [id, kategoriId, ad, aciklama, agirlik, aktif]
  )
  res.json({ ok: true })
})

app.delete('/api/criteria/:id', async (req, res) => {
  await sorgu('delete from criteria where id = $1', [req.params.id])
  res.status(204).end()
})

app.post('/api/criteria/reset', async (_, res) => {
  await sorgu('truncate table house_scores, house_templates, template_criteria, templates, criteria restart identity cascade')
  await kriterleriBaslat()
  await genelSablonBaslat()
  res.json(await bootstrapYukle())
})

app.post('/api/templates', async (req, res) => {
  const { ad, kriterIds = [] } = req.body
  const created = await sorgu('insert into templates (ad) values ($1) returning id, ad, olusturulma_tarihi', [ad])
  const template = created[0]
  for (const kriterId of kriterIds) {
    await sorgu('insert into template_criteria (template_id, criterion_id) values ($1,$2) on conflict do nothing', [template.id, kriterId])
  }
  res.json({ ...template, kriterIds })
})

app.put('/api/templates/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { ad, kriterIds = [] } = req.body
  await sorgu('update templates set ad=$2 where id=$1', [id, ad])
  await sorgu('delete from template_criteria where template_id=$1', [id])
  for (const kriterId of kriterIds) {
    await sorgu('insert into template_criteria (template_id, criterion_id) values ($1,$2)', [id, kriterId])
  }
  res.json({ ok: true })
})

app.delete('/api/templates/:id', async (req, res) => {
  await sorgu('delete from templates where id = $1', [Number(req.params.id)])
  res.status(204).end()
})

app.post('/api/houses', async (req, res) => {
  const { ad, adres = '', fiyat = '', tip = 'satilik', not = '', templateIds = [] } = req.body
  const id = `ev_${Date.now()}`
  await sorgu(
    'insert into houses (id, ad, adres, fiyat, tip, not) values ($1,$2,$3,$4,$5,$6)',
    [id, ad, adres, fiyat || null, tip, not]
  )
  for (const templateId of templateIds) {
    await sorgu('insert into house_templates (house_id, template_id) values ($1,$2)', [id, Number(templateId)])
  }
  res.json({ id, ad, adres, fiyat, tip, not, templateIds, puanlarByTemplate: {}, olusturulma_tarihi: new Date().toISOString() })
})

app.put('/api/houses/:id', async (req, res) => {
  const { ad, adres = '', fiyat = '', tip = 'satilik', not = '' } = req.body
  await sorgu('update houses set ad=$2, adres=$3, fiyat=$4, tip=$5, not=$6 where id=$1', [req.params.id, ad, adres, fiyat || null, tip, not])
  res.json({ ok: true })
})

app.delete('/api/houses/:id', async (req, res) => {
  await sorgu('delete from houses where id = $1', [req.params.id])
  res.status(204).end()
})

app.put('/api/houses/:id/templates', async (req, res) => {
  const houseId = req.params.id
  const { templateIds = [] } = req.body
  await sorgu('delete from house_templates where house_id = $1', [houseId])
  for (const templateId of templateIds) {
    await sorgu('insert into house_templates (house_id, template_id) values ($1,$2)', [houseId, Number(templateId)])
  }
  res.json({ ok: true })
})

app.put('/api/houses/:id/scores', async (req, res) => {
  const houseId = req.params.id
  const { templateId, kriterKayitlar } = req.body
  for (const [criterionId, score] of Object.entries(kriterKayitlar || {})) {
    await sorgu(
      'insert into house_scores (house_id, template_id, criterion_id, score) values ($1,$2,$3,$4) on conflict (house_id, template_id, criterion_id) do update set score = excluded.score',
      [houseId, Number(templateId), criterionId, Number(score)]
    )
  }
  res.json({ ok: true })
})

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

async function baslat() {
  await semaHazirla()
  await kriterleriBaslat()
  await genelSablonBaslat()
  app.listen(port, () => {
    console.log(`API hazır: http://localhost:${port}`)
  })
}

baslat().catch((err) => {
  console.error(err)
  process.exit(1)
})
