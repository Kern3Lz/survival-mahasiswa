// DATABASE KARTU (30 KARTU)

const cardData = [
    // --- STARTER & COMMON ---
    { id: "c_001", name: "Baca Buku Paket", rarity: "Common", cost: 1, type: "Attack", value: 6, desc: "Serangan dasar. Membosankan tapi perlu." },
    { id: "c_002", name: "Tanya Teman", rarity: "Common", cost: 1, type: "Attack", value: 5, desc: "Serangan kecil + Draw 1 kartu (jika beruntung)." },
    { id: "c_003", name: "Tarik Napas", rarity: "Common", cost: 1, type: "Block", value: 5, desc: "Menahan 5 damage mental (Sanity)." },
    { id: "c_004", name: "Catatan Kuliah", rarity: "Common", cost: 1, type: "Block", value: 6, desc: "Pertahanan standar mahasiswa rajin." },
    { id: "c_005", name: "Air Mineral", rarity: "Common", cost: 0, type: "Buff", value: 1, desc: "+1 Stamina (Segar sedikit)." },
    { id: "c_006", name: "SKS Kebut Semalam", rarity: "Common", cost: 2, type: "Attack", value: 15, desc: "Damage besar, tapi Sanity sendiri berkurang -3." },
    { id: "c_007", name: "Copy Paste", rarity: "Common", cost: 1, type: "Attack", value: 8, desc: "Serangan cepat dan murah." },
    { id: "c_008", name: "Nitip Absen", rarity: "Common", cost: 1, type: "Buff", value: 0, desc: "Menghindari serangan musuh berikutnya (Dodge)." },
    { id: "c_009", name: "Makan di Burjo", rarity: "Common", cost: 1, type: "Heal", value: 10, desc: "Memulihkan 10 Sanity." },
    { id: "c_010", name: "Wikipedia Source", rarity: "Common", cost: 1, type: "Attack", value: 7, desc: "Serangan standar." },
    { id: "c_011", name: "Modal Nekat", rarity: "Common", cost: 0, type: "Attack", value: 4, desc: "Serangan gratis tanpa stamina." },
    { id: "c_012", name: "Dengerin Musik", rarity: "Common", cost: 1, type: "Block", value: 8, desc: "Memblokir omongan dosen/musuh." },
    { id: "c_013", name: "Kelompok Solid", rarity: "Common", cost: 2, type: "Attack", value: 12, desc: "Serangan sedang." },
    { id: "c_014", name: "Pinjam Charger", rarity: "Common", cost: 0, type: "Buff", value: 1, desc: "+1 Stamina." },
    { id: "c_015", name: "Alasan Sakit", rarity: "Common", cost: 1, type: "Block", value: 10, desc: "Block besar, sekali pakai." },

    // --- RARE ---
    { id: "c_016", name: "ChatGPT Premium", rarity: "Rare", cost: 2, type: "Attack", value: 20, desc: "Serangan otomatis yang menyakitkan." },
    { id: "c_017", name: "Joki Tugas", rarity: "Rare", cost: 3, type: "Attack", value: 30, desc: "Biaya mahal, damage sangat besar." },
    { id: "c_018", name: "Kopi Kapal Api", rarity: "Rare", cost: 0, type: "Buff", value: 2, desc: "+2 Stamina (Mata melek total)." },
    { id: "c_019", name: "Healing ke Puncak", rarity: "Rare", cost: 2, type: "Heal", value: 25, desc: "Memulihkan Sanity dalam jumlah besar." },
    { id: "c_020", name: "Debat Dosen", rarity: "Rare", cost: 2, type: "Attack", value: 18, desc: "Memberi efek 'Stun' (Musuh diam 1 turn)." },
    { id: "c_021", name: "PDF Bajakan", rarity: "Rare", cost: 1, type: "Attack", value: 12, desc: "Serangan efisien (Cost 1, Damage 12)." },
    { id: "c_022", name: "Tidur 8 Jam", rarity: "Rare", cost: 2, type: "Block", value: 20, desc: "Pertahanan super kuat." },
    { id: "c_023", name: "Bimbingan Kilat", rarity: "Rare", cost: 1, type: "Buff", value: 0, desc: "Buang semua kartu di tangan, ambil 5 kartu baru." },
    { id: "c_024", name: "Revisi Mandiri", rarity: "Rare", cost: 1, type: "Heal", value: 15, desc: "Heal + Block 5." },
    { id: "c_025", name: "Organisasi Kampus", rarity: "Rare", cost: 2, type: "Attack", value: 15, desc: "Damage area (jika nanti ada fitur multi-enemy)." },

    // --- ULTIMATE ---
    { id: "c_026", name: "The Power of Kepepet", rarity: "Ultimate", cost: "ALL", type: "Attack", value: 50, desc: "Menghabiskan semua Stamina. Damage Masif." },
    { id: "c_027", name: "Ordal (Orang Dalam)", rarity: "Ultimate", cost: "ALL", type: "Kill", value: 999, desc: "Instan Kill (Kecuali Boss, Boss kena 50 dmg)." },
    { id: "c_028", name: "Cuti Akademik", rarity: "Ultimate", cost: "ALL", type: "Heal", value: 100, desc: "Memulihkan Sanity sampai PENUH (Max)." },
    { id: "c_029", name: "Acc Dosen", rarity: "Ultimate", cost: "ALL", type: "Buff", value: 0, desc: "Kebal Serangan selama 2 Turn." },
    { id: "c_030", name: "Wisuda Jalur VIP", rarity: "Ultimate", cost: "ALL", type: "Attack", value: 60, desc: "Serangan terkuat di game." }
];


