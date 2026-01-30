/**
 * CHILD CLASS 2: Masalah (Enemy)
 * Inherits from: MakhlukHidup
 */
class Masalah extends MakhlukHidup {
  #tipe_masalah;
  #drop_item;
  #exp_reward;
  #attack_patterns;
  #isBoss;
  #sprite;
  #stage;
  #specialAbilities;

  static TIPE_MASALAH = {
    TUGAS: "Tugas",
    DOSEN: "Dosen",
    ADMIN: "Admin",
    TEKNIS: "Teknis",
    SOSIAL: "Sosial",
  };

  constructor(config) {
    super(
      config.nama || "Masalah",
      config.max_sanity || 50,
      config.base_attack || 10
    );
    this.#tipe_masalah = config.tipe_masalah || Masalah.TIPE_MASALAH.TUGAS;
    this.#drop_item = config.drop_item || null;
    this.#exp_reward = config.exp_reward || 20;
    this.#attack_patterns = config.attack_patterns || [
      {
        id: "attack",
        name: "Serangan",
        damage: 1.0,
        chance: 0.6,
        message: "{enemy} menyerang!",
      },
      {
        id: "heavy",
        name: "Serangan Berat",
        damage: 1.5,
        chance: 0.4,
        message: "{enemy} melancarkan serangan berat!",
      },
    ];
    this.#isBoss = config.isBoss || false;
    this.#sprite = config.sprite || "👹";
    this.#stage = config.stage || 1;
    this.#specialAbilities = config.specialAbilities || [];
    if (this.#isBoss)
      this.addStatusEffect({
        type: "boss",
        name: "Boss",
        value: 0,
        duration: 999,
      });
  }

  get tipe_masalah() {
    return this.#tipe_masalah;
  }
  get drop_item() {
    return this.#drop_item;
  }
  get exp_reward() {
    return this.#exp_reward;
  }
  get attack_patterns() {
    return [...this.#attack_patterns];
  }
  get isBoss() {
    return this.#isBoss;
  }
  get sprite() {
    return this.#sprite;
  }
  get stage() {
    return this.#stage;
  }

  attack_pattern(player) {
    if (this.hasStatusEffect("stun"))
      return {
        id: "stunned",
        name: "Terdiam",
        damage: 0,
        isStunned: true,
        message: `${this.nama} masih terdiam...`,
      };

    if (
      this.#isBoss &&
      this.getSanityPercentage() < 30 &&
      this.#specialAbilities.length > 0 &&
      Math.random() < 0.5
    ) {
      return { ...this.#specialAbilities[0], isSpecial: true };
    }

    const rand = Math.random();
    let cumulative = 0;
    for (const atk of this.#attack_patterns) {
      cumulative += atk.chance;
      if (rand <= cumulative) return { ...atk };
    }
    return { ...this.#attack_patterns[0] };
  }

  executeAttack(player) {
    const attack = this.attack_pattern(player);
    if (attack.isStunned)
      return {
        success: true,
        skipped: true,
        attackName: attack.name,
        message: attack.message,
        damage: 0,
      };

    const baseDmg = Math.floor(this.calculateDamage() * attack.damage);
    const variance = Math.floor(Math.random() * 5) - 2;
    const actualDmg = Math.max(1, baseDmg + variance);
    const dmgResult = player.take_damage(actualDmg);
    const message = attack.message.replace("{enemy}", this.nama);

    return {
      success: true,
      skipped: false,
      attackId: attack.id,
      attackName: attack.name,
      damage: dmgResult.damage,
      message: `${message} (-${dmgResult.damage} Sanity)`,
      playerDead: dmgResult.is_dead,
      isSpecial: attack.isSpecial || false,
    };
  }

  take_damage(damage) {
    let actual = damage;
    if (this.#isBoss) actual = Math.floor(damage * 0.85);
    return super.take_damage(actual);
  }

  calculateDamage() {
    let damage = super.calculateDamage();
    if (this.#isBoss) damage = Math.floor(damage * 1.2);
    return Math.floor(damage * (1 + (this.#stage - 1) * 0.15));
  }

  getRewards() {
    const rewards = { exp: this.#exp_reward, items: [] };
    if (this.#drop_item && (this.#isBoss || Math.random() < 0.5))
      rewards.items.push(this.#drop_item);
    if (this.#isBoss) {
      rewards.exp *= 2;
      rewards.isBossReward = true;
    }
    return rewards;
  }

  getEnemyInfo() {
    return {
      ...this.getInfo(),
      tipe_masalah: this.#tipe_masalah,
      isBoss: this.#isBoss,
      sprite: this.#sprite,
      stage: this.#stage,
      exp_reward: this.#exp_reward,
    };
  }

  clone() {
    return new Masalah({
      nama: this.nama,
      max_sanity: this.max_sanity,
      base_attack: this.base_attack,
      tipe_masalah: this.#tipe_masalah,
      drop_item: this.#drop_item,
      exp_reward: this.#exp_reward,
      attack_patterns: this.#attack_patterns,
      isBoss: this.#isBoss,
      sprite: this.#sprite,
      stage: this.#stage,
      specialAbilities: this.#specialAbilities,
    });
  }
}
