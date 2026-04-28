# Panduan Pengembang (Developer Guide)

Dokumen ini berisi informasi teknis untuk pemeliharaan dan pengembangan sistem SIPS lebih lanjut.

## 1. Menjalankan Testing Otomatis
Sistem dilengkapi dengan suite pengujian otomatis untuk menjamin stabilitas fitur utama.

### Cara Menjalankan Tes:
Gunakan perintah berikut di terminal:
```bash
vendor/bin/phpunit tests/Feature/SipsTest.php
```
Atau jika ingin menjalankan seluruh suite:
```bash
php artisan test
```

### Cakupan Tes:
- **SipsTest**: Menguji alur registrasi surat, logika auto-increment nomor, dan validasi bidang dinamis.

## 2. Struktur Model & Mass Assignment
Setiap Model baru yang memiliki kaitan dengan departemen wajib menyertakan `department_id` dan `department` (slug) di dalam array `$fillable`.
Contoh:
```php
protected $fillable = ['department', 'department_id', ...];
```

## 3. Sinkronisasi Global
Data bidang dibagikan secara global melalui `app/Http/Middleware/HandleInertiaRequests.php`. Jika Anda menambah data master global lainnya, tambahkan di metode `share`.

## 4. Konvensi Penomoran
Logika penomoran utama berada di `app/Services/LetterService.php`. Pastikan untuk melakukan testing jika mengubah format nomor agar tidak merusak data yang sudah ada.
