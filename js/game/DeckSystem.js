/**
 * ============================================
 * DECK SYSTEM
 * ============================================
 *
 * Mengelola sistem kartu menggunakan struktur data:
 * - Draw Pile: STACK (LIFO) - Ambil kartu dari atas
 * - Discard Pile: STACK (LIFO) - Buang kartu ke atas
 * - Hand: ARRAY/LIST - Akses random
 * - Action History: QUEUE (FIFO) - Urutan aksi
 */

class DeckSystem {
  #drawPile; // Stack - Tumpukan kartu ambil
  #discardPile; // Stack - Tumpukan kartu buang
  #hand; // Array - Kartu di tangan
  #exhaustPile; // Array - Kartu yang di-exhaust (tidak kembali)
  #actionHistory; // Queue - Riwayat aksi
  #maxHandSize;
  #cardsPerTurn;

  constructor(config = {}) {
    this.#drawPile = new Stack();
    this.#discardPile = new Stack();
    this.#hand = [];
    this.#exhaustPile = [];
    this.#actionHistory = new Queue(50); // Keep last 50 actions
    this.#maxHandSize = config.maxHandSize || 10;
    this.#cardsPerTurn = config.cardsPerTurn || 5;
  }

  // ============================================
  // GETTERS
  // ============================================

  get drawPile() {
    return this.#drawPile;
  }
  get discardPile() {
    return this.#discardPile;
  }
  get hand() {
    return [...this.#hand];
  }
  get exhaustPile() {
    return [...this.#exhaustPile];
  }
  get actionHistory() {
    return this.#actionHistory;
  }

  getDrawPileCount() {
    return this.#drawPile.size();
  }
  getDiscardPileCount() {
    return this.#discardPile.size();
  }
  getHandCount() {
    return this.#hand.length;
  }
  getExhaustCount() {
    return this.#exhaustPile.length;
  }

  // ============================================
  // DECK INITIALIZATION
  // ============================================

  /**
   * Initialize deck dengan kartu starter
   * @param {Array} cards - Array of Card objects
   */
  initializeDeck(cards) {
    this.#drawPile.clear();
    this.#discardPile.clear();
    this.#hand = [];
    this.#exhaustPile = [];
    this.#actionHistory.clear();

    // Push semua kartu ke Draw Pile
    cards.forEach((card) => {
      this.#drawPile.push(card);
    });

    // Shuffle Draw Pile
    this.#drawPile.shuffle();

    // Log action
    this.#logAction({
      type: "DECK_INIT",
      message: `Deck initialized with ${cards.length} cards`,
      timestamp: Date.now(),
    });
  }

  // ============================================
  // DRAW CARDS (Stack POP operation)
  // ============================================

  /**
   * Draw kartu dari Draw Pile ke Hand
   * Menggunakan Stack POP (LIFO)
   * @param {number} count - Jumlah kartu yang diambil
   * @returns {Array} - Kartu yang berhasil diambil
   */
  drawCards(count = 1) {
    const drawnCards = [];

    for (let i = 0; i < count; i++) {
      // Cek apakah tangan sudah penuh
      if (this.#hand.length >= this.#maxHandSize) {
        this.#logAction({
          type: "DRAW_FAILED",
          message: "Hand is full!",
          timestamp: Date.now(),
        });
        break;
      }

