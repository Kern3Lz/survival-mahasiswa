/**
 * ============================================
 * WEIGHTED BATTLE SYSTEM
 * Uses Weighted RNG for card drawing
 * No deck/discard pile - draws from "universe"
 * ============================================
 */

class WeightedBattleSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;

    // Battle state
    this.player = null;
    this.enemy = null;
    this.battleActive = false;
    this.turnCount = 0;
    this.isPlayerTurn = true;

    // Stamina (Energy) system - based on player level
    this.maxStamina = 3;
    this.currentStamina = 3;

    // Hand - 5 cards each turn (drawn fresh)
    this.hand = [];
    this.cardsPerTurn = 5;

    // Combat stats
    this.playerShield = 0;
    this.enemyShield = 0;
    this.playerStrength = 0;

    // Status effects & buffs
    this.playerBuffs = [];
    this.enemyDebuffs = [];
    this.enemySkipTurn = false;

    // Round info
    this.currentSemester = 1;
    this.currentRound = 1;

    // Critical hit settings
    this.critChance = 0.2; // 20% chance
    this.critMultiplier = 2.0; // 2x damage
  }

  // ============================================
  // BATTLE INITIALIZATION
  // ============================================

  startBattle(player, enemy, semester, round) {
    this.player = player;
    this.enemy = enemy;
    this.currentSemester = semester;
    this.currentRound = round;
    this.battleActive = true;
    this.turnCount = 0;
    this.isPlayerTurn = true;

    // Reset combat stats
    this.maxStamina = playerProgression.getMaxStamina();
    this.currentStamina = this.maxStamina;
    // this.playerShield = 0; // Shield persists between battles!
    this.enemyShield = 0;
    this.playerStrength = 0;
    this.playerBuffs = [];
    this.enemyDebuffs = [];
    this.enemySkipTurn = false;
    this.hand = [];

    // Start first turn
    this.startPlayerTurn();

    this.updateUI();
    this.addLog(`⚔️ ${enemy.nama} muncul!`, "system");
    this.addLog(`📊 Semester ${semester} - Ronde ${round}`, "system");
  }

  // ============================================
  // WEIGHTED CARD DRAW (No Deck/Discard)
  // ============================================

  drawHand() {
    // Clear old hand
    this.hand = [];

    // Draw cards using weighted RNG from player's collection
    const drawnCardIds = playerProgression.drawWeightedCards(
      this.cardsPerTurn + 2,
    ); // Draw extra to filter
    const usedUltimateIds = new Set();
    let cardsAdded = 0;

    // Convert IDs to Card objects, preventing duplicate ultimates
    for (const cardId of drawnCardIds) {
      if (cardsAdded >= this.cardsPerTurn) break;

      const cardData = CARDS_DATA[cardId];
      if (!cardData) continue;

      const cardInfo = cardData.getInfo();

      // Check if ultimate - only allow one of each ultimate type
      if (cardInfo.rarity === Card.RARITY.ULTIMATE) {
        if (usedUltimateIds.has(cardId)) {
          continue; // Skip duplicate ultimate
        }
        usedUltimateIds.add(cardId);
      }

      this.hand.push(cardData.clone());
      cardsAdded++;
    }

    return this.hand;
  }

  // ============================================
  // TURN MANAGEMENT
  // ============================================

  startPlayerTurn() {
    this.turnCount++;
    this.isPlayerTurn = true;

    // Reset stamina for turn
    this.currentStamina = this.maxStamina;

    // Process permanent buffs
    this.processPlayerBuffs();

    // Draw fresh hand from weighted pool
    this.drawHand();
    this.addLog(`🃏 Drew ${this.hand.length} cards`, "system");

    this.updateUI();
    this.updateTurnIndicator();
    this.enableCardInteraction();
  }

  endPlayerTurn() {
    // Hand cards are discarded (disappear) - no discard pile
    this.addLog(`✋ Turn ended`, "system");
    this.hand = [];

    this.isPlayerTurn = false;
    this.updateTurnIndicator();
    this.disableCardInteraction();

    setTimeout(() => this.enemyTurn(), 800);
  }

  enemyTurn() {
    if (!this.battleActive || !this.enemy.is_alive()) return;

    // Check if enemy should skip turn
    if (this.enemySkipTurn) {
      this.enemySkipTurn = false;
      this.addLog(`😵 ${this.enemy.nama} skips turn!`, "enemy-action");
      this.enemyShield = 0;
      setTimeout(() => this.startPlayerTurn(), 800);
      return;
    }

    // Calculate damage modifier from debuffs
    let damageModifier = 1;
    const weakDebuff = this.enemyDebuffs.find((d) => d.type === "weak");
    if (weakDebuff) {
      damageModifier = 0.75;
      weakDebuff.duration--;
      if (weakDebuff.duration <= 0) {
        this.enemyDebuffs = this.enemyDebuffs.filter((d) => d.type !== "weak");
      }
    }

    // Get enemy attack
    const attack = this.enemy.attack_pattern(this.player);
    let damage = Math.floor(this.enemy.base_attack * damageModifier);

    // Check for INVINCIBILITY - Acc Dosen ultimate card
    const invincibleBuff = this.playerBuffs.find(
      (b) => b.type === "invincible",
    );
    if (invincibleBuff) {
      this.addLog(
        `✅ KEBAL! Serangan ${this.enemy.nama} tidak berpengaruh!`,
        "system",
      );
      this.animateSprite("enemy", "attacking");
      this.showDamagePopup("player", 0, "blocked");

      // Reduce duration
      invincibleBuff.duration--;
      if (invincibleBuff.duration <= 0) {
        this.playerBuffs = this.playerBuffs.filter(
          (b) => b.type !== "invincible",
        );
        this.addLog(`⚠️ Kebal berakhir!`, "system");
      } else {
        this.addLog(
          `✅ Kebal: ${invincibleBuff.duration} turn tersisa`,
          "system",
        );
      }

      this.enemy.processStatusEffects();
      this.enemyShield = 0;
      this.updateUI();
      setTimeout(() => this.startPlayerTurn(), 800);
      return;
    }

    // Check for DODGE - Nitip Absen card
    const dodgeBuff = this.playerBuffs.find((b) => b.type === "dodge");
    if (dodgeBuff) {
      this.addLog(`👻 DODGE! Serangan ${this.enemy.nama} meleset!`, "system");
      this.animateSprite("enemy", "attacking");
      this.showDamagePopup("player", 0, "dodge");

      // Remove dodge buff after use
      this.playerBuffs = this.playerBuffs.filter((b) => b.type !== "dodge");

      this.enemy.processStatusEffects();
      this.enemyShield = 0;
      this.updateUI();
      setTimeout(() => this.startPlayerTurn(), 800);
      return;
    }

    // Apply shield first (shield is persistent)
    if (this.playerShield > 0) {
      const absorbed = Math.min(this.playerShield, damage);
      this.playerShield -= absorbed;
      damage -= absorbed;
      if (absorbed > 0) {
        this.addLog(`🛡️ Shield absorbed ${absorbed} damage`, "system");
      }
    }

    if (damage > 0) {
      this.player.take_damage(damage);
      this.animateSprite("enemy", "attacking");
      setTimeout(() => {
        this.animateSprite("player", "damaged");
        this.showDamagePopup("player", damage);
      }, 200);
    }

    this.addLog(
      `${this.enemy.nama} attacks! (-${damage} Sanity)`,
      "enemy-action",
    );

    this.enemy.processStatusEffects();
    this.enemyShield = 0;

    this.updateUI();

    if (!this.player.is_alive()) {
      this.handleDefeat();
    } else {
      setTimeout(() => this.startPlayerTurn(), 800);
    }
  }

  // ============================================
  // CARD PLAYING
  // ============================================

  playCard(handIndex) {
    if (!this.isPlayerTurn || !this.battleActive) return;

    const card = this.hand[handIndex];
    if (!card) return;

    const cardInfo = card.getInfo();
    const isUltimate =
      cardInfo.rarity === Card.RARITY.ULTIMATE || card.cost === "ALL";

    // Ultimate cards require FULL stamina and consume ALL
    if (isUltimate) {
      if (this.currentStamina < this.maxStamina) {
        this.addLog(
          `❌ Ultimate requires FULL stamina (${this.maxStamina}/${this.maxStamina})!`,
          "system",
        );
        soundSystem.play("click");
        return;
      }
      // Consume ALL stamina for ultimate
      this.currentStamina = 0;
      this.addLog(`💫 ULTIMATE CARD ACTIVATED!`, "system");
    } else {
      // Regular card cost
      const cardCost = parseInt(card.cost) || 0;

      // Check stamina (energy) - cost 0 cards are always free
      if (cardCost > 0 && this.currentStamina < cardCost) {
        this.addLog(
          `❌ Need ${cardCost} stamina, have ${this.currentStamina}`,
          "system",
        );
        soundSystem.play("click");
        return;
      }

      // Use stamina (cost 0 = free)
      if (cardCost > 0) {
        this.currentStamina -= cardCost;
      }
    }

    // Play sound based on card type
    soundSystem.playCardSound(card.type);

    // Remove card from hand
    this.hand.splice(handIndex, 1);

    // Execute card effect
    this.executeCardEffect(card);
    this.updateUI();

    if (!this.enemy.is_alive()) {
      soundSystem.play("victory");
      this.handleVictory();
    }
  }

  // Ultimate Card - costs ALL stamina (must be full)
  playUltimateCard(card) {
    if (this.currentStamina < this.maxStamina) {
      this.addLog(`❌ Ultimate requires FULL stamina!`, "system");
      return false;
    }

    this.currentStamina = 0;
    this.executeCardEffect(card);
    this.addLog(`⚡ ULTIMATE: ${card.name}!`, "player-action");
    this.updateUI();

    return true;
  }

  executeCardEffect(card) {
    const info = card.getInfo();
    let effectExecuted = false;

    // 1. Handle Special Types (Mutually Exclusive mostly)

    // Gambling
    if (card.effect?.gambling) {
      this.executeGamblingCard(card);
      // Gambling card handles its own success/fail logic including effects
      // We return here because gambling cards have unique fail states
      return;
    }

    // Ultimate: Instant Kill
    if (card.effect?.instantKill) {
      this.executeKillCard(card);
      effectExecuted = true;
    }
    // Full Heal
    else if (card.effect?.fullHeal) {
      const healed = this.player.max_sanity - this.player.curr_sanity;
      this.player.curr_sanity = this.player.max_sanity;
      this.addLog(
        `🏖️ ${card.name}: Full heal! +${healed} HP!`,
        "player-action",
      );
      soundSystem.play("heal");
      this.animateSprite("player", "healing");
      this.showDamagePopup("player", healed, "heal");
      effectExecuted = true;
    }
    // Invincible
    else if (card.effect?.invincible) {
      this.playerBuffs.push({
        type: "invincible",
        value: card.effect.invincible,
        duration: card.effect.invincible,
      });
      this.addLog(
        `✅ ${card.name}: Invincible for ${card.effect.invincible} turns!`,
        "player-action",
      );
      soundSystem.play("powerup");
      effectExecuted = true;
    }
    // Redraw All
    else if (card.effect?.redrawAll) {
      this.hand = [];
      this.drawHand();
      this.addLog(`📚 ${card.name}: Redraw all cards!`, "player-action");
      effectExecuted = true;
    }

    // 2. Handle Standard Types (if no special effect blocked it)
    if (!effectExecuted) {
      switch (card.type) {
        case Card.TYPES.ATTACK:
          this.executeAttackCard(card);
          break;
        case Card.TYPES.DEFENSE:
        case Card.TYPES.BLOCK:
          this.executeDefenseCard(card);
          break;
        case Card.TYPES.SKILL:
          this.executeSkillCard(card);
          break;
        case Card.TYPES.POWER:
        case Card.TYPES.BUFF:
          this.executePowerCard(card);
          break;
        case Card.TYPES.HEAL:
          this.executeHealCard(card);
          break;
        case Card.TYPES.KILL:
          this.executeKillCard(card);
          break;
        default:
          // Fallback
          if (
            card.effect?.heal ||
            (card.value > 0 && card.type === Card.TYPES.HEAL)
          ) {
            this.executeHealCard(card);
          } else if (card.value > 0) {
            this.executeAttackCard(card);
          }
      }
    }

    // 3. Handle Common Side Effects (ALWAYS run unless returned early)
    // This allows Attack cards to also draw cards, or Heal cards to self-damage, etc.
    if (card.effect) {
      this.processCommonEffects(card);
    }
  }

  processCommonEffects(card) {
    if (!card.effect) return;

    // Energy gain
    if (card.effect.gainEnergy) {
      this.currentStamina = Math.min(
        this.maxStamina,
        this.currentStamina + card.effect.gainEnergy,
      );
      this.addLog(`⚡ +${card.effect.gainEnergy} Stamina`, "system");
    }

    // Self damage (Cost to cast)
    if (card.effect.selfDamage) {
      this.player.take_damage(card.effect.selfDamage);
      this.addLog(`💔 Lose ${card.effect.selfDamage} HP`, "player-action");
      this.showDamagePopup("player", card.effect.selfDamage, "damage");
    }

    // Stun enemy
    if (card.effect.stunEnemy) {
      this.enemySkipTurn = true;
      this.addLog(`😵 Enemy will skip next turn!`, "player-action");
    }

    // Draw cards
    if (card.effect.draw) {
      // Check for chance (default 100% if not specified)
      const chance =
        card.effect.drawChance !== undefined ? card.effect.drawChance : 1.0;

      if (Math.random() <= chance) {
        for (let i = 0; i < card.effect.draw; i++) {
          const drawnIds = playerProgression.drawWeightedCards(1);
          const cardId = drawnIds[0];
          if (cardId && CARDS_DATA[cardId]) {
            const newCard = CARDS_DATA[cardId].clone();
            this.hand.push(newCard);
          }
        }
        this.addLog(`📝 Drew ${card.effect.draw} card(s)`, "system");
      } else {
        this.addLog(`🎲 Gagal draw kartu tambahan`, "system");
      }
    }

    // Bonus block
    if (card.effect.block) {
      this.playerShield += card.effect.block;
      this.addLog(`🛡️ +${card.effect.block} Shield`, "player-action");
    }

    // Dodge
    if (card.effect.dodge) {
      this.playerBuffs.push({
        type: "dodge",
        value: 1,
        duration: 1,
      });
      this.addLog(`👻 Will dodge next attack!`, "player-action");
    }

    // New: Debuff on generic cards
    if (card.effect.debuff && card.type !== Card.TYPES.ATTACK) {
      // Attack cards handle debuff in executeAttackCard, this captures skills/others
      this.enemyDebuffs.push({
        type: card.effect.debuff,
        value: 0.25,
        duration: card.effect.duration || 1,
      });
    }
  }

  // New: Execute Heal Card
  executeHealCard(card) {
    const healAmount = card.value;
    const healed = this.player.heal(healAmount);
    this.addLog(`💚 ${card.name}: +${healed.healed} HP!`, "player-action");
    soundSystem.play("heal");
    this.animateSprite("player", "healing");
    this.showDamagePopup("player", healed.healed, "heal");
  }

  // New: Execute Kill Card (Ultimate)
  executeKillCard(card) {
    const isBoss = this.enemy.type === "boss" || this.currentRound === 5;

    if (isBoss) {
      // Boss only takes reduced damage
      const damage = card.effect?.bossDamage || 50;
      this.enemy.take_damage(damage);
      this.addLog(
        `👔 ${card.name}: Boss takes ${damage} damage!`,
        "player-action",
      );
      this.showDamagePopup("enemy", damage, "critical");
    } else {
      // Instant kill non-boss
      this.enemy.curr_sanity = 0;
      this.addLog(`👔 ${card.name}: INSTANT KILL!`, "player-action");
      this.showDamagePopup("enemy", 999, "critical");
    }

    this.animateSprite("player", "attacking");
    this.animateSprite("enemy", "damaged");
    this.shakeScreen();
    soundSystem.play("critical");
  }

  executeGamblingCard(card) {
    const success = Math.random() >= 0.5;

    if (success) {
      const damage = card.value;
      this.enemy.take_damage(damage);
      this.animateSprite("player", "attacking");
      setTimeout(() => {
        this.animateSprite("enemy", "damaged");
        this.showDamagePopup("enemy", damage);
      }, 200);
      this.addLog(
        `🎰 ${card.name} SUCCESS! ${damage} damage!`,
        "player-action",
      );
    } else {
      const selfDamage = card.effect.failDamage || 10;
      this.player.take_damage(selfDamage);
      this.animateSprite("player", "damaged");
      this.showDamagePopup("player", selfDamage);
      this.addLog(
        `🎰 ${card.name} FAILED! Lose ${selfDamage} HP!`,
        "player-action",
      );
    }
  }

  executeAttackCard(card) {
    let baseDamage = card.value + this.playerStrength;
    let hits = card.effect?.hits || 1;
    let totalDamage = 0;
    let isCritical = false;

    // Check for critical hit
    if (Math.random() < this.critChance) {
      isCritical = true;
      baseDamage = Math.floor(baseDamage * this.critMultiplier);
      soundSystem.play("critical");
      this.shakeScreen();
    }

    // DAMAGE CALCULATION (Synchronous for logic correctness)
    for (let i = 0; i < hits; i++) {
      let actualDamage = baseDamage;
      if (this.enemyShield > 0) {
        const absorbed = Math.min(this.enemyShield, actualDamage);
        this.enemyShield -= absorbed;
        actualDamage -= absorbed;
      }

      if (actualDamage > 0) {
        this.enemy.take_damage(actualDamage);
        totalDamage += actualDamage;
      }

      // Schedule visual effect (Asynchronous for UX)
      setTimeout(() => {
        this.animateSprite("enemy", "damaged");
        this.showDamagePopup(
          "enemy",
          actualDamage, // Show per-hit damage
          isCritical ? "critical" : "damage",
        );
      }, i * 200);
    }

    this.animateSprite("player", "attacking");

    const hitText = hits > 1 ? ` (${hits}x)` : "";
    const critText = isCritical ? " 💥CRITICAL!" : "";
    this.addLog(
      `⚔️ ${card.name}${hitText}: ${totalDamage} damage!${critText}`,
      "player-action",
    );

    // Apply debuffs
    if (card.effect?.debuff) {
      this.enemyDebuffs.push({
        type: card.effect.debuff,
        value: 0.25,
        duration: card.effect.duration || 1,
      });
      this.addLog(`   → Applied ${card.effect.debuff}`, "player-action");
    }
  }

  executeDefenseCard(card) {
    this.playerShield += card.value;
    this.addLog(
      `🛡️ ${card.name}: +${card.value} Shield (Total: ${this.playerShield})`,
      "player-action",
    );
    soundSystem.play("defense");
    this.animateSprite("player", "healing");

    if (card.effect?.damage) {
      this.enemy.take_damage(card.effect.damage);
      this.animateSprite("enemy", "damaged");
      this.showDamagePopup("enemy", card.effect.damage);
      this.addLog(`   → Dealt ${card.effect.damage} damage`, "player-action");
    }
  }

  executeSkillCard(card) {
    if (card.effect?.heal) {
      const healed = this.player.heal(card.value);
      this.addLog(`💚 ${card.name}: +${healed.healed} HP!`, "player-action");
      soundSystem.play("heal");
      this.animateSprite("player", "healing");
    }
  }

  executePowerCard(card) {
    const cardInfo = card.getInfo();

    // Handle stamina restore BUFF cards (Air Mineral, Pinjam Charger, Kopi Kapal Api)
    // These cards have type BUFF and value > 0 representing stamina to gain
    if (
      card.type === Card.TYPES.BUFF &&
      cardInfo.value > 0 &&
      !card.effect?.buff
    ) {
      const staminaGain = cardInfo.value;
      const oldStamina = this.currentStamina;
      this.currentStamina = Math.min(
        this.maxStamina + 2,
        this.currentStamina + staminaGain,
      ); // Allow slight overflow
      const actualGain = this.currentStamina - oldStamina;

      if (actualGain > 0) {
        this.addLog(
          `⚡ ${cardInfo.name}: +${actualGain} Stamina!`,
          "player-action",
        );
        this.showDamagePopup("player", `+${actualGain}⚡`, "buff");
      } else {
        this.addLog(`⚡ ${cardInfo.name}: Stamina sudah penuh!`, "system");
      }
      this.updateUI();
      return; // Exit early - this is a simple stamina buff card
    }

    // Handle dodge effect (Nitip Absen)
    if (card.effect?.type === "dodge") {
      this.playerBuffs.push({
        type: "dodge",
        duration: card.effect.duration || 1,
      });
      this.addLog(
        `✋ ${cardInfo.name}: Menghindari serangan berikutnya!`,
        "player-action",
      );
      return;
    }

    // Handle strength buff
    if (card.effect?.buff === "strength") {
      this.playerStrength += card.effect.buffValue || cardInfo.value;
      this.addLog(
        `💪 ${cardInfo.name}: +${card.effect.buffValue || cardInfo.value} Strength!`,
        "player-action",
      );
    }

    // Handle regen buff
    if (card.effect?.buff === "regen") {
      this.playerBuffs.push({
        type: "regen",
        value: card.effect.buffValue || cardInfo.value,
        permanent: true,
      });
      this.addLog(
        `🌿 ${cardInfo.name}: Regen ${card.effect.buffValue || cardInfo.value}/turn!`,
        "player-action",
      );
    }

    // Handle metallicize buff
    if (card.effect?.buff === "metallicize") {
      this.playerBuffs.push({
        type: "metallicize",
        value: card.effect.buffValue || cardInfo.value,
        permanent: true,
      });
      this.addLog(
        `🔩 ${cardInfo.name}: +${card.effect.buffValue || cardInfo.value} Shield/turn!`,
        "player-action",
      );
    }
  }

  processPlayerBuffs() {
    this.playerBuffs.forEach((buff) => {
      if (buff.type === "regen") {
        const healed = this.player.heal(buff.value);
        if (healed.healed > 0)
          this.addLog(`🌿 Regen: +${healed.healed} HP`, "system");
      }
      if (buff.type === "metallicize") {
        this.playerShield += buff.value;
        this.addLog(`🔩 Metallicize: +${buff.value} Shield`, "system");
      }
    });
  }

  playerEndTurn() {
    if (!this.isPlayerTurn || !this.battleActive) return;
    this.endPlayerTurn();
  }

  // ============================================
  // BATTLE END
  // ============================================

  handleVictory() {
    this.battleActive = false;
    this.addLog(`🎉 ${this.enemy.nama} defeated!`, "system");

    // Get round data for rewards
    const roundData = getRoundData(this.currentSemester, this.currentRound);

    const rewards = {
      xp: roundData.xpReward,
      cardChance: roundData.cardChance,
      isBoss: roundData.type === "BOSS",
      isElite: roundData.type === "Elite",
      semester: this.currentSemester,
      round: this.currentRound,
      newCard: null,
      newCardKey: null,
    };

    // RNG check for card reward
    if (Math.random() < roundData.cardChance) {
      const result = this.getRandomNewCard(roundData.type === "BOSS");
      if (result) {
        rewards.newCard = result.card;
        rewards.newCardKey = result.key;
      }
    }

    // Add to temp rewards
    playerProgression.addTempXP(rewards.xp);
    if (rewards.newCardKey) {
      // Use the CARDS_DATA key, not the Card.id
      playerProgression.addTempCard(rewards.newCardKey);
      console.log(`🃏 Card reward queued: ${rewards.newCardKey}`);
    }

    setTimeout(() => this.gameManager.onBattleVictory(rewards), 1000);
  }

  getRandomNewCard(isBoss = false) {
    // Get all CARDS_DATA entries with their keys
    const entries = Object.entries(CARDS_DATA);
    const unlockedKeys = new Set(playerProgression.unlockedCards);

    // Filter to cards not yet unlocked (using keys, not IDs)
    let available = entries.filter(([key, card]) => !unlockedKeys.has(key));

    // If boss, prefer rare/uncommon
    if (isBoss && available.length > 0) {
      const rareCards = available.filter(
        ([key, card]) =>
          card.rarity === Card.RARITY.RARE ||
          card.rarity === Card.RARITY.UNCOMMON,
      );
      if (rareCards.length > 0) available = rareCards;
    }

    if (available.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * available.length);
    const [key, card] = available[randomIndex];
    return { key, card };
  }

  handleDefeat() {
    this.battleActive = false;
    this.addLog("💀 Sanity habis... DROP OUT!", "system");

    // Clear temp rewards on defeat
    playerProgression.tempXP = 0;
    playerProgression.tempNewCards = [];

    setTimeout(() => this.gameManager.onBattleDefeat(), 1500);
  }

  // ============================================
  // UI METHODS
  // ============================================

  updateUI() {
    // Player stats
    const playerInfo = this.player.getFullInfo();
    document.getElementById("player-battle-name").textContent = playerInfo.nama;
    document.getElementById("player-sprite").textContent = playerInfo.sprite;

    const sanityPercent = playerInfo.sanityPercent;
    document.getElementById("player-sanity-bar").style.width =
      sanityPercent + "%";
    document.getElementById("player-sanity-text").textContent =
      `${playerInfo.curr_sanity}/${playerInfo.max_sanity}`;

    // Enemy stats
    const enemyInfo = this.enemy.getEnemyInfo();
    document.getElementById("enemy-battle-name").textContent = enemyInfo.nama;
    document.getElementById("enemy-sprite").textContent = enemyInfo.sprite;
    document.getElementById("enemy-type").textContent =
      `Tipe: ${enemyInfo.tipe_masalah}`;

    const enemyPercent = enemyInfo.sanityPercent;
    document.getElementById("enemy-hp-bar").style.width = enemyPercent + "%";
    document.getElementById("enemy-hp-text").textContent =
      `${enemyInfo.curr_sanity}/${enemyInfo.max_sanity}`;

    this.updateStaminaDisplay();
    this.updateHandDisplay();
    this.updateShieldDisplay();
  }

  updateStaminaDisplay() {
    const container = document.getElementById("energy-display");
    if (container) {
      let staminaHtml = "";
      for (let i = 0; i < this.maxStamina; i++) {
        staminaHtml += i < this.currentStamina ? "⚡" : "○";
      }
      container.innerHTML = `${staminaHtml} ${this.currentStamina}/${this.maxStamina}`;
    }
  }

  updateHandDisplay() {
    const handContainer = document.getElementById("card-hand");
    if (!handContainer) return;

    handContainer.innerHTML = this.hand
      .map((card, index) => {
        const info = card.getInfo();
        // Handle cost "ALL" for ultimate cards
        const costValue = info.cost === "ALL" ? "∞" : info.cost;
        const canPlay =
          info.cost === "ALL"
            ? this.currentStamina >= this.maxStamina
            : this.currentStamina >= info.cost;
        const disabledClass = canPlay ? "" : "disabled";
        const rarityClass = `rarity-${info.rarity}`;

        // Type class mapping
        const typeClassMap = {
          [Card.TYPES.ATTACK]: "card-attack",
          [Card.TYPES.DEFENSE]: "card-defense",
          [Card.TYPES.BLOCK]: "card-block",
          [Card.TYPES.SKILL]: "card-skill",
          [Card.TYPES.POWER]: "card-power",
          [Card.TYPES.BUFF]: "card-buff",
          [Card.TYPES.HEAL]: "card-heal",
          [Card.TYPES.KILL]: "card-kill",
        };
        const typeClass = typeClassMap[card.type] || "";

        // Icon rendering - support both emoji and image
        let iconHtml;
        if (card.iconType === "image") {
          iconHtml = `<img src="${info.icon}" alt="${info.name}" class="card-icon-img"/>`;
        } else {
          iconHtml = `<span class="card-icon-emoji">${info.icon}</span>`;
        }

        return `
          <div class="game-card ${typeClass} ${rarityClass} ${disabledClass}" 
               data-index="${index}" 
               onclick="battleSystem.playCard(${index})">
            <div class="card-cost">${costValue}</div>
            <div class="card-icon-box">
              ${iconHtml}
            </div>
            <div class="card-desc-box">
              <div class="card-name">${info.name}</div>
              <div class="card-desc">${info.description}</div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  updateShieldDisplay() {
    const playerStatus = document.getElementById("player-status");
    if (playerStatus) {
      let statusHtml = "";
      if (this.playerShield > 0)
        statusHtml += `<span class="status-effect buff" title="Shield: Menyerap ${this.playerShield} damage. Permanen.">🛡️ ${this.playerShield}</span>`;
      if (this.playerStrength > 0)
        statusHtml += `<span class="status-effect buff" title="Strength: +${this.playerStrength} damage.">💪 +${this.playerStrength}</span>`;
      this.playerBuffs.forEach((buff) => {
        if (buff.type === "regen")
          statusHtml += `<span class="status-effect buff" title="Regen: +${buff.value} HP/turn">🌿 ${buff.value}</span>`;
        if (buff.type === "metallicize")
          statusHtml += `<span class="status-effect buff" title="Metallicize: +${buff.value} Shield/turn">🔩 ${buff.value}</span>`;
      });
      playerStatus.innerHTML = statusHtml;
    }

    const enemyStatus = document.getElementById("enemy-status");
    if (enemyStatus) {
      let statusHtml = "";
      if (this.enemyShield > 0)
        statusHtml += `<span class="status-effect buff" title="Shield">🛡️ ${this.enemyShield}</span>`;
      if (this.enemySkipTurn)
        statusHtml += `<span class="status-effect debuff" title="Stun: Skip next turn">😵 Stun</span>`;
      this.enemyDebuffs.forEach((debuff) => {
        let tooltip =
          debuff.type === "weak" ? "Weak: -25% damage" : debuff.type;
        statusHtml += `<span class="status-effect debuff" title="${tooltip}">${debuff.type} (${debuff.duration})</span>`;
      });
      enemyStatus.innerHTML = statusHtml;
    }
  }

  updateTurnIndicator() {
    const indicator = document.getElementById("turn-indicator");
    if (this.isPlayerTurn) {
      indicator.textContent = "Giliran Kamu!";
      indicator.classList.remove("enemy-turn");
    } else {
      indicator.textContent = "Giliran Musuh...";
      indicator.classList.add("enemy-turn");
    }
  }

  enableCardInteraction() {
    const cards = document.querySelectorAll(".game-card");
    cards.forEach((card) => (card.style.pointerEvents = "auto"));
    const endTurnBtn = document.getElementById("btn-end-turn");
    if (endTurnBtn) endTurnBtn.disabled = false;
  }

  disableCardInteraction() {
    const cards = document.querySelectorAll(".game-card");
    cards.forEach((card) => (card.style.pointerEvents = "none"));
    const endTurnBtn = document.getElementById("btn-end-turn");
    if (endTurnBtn) endTurnBtn.disabled = true;
  }

  addLog(message, type = "") {
    const log = document.getElementById("battle-log");
    if (!log) return;
    const entry = document.createElement("p");
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  clearLog() {
    const log = document.getElementById("battle-log");
    if (log) log.innerHTML = "";
  }

  animateSprite(target, animation) {
    const sprite = document.getElementById(
      `${target === "player" ? "player" : "enemy"}-sprite`,
    );
    if (!sprite) return;
    sprite.classList.add(animation);
    setTimeout(() => sprite.classList.remove(animation), 500);
  }

  shakeScreen() {
    const battleContainer = document.querySelector(".battle-container");
    if (battleContainer) {
      battleContainer.classList.add("screen-shake");
      setTimeout(() => battleContainer.classList.remove("screen-shake"), 500);
    }
  }

  showDamagePopup(target, amount, type = "damage") {
    const sprite = document.getElementById(
      `${target === "player" ? "player" : "enemy"}-sprite`,
    );
    if (!sprite) return;

    const popup = document.createElement("div");
    popup.className = `damage-popup ${type}`;

    if (type === "critical") {
      popup.textContent = `💥-${amount}!`;
      popup.classList.add("critical-hit");
    } else {
      popup.textContent = type === "damage" ? `-${amount}` : `+${amount}`;
    }

    popup.style.left = sprite.offsetLeft + sprite.offsetWidth / 2 + "px";
    popup.style.top = sprite.offsetTop + "px";
    sprite.parentElement.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }
}

// Global reference
let battleSystem = null;
