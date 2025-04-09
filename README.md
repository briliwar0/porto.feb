# Portfolio Website - Febri

Sebuah portfolio website modern dengan animasi interaktif, tema gelap/terang, dan backend database PostgreSQL.

## Fitur

- Design Modern dan Responsif
- Tema Gelap/Terang
- Animasi menggunakan Framer Motion
- Efek Partikel Interaktif
- Bagian Portfolio yang dapat difilter
- Formulir Kontak dengan validasi
- Backend database PostgreSQL

## Teknologi

- React dengan TypeScript
- TailwindCSS dan ShadcnUI
- Framer Motion untuk animasi
- Express.js sebagai backend
- PostgreSQL untuk database
- Drizzle ORM

## Deploy ke Netlify

### Menggunakan GitHub

1. Push kode ke repositori GitHub Anda
2. Login ke Netlify dan klik "New site from Git"
3. Pilih repositori GitHub Anda
4. Konfigurasi pengaturan build:
   - Build command: `./build.sh`
   - Publish directory: `dist`
5. Klik "Deploy site"

### Variabel Lingkungan

Tambahkan variabel lingkungan berikut di Netlify:

- `DATABASE_URL`: URL database PostgreSQL Anda

## Pengembangan Lokal

1. Clone repositori
2. Instal dependensi: `npm install`
3. Jalankan pengembangan lokal: `npm run dev`

## Kustomisasi

Data personal ada di `client/src/lib/constants.ts`.