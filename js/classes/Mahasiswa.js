/**
 * CHILD CLASS 1: Mahasiswa (Player)
 * Inherits from: MakhlukHidup
 */
class Mahasiswa extends MakhlukHidup {
  #energi_kopi;
  #max_kopi;
  #semester;
  #inventory;
  #skills;
  #experience;
  #expToNextLevel;
  #jurusan;
  #sprite;

  static JURUSAN_STATS = {
    teknik: {
      name: "Teknik",
      sanityBonus: -5,
      kopiBonus: 0,
      attackBonus: 10,
      sprite: "👨‍💻",
    },
    ekonomi: {
      name: "Ekonomi",
      sanityBonus: 0,
      kopiBonus: 15,
      attackBonus: 0,
      sprite: "👨‍💼",
    },
    kedokteran: {
      name: "Kedokteran",
      sanityBonus: 20,
      kopiBonus: -5,
      attackBonus: 0,
      sprite: "👨‍⚕️",
    },
    hukum: {
      name: "Hukum",
      sanityBonus: 5,
      kopiBonus: 5,
      attackBonus: 5,
      sprite: "👨‍⚖️",
    },
  };

  constructor(nama, jurusan = "teknik") {
    const config =
      Mahasiswa.JURUSAN_STATS[jurusan] || Mahasiswa.JURUSAN_STATS.teknik;
    super(nama, 100 + config.sanityBonus, 15 + config.attackBonus);
    this.#max_kopi = 50 + config.kopiBonus;
    this.#energi_kopi = this.#max_kopi;
    this.#semester = 1;
    this.#inventory = [];
    this.#skills = ["basicAttack", "sistemKebut", "copyPaste", "alasanLaptop"];
    this.#experience = 0;
    this.#expToNextLevel = 100;
    this.#jurusan = jurusan;
    this.#sprite = config.sprite;
  }

