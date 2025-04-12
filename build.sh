#!/bin/bash

# Pesan pembukaan
echo "=== Memulai proses build untuk deployment ==="

# Install dependencies
echo "Menginstal dependensi..."
npm install

# Build the frontend
echo "Building frontend application..."
npm run build

# Pastikan direktori dist ada
mkdir -p dist

# Copy aset statis, redirects, dan file konfigurasi
echo "Menyalin aset statis dan file konfigurasi..."
cp -r client/public/* dist/

# Siapkan fungsi serverless
echo "Mempersiapkan fungsi serverless..."
mkdir -p functions-build

# Build fungsi serverless dengan format yang tepat untuk deployment
echo "Kompilasi fungsi serverless untuk deployment..."
esbuild functions/server.js --platform=node --packages=external --bundle --format=esm --outfile=functions/server.js --allow-overwrite

# Build sukses
echo "✅ Build selesai dengan sukses!"
echo "Siap untuk deployment ke Netlify atau Cloudflare Pages"
echo "===================================================="