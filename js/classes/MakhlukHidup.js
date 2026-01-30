/**
 * ============================================
 * PARENT CLASS: MakhlukHidup (Entity)
 * ============================================
 */
class MakhlukHidup {
  #nama;
  #max_sanity;
  #curr_sanity;
  #base_attack;
  #statusEffects;

  constructor(nama, max_sanity, base_attack) {
    this.#nama = nama;
    this.#max_sanity = max_sanity;
    this.#curr_sanity = max_sanity;
    this.#base_attack = base_attack;
    this.#statusEffects = [];
  }

  get nama() {
    return this.#nama;
  }
  get max_sanity() {
    return this.#max_sanity;
  }
  get curr_sanity() {
    return this.#curr_sanity;
  }
  get base_attack() {
    return this.#base_attack;
  }
  get statusEffects() {
    return [...this.#statusEffects];
  }

  set nama(v) {
    if (typeof v === "string" && v.length > 0) this.#nama = v;
  }
  set max_sanity(v) {
    if (typeof v === "number" && v > 0) {
      this.#max_sanity = v;
      if (this.#curr_sanity > v) this.#curr_sanity = v;
    }
  }
  set curr_sanity(v) {
    if (typeof v === "number")
      this.#curr_sanity = Math.max(0, Math.min(v, this.#max_sanity));
  }
  set base_attack(v) {
    if (typeof v === "number" && v >= 0) this.#base_attack = v;
  }

  take_damage(damage) {
    let actualDamage = damage;
    const shield = this.#statusEffects.find((e) => e.type === "shield");
    if (shield) actualDamage = Math.floor(damage * (1 - shield.value));
    this.#curr_sanity = Math.max(0, this.#curr_sanity - actualDamage);
    return {
      damage: actualDamage,
      remaining: this.#curr_sanity,
      is_dead: !this.is_alive(),
    };
  }

  is_alive() {
    return this.#curr_sanity > 0;
  }

  heal(amount) {
    const old = this.#curr_sanity;
    this.#curr_sanity = Math.min(this.#max_sanity, this.#curr_sanity + amount);
    return {
      healed: this.#curr_sanity - old,
      current: this.#curr_sanity,
      max: this.#max_sanity,
    };
  }

  calculateDamage() {
    const variance = 0.2;
    const min = Math.floor(this.#base_attack * (1 - variance));
    const max = Math.ceil(this.#base_attack * (1 + variance));
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  basicAttack(target) {
    const damage = this.calculateDamage();
    const result = target.take_damage(damage);
    return {
      attacker: this.#nama,
      target: target.nama,
      damage: result.damage,
      targetDead: result.is_dead,
    };
  }

  addStatusEffect(effect) {
    this.removeStatusEffect(effect.type);
    this.#statusEffects.push({ ...effect, turnsRemaining: effect.duration });
  }

  removeStatusEffect(type) {
    this.#statusEffects = this.#statusEffects.filter((e) => e.type !== type);
  }

  processStatusEffects() {
    const results = [];
    this.#statusEffects = this.#statusEffects.filter((e) => {
      e.turnsRemaining--;
      if (e.type === "poison" || e.type === "burn") {
        this.#curr_sanity = Math.max(0, this.#curr_sanity - e.value);
        results.push({
          type: e.type,
          name: e.name,
          damage: e.value,
          expired: e.turnsRemaining <= 0,
        });
      } else if (e.type === "regen") {
        this.heal(e.value);
        results.push({
          type: e.type,
          name: e.name,
          heal: e.value,
          expired: e.turnsRemaining <= 0,
        });
      }
      return e.turnsRemaining > 0;
    });
    return results;
  }

  hasStatusEffect(type) {
    return this.#statusEffects.some((e) => e.type === type);
  }
  getStatusEffect(type) {
    return this.#statusEffects.find((e) => e.type === type) || null;
  }
  clearAllStatusEffects() {
    this.#statusEffects = [];
  }
  getSanityPercentage() {
    return Math.round((this.#curr_sanity / this.#max_sanity) * 100);
  }
  resetSanity() {
    this.#curr_sanity = this.#max_sanity;
    this.#statusEffects = [];
  }

  getInfo() {
    return {
      nama: this.#nama,
      max_sanity: this.#max_sanity,
      curr_sanity: this.#curr_sanity,
      base_attack: this.#base_attack,
      sanityPercent: this.getSanityPercentage(),
      isAlive: this.is_alive(),
      statusEffects: this.statusEffects,
    };
  }

  toString() {
    return `${this.#nama} [HP: ${this.#curr_sanity}/${this.#max_sanity}, ATK: ${
      this.#base_attack
    }]`;
  }
}