  get energi_kopi() {
    return this.#energi_kopi;
  }
  get max_kopi() {
    return this.#max_kopi;
  }
  get semester() {
    return this.#semester;
  }
  get inventory() {
    return [...this.#inventory];
  }
  get skills() {
    return [...this.#skills];
  }
  get experience() {
    return this.#experience;
  }
  get expToNextLevel() {
    return this.#expToNextLevel;
  }
  get jurusan() {
    return this.#jurusan;
  }
  get sprite() {
    return this.#sprite;
  }
  set energi_kopi(v) {
    this.#energi_kopi = Math.max(0, Math.min(v, this.#max_kopi));
  }

  use_skill(skillId, target, skillData) {
    if (!this.#skills.includes(skillId))
      return { success: false, message: "Skill tidak dimiliki!" };
    if (skillData.kopiCost > this.#energi_kopi)
      return { success: false, message: `Butuh ${skillData.kopiCost} Kopi` };
    this.#energi_kopi -= skillData.kopiCost;
    let result = {
      success: true,
      skillName: skillData.name,
      attacker: this.nama,
      kopiUsed: skillData.kopiCost,
    };

    switch (skillId) {
      case "basicAttack":
        const dmg = this.calculateDamage();
        const r = target.take_damage(dmg);
        result = {
          ...result,
          type: "damage",
          damage: r.damage,
          message: `${this.nama} melancarkan serangan! -${r.damage} Sanity`,
          targetDead: r.is_dead,
        };
        break;
      case "sistemKebut":
        const sDmg = this.base_attack * 3 + Math.floor(Math.random() * 10);
        this.take_damage(10);
        const sR = target.take_damage(sDmg);
        result = {
          ...result,
          type: "ultimate",
          damage: sR.damage,
          selfDamage: 10,
          message: `⚡ SISTEM KEBUT SEMALAM! ${sR.damage} damage tapi -10 Sanity!`,
          targetDead: sR.is_dead,
          isCritical: true,
        };
        break;
      case "copyPaste":
        if (Math.random() >= 0.5) {
          const cDmg = target.hasStatusEffect("boss")
            ? Math.floor(target.max_sanity * 0.5)
            : target.curr_sanity;
          const cR = target.take_damage(cDmg);
          result = {
            ...result,
            type: "gambling",
            success: true,
            damage: cR.damage,
            message: `🎰 COPY PASTE BERHASIL! ${cR.damage} damage!`,
            targetDead: cR.is_dead,
          };
        } else {
          this.take_damage(30);
          result = {
            ...result,
            type: "gambling",
            success: false,
            damage: 0,
            selfDamage: 30,
            message: `🎰 COPY PASTE KETAHUAN! -30 Sanity!`,
            targetDead: false,
          };
        }
        break;
      case "alasanLaptop":
        target.addStatusEffect({
          type: "stun",
          name: "Percaya Alasan",
          value: 0,
          duration: 1,
        });
        result = {
          ...result,
          type: "defensive",
          damage: 0,
          message: `🛡️ "Laptop saya rusak!" Skip giliran musuh!`,
          targetDead: false,
        };
        break;
    }
    return result;
  }

  minum_kopi(amount) {
    const old = this.#energi_kopi;
    this.#energi_kopi = Math.min(this.#max_kopi, this.#energi_kopi + amount);
    return {
      gained: this.#energi_kopi - old,
      current: this.#energi_kopi,
      max: this.#max_kopi,
    };
  }

  useKopi(amount) {
    this.#energi_kopi = Math.max(0, this.#energi_kopi - amount);
  }

  belajar(exp) {
    this.#experience += exp;
    let leveledUp = false,
      oldSem = this.#semester;
    while (this.#experience >= this.#expToNextLevel && this.#semester < 8) {
      this.#experience -= this.#expToNextLevel;
      this.#semester++;
      this.#expToNextLevel = Math.floor(this.#expToNextLevel * 1.5);
      leveledUp = true;
      this.max_sanity = this.max_sanity + 10;
      this.heal(10);
      this.#max_kopi += 5;
      this.#energi_kopi = Math.min(this.#max_kopi, this.#energi_kopi + 5);
      this.base_attack = this.base_attack + 3;
    }
    return {
      expGained: exp,
      leveledUp,
      oldSemester: oldSem,
      newSemester: this.#semester,
    };
  }

  addItem(item) {
    const existing = this.#inventory.find((i) => i.id === item.id);
    if (existing && item.stackable)
      existing.quantity = (existing.quantity || 1) + 1;
    else this.#inventory.push({ ...item, quantity: 1 });
  }

  removeItem(itemId) {
    const i = this.#inventory.findIndex((x) => x.id === itemId);
    if (i !== -1) {
      if (this.#inventory[i].quantity > 1) this.#inventory[i].quantity--;
      else this.#inventory.splice(i, 1);
      return true;
    }
    return false;
  }

  useItem(itemId) {
    const item = this.#inventory.find((i) => i.id === itemId);
    if (!item) return { success: false, message: "Item tidak ditemukan!" };
    let result = { success: true, itemName: item.name, itemId };
    if (item.type === "healing") {
      const h = this.heal(item.value);
      result.message = `🧪 ${item.name}! Sanity +${h.healed}`;
    } else if (item.type === "kopi") {
      const k = this.minum_kopi(item.value);
      result.message = `☕ ${item.name}! Kopi +${k.gained}`;
    } else {
      result.message = `${this.nama} menggunakan ${item.name}!`;
    }
    this.removeItem(itemId);
    return result;
  }

  take_damage(damage) {
    return super.take_damage(damage);
  }

  calculateDamage() {
    return Math.floor(
      super.calculateDamage() * (1 + (this.#semester - 1) * 0.05),
    );
  }

  getKopiPercentage() {
    return Math.round((this.#energi_kopi / this.#max_kopi) * 100);
  }
  resetForBattle() {
    this.resetSanity();
    this.#energi_kopi = this.#max_kopi;
  }

  getFullInfo() {
    return {
      ...this.getInfo(),
      energi_kopi: this.#energi_kopi,
      max_kopi: this.#max_kopi,
      kopiPercent: this.getKopiPercentage(),
      semester: this.#semester,
      experience: this.#experience,
      expToNextLevel: this.#expToNextLevel,
      jurusan: this.#jurusan,
      jurusanName: Mahasiswa.JURUSAN_STATS[this.#jurusan]?.name || "Unknown",
      sprite: this.#sprite,
      inventory: this.#inventory,
      skills: this.#skills,
    };
  }
}