      // Cek apakah Draw Pile kosong -> Reshuffle
      if (this.#drawPile.isEmpty()) {
        this.reshuffleDeck();

        // Jika masih kosong setelah reshuffle, stop
        if (this.#drawPile.isEmpty()) {
          this.#logAction({
            type: "DRAW_FAILED",
            message: "No cards left to draw!",
            timestamp: Date.now(),
          });
          break;
        }
      }

      // POP kartu dari Draw Pile (STACK - LIFO)
      const card = this.#drawPile.pop();
      this.#hand.push(card);
      drawnCards.push(card);

      this.#logAction({
        type: "DRAW_CARD",
        card: card.name,
        message: `Drew ${card.name}`,
        timestamp: Date.now(),
      });
    }

    return drawnCards;
  }

  /**
   * Draw kartu untuk awal turn
   * @returns {Array}
   */
  drawForTurn() {
    return this.drawCards(this.#cardsPerTurn);
  }

  // ============================================
  // DISCARD CARDS (Stack PUSH operation)
  // ============================================

  /**
   * Buang kartu dari Hand ke Discard Pile
   * Menggunakan Stack PUSH (LIFO)
   * @param {number} handIndex - Index kartu di tangan
   * @returns {Card|null}
   */
  discardCard(handIndex) {
    if (handIndex < 0 || handIndex >= this.#hand.length) {
      return null;
    }

    // Remove dari hand
    const card = this.#hand.splice(handIndex, 1)[0];

    // PUSH ke Discard Pile (STACK - LIFO)
    this.#discardPile.push(card);

    this.#logAction({
      type: "DISCARD_CARD",
      card: card.name,
      message: `Discarded ${card.name}`,
      timestamp: Date.now(),
    });

    return card;
  }

  /**
   * Buang kartu berdasarkan card object
   * @param {Card} card - Card to discard
   * @returns {boolean}
   */
  discardCardByRef(card) {
    const index = this.#hand.findIndex((c) => c === card);
    if (index !== -1) {
      this.discardCard(index);
      return true;
    }
    return false;
  }

  /**
   * Buang semua kartu di tangan (end of turn)
   */
  discardHand() {
    const discarded = [];
    while (this.#hand.length > 0) {
      const card = this.#hand.pop();
      this.#discardPile.push(card);
      discarded.push(card);
    }

    if (discarded.length > 0) {
      this.#logAction({
        type: "DISCARD_HAND",
        count: discarded.length,
        message: `Discarded ${discarded.length} cards from hand`,
        timestamp: Date.now(),
      });
    }

    return discarded;
  }

  // ============================================
  // RESHUFFLE LOGIC
  // ============================================

  /**
   * Reshuffle: Pindahkan Discard Pile ke Draw Pile lalu shuffle
   * Ini adalah logika kunci dalam deck-building game
   */
  reshuffleDeck() {
    if (this.#discardPile.isEmpty()) {
      return false;
    }

    const reshuffleCount = this.#discardPile.size();

    // Transfer semua dari Discard ke Draw
    this.#discardPile.transferTo(this.#drawPile);

    // Shuffle Draw Pile
    this.#drawPile.shuffle();

    this.#logAction({
      type: "RESHUFFLE",
      count: reshuffleCount,
      message: `Reshuffled ${reshuffleCount} cards from Discard to Draw Pile`,
      timestamp: Date.now(),
    });

    return true;
  }

  // ============================================
  // PLAY CARD
  // ============================================

  /**
   * Mainkan kartu dari tangan
   * @param {number} handIndex - Index kartu di tangan
   * @param {object} context - Context untuk eksekusi (player, enemy, dll)
   * @returns {object} - Hasil play kartu
   */
  playCard(handIndex, context) {
    if (handIndex < 0 || handIndex >= this.#hand.length) {
      return { success: false, message: "Invalid card index" };
    }

    const card = this.#hand[handIndex];

    // Check energy
    if (context.currentEnergy < card.cost) {
      return {
        success: false,
        message: `Not enough energy! Need ${card.cost}, have ${context.currentEnergy}`,
      };
    }

    // Remove from hand
    this.#hand.splice(handIndex, 1);

    // Log action ke Queue (FIFO)
    this.#logAction({
      type: "PLAY_CARD",
      card: card.name,
      cost: card.cost,
      message: `Played ${card.name} (Cost: ${card.cost})`,
      timestamp: Date.now(),
    });

    // Check if card should be exhausted
    if (card.effect && card.effect.exhaust) {
      this.#exhaustPile.push(card);
      this.#logAction({
        type: "EXHAUST_CARD",
        card: card.name,
        message: `${card.name} was exhausted`,
        timestamp: Date.now(),
      });
    } else {
      // Normal: Push to Discard Pile
      this.#discardPile.push(card);
    }

    return {
      success: true,
      card: card,
      energyCost: card.cost,
    };
  }

  // ============================================
  // EXHAUST CARD
  // ============================================

  /**
   * Exhaust kartu (remove dari game)
   * @param {number} handIndex
   */
  exhaustCard(handIndex) {
    if (handIndex < 0 || handIndex >= this.#hand.length) {
      return null;
    }

    const card = this.#hand.splice(handIndex, 1)[0];
    this.#exhaustPile.push(card);

    this.#logAction({
      type: "EXHAUST_CARD",
      card: card.name,
      message: `${card.name} was exhausted`,
      timestamp: Date.now(),
    });

    return card;
  }

  // ============================================
  // ADD CARD TO DECK
  // ============================================

  /**
   * Tambah kartu baru ke deck (reward)
   * @param {Card} card
   */
  addCardToDeck(card) {
    // Tambah ke Discard Pile (akan masuk deck saat reshuffle)
    this.#discardPile.push(card);

    this.#logAction({
      type: "ADD_CARD",
      card: card.name,
      message: `Added ${card.name} to deck`,
      timestamp: Date.now(),
    });
  }

  // ============================================
  // ACTION HISTORY (Queue operations)
  // ============================================

  /**
   * Log action ke history queue (FIFO)
   * @param {object} action
   */
  #logAction(action) {
    this.#actionHistory.enqueue(action);
  }

  /**
   * Get recent actions
   * @param {number} count
   * @returns {Array}
   */
  getRecentActions(count = 10) {
    return this.#actionHistory.getLast(count);
  }

  // ============================================
  // GET CARD FROM HAND
  // ============================================

  /**
   * Get card at hand index
   * @param {number} index
   * @returns {Card|null}
   */
  getHandCard(index) {
    return this.#hand[index] || null;
  }

  /**
   * Find card in hand by ID
   * @param {string} cardId
   * @returns {number} - Index or -1
   */
  findCardInHand(cardId) {
    return this.#hand.findIndex((c) => c.id === cardId);
  }

  // ============================================
  // DEBUG & DISPLAY
  // ============================================

  /**
   * Get deck state for UI display
   * @returns {object}
   */
  getState() {
    return {
      drawPile: this.#drawPile.size(),
      discardPile: this.#discardPile.size(),
      hand: this.#hand.map((c) => c.getInfo()),
      exhaustPile: this.#exhaustPile.length,
      recentActions: this.getRecentActions(5),
    };
  }

  /**
   * Debug: Print deck state
   */
  debugPrint() {
    console.log("=== DECK STATE ===");
    console.log("Draw Pile:", this.#drawPile.toString());
    console.log("Discard Pile:", this.#discardPile.toString());
    console.log("Hand:", this.#hand.map((c) => c.name).join(", "));
    console.log("Exhaust:", this.#exhaustPile.map((c) => c.name).join(", "));
    console.log("History:", this.#actionHistory.toString());
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = DeckSystem;
}
