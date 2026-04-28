<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Surat — {{ $data['nomor'] }}</title>
<link href="https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }

body { font-family:Calibri,'Carlito','Segoe UI',sans-serif; font-size:10pt; color:#000; background:#fff; }
@media screen {
    body { background:#cccccc; }
    .page { width:21cm; min-height:29.7cm; margin:20px auto; background:#fff; box-shadow:0 0 12px rgba(0,0,0,.4); }
}

/* ── HEADER ── */
.header { padding:1cm 2.5cm 0 2.5cm; }
.header-row { display:flex; align-items:center; justify-content:space-between; }
.logo { width:212px; height:96px; object-fit:contain; object-position:left center; flex-shrink:0; }
.header-text { text-align:right; line-height:1.35; flex:1; padding-left:10px; }
.header-text .org { font-weight:bold; font-size:11pt; }
.header-text .addr { font-size:11pt; }
.header-text a { color:#0563C1; text-decoration:underline; }
.header-rule { border:none; border-bottom:2.5px solid #000; margin-top:5px; }

/* ── BODY ── */
.body { padding:0.3cm 2.5cm 1cm 2.5cm; }
p, td, li { font-family:Calibri,'Carlito','Segoe UI',sans-serif; font-size:10pt; line-height:1.15; }

/* Meta table */
.tbl-meta { width:100%; border-collapse:collapse; margin-bottom:8px; }
.tbl-meta td { padding:0 0 6pt 0; vertical-align:top; line-height:1.15; }
.tbl-meta .lbl { width:118px; }
.tbl-meta .sep { width:16px; }

/* Address block */
.addr-block { margin-bottom:8pt; }
.addr-block p { margin:0; line-height:1.15; }

/* Body paragraphs */
.p0 { text-align:justify; line-height:1.15; margin-bottom:6pt; }
.p-indent { text-align:left; line-height:1.15; margin-bottom:6pt; padding-left:46px; }

/* Pasal quote */
.pasal-outer { margin:0 0 6pt 36px; }
.tbl-pasal { width:100%; border-collapse:collapse; }
.tbl-pasal td { vertical-align:top; padding:0 2px; font-style:italic; text-align:justify; line-height:1.15; }
.tbl-pasal .pn { width:26px; white-space:nowrap; }
.tbl-pasal .pd { width:26px; white-space:nowrap; }

/* Rapat table */
.tbl-rapat { width:100%; border-collapse:collapse; margin-bottom:6pt; }
.tbl-rapat td { padding:0 0 6pt 0; vertical-align:top; line-height:1.15; }
.tbl-rapat .lbl { width:116px; }
.tbl-rapat .sep { width:16px; }

/* Signature */
.sig-block { margin-top:4px; }
.sig-bold { font-weight:bold; margin:0; line-height:1.15; }
.sig-normal { margin:0; line-height:1.15; }
.sig-images { position:relative; width:201px; height:135px; margin:0; }
.sig-stamp { position:absolute; left:54px; top:13px; width:125px; height:122px; z-index:1; }
.sig-signature { position:absolute; left:-22px; top:12px; width:127px; height:109px; z-index:2; }
.sig-name { font-weight:bold; text-decoration:underline; margin:0; line-height:1.15; }

/* Tembusan */
.tembusan { margin-top:14px; }
.tembusan p { margin:0; line-height:1.15; }
.tembusan ul { list-style:none; margin:0; padding:0; }
.tembusan li { padding-left:1.1cm; position:relative; line-height:1.15; }
.tembusan li::before { content:"–"; position:absolute; left:0.35cm; }

/* Print */
@media print {
    body { background:#fff; }
    .page { box-shadow:none; margin:0; }
}
@page { size:A4; margin:1cm 2.5cm; }
</style>
</head>
<body>

@php
  $logo_path = public_path('surat-assets/kop_image3.png');
  $logo_base64 = file_exists($logo_path) ? base64_encode(file_get_contents($logo_path)) : '';

  $stamp_path = public_path('surat-assets/kop_image1.png');
  $stamp_base64 = file_exists($stamp_path) ? base64_encode(file_get_contents($stamp_path)) : '';

  $sig_path = public_path('surat-assets/kop_image2.png');
  $sig_base64 = file_exists($sig_path) ? base64_encode(file_get_contents($sig_path)) : '';
@endphp

<div class="page" id="letter">

  <div class="header">
    <div class="header-row">
      <img class="logo" src="data:image/png;base64,{{ $logo_base64 }}" width="212" height="96" alt="KAI Services">
      <div class="header-text">
        <div class="org">DEWAN KOMISARIS PT RESKA MULTI USAHA</div>
        <div class="addr">Stasiun Mangga Besar Lantai Dasar,</div>
        <div class="addr">Jl. Karang Anyar No. 1, Jakarta Pusat, 10740</div>
        <div class="addr">Telepon 021-62302540 | email: <a href="mailto:dekom@reska.id">dekom@reska.id</a></div>
      </div>
    </div>
    <hr class="header-rule">
  </div>

  <div class="body">

    <table class="tbl-meta">
      <tr><td class="lbl">Tanggal</td><td class="sep">:</td><td>{{ $data['tanggal'] }}</td></tr>
      <tr><td class="lbl">Nomor</td><td class="sep">:</td><td>{{ $data['nomor'] }}</td></tr>
      <tr><td class="lbl">Lampiran</td><td class="sep">:</td><td>{{ $data['lampiran'] ?: '-' }}</td></tr>
      <tr><td class="lbl">Klasifikasi</td><td class="sep">:</td><td>{{ $data['klasifikasi'] }}</td></tr>
      <tr><td class="lbl">Perihal</td><td class="sep">:</td><td>{{ $data['perihal'] }}</td></tr>
    </table>

    <div class="addr-block">
      <p>Kepada Yth.</p>
      <p>{{ $data['kepada'] }}</p>
      <p>Di</p>
      <p>Tempat,</p>
    </div>

    <p class="p-indent">Merujuk pada Anggaran Dasar Perseroan Akta Nomor 75 tanggal 21 November 2014 yang dibuat di hadapan Surjadi Jasin, S.H., Notaris di Bandung, serta perubahan Anggaran Dasar yang dinyatakan dalam Akta Nomor 02 Tanggal 17 November 2020.</p>

    <p class="p0">Memperhatikan Ketentuan Pasal 15 ayat 2 huruf a angka 5) Anggaran Dasar Akta Nomor 75 tanggal 21 November 2014, yang berbunyi:</p>

    <div class="pasal-outer">
      <table class="tbl-pasal">
        <tr>
          <td class="pn"><em>15</em></td>
          <td class="pd"><em>2.</em></td>
          <td>
            <em>&#x201C;Dalam melaksanakan tugas sebagaimana dimaksud pada ayat 1 Pasal ini, maka:---------</em><br>
            <em>Dewan Komisaris berwenang untuk:-------------------------------------------------------------</em><br>
            <em>Meminta Direksi dan/atau pejabat lainnya di bawah Direksi dengan sepengetahuan Direksi untuk menghadiri Rapat Dewan Komisaris;------------- &#x201D;</em>
          </td>
        </tr>
      </table>
    </div>

    <p class="p0">Bersama ini kami mengundang {{ $data['kepada'] }}, untuk hadir dalam Rapat Dewan Komisaris dengan Direksi PT Reska Multi Usaha yang akan dilaksanakan pada:</p>

    <table class="tbl-rapat">
      <tr><td class="lbl">Hari dan Tanggal</td><td class="sep">:</td><td>{{ $data['hari_tanggal'] }}</td></tr>
      <tr><td class="lbl">Waktu</td><td class="sep">:</td><td>{{ $data['waktu'] }}</td></tr>
      <tr><td class="lbl">Tempat</td><td class="sep">:</td><td>{{ $data['tempat'] }}</td></tr>
      <tr><td class="lbl">Agenda</td><td class="sep">:</td><td>{{ $data['agenda'] }}</td></tr>
      @if(!empty($data['dresscode']))
      <tr><td class="lbl"><em>Dresscode</em></td><td class="sep">:</td><td>{{ $data['dresscode'] }}</td></tr>
      @endif
    </table>

    <p class="p0">Demikian kami sampaikan, atas kehadiran dan kerjasamanya kami ucapkan terimakasih.</p>

    <div class="sig-block">
      <p class="sig-bold">a.n Dewan Komisaris PT Reska Multi Usaha</p>
      <p class="sig-normal">{{ $data['jabatan_penandatangan'] }}</p>

      <div class="sig-images">
        <img class="sig-stamp" src="data:image/png;base64,{{ $stamp_base64 }}" width="125" height="122" alt="Stempel">
        <img class="sig-signature" src="data:image/png;base64,{{ $sig_base64 }}" width="127" height="109" alt="Tanda Tangan">
      </div>

      <p class="sig-name">{{ strtoupper($data['nama_penandatangan']) }}</p>
    </div>

    @php $vt = array_filter((array)($data['tembusan'] ?? []), fn($t) => !empty(trim($t))); @endphp
    @if(count($vt) > 0)
    <div class="tembusan">
      <p>Tembusan Kepada Yth:</p>
      <ul>@foreach($vt as $t)<li>{{ trim($t) }};</li>@endforeach</ul>
    </div>
    @endif

  </div><!-- .body -->
</div><!-- .page -->

</body>
</html>
