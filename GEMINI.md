# GEMINI.md - Konteks & Instruksi

## Gambaran Umum Proyek

**Nama:** `saas-starter`
**Deskripsi:** Fondasi siap produksi yang skalabel untuk membangun aplikasi SaaS modern.
**Tujuan:** Untuk mempercepat pengembangan SaaS dengan menyediakan fitur-fitur esensial seperti autentikasi, multi-tenancy, billing, dan sistem UI yang solid.

## Tech Stack & Konfigurasi

Proyek ini dikonfigurasi sebagai **modul ESM** (`"type": "module"`).

### Inti

- **Framework:** Next.js 16.1.4 (App Router)
- **Bahasa:** TypeScript v5 (Wajib Strict Mode)
- **Runtime:** Node.js (ESM)

### Frontend & UI

- **Styling:** Tailwind CSS v4
- **Komponen:** shadcn/ui (Gaya New York)
- **Ikon:** Lucide React
- **Tema:** `next-themes` (Wajib mendukung mode Gelap/Terang)
- **Utils:** `clsx`, `tailwind-merge`

### Backend & Data (Direncanakan/Diwajibkan)

_Catatan: Dependensi ini diwajibkan oleh Konstitusi proyek tetapi mungkin belum terinstall di `package.json`._

- **Database:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM
- **Validasi:** Zod
- **Email:** React Email dengan Nodemailer/Resend

## Standar Pengembangan (Konstitusi)

Patuhi dengan ketat aturan yang didefinisikan dalam `.specify/memory/constitution.md`.

1.  **Kualitas Kode:**
    - **Strict TypeScript:** Tidak boleh ada `any` implisit. `any` eksplisit memerlukan justifikasi.
    - **Hanya ESM:** Gunakan `import`/`export`.
    - **Linting:** Toleransi nol untuk error atau warning ESLint di CI.
    - **Pemformatan:** Prettier (tanda kutip tunggal, tanpa titik koma, tab 2 spasi).

2.  **UI/UX:**
    - **Shadcn/UI:** Harus digunakan sebagai basis komponen.
    - **Responsivitas:** Pendekatan mobile-first.
    - **Aksesibilitas:** Wajib mematuhi navigasi keyboard dan kontras.

3.  **Arsitektur:**
    - **Next.js App Router:** Gunakan Server Components secara default.
    - **Multi-Tenancy:** Arsitektur harus mendukung isolasi data berbasis organisasi.

## Struktur Proyek

```text
/
├── app/                 # Halaman dan layout Next.js App Router
├── components/
│   └── ui/              # Komponen shadcn/ui
├── lib/
│   └── utils.ts         # Fungsi utilitas (cn helper)
├── .specify/            # Aturan proyek, memori, dan template
├── .gemini/             # Konfigurasi AI Agent
├── next.config.ts       # Konfigurasi Next.js
├── package.json         # Dependensi dan skrip proyek
└── README.md            # Dokumen Kebutuhan Produk (PRD)
```

## Perintah Utama

| Perintah        | Deskripsi                         |
| :-------------- | :-------------------------------- |
| `npm run dev`   | Menjalankan server pengembangan   |
| `npm run build` | Membangun aplikasi untuk produksi |
| `npm run start` | Menjalankan server produksi       |
| `npm run lint`  | Menjalankan ESLint                |

## Status Saat Ini & Langkah Selanjutnya

- **Scaffolding Frontend:** Selesai dengan Next.js 16, Tailwind v4, dan Shadcn UI.
- **Setup Backend:** **Pending.** Supabase dan Drizzle didefinisikan dalam kebutuhan tetapi belum ada di `package.json`.
- **Tugas Mendesak:** Proyek berada dalam fase "starter". Tugas selanjutnya kemungkinan akan melibatkan integrasi stack backend (Supabase/Drizzle) dan mengimplementasikan fitur autentikasi/multi-tenancy yang dijelaskan dalam README.
