# Undangan Pernikahan Endah & Fahmi

Website statis (HTML/CSS/JS) + Firebase Firestore untuk RSVP, ucapan, dan buku tamu. Hosting gratis di GitHub Pages.

## Struktur folder
```
undangan-endah-fahmi/
├── index.html          # halaman undangan
├── admin.html          # dashboard admin (login)
├── css/style.css
├── js/
│   ├── config.js       # DATA UNDANGAN (nama, acara, rekening, foto)
│   ├── firebase.js     # config Firebase + fungsi database
│   ├── app.js          # logika halaman undangan
│   └── admin.js        # logika dashboard admin
├── assets/
│   ├── img/            # 1.jpg ... 6.jpg (foto galeri)
│   └── audio/          # music.mp3 (musik latar)
├── firestore.rules     # aturan keamanan Firestore
└── README.md
```

## 1. Siapkan Firebase
1. Buka https://console.firebase.google.com, buat project baru.
2. **Build > Firestore Database > Create database** (mode production, pilih region asia-southeast2 Jakarta).
3. **Build > Authentication > Get started > Email/Password > Enable**. Lalu tab Users > Add user (email & sandi admin Anda).
4. **Project settings > Your apps > Web (`</>`)**, daftarkan app, salin objek `firebaseConfig` ke `js/firebase.js`.
5. **Firestore > Rules**: tempel isi `firestore.rules`, lalu Publish. Pastikan akun admin Firebase Authentication menggunakan email `adminfahmiendah@gmail.com`.
6. **Authentication > Settings > Authorized domains**: tambahkan `USERNAME.github.io`.

## 2. Isi konten
- Edit `js/config.js` untuk cerita cinta dan nomor rekening (saat ini contoh).
- Masukkan foto ke `assets/img/` (1.jpg sampai 6.jpg, rasio 3:4) dan musik ke `assets/audio/music.mp3`.

## 3. Deploy ke GitHub Pages
```bash
git init
git add .
git commit -m "Undangan Endah & Fahmi"
git branch -M main
git remote add origin https://github.com/USERNAME/undangan-endah-fahmi.git
git push -u origin main
```
Di GitHub: **Settings > Pages > Source: Deploy from a branch > main / (root) > Save**.
Undangan: `https://USERNAME.github.io/undangan-endah-fahmi/`
Admin: `https://USERNAME.github.io/undangan-endah-fahmi/admin.html`

## Link per tamu
Tambahkan `?to=Nama Tamu` di akhir link, atau pakai menu "Buat link tamu" di admin.
Contoh: `.../undangan-endah-fahmi/?to=Bapak%20Ahmad`

## Catatan
- Jika Firebase belum diisi, situs berjalan dalam mode demo (data di browser saja).
- Data RSVP hanya bisa dibaca dan dihapus admin. Pengunjung tetap bisa mengirim RSVP; ucapan di Buku Ucapan ditampilkan untuk publik.
- API key Firebase di kode web memang tidak rahasia; keamanan dijaga oleh `firestore.rules`.
