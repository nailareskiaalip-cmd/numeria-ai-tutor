# Numeria AI Tutor

Aplikasi pembelajaran matematika dengan HTML + JavaScript di frontend dan Node.js sebagai backend aman untuk OpenAI API.

## Fitur
- Chat tanya jawab matematika
- Pembahasan langkah demi langkah
- Petunjuk soal
- Generator latihan soal
- Upload foto soal (vision)
- Pertanyaan suara: rekam dari mikrofon, transkripsi dengan OpenAI
- Membaca jawaban AI dengan fitur text-to-speech bawaan browser (klik dua kali jawaban AI)

## Persyaratan
- Node.js 20 atau lebih baru
- OpenAI API key dan akses/billing API yang aktif
- Koneksi internet
- Browser modern

## Cara menjalankan
1. Ekstrak folder proyek.
2. Buka terminal pada folder `numeria-ai-tutor`.
3. Jalankan:
   ```bash
   npm install
   ```
4. Salin `.env.example` menjadi `.env`.
   - Windows PowerShell: `Copy-Item .env.example .env`
   - macOS/Linux: `cp .env.example .env`
5. Buka `.env`, lalu ganti `isi_api_key_di_sini` dengan API key dari OpenAI Platform.
6. Jalankan:
   ```bash
   npm start
   ```
7. Buka `http://localhost:3000` di Chrome.

## Mengaktifkan suara
- Klik tombol mikrofon, izinkan akses mikrofon, lalu bicara.
- Klik tombol stop untuk mengakhiri rekaman. Teks hasil transkripsi akan masuk ke kotak chat.
- Untuk mendengarkan jawaban, klik dua kali pada gelembung jawaban Numeria.
- Akses mikrofon membutuhkan localhost atau HTTPS. Pada HP, buka alamat server yang memakai HTTPS jika tidak memakai localhost.

## Catatan keamanan dan biaya
- Jangan pernah menaruh API key di `public/index.html` atau JavaScript frontend.
- Jangan mengunggah file `.env` ke GitHub atau membagikannya.
- Permintaan chat, analisis gambar, dan transkripsi menggunakan API dan dapat menimbulkan biaya sesuai pemakaian/model. Atur batas penggunaan di OpenAI Platform.
- Versi contoh ini belum memiliki login siswa, database riwayat permanen, pembatasan pemakaian per siswa, atau deployment publik.
- Untuk penggunaan kelas/sekolah, tambahkan autentikasi, rate limit, moderasi, dan kebijakan privasi sebelum dipublikasikan.
