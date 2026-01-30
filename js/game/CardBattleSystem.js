/**
 * ============================================
 * CARD BATTLE SYSTEM - Updated with Energy Progression
 * ============================================
 */

class CardBattleSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.deckSystem = new DeckSystem({ cardsPerTurn: 5, maxHandSize: 10 });

    // Battle state
    this.player = null;
    this.enemy = null;
    this.battleActive = false;
    this.turnCount = 0;
    this.isPlayerTurn = true;

    // Energy system - starts at 2, can increase
    this.baseMaxEnergy = 2;
    this.maxEnergy = 2;
    this.currentEnergy = 2;

    // Combat stats
    this.playerShield = 0;
    this.enemyShield = 0;
    this.playerStrength = 0;

    // Status effects & buffs
    this.playerBuffs = [];
    this.enemyDebuffs = [];
    this.enemySkipTurn = false;
    this.extraDrawNextTurn = 0;
  }

  // ============================================
  // ENERGY MANAGEMENT
  // ============================================

  setBaseEnergy(energy) {
    this.baseMaxEnergy = energy;
    this.maxEnergy = energy;
  }

  addPermanentEnergy() {
    this.baseMaxEnergy = Math.min(5, this.baseMaxEnergy + 1);
    this.maxEnergy = this.baseMaxEnergy;
    return this.baseMaxEnergy;
  }

  // ============================================
  // BATTLE INITIALIZATION
  // ============================================

  startBattle(player, enemy, isRound3 = false, isBossBattle = false) {
    this.player = player;
    this.enemy = enemy;
    this.battleActive = true;
    this.turnCount = 0;
    this.isPlayerTurn = true;

    // Reset combat stats
    this.maxEnergy = this.baseMaxEnergy;
    this.currentEnergy = this.maxEnergy;
    this.playerShield = 0;
    this.enemyShield = 0;
    this.playerStrength = 0;
    this.playerBuffs = [];
    this.enemyDebuffs = [];
    this.enemySkipTurn = false;
    this.extraDrawNextTurn = 0;

    // Get deck from user's unlocked cards
    let deckCards;
    if (authSystem.isLoggedIn) {
      const cardIds = authSystem.getUnlockedCards();
      deckCards = getDeckFromCardIds(cardIds);
    } else {
      deckCards = getStarterDeck();
    }

    this.deckSystem.initializeDeck(deckCards);
    this.startPlayerTurn();

    this.updateUI();
    this.addLog(`⚔️ ${enemy.nama} muncul!`, "system");
    this.addLog(
      `📚 Deck: ${deckCards.length} kartu | ⚡ Max Energy: ${this.maxEnergy}`,
      "system"
    );
  }

  // ============================================
  // TURN MANAGEMENT
  // ============================================

  startPlayerTurn() {
    this.turnCount++;
    this.isPlayerTurn = true;

    // Reset energy for turn
    this.currentEnergy = this.maxEnergy;

    // NOTE: Shield is now PERSISTENT - it does NOT reset between turns!
    // Players can build up shield over multiple turns

    // Process permanent buffs
    this.processPlayerBuffs();

    // Draw cards for turn (check for extra draw from previous turn)
    const drawCount = 5 + this.extraDrawNextTurn;
    this.extraDrawNextTurn = 0;
    const drawn = this.deckSystem.drawCards(drawCount);

    if (drawn.length > 0) {
      this.addLog(`🃏 Drew ${drawn.length} cards`, "system");
    }

    this.updateUI();
    this.updateTurnIndicator();
    this.enableCardInteraction();
  }

  endPlayerTurn() {
    // Discard remaining hand
    const discarded = this.deckSystem.discardHand();
    if (discarded.length > 0) {
      this.addLog(`🗑️ Discarded ${discarded.length} cards`, "system");
    }

    // NOTE: Shield persists until start of next player turn!
    // Don't reset shield here - let enemy attack against the shield

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
      this.addLog(`😵 ${this.enemy.nama} melewati giliran!`, "enemy-action");
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

    if (attack.isStunned) {
      this.addLog(attack.message, "enemy-action");
    } else {
      let damage = Math.floor(
        this.enemy.calculateDamage() * attack.damage * damageModifier
      );

      // Check vulnerable
      const vulnDebuff = this.enemyDebuffs.find((d) => d.type === "vulnerable");

      // Apply shield first
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

      const message = attack.message.replace("{enemy}", this.enemy.nama);
      this.addLog(`${message} (-${damage} Sanity)`, "enemy-action");
    }

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

    const card = this.deckSystem.getHandCard(handIndex);
    if (!card) return;

    if (this.currentEnergy < card.cost) {
      this.addLog(
        `❌ Butuh ${card.cost} energy, punya ${this.currentEnergy}`,
        "system"
      );
      return;
    }

    const result = this.deckSystem.playCard(handIndex, {
      currentEnergy: this.currentEnergy,
    });

    if (!result.success) {
      this.addLog(`❌ ${result.message}`, "system");
      return;
    }

    this.currentEnergy -= result.energyCost;
    this.executeCardEffect(card);
    this.updateUI();

    if (!this.enemy.is_alive()) {
      this.handleVictory();
    }
  }

  executeCardEffect(card) {
    const info = card.getInfo();

    // Handle gambling cards (Copy Paste)
    if (card.effect?.gambling) {
      this.executeGamblingCard(card);
      return;
    }

    switch (card.type) {
      case Card.TYPES.ATTACK:
        this.executeAttackCard(card);
        break;
      case Card.TYPES.DEFENSE:
        this.executeDefenseCard(card);
        break;
      case Card.TYPES.SKILL:
        this.executeSkillCard(card);
        break;
      case Card.TYPES.POWER:
        this.executePowerCard(card);
        break;
    }

    // Handle common effects
    if (card.effect) {
      if (card.effect.draw) {
        const drawn = this.deckSystem.drawCards(card.effect.draw);
        if (drawn.length > 0) {
          this.addLog(`📚 Drew ${drawn.length} cards`, "system");
        }
      }
      if (card.effect.gainEnergy) {
        this.currentEnergy += card.effect.gainEnergy;
        this.addLog(`⚡ +${card.effect.gainEnergy} Energy`, "system");
      }
      if (card.effect.drawNextTurn) {
        this.extraDrawNextTurn += card.effect.drawNextTurn;
      }
      if (card.effect.selfDamage) {
        this.player.take_damage(card.effect.selfDamage);
        this.addLog(`💔 Lose ${card.effect.selfDamage} HP`, "player-action");
      }
      if (card.effect.stunEnemy) {
        this.enemySkipTurn = true;
        this.addLog(`😵 Enemy will skip next turn!`, "player-action");
      }
      if (card.effect.copyToDiscard) {
        this.deckSystem.addCardToDeck(card.clone());
        this.addLog(`📋 Added copy to discard pile`, "system");
      }
    }
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
        `🎰 ${card.name} BERHASIL! ${damage} damage!`,
        "player-action"
      );
    } else {
      const selfDamage = card.effect.failDamage || 10;
      this.player.take_damage(selfDamage);
      this.animateSprite("player", "damaged");
      this.showDamagePopup("player", selfDamage);
      this.addLog(
        `🎰 ${card.name} GAGAL! Lose ${selfDamage} HP!`,
        "player-action"
      );
    }
  }

  executeAttackCard(card) {
    let damage = card.value + this.playerStrength;
    let hits = card.effect?.hits || 1;
    let totalDamage = 0;

    for (let i = 0; i < hits; i++) {
      let actualDamage = damage;
      if (this.enemyShield > 0) {
        const absorbed = Math.min(this.enemyShield, actualDamage);
        this.enemyShield -= absorbed;
        actualDamage -= absorbed;
      }

      if (actualDamage > 0) {
        this.enemy.take_damage(actualDamage);
        totalDamage += actualDamage;
      }
    }

    this.animateSprite("player", "attacking");
    setTimeout(() => {
      this.animateSprite("enemy", "damaged");
      this.showDamagePopup("enemy", totalDamage);
    }, 200);

    const hitText = hits > 1 ? ` (${hits}x)` : "";
    this.addLog(
      `⚔️ ${card.name}${hitText}: ${totalDamage} damage!`,
      "player-action"
    );

    // Apply debuffs from attack cards
    if (card.effect?.debuff) {
      this.enemyDebuffs.push({
        type: card.effect.debuff,
        value: 0.25,
        duration: card.effect.duration || 1,
      });
      this.addLog(`   → Applied ${card.effect.debuff}`, "player-action");
    }
    if (card.effect?.debuff2) {
      this.enemyDebuffs.push({
        type: card.effect.debuff2,
        value: 0.25,
        duration: card.effect.duration || 1,
      });
    }

    // Damage from card effect
    if (card.effect?.damage) {
      this.enemy.take_damage(card.effect.damage);
      this.addLog(`   → Bonus ${card.effect.damage} damage`, "player-action");
    }
  }

  executeDefenseCard(card) {
    this.playerShield += card.value;
    this.addLog(
      `🛡️ ${card.name}: +${card.value} Shield (Total: ${this.playerShield})`,
      "player-action"
    );
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
      this.animateSprite("player", "healing");
    }
  }

  executePowerCard(card) {
    if (card.effect?.buff === "strength") {
      this.playerStrength += card.effect.buffValue || card.value;
      this.addLog(
        `💪 ${card.name}: +${card.effect.buffValue || card.value} Strength!`,
        "player-action"
      );
    }

    if (card.effect?.buff === "regen") {
      this.playerBuffs.push({
        type: "regen",
        value: card.effect.buffValue || card.value,
        permanent: true,
      });
      this.addLog(
        `🌿 ${card.name}: Regen ${card.effect.buffValue || card.value}/turn!`,
        "player-action"
      );
    }

    if (card.effect?.buff === "metallicize") {
      this.playerBuffs.push({
        type: "metallicize",
        value: card.effect.buffValue || card.value,
        permanent: true,
      });
      this.addLog(
        `🔩 ${card.name}: +${card.effect.buffValue || card.value} Shield/turn!`,
        "player-action"
      );
    }

    if (card.effect?.buff === "demonForm") {
      this.playerBuffs.push({
        type: "demonForm",
        value: card.effect.buffValue || 1,
        permanent: true,
      });
      this.addLog(
        `😈 ${card.name}: +${card.effect.buffValue || 1} Strength/turn!`,
        "player-action"
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
      if (buff.type === "demonForm") {
        this.playerStrength += buff.value;
        this.addLog(`😈 Demon Form: +${buff.value} Strength`, "system");
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
    this.addLog(`🎉 ${this.enemy.nama} dikalahkan!`, "system");

    const rewards = this.enemy.getRewards();

    // Get card reward
    rewards.cardReward = getCardReward(
      this.enemy.tipe_masalah,
      this.enemy.isBoss
    );
    rewards.cardChoices = getCardRewardChoices(3, this.enemy.isBoss);

    // Deck stats
    const deckState = this.deckSystem.getState();
    rewards.deckStats = {
      totalActions: this.deckSystem.actionHistory.size(),
      cardsExhausted: deckState.exhaustPile,
    };

    setTimeout(() => this.gameManager.onCardBattleVictory(rewards), 1000);
  }

  handleDefeat() {
    this.battleActive = false;
    this.addLog("💀 Sanity habis... DROP OUT!", "system");
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
    document.getElementById(
      "player-sanity-text"
    ).textContent = `${playerInfo.curr_sanity}/${playerInfo.max_sanity}`;

    // Enemy stats
    const enemyInfo = this.enemy.getEnemyInfo();
    document.getElementById("enemy-battle-name").textContent = enemyInfo.nama;
    document.getElementById("enemy-sprite").textContent = enemyInfo.sprite;
    document.getElementById(
      "enemy-type"
    ).textContent = `Tipe: ${enemyInfo.tipe_masalah}`;

    const enemyPercent = enemyInfo.sanityPercent;
    document.getElementById("enemy-hp-bar").style.width = enemyPercent + "%";
    document.getElementById(
      "enemy-hp-text"
    ).textContent = `${enemyInfo.curr_sanity}/${enemyInfo.max_sanity}`;

    this.updateEnergyDisplay();
    this.updateDeckCounters();
    this.updateHandDisplay();
    this.updateShieldDisplay();
  }

  updateEnergyDisplay() {
    const container = document.getElementById("energy-display");
    if (container) {
      let energyHtml = "";
      for (let i = 0; i < this.maxEnergy; i++) {
        energyHtml += i < this.currentEnergy ? "⚡" : "○";
      }
      container.innerHTML = `${energyHtml} ${this.currentEnergy}/${this.maxEnergy}`;
    }
  }

  updateDeckCounters() {
    const drawCount = document.getElementById("draw-pile-count");
    const discardCount = document.getElementById("discard-pile-count");
    if (drawCount) drawCount.textContent = this.deckSystem.getDrawPileCount();
    if (discardCount)
      discardCount.textContent = this.deckSystem.getDiscardPileCount();
  }

  updateHandDisplay() {
    const handContainer = document.getElementById("card-hand");
    if (!handContainer) return;

    const hand = this.deckSystem.hand;

    handContainer.innerHTML = hand
      .map((card, index) => {
        const info = card.getInfo();
        const canPlay = this.currentEnergy >= info.cost;
        const disabledClass = canPlay ? "" : "disabled";
        const rarityClass = `rarity-${info.rarity}`;

        let typeClass = "";
        switch (card.type) {
          case Card.TYPES.ATTACK:
            typeClass = "card-attack";
            break;
          case Card.TYPES.DEFENSE:
            typeClass = "card-defense";
            break;
          case Card.TYPES.SKILL:
            typeClass = "card-skill";
            break;
          case Card.TYPES.POWER:
            typeClass = "card-power";
            break;
        }

        return `
                <div class="game-card ${typeClass} ${rarityClass} ${disabledClass}" 
                     data-index="${index}" 
                     onclick="cardBattle.playCard(${index})">
                    <div class="card-cost">${info.cost}</div>
                    <div class="card-icon">${info.icon}</div>
                    <div class="card-name">${info.name}</div>
                    <div class="card-desc">${info.description}</div>
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
        statusHtml += `<span class="status-effect buff" title="Shield: Menyerap ${this.playerShield} damage dari serangan musuh. Shield bersifat permanen.">🛡️ ${this.playerShield}</span>`;
      if (this.playerStrength > 0)
        statusHtml += `<span class="status-effect buff" title="Strength: Menambah +${this.playerStrength} damage ke semua serangan.">💪 +${this.playerStrength}</span>`;
      this.playerBuffs.forEach((buff) => {
        if (buff.type === "regen")
          statusHtml += `<span class="status-effect buff" title="Regeneration: Heal ${buff.value} HP di awal setiap turn.">🌿 ${buff.value}</span>`;
        if (buff.type === "metallicize")
          statusHtml += `<span class="status-effect buff" title="Metallicize: Gain ${buff.value} Shield di awal setiap turn.">🔩 ${buff.value}</span>`;
        if (buff.type === "demonForm")
          statusHtml += `<span class="status-effect buff" title="Demon Form: Gain +1 Strength di awal setiap turn.">😈</span>`;
      });
      playerStatus.innerHTML = statusHtml;
    }

    const enemyStatus = document.getElementById("enemy-status");
    if (enemyStatus) {
      let statusHtml = "";
      if (this.enemyShield > 0)
        statusHtml += `<span class="status-effect buff" title="Shield: Menyerap damage.">🛡️ ${this.enemyShield}</span>`;
      if (this.enemySkipTurn)
        statusHtml += `<span class="status-effect debuff" title="Stun: Musuh melewati giliran berikutnya.">😵 Stun</span>`;
      this.enemyDebuffs.forEach((debuff) => {
        let tooltipText = "";
        if (debuff.type === "weak")
          tooltipText = "Weak: Damage musuh berkurang 25%.";
        else if (debuff.type === "vulnerable")
          tooltipText = "Vulnerable: Musuh menerima 50% damage lebih banyak.";
        else
          tooltipText = `${debuff.type}: Efek berlangsung ${debuff.duration} turn.`;
        statusHtml += `<span class="status-effect debuff" title="${tooltipText}">${debuff.type} (${debuff.duration})</span>`;
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
      `${target === "player" ? "player" : "enemy"}-sprite`
    );
    if (!sprite) return;
    sprite.classList.add(animation);
    setTimeout(() => sprite.classList.remove(animation), 500);
  }

  showDamagePopup(target, amount, type = "damage") {
    const sprite = document.getElementById(
      `${target === "player" ? "player" : "enemy"}-sprite`
    );
    if (!sprite) return;

    const popup = document.createElement("div");
    popup.className = `damage-popup ${type}`;
    popup.textContent = type === "damage" ? `-${amount}` : `+${amount}`;
    popup.style.left = sprite.offsetLeft + sprite.offsetWidth / 2 + "px";
    popup.style.top = sprite.offsetTop + "px";
    sprite.parentElement.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }
}

let cardBattle = null;
