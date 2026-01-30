/**
 * ============================================
 * STACK DATA STRUCTURE
 * ============================================
 *
 * Implementasi Stack (LIFO - Last In First Out)
 * Digunakan untuk:
 * - Draw Pile (Tumpukan kartu ambil)
 * - Discard Pile (Tumpukan kartu buang)
 *
 * Operasi Utama:
 * - push(item): Tambah item ke atas stack
 * - pop(): Ambil item dari atas stack
 * - peek(): Lihat item teratas tanpa mengambil
 */

class Stack {
  #items;
  #maxSize;

  /**
   * Constructor
   * @param {number} maxSize - Optional maximum size (0 = unlimited)
   */
  constructor(maxSize = 0) {
    this.#items = [];
    this.#maxSize = maxSize;
  }

  /**
   * Push item ke atas stack (LIFO)
   * @param {*} item - Item untuk ditambahkan
   * @returns {boolean} - Success status
   */
  push(item) {
    if (this.#maxSize > 0 && this.#items.length >= this.#maxSize) {
      console.warn("Stack overflow: Maximum size reached");
      return false;
    }
    this.#items.push(item);
    return true;
  }

  /**
   * Push multiple items ke stack
   * @param {Array} items - Array of items
   */
  pushMany(items) {
    items.forEach((item) => this.push(item));
  }

  /**
   * Pop item dari atas stack (LIFO)
   * @returns {*} - Item yang diambil, atau undefined jika kosong
   */
  pop() {
    if (this.isEmpty()) {
      console.warn("Stack underflow: Stack is empty");
      return undefined;
    }
    return this.#items.pop();
  }

  /**
   * Pop multiple items dari stack
   * @param {number} count - Jumlah item yang diambil
   * @returns {Array} - Array of items
   */
  popMany(count) {
    const result = [];
    for (let i = 0; i < count && !this.isEmpty(); i++) {
      result.push(this.pop());
    }
    return result;
  }

  /**
   * Peek item teratas tanpa mengambil
   * @returns {*} - Item teratas
   */
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.#items[this.#items.length - 1];
  }

  /**
   * Cek apakah stack kosong
   * @returns {boolean}
   */
  isEmpty() {
    return this.#items.length === 0;
  }

  /**
   * Get jumlah item dalam stack
   * @returns {number}
   */
  size() {
    return this.#items.length;
  }

  /**
   * Kosongkan stack
   */
  clear() {
    this.#items = [];
  }

  /**
   * Get semua items (untuk debugging/display)
   * @returns {Array} - Copy of items array
   */
  getAll() {
    return [...this.#items];
  }

  /**
   * Transfer semua items ke stack lain
   * @param {Stack} targetStack - Stack tujuan
   */
  transferTo(targetStack) {
    while (!this.isEmpty()) {
      targetStack.push(this.pop());
    }
  }

  /**
   * Shuffle stack (untuk reshuffle deck)
   */
  shuffle() {
    for (let i = this.#items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.#items[i], this.#items[j]] = [this.#items[j], this.#items[i]];
    }
  }

  /**
   * String representation
   */
  toString() {
    return `Stack[${this.#items.length}]: ${this.#items
      .map((i) => i.name || i)
      .join(" <- ")}`;
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = Stack;
}
