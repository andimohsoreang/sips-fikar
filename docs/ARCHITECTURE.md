# Arsitektur Bidang Dinamis (Dynamic Department)

Sistem SIPS kini menggunakan arsitektur **Data-Driven** untuk pengelolaan departemen/bidang. Ini berarti tidak ada lagi departemen yang dikunci di dalam kode program (*hardcoded*).

## 1. Tabel Master Bidang (`departments`)
Seluruh departemen dikelola di tabel ini dengan struktur:
- `id`: Primary Key.
- `name`: Nama lengkap departemen (misal: Sekretariat Dewan Komisaris).
- `slug`: Identifier unik dalam format teks kecil (misal: `sekretariat`). Digunakan untuk filter dan URL.
- `color`: Tema warna UI (misal: `supabase`, `indigo`, `slate`).

## 2. Relasi Global
Seluruh tabel transaksi dan master data lainnya kini terhubung melalui `department_id`:
- `letters` (Surat)
- `document_types` (Jenis Dokumen)
- `classifications` (Kualifikasi)
- `sub_classifications` (Sub Kualifikasi)
- `recipients` (Master Tujuan)

## 3. Sinkronisasi Global via Inertia
Daftar departemen dibagikan ke seluruh halaman Frontend menggunakan **Inertia Shared Props** melalui `HandleInertiaRequests.php`. Hal ini memastikan:
- Filter tab di atas tabel selalu sinkron.
- Dropdown pilihan bidang di setiap modal selalu terbaru.
- Perubahan nama bidang di Master Bidang akan langsung berdampak ke seluruh aplikasi.

## 4. Keuntungan Arsitektur Ini
- **Skalabilitas**: Jika organisasi menambah divisi baru, Admin cukup menambahkannya di menu Master Bidang.
- **Fleksibilitas**: Setiap divisi memiliki isolasi data yang kuat namun tetap dalam satu alur kerja yang seragam.
- **Visual**: Setiap divisi memiliki identitas warna yang unik untuk memudahkan pembedaan data di tabel.

## 5. Arsitektur Pengujian (Testing)
Sistem menggunakan **PHPUnit** untuk pengujian otomatis:
- **Unit Testing**: Memastikan logika penomoran surat akurat.
- **Feature Testing**: Menguji interaksi antara Request, Controller, dan Database.
- **Database Refreshing**: Setiap tes berjalan di database yang bersih menggunakan trait `RefreshDatabase` untuk menjamin hasil pengujian yang valid dan konsisten.

