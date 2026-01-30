/**
 * ============================================
 * CARDS DATA - 30 Kartu Tema Mahasiswa Indonesia
 * ============================================
 * Based on reference/data.js
 *
 * Rarity: STARTER, COMMON, RARE, ULTIMATE
 * Type: ATTACK, BLOCK, BUFF, HEAL, KILL
 */

const CARDS_DATA = {
  // ========================================
  // STARTER CARDS (3 kartu awal untuk player baru)
  // ========================================
  bukuPaket: new Card({
    id: "c_001",
    name: "Baca Buku Paket",
    description: "Serangan dasar. Membosankan tapi perlu.",
    cost: 1,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.STARTER,
    icon: "📚",
    value: 6,
  }),

  tarikNapas: new Card({
    id: "c_003",
    name: "Tarik Napas",
    description: "Menahan 5 damage mental (Sanity).",
    cost: 1,
    type: Card.TYPES.BLOCK,
    rarity: Card.RARITY.STARTER,
    icon: "🌬️",
    value: 5,
  }),

  modalNekat: new Card({
    id: "c_011",
    name: "Modal Nekat",
    description: "Serangan gratis tanpa stamina.",
    cost: 0,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.STARTER,
    icon: "💪",
    value: 4,
  }),

  // ========================================
  // COMMON CARDS (12 kartu)
  // ========================================
  tanyaTeman: new Card({
    id: "c_002",
    name: "Tanya Teman",
    description: "Serangan kecil + Draw 1 kartu (jika beruntung).",
    cost: 1,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.COMMON,
    icon: "💬",
    value: 5,
    effect: { draw: 1, drawChance: 0.5 },
  }),

  catatanKuliah: new Card({
    id: "c_004",
    name: "Catatan Kuliah",
    description: "Pertahanan standar mahasiswa rajin.",
    cost: 1,
    type: Card.TYPES.BLOCK,
    rarity: Card.RARITY.COMMON,
    icon: "📝",
    value: 6,
  }),

  airMineral: new Card({
    id: "c_005",
    name: "Air Mineral",
    description: "+1 Stamina (Segar sedikit).",
    cost: 0,
    type: Card.TYPES.BUFF,
    rarity: Card.RARITY.RARE,
    icon: "💧",
    value: 1,
  }),

  sksKebut: new Card({
    id: "c_006",
    name: "Sistem Kebut Semalam",
    description: "Damage besar, tapi Sanity sendiri berkurang -3.",
    cost: 2,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.COMMON,
    icon: "🌙",
    value: 15,
    effect: { selfDamage: 3 },
  }),

  copyPaste: new Card({
    id: "c_007",
    name: "Copy Paste",
    description: "Serangan cepat dan murah.",
    cost: 1,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.COMMON,
    icon: "📋",
    value: 8,
  }),

  nitipAbsen: new Card({
    id: "c_008",
    name: "Nitip Absen",
    description: "Menghindari serangan musuh berikutnya (Dodge).",
    cost: 1,
    type: Card.TYPES.BUFF,
    rarity: Card.RARITY.COMMON,
    icon: "✋",
    value: 0,
    effect: { type: "dodge", duration: 1 },
  }),

  makanBurjo: new Card({
    id: "c_009",
    name: "Makan di Burjo",
    description: "Memulihkan 10 Sanity.",
    cost: 1,
    type: Card.TYPES.HEAL,
    rarity: Card.RARITY.COMMON,
    icon: "🍜",
    value: 10,
  }),

  wikipediaSource: new Card({
    id: "c_010",
    name: "Wikipedia Source",
    description: "Serangan standar.",
    cost: 1,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.COMMON,
    icon: "🌐",
    value: 7,
  }),

  dengerinMusik: new Card({
    id: "c_012",
    name: "Dengerin Musik",
    description: "Memblokir omongan dosen/musuh.",
    cost: 1,
    type: Card.TYPES.BLOCK,
    rarity: Card.RARITY.COMMON,
    icon: "🎧",
    value: 8,
  }),

  kelompokSolid: new Card({
    id: "c_013",
    name: "Kelompok Solid",
    description: "Serangan tim.",
    cost: 2,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.COMMON,
    icon: "👥",
    value: 12,
  }),

  pinjamCharger: new Card({
    id: "c_014",
    name: "Pinjam Charger",
    description: "+1 Stamina.",
    cost: 0,
    type: Card.TYPES.BUFF,
    rarity: Card.RARITY.COMMON,
    icon: "🔌",
    value: 1,
  }),

  alasanSakit: new Card({
    id: "c_015",
    name: "Alasan Sakit",
    description: "Block besar, sekali pakai.",
    cost: 1,
    type: Card.TYPES.BLOCK,
    rarity: Card.RARITY.COMMON,
    icon: "🤒",
    value: 10,
  }),

  // ========================================
  // RARE CARDS (10 kartu)
  // ========================================
  chatgptPremium: new Card({
    id: "c_016",
    name: "ChatGPT Premium",
    description: "Serangan otomatis yang menyakitkan.",
    cost: 2,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.RARE,
    icon: "🤖",
    value: 20,
  }),

  jokiTugas: new Card({
    id: "c_017",
    name: "Joki Tugas",
    description: "Biaya mahal, damage sangat besar.",
    cost: 3,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.RARE,
    icon: "💸",
    value: 30,
  }),

  kopiKapalApi: new Card({
    id: "c_018",
    name: "Kopi Kapal Api",
    description: "+2 Stamina (Mata melek total).",
    cost: 0,
    type: Card.TYPES.BUFF,
    rarity: Card.RARITY.RARE,
    icon: "☕",
    value: 2,
  }),

  healingPuncak: new Card({
    id: "c_019",
    name: "Healing ke Puncak",
    description: "Memulihkan Sanity dalam jumlah besar.",
    cost: 2,
    type: Card.TYPES.HEAL,
    rarity: Card.RARITY.RARE,
    icon: "⛰️",
    value: 25,
  }),

  debatDosen: new Card({
    id: "c_020",
    name: "Debat Dosen",
    description: "Memberi efek 'Stun' (Musuh diam 1 turn).",
    cost: 2,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.RARE,
    icon: "🎓",
    value: 18,
    effect: { stunEnemy: true },
  }),

  pdfBajakan: new Card({
    id: "c_021",
    name: "PDF Bajakan",
    description: "Serangan efisien (Cost 1, Damage 12).",
    cost: 1,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.RARE,
    icon: "📄",
    value: 12,
  }),

  tidur8Jam: new Card({
    id: "c_022",
    name: "Tidur 8 Jam",
    description: "Pertahanan super kuat.",
    cost: 2,
    type: Card.TYPES.BLOCK,
    rarity: Card.RARITY.RARE,
    icon: "😴",
    value: 20,
  }),

  bimbinganKilat: new Card({
    id: "c_023",
    name: "Bimbingan Kilat",
    description: "Buang semua kartu di tangan, ambil 5 kartu baru.",
    cost: 1,
    type: Card.TYPES.BUFF,
    rarity: Card.RARITY.RARE,
    icon: "⚡",
    value: 0,
    effect: { redrawAll: true },
  }),

  revisiMandiri: new Card({
    id: "c_024",
    name: "Revisi Mandiri",
    description: "Heal 15 + Block 5.",
    cost: 1,
    type: Card.TYPES.HEAL,
    rarity: Card.RARITY.RARE,
    icon: "📖",
    value: 15,
    value: 15,
    effect: { block: 5 },
  }),

  organisasiKampus: new Card({
    id: "c_025",
    name: "Organisasi Kampus",
    description: "Damage area (multi-hit).",
    cost: 2,
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.RARE,
    icon: "🏛️",
    value: 5, // 5 dmg x 3 hits = 15 total
    effect: { hits: 3 },
  }),

  // ========================================
  // ULTIMATE CARDS (5 kartu) - Cost ALL stamina
  // ========================================
  powerOfKepepet: new Card({
    id: "c_026",
    name: "The Power of Kepepet",
    description: "Menghabiskan semua Stamina. Damage Masif.",
    cost: "ALL",
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.ULTIMATE,
    icon: "🔥",
    value: 50,
  }),

  ordal: new Card({
    id: "c_027",
    name: "Ordal (Orang Dalam)",
    description: "Instan Kill (Kecuali Boss, Boss kena 50 dmg).",
    cost: "ALL",
    type: Card.TYPES.KILL,
    rarity: Card.RARITY.ULTIMATE,
    icon: "🎯",
    value: 999,
  }),

  cutiAkademik: new Card({
    id: "c_028",
    name: "Cuti Akademik",
    description: "Memulihkan Sanity sampai PENUH (Max).",
    cost: "ALL",
    type: Card.TYPES.HEAL,
    rarity: Card.RARITY.ULTIMATE,
    icon: "🏝️",
    value: 100,
    effect: { fullHeal: true },
  }),

  accDosen: new Card({
    id: "c_029",
    name: "Acc Dosen",
    description: "Kebal Serangan selama 2 Turn.",
    cost: "ALL",
    type: Card.TYPES.BUFF,
    rarity: Card.RARITY.ULTIMATE,
    icon: "✅",
    value: 0,
    effect: { invincible: 2 },
  }),

  wisudaVIP: new Card({
    id: "c_030",
    name: "Wisuda Jalur VIP",
    description: "Serangan terkuat di game.",
    cost: "ALL",
    type: Card.TYPES.ATTACK,
    rarity: Card.RARITY.ULTIMATE,
    icon: "👑",
    value: 60,
  }),
};

