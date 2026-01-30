/**
 * ============================================
 * GAME MANAGER V2 - New UI Flow
 * Login → Main Menu → Semester Select → Battle
 * ============================================
 */

class GameManager {
  constructor() {
    this.player = null;
    this.battleSystem = new WeightedBattleSystem(this);

    // Current game state
    this.currentSemester = 1;
    this.currentRound = 1;
    this.inBattle = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createParticles();

    // Load player progression
    if (!playerProgression.load()) {
      playerProgression.initializeStarterCards();
    }

    // Check if user is logged in
    if (authSystem.isLoggedIn) {
      this.showScreen("main-menu");
      this.updateMainMenuUI();
    } else {
      this.showScreen("login-screen");
    }

    battleSystem = this.battleSystem;
  }

  setupEventListeners() {
    // Login Screen
    document
      .getElementById("btn-login")
      ?.addEventListener("click", () => this.handleLogin());
    document
      .getElementById("btn-register")
      ?.addEventListener("click", () => this.handleRegister());
    document
      .getElementById("btn-guest")
      ?.addEventListener("click", () => this.handleGuestLogin());

    // Main Menu
    document
      .getElementById("btn-play")
      ?.addEventListener("click", () => this.showSemesterSelect());
    document
      .getElementById("btn-deck")
      ?.addEventListener("click", () => this.showDeckManager());
    document
      .getElementById("btn-how-to-play")
      ?.addEventListener("click", () => this.showModal("how-to-play-modal"));
    document
      .getElementById("btn-logout")
      ?.addEventListener("click", () => this.handleLogout());

    // Modals
    document
      .getElementById("close-how-to-play")
      ?.addEventListener("click", () => this.hideModal("how-to-play-modal"));
    document
      .getElementById("close-deck-modal")
      ?.addEventListener("click", () => this.hideModal("deck-modal"));
    document
      .getElementById("close-semester-select")
      ?.addEventListener("click", () =>
        this.hideModal("semester-select-modal"),
      );

    // Battle
    document
      .getElementById("btn-end-turn")
      ?.addEventListener("click", () => this.battleSystem.playerEndTurn());
    document
      .getElementById("btn-drop-out")
      ?.addEventListener("click", () => this.handleDropOut());

    // Results
    document
      .getElementById("btn-next-round")
      ?.addEventListener("click", () => this.continueToNextRound());
    document
      .getElementById("btn-back-menu")
      ?.addEventListener("click", () => this.returnToMainMenu());
    document
      .getElementById("btn-back-menu-defeat")
      ?.addEventListener("click", () => this.returnToMainMenu());
    document
      .getElementById("btn-retry")
      ?.addEventListener("click", () => this.retrySemester());

    // Custom Alert
    document
      .getElementById("custom-alert-ok")
      ?.addEventListener("click", () => {
        document
          .getElementById("custom-alert-modal")
          .classList.remove("active");
      });
  }

