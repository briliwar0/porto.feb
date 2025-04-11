# Portfolio Website - Febri

Sebuah portfolio website modern dengan animasi interaktif, tema gelap/terang, backend database PostgreSQL, dan sistem web analytics untuk pelacakan pengunjung yang komprehensif.

## Fitur

- Design Modern dan Responsif
- Tema Gelap/Terang
- Animasi menggunakan Framer Motion
- Efek Partikel Interaktif
- Bagian Portfolio yang dapat difilter
- Formulir Kontak dengan validasi
- Backend database PostgreSQL
- Web Analytics dengan pelacakan pengunjung
- GeoIP tracking untuk data lokasi pengunjung
- Pelacakan waktu kunjungan halaman
- Dashboard admin untuk visualisasi data pengunjung

## Teknologi

- React dengan TypeScript
- TailwindCSS dan ShadcnUI
- Framer Motion untuk animasi
- Express.js sebagai backend
- PostgreSQL untuk database
- Drizzle ORM
- MaxMind GeoIP2 untuk deteksi lokasi pengunjung
- React Query untuk fetching data
- Recharts untuk visualisasi data analytics

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

- `DATABASE_URL`: URL database PostgreSQL Anda (wajib)
- `OPENAI_API_KEY`: API key OpenAI untuk generasi palet warna (opsional)
- `STRIPE_SECRET_KEY`: API key Stripe untuk pemrosesan pembayaran (opsional)

## Deploy ke Cloudflare Pages

### Menggunakan GitHub

1. Push kode ke repositori GitHub Anda
2. Login ke dashboard Cloudflare
3. Pilih "Pages" dari menu utama
4. Klik "Create a project" dan pilih "Connect to Git"
5. Pilih repositori GitHub Anda
6. Konfigurasi pengaturan build:
   - Framework preset: None
   - Build command: `./build.sh`
   - Build output directory: `dist`
   - Root directory: `/` (root direktori project)
   - Node.js version: 20 (atau versi terbaru yang didukung)
7. Klik "Save and Deploy"

### Konfigurasi Functions

Untuk mengaktifkan API serverless di Cloudflare Pages:

1. Di dashboard project Pages, pilih "Settings" > "Functions"
2. Pastikan "Functions" diaktifkan
3. Di bagian "Compatibility date", masukkan tanggal saat ini
4. Set "Node.js compatibility flag" ke enabled 
5. Klik "Save"

### Catatan File Khusus Cloudflare

Repository ini sudah berisi beberapa file khusus untuk Cloudflare Pages:

- `cloudflare.toml` - Konfigurasi utama untuk Cloudflare Pages
- `wrangler.toml` - Konfigurasi untuk Cloudflare Workers
- `functions/_routes.json` - Routing untuk serverless functions
- `functions/_redirects` - Aturan pengalihan untuk SPA
- `functions/_headers` - Header HTTP untuk keamanan
- `client/public/_routes.json` - Routing khusus untuk aset statis
- `client/public/_worker.js` - Worker khusus untuk SPA routing
- `.cloudflare/workers-site/` - Konfigurasi tambahan untuk Workers

### Variabel Lingkungan

Tambahkan variabel lingkungan berikut di Cloudflare Pages:

1. Di dashboard project Pages, pilih "Settings" > "Environment variables"
2. Tambahkan variabel yang sama seperti di Netlify:
   - `DATABASE_URL`: URL database PostgreSQL Anda (wajib)
   - `OPENAI_API_KEY`: API key OpenAI untuk generasi palet warna (opsional)
   - `STRIPE_SECRET_KEY`: API key Stripe untuk pemrosesan pembayaran (opsional)
3. Klik "Save"

### Setup Database untuk Cloudflare Pages

Karena Cloudflare Pages hanya mengizinkan koneksi ke database melalui koneksi berenkripsi TLS/SSL yang valid, Anda perlu menggunakan layanan database cloud yang mendukung koneksi SSL seperti:

