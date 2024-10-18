# Express Prisma API

## Deskripsi
Proyek ini adalah RESTful API yang dibangun menggunakan **Express.js** dan **Prisma** untuk mengelola pengguna, akun bank, dan transaksi. API ini menyediakan endpoint untuk melakukan operasi CRUD serta validasi data menggunakan **Joi**.

## Fitur
- **Pengguna**:
  - Menambahkan pengguna baru beserta profilnya.
  - Menampilkan daftar pengguna.
  - Menampilkan detail pengguna beserta profilnya.
  
- **Akun Bank**:
  - Menambahkan akun baru untuk pengguna yang sudah terdaftar.
  - Menampilkan daftar akun bank.
  - Menampilkan detail akun bank.
  
- **Transaksi**:
  - Mengirim uang dari satu akun bank ke akun bank lainnya.
  - Menampilkan daftar transaksi.
  - Menampilkan detail transaksi, termasuk pengirim dan penerima.

## Teknologi yang Digunakan
- **Node.js**: Platform untuk menjalankan JavaScript di server.
- **Express.js**: Framework web untuk membangun API.
- **Prisma**: ORM untuk menghubungkan database dengan JavaScript.
- **PostgreSQL**: Database untuk menyimpan data.
- **Joi**: Library untuk validasi data.

## Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name
   
2. Install dependencies
   npm install

3. Konfigurasi database
   Buat database PostgreSQL baru.
   Ganti nilai DATABASE_URL di file .env dengan URL database Anda.
   DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase

4. Migrasi database
   ```bash
   npx prisma migrate dev --name init

6. Jalankan server
   ```bash
   npm start
  Server akan berjalan pada port 3000 secara default.
