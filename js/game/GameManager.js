/**
 * GAME MANAGER - Updated with Login, Energy Progression, Card Rewards
 */
class GameManager {
  constructor() {
    this.player = null;
    this.cardBattleSystem = new CardBattleSystem(this);
    this.currentStage = 1;
    this.currentBattle = 0;
    this.battlesPerStage = 4;
    this.stagesCompleted = [];
    this.currentEnemies = [];
    this.pendingCardReward = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createParticles();

    // Check if user is logged in
    if (authSystem.isLoggedIn) {
      this.showScreen("main-menu");
      this.updateUserDisplay();
    } else {
      this.showScreen("login-screen");
    }

    cardBattle = this.cardBattleSystem;
  }

  setupEventListeners() {
    // Login Screen
    document.getElementById("btn-login").onclick = () => this.handleLogin();
    document.getElementById("btn-register").onclick = () =>
      this.handleRegister();
    document.getElementById("btn-guest").onclick = () =>
      this.handleGuestLogin();

    // Main Menu
    document.getElementById("btn-new-game").onclick = () =>
      this.showScreen("character-creation");
    document.getElementById("btn-card-index").onclick = () =>
      this.showCardIndex();
    document.getElementById("btn-how-to-play").onclick = () =>
      this.showModal("how-to-play-modal");
    document.getElementById("btn-logout").onclick = () => this.handleLogout();

    // Modals
    document.getElementById("close-how-to-play").onclick = () =>
      this.hideModal("how-to-play-modal");
    document.getElementById("close-card-index").onclick = () =>
      this.hideModal("card-index-modal");
    // Note: close-card-reward is optional

    // Character Creation
    this.setupCharacterCreation();

    // Stage Select
    document.getElementById("btn-back-menu").onclick = () =>
      this.showScreen("main-menu");
    document.querySelectorAll(".stage-card").forEach((card) => {
      card.onclick = () => {
        if (!card.classList.contains("locked")) {
          this.selectStage(parseInt(card.dataset.stage));
        }
      };
    });

    // Card Battle
    document.getElementById("btn-end-turn").onclick = () =>
      this.cardBattleSystem.playerEndTurn();

    // Results
    document.getElementById("btn-continue").onclick = () =>
      this.continueAfterVictory();
    document.getElementById("btn-retry").onclick = () => this.retryStage();
    document.getElementById("btn-main-menu").onclick = () =>
      this.showScreen("main-menu");
    document.getElementById("btn-new-game-end").onclick = () => {
      this.player = null;
      this.stagesCompleted = [];
      this.showScreen("character-creation");
    };
  }

  // ============================================
  // LOGIN HANDLERS
  // ============================================

  handleLogin() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    const result = authSystem.login(username, password);
    this.showAuthMessage(result.message, result.success);

