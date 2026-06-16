# 🚗 G-RantCar - Premium Car Rental

## 📋 Deskripsi
G-RantCar adalah aplikasi web untuk penyewaan mobil premium berbasis React dan Node.js. Pengguna dapat menjelajahi koleksi mobil, melakukan pemesanan, melacak riwayat transaksi, dan mengelola akun mereka. Admin memiliki panel terpisah untuk mengelola data mobil dan rental.

## ✨ Fitur

### 👤 Pengguna
- Registrasi dan Login dengan JWT
- Lihat daftar mobil dengan filter (JDM, Sport, Luxury, SUV)
- Detail mobil dengan gambar dan deskripsi
- Pemesanan mobil dengan pilihan tanggal
- Riwayat transaksi
- Profil pengguna
- 3 Tema (Dark, Light, Cyberpunk)
- Live Chat Support

### 👑 Admin
- Dashboard dengan grafik pendapatan
- Kelola Mobil (Tambah, Edit, Hapus)
- Kelola Rental (Ubah status: pending, active, completed, cancelled)

## 📊 ERD (Entity Relationship Diagram)
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ users │ │ rentals │ │ cars │
├─────────────┤ ├─────────────┤ ├─────────────┤
│ id (PK) │────<│ user_id (FK)│ │ id (PK) │
│ username │ │ car_id (FK) │────>│ name │
│ email │ │ start_date │ │ brand │
│ password │ │ end_date │ │ price_per_day│
│ role │ │ total_price │ │ stock │
│ created_at │ │ status │ │ image_url │
└─────────────┘ │ created_at │ │ description │
└─────────────┘ │ is_available│
│ created_at │
└─────────────┘

## 🛠️ Tech Stack

### Frontend
| Teknologi | Keterangan |
|-----------|------------|
| React 19 | Library UI |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Routing |
| Framer Motion | Animasi |
| Axios | HTTP Client |
| Chart.js | Grafik dashboard |

### Backend
| Teknologi | Keterangan |
|-----------|------------|
| Node.js 22 | Runtime |
| Express 5 | Framework |
| PostgreSQL | Database |
| JWT | Autentikasi |
| bcrypt | Hashing password |
| CORS | Security |

## 📁 Struktur Folder

## 🛠️ Tech Stack

### Frontend
| Teknologi | Keterangan |
|-----------|------------|
| React 19 | Library UI |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Routing |
| Framer Motion | Animasi |
| Axios | HTTP Client |
| Chart.js | Grafik dashboard |

### Backend
| Teknologi | Keterangan |
|-----------|------------|
| Node.js 22 | Runtime |
| Express 5 | Framework |
| PostgreSQL | Database |
| JWT | Autentikasi |
| bcrypt | Hashing password |
| CORS | Security |

## 📁 Struktur Folder

## 🛠️ Tech Stack

### Frontend
| Teknologi | Keterangan |
|-----------|------------|
| React 19 | Library UI |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Routing |
| Framer Motion | Animasi |
| Axios | HTTP Client |
| Chart.js | Grafik dashboard |

### Backend
| Teknologi | Keterangan |
|-----------|------------|
| Node.js 22 | Runtime |
| Express 5 | Framework |
| PostgreSQL | Database |
| JWT | Autentikasi |
| bcrypt | Hashing password |
| CORS | Security |

## 📁 Struktur Folder
G-RantCar/
├── backend/
│ ├── config/
│ │ └── database.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── carController.js
│ │ └── rentalController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorMiddleware.js
│ ├── models/
│ │ ├── userModel.js
│ │ ├── carModel.js
│ │ └── rentalModel.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── carRoutes.js
│ │ └── rentalRoutes.js
│ ├── services/
│ │ ├── authService.js
│ │ ├── carService.js
│ │ └── rentalService.js
│ ├── utils/
│ │ └── generateToken.js
│ ├── .env
│ ├── package.json
│ └── server.js
│
├── frontend/
│ ├── public/
│ │ └── logoweb.png
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── layouts/
│ │ ├── pages/
│ │ ├── routes/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ ├── .env
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
│
├── .gitignore
└── README.md

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js >= 18
- pnpm (atau npm)
- PostgreSQL

### 1. Clone Repository
```bash
git clone https://github.com/username/G-RantCar.git
cd G-RantCar
