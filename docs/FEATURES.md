# Panduan Fitur SIPS (Sistem Informasi Penomoran Surat)

Sistem ini dirancang dengan antarmuka premium yang mengutamakan kecepatan dan akurasi data antar bidang.

## 1. Registrasi Nomor Surat
Fitur utama untuk menghasilkan nomor surat secara otomatis berdasarkan bidang yang dipilih.
- **Auto-Numbering**: Sistem mendeteksi urutan terakhir berdasarkan Bidang + Tahun + Jenis Dokumen.
- **Smart Loader**: Saat mengganti bidang, sistem melakukan sinkronisasi data master (Kualifikasi, Jenis Dokumen) secara real-time.
- **Preview Nomor**: Nomor surat lengkap (Full Number) dihasilkan secara dinamis sebelum disimpan.

## 2. Generate & Cetak Surat Undangan Rapat
Fitur untuk menghasilkan surat undangan rapat resmi dalam format cetak maupun PDF.
- **Form Dinamis**: Pengguna mengisi detail rapat (tanggal, waktu, tempat, agenda, dresscode) sebelum surat di-generate.
- **Kop Surat Otomatis**: Tampilan surat sudah dilengkapi kop resmi Dewan Komisaris PT Reska Multi Usaha.
- **Preview Cetak**: Surat ditampilkan dalam layout A4 siap cetak dengan tombol Print Browser.
- **Export PDF Terpisah**: Tombol Export PDF menghasilkan file `.pdf` yang dapat didownload langsung.
- **Penandatangan Dinamis**: Nama dan jabatan penandatangan bisa diisi secara bebas.
- **Tembusan Multiple**: Bisa menambahkan satu atau lebih tembusan secara fleksibel.

## 2. Master Bidang & Departemen
Pusat kendali seluruh aplikasi.
- **Pengaturan Tema**: Memungkinkan pemilihan warna identitas untuk setiap departemen.
- **Manajemen Slug**: Menghasilkan slug otomatis untuk kebutuhan sistem internal.

## 3. Master Data Flat (Non-Hierarkis)
Sesuai kebutuhan operasional, sistem menggunakan struktur data flat yang fleksibel:
- **Jenis Dokumen**: Kategori fisik surat (Keputusan, Surat, Laporan, dsb).
- **Kualifikasi**: Kategori utama penomoran (Tanggapan, Persetujuan, Evaluasi, dsb).
- **Sub Kualifikasi**: Spesifikasi detail (Hukum, Keuangan, Operasional, dsb).
- **Master Tujuan**: Daftar penerima surat yang sering digunakan per bidang.

## 4. Sistem Tabel Premium (`SupabaseTable`)
Antarmuka tabel yang canggih dengan fitur:
- **Filter Pills**: Tab bidang di bagian atas untuk penyaringan instan.
- **Live Search**: Pencarian cepat di seluruh kolom tabel.
- **Pagination**: Navigasi data yang rapi untuk ribuan record.
- **Responsive Design**: Tampilan yang menyesuaikan dengan perangkat pengguna.

## 5. Automated Quality Assurance (Testing)
Sistem memiliki lapisan pengujian otomatis untuk memastikan keandalan jangka panjang:
- **Feature Verification**: Menjamin alur registrasi surat selalu berjalan 100%.
- **Data Integrity Tests**: Memastikan sinkronisasi antar bidang tidak pernah bentrok.
- **Regression Testing**: Mencegah fitur yang sudah ada menjadi rusak saat ada pembaruan kode di masa depan.

