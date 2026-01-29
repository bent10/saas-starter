# Technical Design Document (TDD)

Dokumen ini menjelaskan desain teknis untuk modul utama pada SaaS Starter Template, yaitu **Authentication**, **Multi-Tenancy**, **Billing**, dan **Settings**. TDD ini menjadi jembatan antara PRD dan implementasi teknis agar pengembangan konsisten, terukur, dan mudah diskalakan.

## 0. Project Setup & Architecture

### 0.1 Tujuan

Mendefinisikan setup awal proyek sebagai fondasi yang konsisten, scalable, dan siap produksi sebelum pengembangan fitur inti.

### 0.2 Struktur Proyek

- Framework: Next.js (App Router)
- Struktur berbasis domain/module
- Pemisahan jelas antara:
  - app (routing & UI)
  - features (auth, org, billing, settings)
  - shared (components, hooks, utils)
  - lib (config, integrations)

### 0.3 Environment & Configuration

- Environment variables terkelola (.env.example)
- Konfigurasi terpisah untuk dev, staging, production
- Validasi env menggunakan Zod

### 0.4 Database & Migration

- PostgreSQL (Supabase self-hosted)
- Schema dikelola via Drizzle ORM
- Migration versioned & repeatable
- Seed data untuk development

### 0.5 Authentication Bootstrap

- Supabase Auth initialization
- Session handling via middleware
- Proteksi route berbasis auth & organization context

### 0.6 Internationalization (i18n)

- Library i18n terpusat (mis. next-intl)
- Translation berbasis key
- Language preference per user & organization
- Default & fallback language

### 0.7 Styling & Design System Setup

- Tailwind CSS configuration
- shadcn/ui component registry
- Theme tokens (light/dark)
- Global styles & CSS variables

### 0.8 Code Quality & Tooling

- TypeScript strict mode
- ESLint & Prettier
- Git hooks (lint & type-check)
- Commit convention

### 0.9 Testing Foundation

- Unit test setup
- Integration test setup
- Test utilities & mocks

### 0.10 CI/CD Readiness

- Build & test pipeline baseline
- Environment secret handling
- Deployment target readiness

## 1. Authentication (Auth)

### 1.1 Tujuan

Menyediakan sistem autentikasi yang aman, fleksibel, dan siap produksi untuk berbagai tipe pengguna.

### 1.2 Ruang Lingkup

- Email & Password
- Social Sign-in (Google, Microsoft, extensible)
- Multi-Factor Authentication (MFA / 2FA)
- Session Management
- Account Linking

### 1.3 Arsitektur Teknis

- **Auth Provider**: Supabase Auth (self-hosted)
- **Client**: Next.js App Router
- **Session**: JWT + HttpOnly Cookies

### 1.4 Alur Utama

1. User mendaftar / login
2. Supabase memverifikasi kredensial
3. Session token dibuat
4. Token digunakan untuk request selanjutnya

### 1.5 Keamanan

- Password hashing (bcrypt / argon2)
- Rate limiting login
- Email verification wajib
- MFA berbasis TOTP

### 1.6 Error Handling

- Pesan error generik untuk auth failure
- Logging detail di server

## 2. Multi-Tenancy

### 2.1 Tujuan

Memungkinkan satu user memiliki atau bergabung dengan banyak organisasi (tenant).

### 2.2 Model Data (High Level)

- User
- Organization
- OrganizationMember

### 2.3 Strategi Multi-Tenancy

- **Single database, shared schema**
- Semua data terikat `organization_id`

### 2.4 Role & Permission

- Owner
- Admin
- Member
- Custom roles (extensible)

### 2.5 Invitation Flow

1. Admin mengirim undangan
2. Token invitation dibuat
3. User menerima & accept
4. Membership aktif

### 2.6 Transfer Ownership

- Hanya Owner yang bisa transfer
- Ownership harus selalu satu

## 3. Billing & Payments

### 3.1 Tujuan

Mengelola langganan, pembayaran, dan akses fitur berbasis paket.

### 3.2 Payment Provider

- Stripe (default)

### 3.3 Model Billing

- Per Organization
- Per Seat
- Usage-based (metered)

### 3.4 Komponen Teknis

- Stripe Checkout
- Stripe Customer & Subscription
- Webhook Handler

### 3.5 Billing Portal

- View invoice
- Update payment method
- Upgrade / downgrade plan

### 3.6 Feature Gating

- Middleware berbasis plan & role
- Evaluasi di server-side

### 3.7 Keamanan

- Webhook signature verification
- Idempotency key

## 4. Settings

### 4.1 Tujuan

Memberikan kontrol kepada user dan organisasi atas konfigurasi akun dan aplikasi.

### 4.2 User Settings

- Profile
- Email
- Password
- MFA
- Theme (light / dark)

### 4.3 Organization Settings

- Nama & metadata
- Member management
- Role management
- Billing info

### 4.4 Penyimpanan Konfigurasi

- Database (Postgres)
- Feature flags (optional)

### 4.5 Internationalization (i18n)

- Dukungan multi-bahasa di seluruh aplikasi (UI, email, dan notifikasi)
- Deteksi bahasa otomatis dari browser dengan override dari user settings
- Preferensi bahasa per pengguna dan per organisasi
- Sistem translation berbasis key (tanpa hardcoded text)
- Mendukung dynamic language switching tanpa reload halaman
- Fallback language jika terjemahan tidak tersedia
- Template email dan pesan sistem siap untuk multi-bahasa

## 5. Non-Functional Requirements

### 5.1 Performance

- Auth response < 300ms
- Billing webhook < 1s

### 5.2 Scalability

- Stateless API
- Horizontal scaling friendly

### 5.3 Maintainability

- Modular folder structure
- Strict typing (TypeScript)

## 6. Open Questions / Future Improvements

- SSO (SAML)
- Audit logs
- Fine-grained permission system

Dokumen ini menjadi acuan utama sebelum implementasi dan dapat diperluas seiring bertambahnya kebutuhan produk.
