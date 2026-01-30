/**
 * ============================================
 * SEMESTER & ENEMY DATA
 * 8 Semesters x 5 Rounds = 40 Battles
 * ============================================
 */

const SEMESTER_DATA = {
  1: {
    name: "Pengenalan Kampus",
    description: "Awal mula petualangan kuliah",
    rounds: [
      {
        round: 1,
        type: "Normal",
        enemy: { nama: "Ospek Senior", sprite: "😤", tipe: "Sosial" },
        difficulty: "Mudah",
        xpReward: 30,
        cardChance: 0.1, // 10%
      },
      {
        round: 2,
        type: "Normal",
        enemy: { nama: "Kuis Dadakan", sprite: "📝", tipe: "Tugas" },
        difficulty: "Mudah",
        xpReward: 35,
        cardChance: 0.1,
      },
      {
        round: 3,
        type: "Normal",
        enemy: { nama: "Laporan Praktikum", sprite: "📊", tipe: "Tugas" },
        difficulty: "Sedang",
        xpReward: 50,
        cardChance: 0.15,
      },
      {
        round: 4,
        type: "Elite",
        enemy: { nama: "Dosen Killer", sprite: "👨‍🏫", tipe: "Dosen" },
        difficulty: "Sulit",
        xpReward: 80,
        cardChance: 0.25,
      },
      {
        round: 5,
        type: "BOSS",
        enemy: {
          nama: "UAS Semester 1",
          sprite: "📋",
          tipe: "Ujian",
          isBoss: true,
        },
        difficulty: "Sangat Sulit",
        xpReward: 150,
        cardChance: 1.0, // 100% guaranteed
      },
    ],
  },
  2: {
    name: "Adaptasi Perkuliahan",
    description: "Mulai terbiasa dengan ritme kampus",
    rounds: [
      {
        round: 1,
        type: "Normal",
        enemy: { nama: "Tugas Kelompok", sprite: "👥", tipe: "Sosial" },
        difficulty: "Mudah",
        xpReward: 40,
        cardChance: 0.1,
      },
      {
        round: 2,
        type: "Normal",
        enemy: { nama: "Presentasi Dadakan", sprite: "🎤", tipe: "Tugas" },
        difficulty: "Mudah",
        xpReward: 45,
        cardChance: 0.1,
      },
      {
        round: 3,
        type: "Normal",
        enemy: { nama: "Paper Review", sprite: "📄", tipe: "Tugas" },
        difficulty: "Sedang",
        xpReward: 60,
        cardChance: 0.15,
      },
      {
        round: 4,
        type: "Elite",
        enemy: { nama: "Asisten Galak", sprite: "😠", tipe: "Dosen" },
        difficulty: "Sulit",
        xpReward: 100,
        cardChance: 0.25,
      },
      {
        round: 5,
        type: "BOSS",
        enemy: {
          nama: "UTS Mengerikan",
          sprite: "📑",
          tipe: "Ujian",
          isBoss: true,
        },
        difficulty: "Sangat Sulit",
        xpReward: 180,
        cardChance: 1.0,
      },
    ],
  },
  3: {
    name: "Semester Intensif",
    description: "Beban kuliah mulai terasa berat",
    rounds: [
      {
        round: 1,
        type: "Normal",
        enemy: { nama: "Deadline Beruntun", sprite: "⏰", tipe: "Tugas" },
        difficulty: "Sedang",
        xpReward: 50,
        cardChance: 0.12,
      },
      {
        round: 2,
        type: "Normal",
        enemy: { nama: "Coding Marathon", sprite: "💻", tipe: "Teknis" },
        difficulty: "Sedang",
        xpReward: 55,
        cardChance: 0.12,
      },
      {
        round: 3,
        type: "Normal",
        enemy: { nama: "Project Besar", sprite: "📦", tipe: "Tugas" },
        difficulty: "Sedang",
        xpReward: 70,
        cardChance: 0.18,
      },
      {
        round: 4,
        type: "Elite",
        enemy: { nama: "Dosen Perfeksionis", sprite: "🧐", tipe: "Dosen" },
        difficulty: "Sulit",
        xpReward: 120,
        cardChance: 0.3,
      },
      {
        round: 5,
        type: "BOSS",
        enemy: {
          nama: "UAS + Remidi",
          sprite: "💀",
          tipe: "Ujian",
          isBoss: true,
        },
        difficulty: "Sangat Sulit",
        xpReward: 220,
        cardChance: 1.0,
      },
    ],
  },
  4: {
    name: "Pertengahan Kuliah",
    description: "Setengah jalan menuju wisuda",
    rounds: [
      {
        round: 1,
        type: "Normal",
        enemy: { nama: "Magang Wajib", sprite: "🏢", tipe: "Eksternal" },
        difficulty: "Sedang",
        xpReward: 60,
        cardChance: 0.12,
      },
      {
        round: 2,
        type: "Normal",
        enemy: { nama: "Organisasi Kampus", sprite: "🏛️", tipe: "Sosial" },
        difficulty: "Sedang",
        xpReward: 65,
        cardChance: 0.12,
      },
      {
        round: 3,
        type: "Normal",
        enemy: { nama: "Praktikum Lanjut", sprite: "🔬", tipe: "Tugas" },
        difficulty: "Sulit",
        xpReward: 85,
        cardChance: 0.2,
      },
      {
        round: 4,
        type: "Elite",
        enemy: { nama: "Kaprodi Tegas", sprite: "👔", tipe: "Dosen" },
        difficulty: "Sulit",
        xpReward: 140,
        cardChance: 0.35,
      },
      {
        round: 5,
        type: "BOSS",
        enemy: {
          nama: "Evaluasi Tengah",
          sprite: "📊",
          tipe: "Ujian",
          isBoss: true,
        },
        difficulty: "Sangat Sulit",
        xpReward: 260,
        cardChance: 1.0,
      },
    ],
  },
  5: {
    name: "Semester Kritis",
    description: "Mata kuliah inti yang menentukan",
    rounds: [
      {
        round: 1,
        type: "Normal",
        enemy: { nama: "Teori Kompleks", sprite: "📚", tipe: "Tugas" },
        difficulty: "Sedang",
        xpReward: 70,
        cardChance: 0.15,
      },
      {
        round: 2,
        type: "Normal",
        enemy: { nama: "Lab Malam", sprite: "🌙", tipe: "Teknis" },
        difficulty: "Sulit",
        xpReward: 80,
        cardChance: 0.15,
      },
      {
        round: 3,
        type: "Normal",
        enemy: { nama: "Revisi Tanpa Akhir", sprite: "🔄", tipe: "Tugas" },
        difficulty: "Sulit",
        xpReward: 100,
        cardChance: 0.22,
      },
      {
        round: 4,
        type: "Elite",
        enemy: { nama: "Dosen Legendaris", sprite: "👴", tipe: "Dosen" },
        difficulty: "Sangat Sulit",
        xpReward: 160,
        cardChance: 0.4,
      },
      {
        round: 5,
        type: "BOSS",
        enemy: {
          nama: "UAS Matkul Inti",
          sprite: "⚔️",
          tipe: "Ujian",
          isBoss: true,
        },
        difficulty: "Sangat Sulit",
        xpReward: 300,
        cardChance: 1.0,
      },
    ],
  },
  6: {
    name: "Persiapan TA",
    description: "Memulai riset tugas akhir",
    rounds: [
      {
        round: 1,
        type: "Normal",
        enemy: { nama: "Cari Topik TA", sprite: "🔍", tipe: "Tugas" },
        difficulty: "Sulit",
        xpReward: 80,
        cardChance: 0.15,
      },
      {
        round: 2,
        type: "Normal",
        enemy: { nama: "Literature Review", sprite: "📖", tipe: "Tugas" },
        difficulty: "Sulit",
        xpReward: 90,
        cardChance: 0.18,
      },
      {
        round: 3,
        type: "Normal",
        enemy: { nama: "Proposal Ditolak", sprite: "❌", tipe: "Dosen" },
        difficulty: "Sangat Sulit",
        xpReward: 120,
        cardChance: 0.25,
      },
      {
        round: 4,
        type: "Elite",
        enemy: { nama: "Dosen Pembimbing", sprite: "🎓", tipe: "Dosen" },
        difficulty: "Sangat Sulit",
        xpReward: 180,
        cardChance: 0.45,
      },
      {
        round: 5,
        type: "BOSS",
        enemy: {
          nama: "Seminar Proposal",
          sprite: "🎙️",
          tipe: "Ujian",
          isBoss: true,
        },
        difficulty: "Sangat Sulit",
        xpReward: 350,
        cardChance: 1.0,
      },
    ],
  },
  7: {
    name: "Pengerjaan TA",
    description: "Perjuangan mengerjakan skripsi",
    rounds: [
      {
        round: 1,
        type: "Normal",
        enemy: { nama: "Writer's Block", sprite: "✍️", tipe: "Mental" },
        difficulty: "Sulit",
        xpReward: 90,
        cardChance: 0.18,
      },
      {
        round: 2,
        type: "Normal",
        enemy: { nama: "Bug Misterius", sprite: "🐛", tipe: "Teknis" },
        difficulty: "Sangat Sulit",
        xpReward: 110,
        cardChance: 0.2,
      },
      {
        round: 3,
        type: "Normal",
        enemy: { nama: "Data Tidak Valid", sprite: "📉", tipe: "Tugas" },
        difficulty: "Sangat Sulit",
        xpReward: 140,
        cardChance: 0.28,
      },
      {
        round: 4,
        type: "Elite",
        enemy: { nama: "Dospem Ghosting", sprite: "👻", tipe: "Dosen" },
        difficulty: "Sangat Sulit",
        xpReward: 200,
        cardChance: 0.5,
      },
      {
        round: 5,
        type: "BOSS",
        enemy: {
          nama: "Deadline TA",
          sprite: "⚡",
          tipe: "Ujian",
          isBoss: true,
        },
        difficulty: "Ekstrim",
        xpReward: 400,
        cardChance: 1.0,
      },
    ],
  },
  8: {
    name: "Sidang Akhir",
    description: "Pertarungan terakhir menuju wisuda!",
    rounds: [
      {
        round: 1,
        type: "Normal",
        enemy: { nama: "Revisi Final", sprite: "📝", tipe: "Tugas" },
        difficulty: "Sangat Sulit",
        xpReward: 100,
        cardChance: 0.2,
      },
      {
        round: 2,
        type: "Normal",
        enemy: { nama: "Administrasi Wisuda", sprite: "📋", tipe: "Admin" },
        difficulty: "Sangat Sulit",
        xpReward: 120,
        cardChance: 0.22,
      },
      {
        round: 3,
        type: "Elite",
        enemy: { nama: "Penguji Pertama", sprite: "🧑‍⚖️", tipe: "Dosen" },
        difficulty: "Ekstrim",
        xpReward: 160,
        cardChance: 0.3,
      },
      {
        round: 4,
        type: "Elite",
        enemy: { nama: "Penguji Kedua", sprite: "👨‍⚖️", tipe: "Dosen" },
        difficulty: "Ekstrim",
        xpReward: 220,
        cardChance: 0.5,
      },
      {
        round: 5,
        type: "BOSS",
        enemy: {
          nama: "SIDANG SKRIPSI",
          sprite: "🎓",
          tipe: "Final Boss",
          isBoss: true,
        },
        difficulty: "FINAL",
        xpReward: 500,
        cardChance: 1.0,
      },
    ],
  },
};

