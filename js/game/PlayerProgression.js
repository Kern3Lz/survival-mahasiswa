/**
 * ============================================
 * PLAYER PROGRESSION SYSTEM
 * Handles XP, Leveling, Stats Scaling
 * ============================================
 */

const LEVEL_TABLE = [
  { level: 1, xpRequired: 0, sanity: 50, stamina: 3, features: "Awal" },
  { level: 2, xpRequired: 200, sanity: 60, stamina: 3, features: "" },
  { level: 3, xpRequired: 500, sanity: 70, stamina: 3, features: "" },
  { level: 4, xpRequired: 900, sanity: 80, stamina: 4, features: "Naik SKS!" },
  { level: 5, xpRequired: 1400, sanity: 90, stamina: 4, features: "" },
  { level: 6, xpRequired: 2000, sanity: 100, stamina: 4, features: "" },
  { level: 7, xpRequired: 2700, sanity: 110, stamina: 4, features: "" },
  { level: 8, xpRequired: 3500, sanity: 120, stamina: 5, features: "Max SKS!" },
  { level: 9, xpRequired: 4400, sanity: 130, stamina: 5, features: "" },
  {
    level: 10,
    xpRequired: 5500,
    sanity: 140,
    stamina: 5,
    features: "Max Level",
  },
];

class PlayerProgression {
  #baseStorageKey = "survival_mahasiswa_progression";
  #currentUsername = "guest";

  constructor() {
    this.currentXP = 0;
    this.currentLevel = 1;
    this.totalXPEarned = 0;

    // Temp storage for battle rewards
    this.tempXP = 0;
    this.tempNewCards = [];

    // Unlocked cards (weighted deck system)
    this.unlockedCards = [];
    this.favoriteDeck = []; // 5 kartu favorit (weight 10)

    // Semester progress
    this.highestSemester = 1;
    this.completedSemesters = [];
  }

  // ============================================
  // LEVELING SYSTEM
  // ============================================

  getLevelData(level) {
    return LEVEL_TABLE.find((l) => l.level === level) || LEVEL_TABLE[0];
  }

  getCurrentLevelData() {
    return this.getLevelData(this.currentLevel);
  }

  getNextLevelData() {
    if (this.currentLevel >= 10) return null;
    return this.getLevelData(this.currentLevel + 1);
  }

  getXPForNextLevel() {
    const next = this.getNextLevelData();
    if (!next) return 0;
    return next.xpRequired - this.currentXP;
  }

  getXPProgress() {
    const current = this.getCurrentLevelData();
    const next = this.getNextLevelData();

    if (!next)
      return {
        current: this.currentXP,
        required: current.xpRequired,
        percent: 100,
      };

    const xpInLevel = this.currentXP - current.xpRequired;
    const xpNeeded = next.xpRequired - current.xpRequired;
    const percent = Math.floor((xpInLevel / xpNeeded) * 100);

    return {
      current: xpInLevel,
      required: xpNeeded,
      percent: Math.min(percent, 100),
      total: this.currentXP,
    };
  }

  addXP(amount) {
    const oldLevel = this.currentLevel;
    this.currentXP += amount;
    this.totalXPEarned += amount;

    // Check for level up
    let leveledUp = false;
    let newFeatures = [];

    while (this.currentLevel < 10) {
      const nextLevel = this.getLevelData(this.currentLevel + 1);
      if (this.currentXP >= nextLevel.xpRequired) {
        this.currentLevel++;
        leveledUp = true;
        if (nextLevel.features) {
          newFeatures.push(nextLevel.features);
        }
      } else {
        break;
      }
    }

    return {
      leveledUp,
      oldLevel,
      newLevel: this.currentLevel,
      newFeatures,
      xpGained: amount,
    };
  }

  // ============================================
  // STATS (Based on Level)
  // ============================================

  getMaxSanity() {
    return this.getCurrentLevelData().sanity;
  }

  getMaxStamina() {
    return this.getCurrentLevelData().stamina;
  }

  // ============================================
  // CARD DECK SYSTEM (Weighted RNG)
  // ============================================