  // ============================================
  // CUSTOM ALERT
  // ============================================
  showCustomAlert(message, title = "Pemberitahuan") {
    const modal = document.getElementById("custom-alert-modal");
    const titleEl = document.getElementById("custom-alert-title");
    const msgEl = document.getElementById("custom-alert-message");

    if (modal && titleEl && msgEl) {
      titleEl.textContent = title;
      msgEl.innerHTML = message.replace(/\n/g, "<br>"); // Support newlines
      modal.classList.add("active");
    } else {
      // Fallback if modal elements missing
      alert(message);
    }
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
      this.player = result.user;
      playerProgression.loadProfile(this.player.username);
      this.showScreen("main-menu");
      this.updateMainMenuUI();
    }
  }

  handleRegister() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    const result = authSystem.register(username, password);
    this.showAuthMessage(result.message, result.success);
  }

  handleGuestLogin() {
    const result = authSystem.loginAsGuest();
    this.showAuthMessage(result.message, result.success);

    if (result.success) {
      this.player = result.user;

      // Initialize guest progression manually (since no save file)
      playerProgression.reset();
      playerProgression.progress = {
        ...playerProgression.progress,
        username: this.player.username,
      };

      this.showScreen("main-menu");
      this.updateMainMenuUI();
    }
  }

  showAuthMessage(message, isSuccess) {
    const msgElement = document.getElementById("auth-message");
    if (msgElement) {
      msgElement.textContent = message;
      msgElement.className = `auth-message ${isSuccess ? "success" : "error"}`;
      setTimeout(() => (msgElement.textContent = ""), 3000);
    }

    // Also show modal for errors or important info
    if (!isSuccess) {
      this.showCustomAlert(message, "Login Gagal");
    }
  }

  handleLogout() {
    playerProgression.save();
    authSystem.logout();
    this.player = null;
    this.showScreen("login-screen");
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
  }

  // ============================================
  // MAIN MENU
  // ============================================

  updateMainMenuUI() {
    const user = authSystem.currentUser;
    if (!user) return;

    // User info
    const userInfo = document.getElementById("user-info");
    if (userInfo) {
      const levelData = playerProgression.getCurrentLevelData();
      const xpProgress = playerProgression.getXPProgress();

      userInfo.innerHTML = `
                <span class="user-name">👤 ${user.isGuest ? "Guest" : user.username}</span>
                <span class="user-level">⭐ Lv.${playerProgression.currentLevel}</span>
            `;
    }

    // Status bar
    this.updateStatusBar();
  }

  updateStatusBar() {
    const levelData = playerProgression.getCurrentLevelData();
    const xpProgress = playerProgression.getXPProgress();

    // Level & XP
    const levelDisplay = document.getElementById("level-display");
    if (levelDisplay) {
      levelDisplay.textContent = `Level ${playerProgression.currentLevel}`;
    }

    const xpBar = document.getElementById("xp-bar-fill");
    if (xpBar) {
      xpBar.style.width = `${xpProgress.percent}%`;
    }

    const xpText = document.getElementById("xp-text");
    if (xpText) {
      xpText.textContent = `${xpProgress.current}/${xpProgress.required} XP`;
    }

    // Sanity & Stamina
    const sanityDisplay = document.getElementById("sanity-display");
    if (sanityDisplay) {
      sanityDisplay.textContent = `❤️ ${levelData.sanity}`;
    }

    const staminaDisplay = document.getElementById("stamina-display");
    if (staminaDisplay) {
      const staminaIcons = "⚡".repeat(levelData.stamina);
      staminaDisplay.textContent = staminaIcons;
    }
  }

  // ============================================
  // SEMESTER SELECT
  // ============================================

  showSemesterSelect() {
    this.renderSemesterGrid();
    this.showModal("semester-select-modal");
  }

  renderSemesterGrid() {
    const grid = document.getElementById("semester-grid");
    if (!grid) return;

    let html = "";
    for (let sem = 1; sem <= 8; sem++) {
      const semData = getSemesterData(sem);
      const isUnlocked = playerProgression.isSemesterUnlocked(sem);
      const isCompleted = playerProgression.completedSemesters.includes(sem);

      const lockedClass = !isUnlocked ? "locked" : "";
      const completedClass = isCompleted ? "completed" : "";

      html += `
                <div class="semester-card ${lockedClass} ${completedClass}" 
                     data-semester="${sem}"
                     onclick="${isUnlocked ? `game.selectSemester(${sem})` : ""}">
                    <div class="semester-num">Semester ${sem}</div>
                    <div class="semester-icon">${isCompleted ? "✅" : isUnlocked ? "📚" : "🔒"}</div>
                    <div class="semester-name">${semData.name}</div>
                    <div class="semester-desc">${semData.description}</div>
                    ${!isUnlocked ? '<div class="lock-overlay">🔒</div>' : ""}
                </div>
            `;
    }
    grid.innerHTML = html;
  }

  selectSemester(semesterNum) {
    this.currentSemester = semesterNum;
    this.currentRound = 1;

    // Create player character
    if (!this.player) {
      this.player = new Mahasiswa("Mahasiswa", "teknik");
      this.player.max_sanity = playerProgression.getMaxSanity();
      this.player.curr_sanity = this.player.max_sanity;
    } else {
      // Reset player HP for new semester
      this.player.max_sanity = playerProgression.getMaxSanity();
      this.player.curr_sanity = this.player.max_sanity;
    }

    this.hideModal("semester-select-modal");
    this.startRound();
  }

  // ============================================
  // BATTLE FLOW
  // ============================================

  startRound() {
    const semData = getSemesterData(this.currentSemester);
    const roundData = getRoundData(this.currentSemester, this.currentRound);

    // Update battle header
    document.getElementById("current-stage-name").textContent =
      `Semester ${this.currentSemester}: ${semData.name}`;
    document.getElementById("battle-count").textContent =
      `Ronde ${this.currentRound}/5 - ${roundData.type}`;

    // Create enemy
    const enemy = createEnemyFromRound(this.currentSemester, this.currentRound);

    this.showScreen("battle-screen");
    this.battleSystem.clearLog();
    this.battleSystem.startBattle(
      this.player,
      enemy,
      this.currentSemester,
      this.currentRound,
    );
    this.inBattle = true;
  }

  onBattleVictory(rewards) {
    this.inBattle = false;

    // Check if semester complete
    const isSemesterComplete = this.currentRound >= 5;

    // Show victory popup
    const victoryMessage = document.getElementById("victory-message");
    if (victoryMessage) {
      victoryMessage.textContent = isSemesterComplete
        ? `🎓 SEMESTER ${this.currentSemester} SELESAI!`
        : `🎉 Ronde ${this.currentRound} Clear!`;
    }

    // Show rewards
    const rewardsList = document.getElementById("rewards-list");
    if (rewardsList) {
      let html = `<div class="reward-item">📚 +${rewards.xp} XP</div>`;

      if (rewards.newCard) {
        // Use getInfo() to access card name (private field)
        const cardInfo = rewards.newCard.getInfo();
        html += `<div class="reward-item new-card-reward">🃏 Kartu Baru: <strong>${cardInfo.name}</strong> (${cardInfo.rarity})</div>`;
      }

      if (rewards.isBoss) {
        html += `<div class="reward-item">👑 Boss Defeated!</div>`;
      }

      rewardsList.innerHTML = html;
    }

    // Update button visibility and text
    const nextBtn = document.getElementById("btn-next-round");
    const backBtn = document.getElementById("btn-back-menu");

    if (isSemesterComplete) {
      // Semester complete - show both "Lanjut Semester" and "Kembali"
      if (nextBtn) {
        const nextSemester = this.currentSemester + 1;
        if (nextSemester <= 8) {
          nextBtn.textContent = `📚 Lanjut ke Semester ${nextSemester}`;
          nextBtn.style.display = "block";
        } else {
          // All semesters complete - hide next button
          nextBtn.style.display = "none";
        }
      }
      if (backBtn) {
        backBtn.textContent = "🏠 Kembali ke Kampus";
        backBtn.style.display = "block";
      }
    } else {
      // Round not complete - show only "Lanjut Ronde"
      if (nextBtn) {
        nextBtn.textContent = "Lanjut Ronde →";
        nextBtn.style.display = "block";
      }
      if (backBtn) {
        backBtn.style.display = "none"; // Hide back button for mid-round
      }
    }

    this.showScreen("victory-screen");
  }

  continueToNextRound() {
    if (this.currentRound >= 5) {
      // Semester complete - commit rewards
      playerProgression.completeSemester(this.currentSemester);

      // Move to next semester
      const nextSemester = this.currentSemester + 1;
      if (nextSemester <= 8) {
        this.currentSemester = nextSemester;
        this.currentRound = 1;
        this.player.resetSanity();
        this.startRound();
      } else {
        // Game complete!
        alert("🎓 SELAMAT! Kamu berhasil lulus semua semester! WISUDA!");
        this.returnToMainMenu();
      }
    } else {
      // Next round in same semester - still need to save new cards!
      // Process temp rewards now to unlock any new cards gained
      const results = playerProgression.processTempRewards();
      playerProgression.save();

      // Show level up popup if needed
      if (results.levelUp && results.levelUp.leveledUp) {
        this.showLevelUpPopup(results.levelUp);
      }

      // Show new cards popup if any
      if (results.cardsGained.length > 0) {
        this.showNewCardsPopup(results.cardsGained);
      }

      this.currentRound++;
      this.startRound();
    }
  }

  onBattleDefeat() {
    this.inBattle = false;

    document.getElementById("defeat-message").textContent =
      `💀 ${this.player.nama} kehabisan Sanity di Semester ${this.currentSemester} Ronde ${this.currentRound}...`;

    this.showScreen("defeat-screen");
  }

  retrySemester() {
    // Reset to round 1 of current semester
    this.currentRound = 1;
    this.player.resetSanity();
    this.startRound();
  }

  showCustomConfirm(message, title = "Konfirmasi") {
    return new Promise((resolve) => {
      const modal = document.getElementById("custom-confirm-modal");
      const titleEl = document.getElementById("custom-confirm-title");
      const msgEl = document.getElementById("custom-confirm-message");
      const yesBtn = document.getElementById("custom-confirm-yes");
      const cancelBtn = document.getElementById("custom-confirm-cancel");

      // Setup content
      if (titleEl) titleEl.textContent = title;
      if (msgEl) msgEl.innerHTML = message.replace(/\n/g, "<br>");

      // Cleanup previous listeners to avoid duplicates (naive but functional approach)
      const newYes = yesBtn.cloneNode(true);
      const newCancel = cancelBtn.cloneNode(true);
      yesBtn.parentNode.replaceChild(newYes, yesBtn);
      cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

      // Handlers
      const close = (result) => {
        modal.classList.remove("active");
        resolve(result);
      };

      newYes.addEventListener("click", () => close(true));
      newCancel.addEventListener("click", () => close(false));

      // Show
      modal.classList.add("active");
    });
  }

  async handleDropOut() {
    // Confirm before dropping out
    const isConfirmed = await this.showCustomConfirm(
      "Dih masa Badmood? nanti ngulang semester brok!",
      "Yakin Menyerah?",
    );

    if (isConfirmed) {
      this.inBattle = false;

      // Clear temp rewards (no XP gained from forfeiting)
      playerProgression.tempXP = 0;
      playerProgression.tempNewCards = [];

      // Return to main menu
      this.showScreen("main-menu");
      this.updateMainMenuUI();

      console.log("🏳️ Player dropped out from battle");
    }
  }

  returnToMainMenu() {
    // If semester was completed (round 5), make sure to complete it
    if (this.currentRound >= 5) {
      playerProgression.completeSemester(this.currentSemester);
    } else {
      // Only process temp rewards if not completing semester
      // (completeSemester already calls processTempRewards)
      const results = playerProgression.processTempRewards();
      playerProgression.save();

      // Show level up animation if needed
      if (results.levelUp && results.levelUp.leveledUp) {
        this.showLevelUpPopup(results.levelUp);
      }

      // Show new cards animation
      if (results.cardsGained.length > 0) {
        this.showNewCardsPopup(results.cardsGained);
      }
    }

    this.showScreen("main-menu");
    this.updateMainMenuUI();
  }

  showLevelUpPopup(levelInfo) {
    const newData = playerProgression.getLevelData(levelInfo.newLevel);
    this.showCustomAlert(
      `Level ${levelInfo.oldLevel} → ${levelInfo.newLevel}<br>Sanity ${newData.sanity}<br>Stamina ${newData.stamina}<br><br>${newData.features || ""}`,
      "🎉 LEVEL UP!",
    );
  }

  showNewCardsPopup(cardKeys) {
    const cardNames = cardKeys
      .map((key) => {
        const card = CARDS_DATA[key];
        return card ? `• ${card.getInfo().name}` : `• ${key}`;
      })
      .join("\n");

    this.showCustomAlert(
      `🃏 Kartu Baru Didapat!\n\n${cardNames}`,
      "Hadiah Semester",
    );
  }

  // ============================================
  // DECK MANAGER
  // ============================================

  showDeckManager() {
    this.renderDeckManager();
    this.showModal("deck-modal");
  }

  renderDeckManager() {
    const deckContainer = document.getElementById("deck-container");
    if (!deckContainer) return;

    // Rarity Sorting Weights
    const rarityWeight = {
      starter: 0,
      common: 1,
      uncommon: 2,
      rare: 3,
      ultimate: 4,
    };

    const getRarityWeight = (cardId) => {
      const card = CARDS_DATA[cardId];
      if (!card) return 0;
      return rarityWeight[card.getInfo().rarity] || 0;
    };

    // Get all card IDs
    const allCardIds = Object.keys(CARDS_DATA);
    const unlockedIds = new Set(playerProgression.unlockedCards);

    // Sort Unlocked Cards
    const uniqueUnlocked = [...unlockedIds].sort((a, b) => {
      return getRarityWeight(a) - getRarityWeight(b);
    });

    // --- Build Unlocked HTML ---
    let unlockedCardsHtml = "";

    for (const cardId of uniqueUnlocked) {
      const card = CARDS_DATA[cardId];
      if (!card) continue;

      const info = card.getInfo();
      const isFavorite = playerProgression.favoriteDeck.includes(cardId);
      const favClass = isFavorite ? "favorite" : "";
      const rarityClass = `rarity-${info.rarity}`;
      const costDisplay = info.cost === "ALL" ? "∞" : info.cost;

      // Icon HTML
      let iconHtml;
      if (card.iconType === "image") {
        iconHtml = `<img src="${info.icon}" alt="${info.name}" class="card-icon-img"/>`;
      } else {
        iconHtml = `<span class="card-icon-emoji">${info.icon}</span>`;
      }

      unlockedCardsHtml += `
        <div class="deck-card game-card ${rarityClass} ${favClass}" data-id="${cardId}"
             onclick="game.toggleFavoriteCard('${cardId}')" title="${info.description}">
          <div class="card-cost">${costDisplay}</div>
          <div class="card-icon-box">
            ${iconHtml}
          </div>
          <div class="card-desc-box">
            <div class="card-name">${info.name}</div>
            <div class="card-desc">${info.description}</div>
          </div>
          ${isFavorite ? '<div class="favorite-badge">⭐</div>' : ""}
        </div>
      `;
    }

    // --- Build Locked HTML ---
    // Filter and Sort Locked Cards
    const lockedIds = allCardIds
      .filter((id) => !unlockedIds.has(id))
      .sort((a, b) => getRarityWeight(a) - getRarityWeight(b));

    let lockedCardsHtml = "";

    for (const cardId of lockedIds) {
      const card = CARDS_DATA[cardId];
      if (!card) continue;

      const info = card.getInfo();
      const rarityClass = `rarity-${info.rarity}`;
      const costDisplay = info.cost === "ALL" ? "∞" : info.cost;

      // Icon HTML
      let iconHtml;
      if (card.iconType === "image") {
        iconHtml = `<img src="${info.icon}" alt="${info.name}" class="card-icon-img"/>`;
      } else {
        iconHtml = `<span class="card-icon-emoji">${info.icon}</span>`;
      }

      lockedCardsHtml += `
        <div class="deck-card game-card ${rarityClass} card-locked" data-id="${cardId}"
             title="??? - Belum dibuka">
          <div class="card-cost">${costDisplay}</div>
          <div class="card-icon-box">
            ${iconHtml}
          </div>
          <div class="card-desc-box">
            <div class="card-name">???</div>
            <div class="card-desc">Belum dibuka</div>
          </div>
        </div>
      `;
    }

    if (lockedIds.length === 0) {
      lockedCardsHtml =
        '<p class="empty-message">🎉 Semua kartu telah dibuka! Selamat!</p>';
    } else {
      // Wrap locked cards in grid
      lockedCardsHtml = `<div class="deck-cards-grid">${lockedCardsHtml}</div>`;
    }

    // --- Render Final Structure ---
    deckContainer.innerHTML = `
      <h4 class="unlocked-section-title">
          📚 Kartu Kamu (${uniqueUnlocked.length}/${allCardIds.length})
          <span class="deck-counter">Favorite: <span id="deck-count">${playerProgression.favoriteDeck.length}</span>/5</span>
      </h4>
      
      <div class="deck-cards-grid">
          ${unlockedCardsHtml}
      </div>

      <h4 class="locked-section-title">🔒 Kartu Belum Dibuka</h4>
      ${lockedCardsHtml}
    `;
  }

  toggleFavoriteCard(cardId) {
    const success = playerProgression.toggleFavoriteCard(cardId);
    if (success) {
      // Re-render to update badges
      this.renderDeckManager();
    } else {
      this.showCustomAlert(
        "Maksimal 5 kartu untuk Deck Favorite. Hapus satu kartu dulu sebelum menambah yang baru.",
        "Deck Penuh",
      );
    }
  }

  // ============================================
  // UI HELPERS
  // ============================================

  showScreen(screenId) {
    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.remove("active"));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add("active");
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("active");
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("active");
  }

  createParticles() {
    const container = document.getElementById("particles");
    if (!container) return;

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

// Global instance
let game = null;