    if (result.success) {
      this.cardBattleSystem.setBaseEnergy(authSystem.getMaxEnergy());
      this.showScreen("main-menu");
      this.updateUserDisplay();
    }
  }

  handleRegister() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    const result = authSystem.register(username, password);
    this.showAuthMessage(result.message, result.success);

    if (result.success) {
      // Auto login after register
      const loginResult = authSystem.login(username, password);
      if (loginResult.success) {
        this.cardBattleSystem.setBaseEnergy(authSystem.getMaxEnergy());
        this.showScreen("main-menu");
        this.updateUserDisplay();
      }
    }
  }

  handleGuestLogin() {
    const result = authSystem.loginAsGuest();
    this.showAuthMessage(result.message, result.success);

    if (result.success) {
      this.cardBattleSystem.setBaseEnergy(2);
      this.showScreen("main-menu");
      this.updateUserDisplay();
    }
  }

  handleLogout() {
    authSystem.logout();
    this.player = null;
    this.stagesCompleted = [];
    this.showScreen("login-screen");
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
  }

  showAuthMessage(message, isSuccess) {
    const msgEl = document.getElementById("auth-message");
    msgEl.textContent = message;
    msgEl.className = `auth-message ${isSuccess ? "success" : "error"}`;
    setTimeout(() => (msgEl.textContent = ""), 3000);
  }

  updateUserDisplay() {
    const user = authSystem.currentUser;
    if (!user) return;

    const userInfo = document.getElementById("user-info");
    if (userInfo) {
      userInfo.innerHTML = `
                <span class="user-name">${
                  user.isGuest ? "👤 Guest" : "👤 " + user.username
                }</span>
                <span class="user-energy">⚡ Max Energy: ${
                  user.data.maxEnergy
                }</span>
                <span class="user-cards">🃏 Cards: ${
                  user.data.unlockedCards.length
                }</span>
            `;
    }
  }

  // ============================================
  // CHARACTER CREATION
  // ============================================

  setupCharacterCreation() {
    const self = this;
    this.selectedJurusan = null;

    const nameInput = document.getElementById("player-name");
    const jurusanCards = document.querySelectorAll(".jurusan-card");
    const startBtn = document.getElementById("btn-start-game");

    const updatePreview = () => {
      const base = { sanity: 100, kopi: 50, attack: 15 };
      if (self.selectedJurusan) {
        const bonus = Mahasiswa.JURUSAN_STATS[self.selectedJurusan];
        if (bonus) {
          document.getElementById("preview-sanity").textContent =
            base.sanity + (bonus.sanityBonus || 0);
          document.getElementById("preview-kopi").textContent =
            base.kopi + (bonus.kopiBonus || 0);
          document.getElementById("preview-attack").textContent =
            base.attack + (bonus.attackBonus || 0);
        }
      }
      startBtn.disabled = !(nameInput.value.trim() && self.selectedJurusan);
    };

    nameInput.addEventListener("input", updatePreview);

    jurusanCards.forEach((card) => {
      card.addEventListener("click", function () {
        jurusanCards.forEach((c) => c.classList.remove("selected"));
        this.classList.add("selected");
        self.selectedJurusan = this.dataset.jurusan;
        updatePreview();
      });
    });

    startBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      if (name && self.selectedJurusan) {
        self.createPlayer(name, self.selectedJurusan);
        self.showScreen("stage-select");
      }
    });
  }

  createPlayer(name, jurusan) {
    this.player = new Mahasiswa(name, jurusan);
    this.player.addItem({ ...ITEMS_DATA.kopiSachet, quantity: 3 });
    this.player.addItem({ ...ITEMS_DATA.indomie, quantity: 2 });
    this.updateMiniStats();
  }

  updateMiniStats() {
    if (!this.player) return;
    const info = this.player.getFullInfo();
    document.getElementById(
      "mini-semester"
    ).textContent = `Semester ${info.semester}`;
    document.getElementById(
      "mini-sanity"
    ).textContent = `❤️ ${info.curr_sanity}`;
    document.getElementById(
      "mini-energy"
    ).textContent = `⚡ ${authSystem.getMaxEnergy()}`;
  }

  // ============================================
  // STAGE & BATTLE
  // ============================================

  selectStage(stageNum) {
    this.currentStage = stageNum;
    this.currentBattle = 0;
    const stageData = getStageData(stageNum);
    this.currentEnemies = [...stageData.enemies];

    for (let i = this.currentEnemies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.currentEnemies[i], this.currentEnemies[j]] = [
        this.currentEnemies[j],
        this.currentEnemies[i],
      ];
    }

    this.player.resetSanity();
    this.player.energi_kopi = this.player.max_kopi;

    // Set base energy from auth
    this.cardBattleSystem.setBaseEnergy(authSystem.getMaxEnergy());

    this.startNextBattle();
  }

  startNextBattle() {
    this.currentBattle++;
    const stageData = getStageData(this.currentStage);

    document.getElementById(
      "current-stage-name"
    ).textContent = `Stage ${this.currentStage}: ${stageData.name}`;
    document.getElementById("battle-count").textContent = `Battle ${
      this.currentBattle
    }/${this.battlesPerStage + 1}`;

    const isBoss = this.currentBattle > this.battlesPerStage;

    let enemyConfig = isBoss
      ? stageData.boss
      : this.currentEnemies[
          (this.currentBattle - 1) % this.currentEnemies.length
        ];
    const enemy = createEnemy(enemyConfig, this.currentStage);

    this.showScreen("battle-screen");
    this.cardBattleSystem.clearLog();
    this.cardBattleSystem.startBattle(this.player, enemy, false, isBoss);
  }

  addLog(message, type) {
    this.cardBattleSystem.addLog(message, type);
  }

  // ============================================
  // VICTORY & CARD REWARDS
  // ============================================

  onCardBattleVictory(rewards) {
    const isBoss = rewards.isBossReward;
    const expResult = this.player.belajar(rewards.exp);

    rewards.items.forEach((item) => {
      if (item) this.player.addItem({ ...item });
    });

    // Boss gives +1 energy
    if (isBoss) {
      const newEnergy = authSystem.increaseMaxEnergy();
      this.cardBattleSystem.setBaseEnergy(newEnergy);
      rewards.energyBonus = true;
      rewards.newMaxEnergy = newEnergy;
    }

    // Store pending card reward
    this.pendingCardReward = rewards.cardChoices;

    // Show victory with card choices
    document.getElementById("victory-message").textContent = isBoss
      ? "🏆 Boss dikalahkan!"
      : "Masalah teratasi!";

    const rewardsList = document.getElementById("rewards-list");
    rewardsList.innerHTML = `
            <div class="reward-item"><span class="reward-icon">📚</span> +${
              rewards.exp
            } EXP</div>
            ${rewards.items
              .filter((i) => i)
              .map(
                (item) =>
                  `<div class="reward-item"><span class="reward-icon">${item.icon}</span> ${item.name}</div>`
              )
              .join("")}
            ${
              expResult.leveledUp
                ? `<div class="reward-item"><span class="reward-icon">🎉</span> Semester ${expResult.newSemester}!</div>`
                : ""
            }
            ${
              rewards.energyBonus
                ? `<div class="reward-item"><span class="reward-icon">⚡</span> Max Energy +1 (Now: ${rewards.newMaxEnergy})!</div>`
                : ""
            }
        `;

    // Show card reward choices
    this.showCardRewardChoices(rewards.cardChoices);

    this.showScreen("victory-screen");
  }

  showCardRewardChoices(cardChoices) {
    const container = document.getElementById("card-reward-choices");
    if (!container) return;

    container.innerHTML = cardChoices
      .map((card, i) => {
        const info = card.getInfo();
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
                <div class="game-card reward-card ${typeClass} rarity-${info.rarity}" onclick="game.selectCardReward(${i})">
                    <div class="card-cost">${info.cost}</div>
                    <div class="card-icon">${info.icon}</div>
                    <div class="card-name">${info.name}</div>
                    <div class="card-desc">${info.description}</div>
                    <div class="card-rarity">${info.rarity}</div>
                </div>
            `;
      })
      .join("");
  }

  selectCardReward(index) {
    if (!this.pendingCardReward || !this.pendingCardReward[index]) return;

    const selectedCard = this.pendingCardReward[index];
    authSystem.addCardToCollection(selectedCard.id);

    // Show confirmation
    const container = document.getElementById("card-reward-choices");
    container.innerHTML = `<div class="reward-selected">🃏 ${selectedCard.name} ditambahkan ke deck!</div>`;

    this.pendingCardReward = null;
    this.updateUserDisplay();
  }

  skipCardReward() {
    this.pendingCardReward = null;
    this.hideModal("card-reward-modal");
  }

  continueAfterVictory() {
    if (this.currentBattle > this.battlesPerStage) {
      if (!this.stagesCompleted.includes(this.currentStage)) {
        this.stagesCompleted.push(this.currentStage);
        authSystem.updateProgress("highestStage", this.currentStage);
      }

      if (this.currentStage >= 3) {
        this.showGameComplete();
        return;
      }

      this.updateStageSelect();
      this.showScreen("stage-select");
    } else {
      this.startNextBattle();
    }
    this.updateMiniStats();
  }

  onBattleDefeat() {
    authSystem.updateProgress(
      "totalDefeats",
      (authSystem.currentUser?.data?.totalDefeats || 0) + 1
    );
    document.getElementById(
      "defeat-message"
    ).textContent = `${this.player.nama} kehabisan Sanity di Stage ${this.currentStage}...`;
    this.showScreen("defeat-screen");
  }

  retryStage() {
    this.player.resetSanity();
    this.player.energi_kopi = this.player.max_kopi;
    this.selectStage(this.currentStage);
  }

  updateStageSelect() {
    document.querySelectorAll(".stage-card").forEach((card) => {
      const stage = parseInt(card.dataset.stage);
      if (this.stagesCompleted.includes(stage)) {
        card.classList.add("completed");
        card.classList.remove("locked");
        const overlay = card.querySelector(".lock-overlay");
        if (overlay) overlay.style.display = "none";
      } else if (stage === 1 || this.stagesCompleted.includes(stage - 1)) {
        card.classList.remove("locked");
        const overlay = card.querySelector(".lock-overlay");
        if (overlay) overlay.style.display = "none";
      }
    });
    this.updateMiniStats();
  }

  showGameComplete() {
    authSystem.updateProgress(
      "totalWins",
      (authSystem.currentUser?.data?.totalWins || 0) + 1
    );
    const info = this.player.getFullInfo();
    document.getElementById("final-stats").innerHTML = `
            <p><strong>Nama:</strong> ${info.nama}</p>
            <p><strong>Jurusan:</strong> ${info.jurusanName}</p>
            <p><strong>Semester:</strong> ${info.semester}</p>
            <p><strong>Max Energy:</strong> ${authSystem.getMaxEnergy()}</p>
            <p><strong>Total Cards:</strong> ${
              authSystem.getUnlockedCards().length
            }</p>
        `;
    this.showScreen("complete-screen");
  }

  // ============================================
  // CARD INDEX
  // ============================================

  showCardIndex() {
    const container = document.getElementById("card-index-list");
    if (!container) return;

    const allCards = getAllCards();
    const unlockedIds = authSystem.getUnlockedCards();

    container.innerHTML = allCards
      .map((card) => {
        const info = card.getInfo();
        const isUnlocked = unlockedIds.includes(card.id);
        const lockedClass = isUnlocked ? "" : "card-locked";

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
                <div class="game-card index-card ${typeClass} rarity-${
          info.rarity
        } ${lockedClass}">
                    ${
                      !isUnlocked
                        ? '<div class="card-lock-overlay">🔒</div>'
                        : ""
                    }
                    <div class="card-cost">${info.cost}</div>
                    <div class="card-icon">${info.icon}</div>
                    <div class="card-name">${info.name}</div>
                    <div class="card-desc">${info.description}</div>
                </div>
            `;
      })
      .join("");

    this.showModal("card-index-modal");
  }

  // ============================================
  // UI HELPERS
  // ============================================

  showScreen(screenId) {
    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
  }

  showModal(modalId) {
    document.getElementById(modalId).classList.add("active");
  }
  hideModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
  }

  createParticles() {
    const container = document.getElementById("particles");
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 15 + "s";
      particle.style.animationDuration = 10 + Math.random() * 10 + "s";
      container.appendChild(particle);
    }
  }
}
