# SIPS - Sistem Informasi Penomoran Surat

Sistem ini dirancang untuk mengotomatisasi penomoran surat berdasarkan klasifikasi dokumen, kualifikasi, dan sub-kualifikasi sesuai standar organisasi.

## 🛠 Tech Stack
- **Backend:** Laravel 11 (PHP 8.3)
- **Frontend:** React + Inertia.js
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** MySQL / PostgreSQL

---

## 📊 Arsitektur Database (ERD)

### 1. Master Data (Reference Tables)
Tabel-tabel ini menyimpan kode singkatan (Short Codes).

**`document_types`**
| Column | Type | Description |
| :--- | :--- | :--- |
| id | bigint | Primary Key |
| name | string | Contoh: "Keputusan", "Surat" |
| code | string | Contoh: "KEP", "SRT" |

**`classifications`**
| Column | Type | Description |
| :--- | :--- | :--- |
| id | bigint | Primary Key |
| name | string | Contoh: "Undangan", "Persetujuan" |
| code | string | Contoh: "UND", "APP" |

**`sub_classifications`**
| Column | Type | Description |
| :--- | :--- | :--- |
| id | bigint | Primary Key |
| name | string | Contoh: "Organisasi", "Rapat BOC" |
| code | string | Contoh: "KT", "KR" |

### 2. Transaction Table
**`letters`**
| Column | Type | Description |
| :--- | :--- | :--- |
| id | uuid | Primary Key |
| date | date | Tanggal Surat |
| document_type_id | foreignId | Relasi ke `document_types` |
| classification_id | foreignId | Relasi ke `classifications` |
| sub_classification_id| foreignId | Relasi ke `sub_classifications` |
| recipient | string | Tujuan Surat |
| subject | text | Perihal |
| sequence_number | integer | Nomor urut (Reset per bulan/tahun) |
| full_number | string | Final String (Unique) |

---

## 🧠 Logika Penomoran (Service Layer)

Format: `[TYPE]/[CLASS]/[SUB]-[YY]-[MM]-[SEQ]`

### Algoritma Generate:
1. Ambil kode singkatan dari 3 tabel master.
2. Ambil 2 digit tahun dan 2 digit bulan dari `date`.
3. Hitung `sequence_number`:
   ```sql
   SELECT MAX(sequence_number) FROM letters 
   WHERE MONTH(date) = $selectedMonth 
   AND YEAR(date) = $selectedYear
   ```
4. Jika `null`, set `1`. Jika ada, `+1`.

---

## 💻 Implementasi Kode (Laravel)

### 1. Migration (Letters)
```php
Schema::create('letters', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->date('letter_date');
    $table->foreignId('document_type_id')->constrained();
    $table->foreignId('classification_id')->constrained();
    $table->foreignId('sub_classification_id')->constrained();
    $table->string('recipient');
    $table->text('subject');
    $table->integer('sequence_number');
    $table->string('full_number')->unique();
    $table->timestamps();
});
```

### 2. LetterService.php (The "Brain")
```php
public function generateFullNumber($data) 
{
    $type = DocumentType::find($data['document_type_id'])->code;
    $class = Classification::find($data['classification_id'])->code;
    $sub = SubClassification::find($data['sub_classification_id'])->code;
    
    $date = Carbon::parse($data['letter_date']);
    $year = $date->format('y');
    $month = $date->format('m');

    $lastSeq = Letter::whereYear('letter_date', $date->year)
                     ->whereMonth('letter_date', $date->month)
                     ->max('sequence_number') ?? 0;
    
    $newSeq = $lastSeq + 1;

    return "{$type}/{$class}/{$sub}-{$year}-{$month}-{$newSeq}";
}
```

---

## 🎨 UI/UX Component (Shadcn + React)

### Form Input Utama
Menggunakan `Combobox` dari Shadcn untuk pemilihan Master Data agar user bisa melakukan pencarian teks dengan cepat.

```jsx
// Frontend Snippet
const { data, setData, post } = useForm({
    letter_date: '',
    document_type_id: '',
    classification_id: '',
    sub_classification_id: '',
    recipient: '',
    subject: '',
});

return (
    <form onSubmit={submit}>
        <DatePicker value={data.letter_date} onChange={val => setData('letter_date', val)} />
        <SelectComponent label="Jenis Dokumen" options={types} />
        {/* ... component lainnya ... */}
        <Button type="submit">Simpan & Generate Nomor</Button>
    </form>
);
```

---

## 🚀 Rencana Pengembangan Selanjutnya
1. **Bulk Import:** Mengunggah file Excel lama ke dalam sistem baru.
2. **PDF Preview:** Generate surat otomatis dengan kop surat resmi.
3. **Audit Log:** Mencatat siapa yang merubah atau menghapus nomor surat.