/**
 * Get all cards as array
 */
function getAllCards() {
  return Object.values(CARDS_DATA);
}

/**
 * Get cards by rarity
 */
function getCardsByRarity(rarity) {
  return getAllCards().filter((card) => card.rarity === rarity);
}

/**
 * Get cards by type
 */
function getCardsByType(type) {
  return getAllCards().filter((card) => card.type === type);
}

/**
 * Get starter deck (3 basic cards)
 */
function getStarterDeck() {
  return [
    CARDS_DATA.bukuPaket.clone(),
    CARDS_DATA.bukuPaket.clone(),
    CARDS_DATA.tarikNapas.clone(),
    CARDS_DATA.tarikNapas.clone(),
    CARDS_DATA.modalNekat.clone(),
  ];
}

/**
 * Get card by ID
 */
function getCardById(id) {
  return getAllCards().find((card) => card.id === id) || null;
}

/**
 * Get unlockable cards (non-starter)
 */
function getUnlockableCards() {
  return getAllCards().filter((card) => card.rarity !== Card.RARITY.STARTER);
}

/**
 * Get the CARDS_DATA key for a given Card object
 * This is needed because CARDS_DATA uses keys like "bukuPaket"
 * but Card objects have internal IDs like "c_001"
 * @param {Card} card - The card object
 * @returns {string|null} The key in CARDS_DATA, or null if not found
 */
function getCardKey(card) {
  if (!card) return null;
  for (const [key, value] of Object.entries(CARDS_DATA)) {
    if (value.id === card.id) {
      return key;
    }
  }
  return null;
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CARDS_DATA,
    getAllCards,
    getCardsByRarity,
    getCardsByType,
    getStarterDeck,
    getCardById,
    getUnlockableCards,
  };
}