1. **Neon** - [neon.tech](https://neon.tech) - PostgreSQL serverless database
   - Mendukung koneksi edge dari Cloudflare Pages
   - Menyediakan string koneksi yang kompatibel
   - Ada tier gratis untuk penggunaan kecil

2. **Supabase** - [supabase.com](https://supabase.com)
   - Menyediakan PostgreSQL terkelola dengan koneksi SSL
   - Mendukung koneksi edge dari Cloudflare Pages 

3. **Vercel Postgres** - [vercel.com/storage/postgres](https://vercel.com/storage/postgres)
   - Terintegrasi dengan Vercel tapi bisa dipakai di Cloudflare Pages
   - Mendukung koneksi SSL/TLS

Setelah membuat database di salah satu layanan tersebut, gunakan URL koneksi yang disediakan sebagai nilai `DATABASE_URL` di variabel lingkungan.

**Catatan**: Pastikan URL koneksi menyertakan parameter SSL yang diperlukan, contoh:
```
postgresql://username:password@host:port/dbname?sslmode=require
```

## Pengembangan Lokal

1. Clone repositori
2. Instal dependensi: `npm install`
3. Siapkan file `.env` dengan variabel lingkungan yang diperlukan:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   OPENAI_API_KEY=sk-your-api-key (opsional)
   STRIPE_SECRET_KEY=sk_test_your-api-key (opsional)
   ```
4. Jalankan migrasi database: `npm run db:push`
5. Jalankan pengembangan lokal: `npm run dev`

### Migrasi Database

Sistem ini menggunakan Drizzle ORM untuk pengelolaan database. Untuk memperbarui skema database:

1. Edit definisi skema di `shared/schema.ts`
2. Jalankan command: `npm run db:push`

> **Catatan**: Command `db:push` akan langsung memperbarui struktur database tanpa membuat file migrasi terpisah. Harap berhati-hati jika ada data penting.

## Kustomisasi

Data personal ada di `client/src/lib/constants.ts`.

## Web Analytics & Statistik Pengunjung

Website ini dilengkapi dengan sistem analytics terintegrasi yang melacak:

- Jumlah total pengunjung dan pengunjung unik
- Lokasi pengunjung berdasarkan negara menggunakan GeoIP
- Informasi browser, sistem operasi, dan perangkat pengunjung
- Halaman yang paling banyak dikunjungi
- Rata-rata waktu yang dihabiskan di setiap halaman
- Bounce rate (tingkat pentalan) keseluruhan situs
- Halaman masuk (entry page) dan keluar (exit page) pengunjung

Semua data analytics dapat dilihat di dashboard admin pada halaman `/admin` (memerlukan login).

## API Opsional

Website ini mendukung beberapa integrasi API opsional:

- **OpenAI API**: Untuk fitur generasi palet warna. Tanpa API key, sistem akan menggunakan fallback ke palet warna predefined.
- **Stripe API**: Untuk pemrosesan pembayaran. Tanpa API key, sistem tetap berfungsi tanpa fitur pembayaran.

Untuk mengaktifkan API ini, tambahkan variabel lingkungan berikut:

- `OPENAI_API_KEY`: Untuk integrasi dengan OpenAI
- `STRIPE_SECRET_KEY`: Untuk integrasi dengan Stripe

## Analytics API

Website ini menyediakan API endpoints untuk mengakses data analytics:

### Visitor Analytics

- `GET /api/visitors` - Mendapatkan statistik pengunjung (total, unik, per negara, dll)
- `GET /api/visitors/list` - Mendapatkan daftar pengunjung dengan detail

### Page Visit Analytics

- `GET /api/pagevisits` - Mendapatkan statistik kunjungan halaman (halaman populer, bounce rate, dll)
- `GET /api/pagevisits/list` - Mendapatkan daftar kunjungan halaman dengan detail
- `POST /api/pagevisits/update-time` - Memperbarui waktu yang dihabiskan pada halaman tertentu

Data yang dikirim dari API ini dapat digunakan untuk membuat visualisasi custom atau diintegrasikan dengan sistem analytics pihak ketiga.

## Privasi Data

Sistem analytics ini dirancang dengan memperhatikan privasi pengguna:

- Tidak menggunakan cookies untuk pelacakan
- Hanya mengumpulkan informasi teknis (browser, OS, lokasi negara)
- Tidak melakukan cross-site tracking
- Tidak mengumpulkan informasi pribadi pengguna (nama, email, dll) kecuali pengguna mengisi form kontak
- Data analitik hanya tersedia bagi administrator situs