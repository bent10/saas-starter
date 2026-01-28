<!--
Laporan Dampak Sinkronisasi:
- Perubahan Versi: 1.1.0 → 1.2.0
- Prinsip Dimodifikasi:
  - V. Stack Teknologi & Infrastruktur (Baru: Mandat Supabase, Drizzle, Zod, Email, dan Multi-Tenancy)
- Bagian Ditambahkan: Prinsip V
- Bagian Dihapus: T/A
- Status Template:
  - .specify/templates/plan-template.md: ✅ Kompatibel
  - .specify/templates/spec-template.md: ✅ Kompatibel
  - .specify/templates/tasks-template.md: ✅ Kompatibel
-->

# Konstitusi saas-starter

## Prinsip Utama

### I. Kualitas Kode & Gaya

**Kode harus konsisten, mudah dibaca, dan bertipe ketat.**

- **Pemformatan**: Patuhi konfigurasi Prettier proyek secara ketat (single quotes, tanpa titik koma, lebar tab 2 spasi).
- **Keamanan Tipe**: TypeScript strict mode wajib. Tidak boleh ada `any` eksplisit tanpa justifikasi yang terdokumentasi.
- **Linting**: Kesalahan (error) ESLint harus diselesaikan sebelum penggabungan (merge). Tidak ada toleransi untuk peringatan (warnings) di CI.
- **Sistem Modul**: Gunakan ESM (`import`/`export`) secara eksklusif. Gunakan impor dinamis untuk lazy loading jika bermanfaat.

### II. Desain Frontend, UX & Aksesibilitas

**Ciptakan antarmuka produksi yang inklusif, konsisten, dan berestetika tinggi.**

- **Stack Teknologi UI**: Wajib menggunakan **shadcn/ui** sebagai basis komponen, **Tailwind CSS** untuk styling, dan **Lucide Icons**.
- **Sistem Desain & Tema**: Implementasikan sistem desain yang skalabel. Dukungan **Light & Dark Mode** (dengan toggle dan persistensi) adalah WAJIB.
- **Aksesibilitas (A11y)**: Penuhi standar aksesibilitas dasar. Pastikan navigasi keyboard, state fokus yang jelas, dan rasio kontras warna yang memadai.
- **Estetika Berani (Bold)**: Berkomitmen pada arah konseptual yang jelas. Hindari pilihan generik "AI slop". Gunakan tipografi khas dan palet warna kohesif.
- **Mobile-First & Responsif**: Desain harus adaptif untuk mobile, tablet, dan desktop. Mulai dari layar terkecil (mobile-first).
- **Gerakan & Kedalaman**: Gunakan animasi (CSS/Motion) dan komposisi spasial (layering, bayangan) untuk meningkatkan pengalaman pengguna.

### III. Pengujian & Keandalan

**Keandalan tidak dapat ditawar untuk SaaS yang skalabel.**

- **Jalur Kritis**: Autentikasi pengguna, pembayaran, dan logika bisnis inti HARUS memiliki cakupan pengujian otomatis.
- **Pola Pikir Test-First**: Pengujian SEHARUSNYA ditulis atau direncanakan sebelum implementasi untuk logika yang kompleks.
- **Regresi**: Fitur baru TIDAK BOLEH merusak fungsionalitas yang ada. Jalankan rangkaian pengujian yang relevan sebelum melakukan push.

### IV. Performa & Skalabilitas

**Performa adalah fitur; aplikasi harus tetap cepat saat berkembang.**

- **Web Vitals**: Targetkan Core Web Vitals hijau (LCP, CLS, INP).
- **Komponen Server**: Utamakan Next.js Server Components untuk pengambilan data dan rendering berat guna mengurangi ukuran bundle klien.
- **Optimasi**: Optimalkan gambar, font, dan skrip. Lazy load komponen non-kritis.

### V. Stack Teknologi & Infrastruktur

**Gunakan stack yang telah ditentukan untuk menjamin integrasi dan skalabilitas.**

- **Backend & Database**: Wajib menggunakan **Supabase** (PostgreSQL, Auth) dan **Drizzle ORM** untuk manajemen data.
- **Validasi Data**: Gunakan **Zod** untuk validasi skema runtime (frontend & backend).
- **Email System**: Gunakan **React Email** untuk template dan **Nodemailer** atau **Resend** untuk pengiriman.
- **Multi-Tenancy**: Arsitektur harus mendukung isolasi data berbasis organisasi (organization-based isolation) sejak awal.

## Tata Kelola

### Proses Amandemen

- Perubahan yang diusulkan pada konstitusi ini harus ditinjau oleh pimpinan proyek.
- Perubahan pada "Prinsip Utama" memerlukan kenaikan versi MINOR.
- Klarifikasi atau pembaruan non-semantik memerlukan kenaikan versi PATCH.

### Kepatuhan

- **Fase Perencanaan**: Setiap rencana fitur harus secara eksplisit memeriksa prinsip-prinsip ini di bagian "Cek Konstitusi".
- **Code Review**: PR harus diverifikasi terhadap prinsip Kualitas Kode dan Desain.
- **Panduan Runtime**: Lihat `README.md` dan `.specify/templates/` untuk detail operasional.

**Versi**: 1.2.0 | **Diratifikasi**: 2026-01-27 | **Terakhir Diamandemen**: 2026-01-27