/**
 * ============================================
 * AUTH SYSTEM - Login & Guest Account
 * ============================================
 */

class AuthSystem {
  #currentUser;
  #users;
  #storageKey = "survival_mahasiswa_users";
  #sessionKey = "survival_mahasiswa_session";

  constructor() {
    this.#currentUser = null;
    this.#users = this.loadUsers();
    this.checkSession();
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================

  loadUsers() {
    try {
      const data = localStorage.getItem(this.#storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  saveUsers() {
    localStorage.setItem(this.#storageKey, JSON.stringify(this.#users));
  }

  checkSession() {
    try {
      const session = localStorage.getItem(this.#sessionKey);
      if (session) {
        const { username, isGuest } = JSON.parse(session);
        if (isGuest) {
          this.#currentUser = {
            username,
            isGuest: true,
            data: this.getDefaultUserData(),
          };
        } else if (this.#users[username]) {
          this.#currentUser = {
            username,
            isGuest: false,
            data: this.#users[username],
          };
        }
      }
    } catch {
      this.#currentUser = null;
    }
  }

  // ============================================
  // REGISTRATION & LOGIN
  // ============================================

  register(username, password) {
    if (!username || username.length < 3) {
      return { success: false, message: "Username minimal 3 karakter!" };
    }
    if (!password || password.length < 4) {
      return { success: false, message: "Password minimal 4 karakter!" };
    }
    if (this.#users[username]) {
      return { success: false, message: "Username sudah digunakan!" };
    }

    this.#users[username] = {
      password: this.hashPassword(password),
      ...this.getDefaultUserData(),
      createdAt: Date.now(),
    };
    this.saveUsers();

    return { success: true, message: "Registrasi berhasil!" };
  }

  login(username, password) {
    if (!this.#users[username]) {
      return { success: false, message: "Username tidak ditemukan!" };
    }
    if (this.#users[username].password !== this.hashPassword(password)) {
      return { success: false, message: "Password salah!" };
    }

    this.#currentUser = {
      username,
      isGuest: false,
      data: this.#users[username],
    };

    localStorage.setItem(
      this.#sessionKey,
      JSON.stringify({ username, isGuest: false })
    );
    return {
      success: true,
      message: "Login berhasil!",
      user: this.#currentUser,
    };
  }

  loginAsGuest() {
    const guestName = "Guest_" + Math.random().toString(36).substr(2, 6);
    this.#currentUser = {
      username: guestName,
      isGuest: true,
      data: this.getDefaultUserData(),
    };

    localStorage.setItem(
      this.#sessionKey,
      JSON.stringify({ username: guestName, isGuest: true })
    );
    return {
      success: true,
      message: "Bermain sebagai Guest",
      user: this.#currentUser,
    };
  }

  logout() {
    // Save progress before logout (if not guest)
    if (this.#currentUser && !this.#currentUser.isGuest) {
      this.saveProgress();
    }
    this.#currentUser = null;
    localStorage.removeItem(this.#sessionKey);
  }

  // ============================================
  // USER DATA
  // ============================================

  getDefaultUserData() {
    return {
      highestStage: 0,
      totalWins: 0,
      totalDefeats: 0,
      cardCollection: [], // IDs of unlocked cards
      unlockedCards: this.getStarterCardIds(),
      maxEnergy: 2, // Start with 2 energy
      lastCharacter: null,
    };
  }

  getStarterCardIds() {
    // Balanced starter: 2x Strike, 2x Block, 2x QuickJab, 2x Defend, 1x Focus, 1x Heal
    return [
      "strike",
      "strike",
      "block",
      "block",
      "quickJab",
      "quickJab",
      "defend",
      "defend",
      "focus",
      "heal",
    ];
  }

  get currentUser() {
    return this.#currentUser;
  }

  get isLoggedIn() {
    return this.#currentUser !== null;
  }

  get isGuest() {
    return this.#currentUser?.isGuest || false;
  }

  // ============================================
  // PROGRESS MANAGEMENT
  // ============================================

  saveProgress() {
    if (!this.#currentUser || this.#currentUser.isGuest) return;

    this.#users[this.#currentUser.username] = {
      ...this.#users[this.#currentUser.username],
      ...this.#currentUser.data,
      lastSaved: Date.now(),
    };
    this.saveUsers();
  }

  updateProgress(key, value) {
    if (!this.#currentUser) return;
    this.#currentUser.data[key] = value;
    if (!this.#currentUser.isGuest) {
      this.saveProgress();
    }
  }

  addCardToCollection(cardId) {
    if (!this.#currentUser) return;
    if (!this.#currentUser.data.unlockedCards.includes(cardId)) {
      this.#currentUser.data.unlockedCards.push(cardId);
    }
    this.#currentUser.data.cardCollection.push(cardId);
    if (!this.#currentUser.isGuest) {
      this.saveProgress();
    }
  }

  increaseMaxEnergy() {
    if (!this.#currentUser) return;
    this.#currentUser.data.maxEnergy = Math.min(
      5,
      this.#currentUser.data.maxEnergy + 1
    );
    if (!this.#currentUser.isGuest) {
      this.saveProgress();
    }
    return this.#currentUser.data.maxEnergy;
  }

  getMaxEnergy() {
    return this.#currentUser?.data?.maxEnergy || 2;
  }

  getUnlockedCards() {
    return this.#currentUser?.data?.unlockedCards || this.getStarterCardIds();
  }

  // ============================================
  // HELPER
  // ============================================

  hashPassword(password) {
    // Simple hash for demo (in production use proper hashing)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }
}

// Global instance
const authSystem = new AuthSystem();