// DATABASE LEVEL PLAYER

const levelData = [
    { level: 1, xpNeeded: 0, maxSanity: 50, maxStamina: 3, desc: "Maba Polos" },
    { level: 2, xpNeeded: 150, maxSanity: 60, maxStamina: 3, desc: "" },
    { level: 3, xpNeeded: 350, maxSanity: 70, maxStamina: 3, desc: "" },
    { level: 4, xpNeeded: 600, maxSanity: 80, maxStamina: 4, desc: "Naik SKS!" },
    { level: 5, xpNeeded: 900, maxSanity: 90, maxStamina: 4, desc: "" },
    { level: 6, xpNeeded: 1300, maxSanity: 100, maxStamina: 4, desc: "" },
    { level: 7, xpNeeded: 1800, maxSanity: 110, maxStamina: 4, desc: "" },
    { level: 8, xpNeeded: 2400, maxSanity: 120, maxStamina: 5, desc: "SKS Max" },
    { level: 9, xpNeeded: 3100, maxSanity: 130, maxStamina: 5, desc: "" },
    { level: 10, xpNeeded: 4000, maxSanity: 140, maxStamina: 5, desc: "Mahasiswa Abadi" }
];


// DATABASE MUSUH (40 STAGE)

const enemyData = [
    // Semester 1
    { id: "E_01_01", semester: 1, round: 1, name: "Maba Nyasar", type: "Normal", hp: 25, dmg: 5, xp: 20 },
    { id: "E_01_02", semester: 1, round: 2, name: "Kuis Dadakan", type: "Normal", hp: 30, dmg: 6, xp: 25 },
    { id: "E_01_03", semester: 1, round: 3, name: "Senior Galak", type: "Normal", hp: 35, dmg: 7, xp: 30 },
    { id: "E_01_04", semester: 1, round: 4, name: "Tugas Kelompok", type: "Elite", hp: 45, dmg: 9, xp: 40 },
    { id: "E_01_05", semester: 1, round: 5, name: "UAS Pengantar", type: "BOSS", hp: 80, dmg: 12, xp: 100 },
    // Semester 2
    { id: "E_02_01", semester: 2, round: 1, name: "Rapat Organisasi", type: "Normal", hp: 40, dmg: 8, xp: 35 },
    { id: "E_02_02", semester: 2, round: 2, name: "Dana Usaha (Danus)", type: "Normal", hp: 45, dmg: 9, xp: 40 },
    { id: "E_02_03", semester: 2, round: 3, name: "Jadwal Bentrok", type: "Normal", hp: 50, dmg: 10, xp: 45 },
    { id: "E_02_04", semester: 2, round: 4, name: "Asisten Lab", type: "Elite", hp: 65, dmg: 12, xp: 60 },
    { id: "E_02_05", semester: 2, round: 5, name: "Laporan Praktikum", type: "BOSS", hp: 110, dmg: 15, xp: 150 },
    // Semester 3 (Data dari Screenshot mulai di sini)
    { id: "E_03_01", semester: 3, round: 1, name: "Begadang 2 Hari", type: "Normal", hp: 60, dmg: 11, xp: 50 },
    { id: "E_03_02", semester: 3, round: 2, name: "Laptop Nge-Lag", type: "Normal", hp: 65, dmg: 12, xp: 55 },
    { id: "E_03_03", semester: 3, round: 3, name: "Internet Down", type: "Normal", hp: 70, dmg: 13, xp: 60 },
    { id: "E_03_04", semester: 3, round: 4, name: "Matkul Mengulang", type: "Elite", hp: 90, dmg: 16, xp: 80 },
    { id: "E_03_05", semester: 3, round: 5, name: "Dosen Killer", type: "BOSS", hp: 150, dmg: 20, xp: 200 },
    // Semester 4
    { id: "E_04_01", semester: 4, round: 1, name: "Proposal Magang", type: "Normal", hp: 80, dmg: 14, xp: 70 },
    { id: "E_04_02", semester: 4, round: 2, name: "Interview Awkward", type: "Normal", hp: 85, dmg: 15, xp: 75 },
    { id: "E_04_03", semester: 4, round: 3, name: "Revisi Laporan KP", type: "Normal", hp: 90, dmg: 16, xp: 80 },
    { id: "E_04_04", semester: 4, round: 4, name: "Pembimbing Sibuk", type: "Elite", hp: 115, dmg: 19, xp: 100 },
    { id: "E_04_05", semester: 4, round: 5, name: "Sidang PKL", type: "BOSS", hp: 190, dmg: 24, xp: 250 },
    // Semester 5
    { id: "E_05_01", semester: 5, round: 1, name: "Lokasi KKN Angker", type: "Normal", hp: 100, dmg: 17, xp: 90 },
    { id: "E_05_02", semester: 5, round: 2, name: "Proker Gagal", type: "Normal", hp: 105, dmg: 18, xp: 95 },
    { id: "E_05_03", semester: 5, round: 3, name: "Cinlok Bertepuk Sebelah Tangan", type: "Normal", hp: 110, dmg: 19, xp: 100 },
    { id: "E_05_04", semester: 5, round: 4, name: "Kepala Desa", type: "Elite", hp: 140, dmg: 22, xp: 130 },
    { id: "E_05_05", semester: 5, round: 5, name: "Laporan KKN", type: "BOSS", hp: 230, dmg: 28, xp: 300 },
    // Semester 6
    { id: "E_06_01", semester: 6, round: 1, name: "Cari Judul Skripsi", type: "Normal", hp: 120, dmg: 20, xp: 110 },
    { id: "E_06_02", semester: 6, round: 2, name: "Judul Ditolak", type: "Normal", hp: 125, dmg: 21, xp: 115 },
    { id: "E_06_03", semester: 6, round: 3, name: "Ganti Judul Lagi", type: "Normal", hp: 130, dmg: 22, xp: 120 },
    { id: "E_06_04", semester: 6, round: 4, name: "Dosen Ghosting", type: "Elite", hp: 165, dmg: 26, xp: 150 },
    { id: "E_06_05", semester: 6, round: 5, name: "Seminar Proposal", type: "BOSS", hp: 270, dmg: 32, xp: 350 },
    // Semester 7
    { id: "E_07_01", semester: 7, round: 1, name: "Olah Data Error", type: "Normal", hp: 140, dmg: 23, xp: 130 },
    { id: "E_07_02", semester: 7, round: 2, name: "Revisi Bab 1-3", type: "Normal", hp: 145, dmg: 24, xp: 135 },
    { id: "E_07_03", semester: 7, round: 3, name: "File Skripsi Corrupt", type: "Normal", hp: 150, dmg: 25, xp: 140 },
    { id: "E_07_04", semester: 7, round: 4, name: "Revisi Mayor", type: "Elite", hp: 190, dmg: 30, xp: 180 },
    { id: "E_07_05", semester: 7, round: 5, name: "Sidang Tertutup", type: "BOSS", hp: 310, dmg: 36, xp: 400 },
    // Semester 8
    { id: "E_08_01", semester: 8, round: 1, name: "Salah Format Penulisan", type: "Normal", hp: 160, dmg: 26, xp: 150 },
    { id: "E_08_02", semester: 8, round: 2, name: "Tanda Tangan Hilang", type: "Normal", hp: 165, dmg: 27, xp: 155 },
    { id: "E_08_03", semester: 8, round: 3, name: "Revisi H-1", type: "Normal", hp: 170, dmg: 28, xp: 160 },
    { id: "E_08_04", semester: 8, round: 4, name: "Penguji Tamu", type: "Elite", hp: 215, dmg: 34, xp: 200 },
    { id: "E_08_05", semester: 8, round: 5, name: "SIDANG SKRIPSI AKHIR", type: "BOSS", hp: 350, dmg: 40, xp: 500 }
];