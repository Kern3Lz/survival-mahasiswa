/**
 * ============================================
 * CARD CLASS
 * ============================================
 *
 * Class untuk kartu dalam deck building system
 */

class Card {
  #id;
  #name;
  #description;
  #cost; // Energy cost
  #type; // attack, defense, skill, power
  #rarity; // common, uncommon, rare
  #icon;
  #effect;
  #value; // Damage/Block value
  #upgraded;

  static TYPES = {
    ATTACK: "attack",
    DEFENSE: "defense",
    SKILL: "skill",
    POWER: "power",
    BLOCK: "block",
    BUFF: "buff",
    HEAL: "heal",
    KILL: "kill",
  };

  static RARITY = {
    STARTER: "starter",
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    ULTIMATE: "ultimate",
  };

  constructor(config) {
    this.#id = config.id;
    this.#name = config.name;
    this.#description = config.description;
    // FIX: Use !== undefined to properly handle cost: 0
    // (0 is falsy in JS, so "config.cost || 1" would turn 0 into 1)
    this.#cost = config.cost !== undefined ? config.cost : 1;
    this.#type = config.type || Card.TYPES.ATTACK;
    this.#rarity = config.rarity || Card.RARITY.COMMON;
    this.#icon = config.icon || "🃏";
    this.#effect = config.effect || null;
    this.#value = config.value || 0;
    this.#upgraded = false;
  }

  // Getters
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  get cost() {
    return this.#cost;
  }
  get type() {
    return this.#type;
  }
  get rarity() {
    return this.#rarity;
  }
  get icon() {
    return this.#icon;
  }
  get effect() {
    return this.#effect;
  }
  get value() {
    return this.#value;
  }
  get upgraded() {
    return this.#upgraded;
  }

  /**
   * Check if icon is image path or emoji
   * @returns {string} 'image' or 'emoji'
   */
  get iconType() {
    if (typeof this.#icon === "string") {
      return this.#icon.startsWith("/") ||
        this.#icon.startsWith("http") ||
        this.#icon.startsWith("./") ||
        this.#icon.endsWith(".png") ||
        this.#icon.endsWith(".jpg") ||
        this.#icon.endsWith(".webp")
        ? "image"
        : "emoji";
    }
    return "emoji";
  }

  /**
   * Check if player can play this card
   * @param {number} currentEnergy - Player's current energy
   * @returns {object}
   */
  canPlay(currentEnergy) {
    if (currentEnergy < this.#cost) {
      return { canPlay: false, reason: `Butuh ${this.#cost} Energy` };
    }
    return { canPlay: true };
  }

  /**
   * Get card info for display
   * @returns {object}
   */
  getInfo() {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      cost: this.#cost,
      type: this.#type,
      rarity: this.#rarity,
      icon: this.#icon,
      value: this.#value,
      upgraded: this.#upgraded,
    };
  }

  /**
   * Clone card
   * @returns {Card}
   */
  clone() {
    const cloned = new Card({
      id: this.#id,
      name: this.#name,
      description: this.#description,
      cost: this.#cost,
      type: this.#type,
      rarity: this.#rarity,
      icon: this.#icon,
      effect: this.#effect,
      value: this.#value,
    });
    return cloned;
  }

  /**
   * Get CSS class for card type
   * @returns {string}
   */
  getTypeClass() {
    return `card-${this.#type}`;
  }

  /**
   * Get CSS class for rarity
   * @returns {string}
   */
  getRarityClass() {
    return `rarity-${this.#rarity}`;
  }

  toString() {
    return `[${this.#cost}] ${this.#name}: ${this.#description}`;
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = Card;
}
