# Panduan publikasi Numeria AI Tutor agar bisa dibuka siswa melalui HP

Project ini menggunakan Render sebagai hosting Node.js. Setelah deploy berhasil, Render memberi URL HTTPS yang dapat dibuka dari HP.

## 1. Siapkan akun dan API key
- Buat akun GitHub: https://github.com
- Buat akun Render: https://render.com
- Buat API key OpenAI: https://platform.openai.com/api-keys
- Pastikan project API OpenAI memiliki billing/limit penggunaan yang sesuai. API key adalah rahasia; jangan kirimkan melalui chat atau masukkan ke file HTML.

## 2. Unggah project ke GitHub
1. Download dan ekstrak `numeria_ai_tutor_online_package.zip`.
2. Buat repository baru di GitHub, misalnya `numeria-ai-tutor`. Pilih Private bila source code ingin dibatasi.
3. Upload seluruh isi folder project ke root repository. Pastikan `server.js`, `package.json`, `render.yaml`, dan folder `public` terlihat di root.
4. Jangan unggah file `.env` yang berisi API key. File `.gitignore` sudah mengabaikan `.env`.

## 3. Deploy ke Render menggunakan Blueprint
1. Masuk ke https://dashboard.render.com
2. Pilih **New** → **Blueprint**.
3. Hubungkan akun GitHub jika diminta, lalu pilih repository `numeria-ai-tutor`.
4. Render akan membaca `render.yaml`. Periksa konfigurasi service.
5. Saat diminta nilai `OPENAI_API_KEY`, masukkan API key OpenAI langsung pada kolom rahasia Render. Jangan masukkan ke source code.
6. Klik deploy/apply dan tunggu proses build sampai statusnya **Live**.

Jika menu Blueprint tidak tersedia, gunakan **New → Web Service**, pilih repository, lalu atur:
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Environment Variables:
  - `OPENAI_API_KEY` = API key rahasia
  - `OPENAI_MODEL` = `gpt-4.1-mini`
  - `NODE_VERSION` = `20`

## 4. Buka melalui HP dan tes
1. Salin URL HTTPS yang diberikan Render, bentuknya seperti `https://nama-service.onrender.com`.
2. Buka URL tersebut dari Chrome di HP.
3. Tes chat: `Jelaskan pola bilangan 2, 4, 6, 8`.
4. Tes mode Bahas Langkah, Petunjuk, dan Latihan.
5. Tes upload foto soal.
6. Tes mikrofon dan izinkan akses microphone. Fitur mikrofon memerlukan HTTPS atau localhost.
7. Cek `https://URL-RENDER/api/health`. Hasil normal adalah `ok: true` dan `apiKeyConfigured: true`.

## 5. Sebelum link dibagikan ke siswa
- Batasi pengeluaran dan pantau pemakaian API di OpenAI Platform.
- Render Free Web Services dapat tidur setelah 15 menit tidak aktif dan membutuhkan waktu untuk bangun kembali. Pertimbangkan paket berbayar bila harus selalu siap untuk jam pelajaran.
- Untuk penggunaan siswa, tambahkan autentikasi/kode kelas, rate limiting, kebijakan privasi, dan pembatasan pemakaian agar API tidak disalahgunakan.
- Jangan meminta atau menyimpan data pribadi siswa. Beri tahu siswa bahwa pesan dan foto soal diproses oleh layanan AI.
- Uji beberapa contoh soal dan periksa ketepatan jawaban sebelum digunakan di kelas.

## Yang belum bisa dilakukan otomatis dari sini
Aku tidak bisa masuk ke akun GitHub, Render, atau OpenAI milikmu dan menerbitkan URL publik tanpa tindakan/izin akun darimu. Setelah repository dibuat dan API key dimasukkan ke Render, proses deploy bisa kamu jalankan mengikuti langkah di atas.