/**
 * Calculate enemy stats based on semester and round
 * Formula from design doc:
 * - HP: Base_HP + (Semester * 15) + (Ronde * 5)
 * - Damage: Base_Dmg + (Semester * 2)
 */
function calculateEnemyStats(semester, round, isBoss = false, isElite = false) {
  const BASE_HP = 30;
  const BASE_DMG = 5;

  let hp = BASE_HP + semester * 15 + round * 5;
  let damage = BASE_DMG + semester * 2;

  // Boss gets bonus
  if (isBoss) {
    hp = Math.floor(hp * 1.5);
    damage = Math.floor(damage * 1.3);
  } else if (isElite) {
    hp = Math.floor(hp * 1.2);
    damage = Math.floor(damage * 1.15);
  }

  return { hp, damage };
}

function getSemesterData(semesterNum) {
  return SEMESTER_DATA[semesterNum] || null;
}

function getRoundData(semesterNum, roundNum) {
  const semester = SEMESTER_DATA[semesterNum];
  if (!semester) return null;
  return semester.rounds.find((r) => r.round === roundNum) || null;
}

function createEnemyFromRound(semesterNum, roundNum) {
  const roundData = getRoundData(semesterNum, roundNum);
  if (!roundData) return null;

  const isBoss = roundData.type === "BOSS";
  const isElite = roundData.type === "Elite";
  const stats = calculateEnemyStats(semesterNum, roundNum, isBoss, isElite);

  return new Masalah({
    nama: roundData.enemy.nama,
    max_sanity: stats.hp,
    base_attack: stats.damage,
    tipe_masalah: roundData.enemy.tipe,
    sprite: roundData.enemy.sprite,
    isBoss: isBoss,
    isElite: isElite,
    exp_reward: roundData.xpReward,
    semester: semesterNum,
    round: roundNum,
  });
}

// Export for use
window.SEMESTER_DATA = SEMESTER_DATA;
window.getSemesterData = getSemesterData;
window.getRoundData = getRoundData;
window.createEnemyFromRound = createEnemyFromRound;
window.calculateEnemyStats = calculateEnemyStats;