  initializeStarterCards() {
    // Starter cards yang langsung unlocked - using new card IDs from reference
    this.unlockedCards = [
      // Starter tier cards
      "bukuPaket", // Baca Buku Paket (attack, cost 1)
      "bukuPaket",
      "tarikNapas", // Tarik Napas (block, cost 1)
      "tarikNapas",
      "modalNekat", // Modal Nekat (attack, cost 0)
      "modalNekat",
      // Common cards - useful basics
      "airMineral", // Air Mineral (buff +1 stamina, cost 0)
      "makanBurjo", // Makan di Burjo (heal 10, cost 1)
      "catatanKuliah", // Catatan Kuliah (block 6, cost 1)
      "tanyaTeman", // Tanya Teman (attack 5, cost 1)
      "pinjamCharger", // Pinjam Charger (buff +1 stamina, cost 0)
      "dengerinMusik", // Dengerin Musik (block 8, cost 1)
    ];

    // Default favorite deck (5 cards with high weight)
    this.favoriteDeck = [
      "bukuPaket", // Main attack
      "tarikNapas", // Main defense
      "makanBurjo", // Healing
      "airMineral", // Free stamina
      "modalNekat", // Free attack
    ];
  }

  setFavoriteDeck(cardIds) {
    if (cardIds.length !== 5) {
      console.warn("Favorite deck must have exactly 5 cards");
      return false;
    }

    // Validate all cards are unlocked
    for (const id of cardIds) {
      if (!this.unlockedCards.includes(id)) {
        console.warn(`Card ${id} is not unlocked`);
        return false;
      }
    }

    this.favoriteDeck = [...cardIds];
    return true;
  }

  toggleFavoriteCard(cardId) {
    if (this.favoriteDeck.includes(cardId)) {
      // Remove
      this.favoriteDeck = this.favoriteDeck.filter((id) => id !== cardId);
      return true;
    } else {
      // Add
      if (this.favoriteDeck.length >= 5) {
        return false; // Full
      }
      this.favoriteDeck.push(cardId);
      return true;
    }
  }

  unlockCard(cardId) {
    if (!this.unlockedCards.includes(cardId)) {
      this.unlockedCards.push(cardId);
      return true;
    }
    return false;
  }

  getWeightedCardPool() {
    // Returns array of {cardId, weight}
    const pool = [];
    const counted = new Set();

    // Favorite deck cards get weight 10
    for (const cardId of this.favoriteDeck) {
      pool.push({ cardId, weight: 10 });
      counted.add(cardId);
    }

    // Other unlocked cards get weight 1
    for (const cardId of this.unlockedCards) {
      if (!counted.has(cardId)) {
        pool.push({ cardId, weight: 1 });
        counted.add(cardId);
      }
    }

    return pool;
  }

  drawWeightedCards(count = 5) {
    const pool = this.getWeightedCardPool();
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    const drawnCards = [];

    for (let i = 0; i < count; i++) {
      let random = Math.random() * totalWeight;

      for (const item of pool) {
        random -= item.weight;
        if (random <= 0) {
          drawnCards.push(item.cardId);
          break;
        }
      }
    }

    return drawnCards;
  }

  // ============================================
  // TEMP REWARDS (Accumulated during battle)
  // ============================================

  addTempXP(amount) {
    this.tempXP += amount;
  }

  addTempCard(cardId) {
    this.tempNewCards.push(cardId);
  }

  processTempRewards() {
    const result = {
      xpGained: this.tempXP,
      cardsGained: [...this.tempNewCards],
      levelUp: null,
    };

    // Process XP
    if (this.tempXP > 0) {
      result.levelUp = this.addXP(this.tempXP);
    }

    // Process new cards
    for (const cardId of this.tempNewCards) {
      this.unlockCard(cardId);
    }

    // Clear temp
    this.tempXP = 0;
    this.tempNewCards = [];

    return result;
  }

  // ============================================
  // SEMESTER PROGRESS
  // ============================================

  completeSemester(semesterNum) {
    // First, commit all temp rewards (XP and new cards)
    const rewardResult = this.processTempRewards();

    // Mark semester as completed
    if (!this.completedSemesters.includes(semesterNum)) {
      this.completedSemesters.push(semesterNum);
    }

    // Unlock next semester
    if (semesterNum >= this.highestSemester && semesterNum < 8) {
      this.highestSemester = semesterNum + 1;
    }

    // Save progress to localStorage
    this.save();

    // Log completion
    console.log(`🎓 Semester ${semesterNum} completed!`, rewardResult);

    // Show notification for new cards
    if (rewardResult.cardsGained.length > 0) {
      const cardNames = rewardResult.cardsGained.map((id) => {
        const card = CARDS_DATA[id];
        return card ? card.getInfo().name : id;
      });
      console.log(`🃏 New cards unlocked: ${cardNames.join(", ")}`);
    }

    return rewardResult;
  }

