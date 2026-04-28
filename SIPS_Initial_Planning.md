# Project Planning: Sistem Informasi Penomoran Surat (SIPS)

**Document Status:** Draft / Initial Planning
**Project Lead:** Andi Mohamad Nurholis
**Date:** April 2026

---

## 1. Latar Belakang & Tujuan
Saat ini, proses penomoran dan pencatatan surat masih menggunakan sistem manual berbasis spreadsheet (Excel/Google Sheets). Hal ini rentan terhadap *human error* (duplikasi nomor), kesulitan pelacakan, dan keterbatasan dalam manajemen akses.

**Tujuan Proyek:**
Membangun aplikasi web tersentralisasi untuk mengotomatisasi *generate* nomor surat berdasarkan klasifikasi baku, sekaligus bertindak sebagai arsip digital (log book) yang mudah dicari dan di-export.

---

## 2. Ruang Lingkup (Scope of Work)

### Fitur Utama (MVP - Minimum Viable Product)
- [ ] **Otentikasi & Otorisasi:** Login sederhana untuk admin/sekretariat.
- [ ] **Manajemen Master Data:** CRUD (Create, Read, Update, Delete) untuk:
  - Jenis Dokumen (Keputusan, Surat, dll)
  - Kualifikasi (Undangan, Persetujuan, dll)
  - Sub Kualifikasi (Hukum, Organisasi, dll)
- [ ] **Logika Penomoran Otomatis:** Engine untuk men-generate nomor dengan format `[Jenis]/[Kualifikasi]/[Sub]-[YY]-[MM]-[Urut]` dan me-reset nomor urut setiap awal bulan.
- [ ] **Dashboard & Log Surat:** Tampilan tabel (DataTable) untuk melihat riwayat registrasi surat.
- [ ] **Pencarian & Filter:** Filter berdasarkan bulan, tahun, jenis dokumen, atau pencarian teks (perihal/tujuan).

### Fitur Lanjutan (Phase 2 - Opsional)
- [ ] Export data ke Excel/CSV.
- [ ] Upload file lampiran (scan surat fisik).
- [ ] Dashboard analitik (grafik jumlah surat per bulan/kategori).

---

## 3. Spesifikasi Teknologi (Tech Stack)
Dipilih berdasarkan efisiensi *development* dan skalabilitas:
- **Backend Framework:** Laravel 11 (PHP)
- **Frontend / UI:** React via Inertia.js (SPA experience tanpa overhead API routing)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (untuk form, select combobox, datatable, dan modal)
- **Database:** MySQL / PostgreSQL

---

## 4. Timeline & Fase Pengembangan

**Fase 1: Inisiasi & Setup (Estimasi: Hari 1-2)**
- Setup repository & instalasi Laravel + Inertia + React.
- Konfigurasi Tailwind & integrasi Shadcn UI.
- Desain arsitektur database (Migrations & Models).

**Fase 2: Backend & Master Data (Estimasi: Hari 3-4)**
- Pembuatan CRUD untuk tabel referensi (Jenis, Kualifikasi, Sub Kualifikasi).
- Setup routing dan *controller*.
- Pembuatan `SuratService` untuk meng-handle algoritma auto-increment nomor urut.

**Fase 3: Frontend & Integrasi UI (Estimasi: Hari 5-7)**
- Membangun layout utama (Sidebar, Header, Content Area).
- Integrasi *Combobox* Shadcn untuk form input registrasi surat.
- Menampilkan data *Log Surat* menggunakan *DataTable* (pagination & sorting).

**Fase 4: Testing & Deployment (Estimasi: Hari 8-9)**
- Uji coba generate nomor (memastikan tidak ada duplikasi jika diinput bersamaan).
- *User Acceptance Testing* (UAT).
- Persiapan deployment (setup server/hosting, migrasi database).

---

## 5. Kebutuhan Data (Data Requirements)
Untuk *seeding* awal, diperlukan migrasi data dari file Excel lama, meliputi:
1. Daftar lengkap 'Jenis Dokumen' dan singkatan (SHORT).
2. Daftar lengkap 'Kualifikasi' dan singkatan.
3. Daftar lengkap 'Kualifikasi Sub' dan singkatan.

---
*Dokumen ini adalah draf perencanaan awal (high-level) dan dapat disesuaikan seiring berjalannya proses development.*