  isSemesterUnlocked(semesterNum) {
    if (semesterNum === 1) return true;
    return this.completedSemesters.includes(semesterNum - 1);
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  get storageKey() {
    return `${this.#baseStorageKey}_${this.#currentUsername}`;
  }

  save() {
    const data = {
      currentXP: this.currentXP,
      currentLevel: this.currentLevel,
      totalXPEarned: this.totalXPEarned,
      unlockedCards: this.unlockedCards,
      favoriteDeck: this.favoriteDeck,
      highestSemester: this.highestSemester,
      completedSemesters: this.completedSemesters,
    };
    console.log(`💾 Saving progression to ${this.storageKey}`, data);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  loadProfile(username) {
    this.#currentUsername = username || "guest";
    console.log(
      `📂 Loading profile for: ${this.#currentUsername} (Key: ${this.storageKey})`,
    );
    if (!this.load()) {
      console.log("🆕 New profile, initializing starter cards.");
      this.reset();
      this.save();
    }
  }

  load() {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey));
      if (data) {
        this.currentXP = data.currentXP || 0;
        this.currentLevel = data.currentLevel || 1;
        this.totalXPEarned = data.totalXPEarned || 0;
        this.unlockedCards = data.unlockedCards || [];
        this.favoriteDeck = data.favoriteDeck || [];
        this.highestSemester = data.highestSemester || 1;
        this.completedSemesters = data.completedSemesters || [];

        // DATA MIGRATION: Convert old card IDs (like "c_001") to new keys (like "bukuPaket")
        if (
          this.unlockedCards.length > 0 &&
          typeof CARDS_DATA !== "undefined"
        ) {
          // Build a map from old Card.id to CARDS_DATA key
          const idToKeyMap = {};
          for (const [key, card] of Object.entries(CARDS_DATA)) {
            idToKeyMap[card.id] = key;
          }

          // Check if any cards need migration
          const needsMigration = this.unlockedCards.some(
            (cardId) => !CARDS_DATA[cardId] && idToKeyMap[cardId],
          );

          if (needsMigration) {
            console.log("🔄 Migrating old card IDs to new format...");
            this.unlockedCards = this.unlockedCards
              .map((cardId) => {
                // If it's already a valid key, keep it
                if (CARDS_DATA[cardId]) return cardId;
                // If it's an old ID, convert to new key
                if (idToKeyMap[cardId]) {
                  console.log(`   Migrated: ${cardId} → ${idToKeyMap[cardId]}`);
                  return idToKeyMap[cardId];
                }
                // Unknown card, skip it
                console.warn(`   Unknown card ID: ${cardId}`);
                return null;
              })
              .filter((id) => id !== null);
            this.save();
            console.log("✅ Migration complete!");
          }

          // Remove any remaining invalid cards
          const hasInvalidCard = this.unlockedCards.some(
            (cardId) => !CARDS_DATA[cardId],
          );
          if (hasInvalidCard) {
            console.warn("🔄 Removing invalid card IDs...");
            this.unlockedCards = this.unlockedCards.filter(
              (cardId) => CARDS_DATA[cardId],
            );
            this.save();
          }
        }

        // Also check and migrate favorite deck
        if (this.favoriteDeck.length > 0 && typeof CARDS_DATA !== "undefined") {
          // Build the map if not already created
          const idToKeyMap = {};
          for (const [key, card] of Object.entries(CARDS_DATA)) {
            idToKeyMap[card.id] = key;
          }

          // Migrate old IDs to new keys
          this.favoriteDeck = this.favoriteDeck
            .map((cardId) => {
              if (CARDS_DATA[cardId]) return cardId;
              if (idToKeyMap[cardId]) return idToKeyMap[cardId];
              return null;
            })
            .filter((id) => id !== null);

          // If migration removed cards, refill with defaults
          if (this.favoriteDeck.length < 5) {
            const defaults = [
              "bukuPaket",
              "tarikNapas",
              "makanBurjo",
              "airMineral",
              "modalNekat",
            ];
            for (const cardId of defaults) {
              if (
                !this.favoriteDeck.includes(cardId) &&
                this.favoriteDeck.length < 5
              ) {
                this.favoriteDeck.push(cardId);
              }
            }
            this.save();
          }
        }

        return true;
      }
    } catch (e) {
      console.error("Failed to load progression:", e);
    }
    return false;
  }

  reset() {
    this.currentXP = 0;
    this.currentLevel = 1;
    this.totalXPEarned = 0;
    this.tempXP = 0;
    this.tempNewCards = [];
    this.unlockedCards = [];
    this.favoriteDeck = [];
    this.highestSemester = 1;
    this.completedSemesters = [];
    this.initializeStarterCards();
  }
}

// Global instance
const playerProgression = new PlayerProgression();
