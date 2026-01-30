/**
 * ============================================
 * QUEUE DATA STRUCTURE
 * ============================================
 *
 * Implementasi Queue (FIFO - First In First Out)
 * Digunakan untuk:
 * - Turn Order (Urutan giliran)
 * - Action History (Riwayat aksi)
 *
 * Operasi Utama:
 * - enqueue(item): Tambah item ke belakang antrian
 * - dequeue(): Ambil item dari depan antrian
 * - front(): Lihat item terdepan tanpa mengambil
 */

class Queue {
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
   * Enqueue item ke belakang antrian (FIFO)
   * @param {*} item - Item untuk ditambahkan
   * @returns {boolean} - Success status
   */
  enqueue(item) {
    if (this.#maxSize > 0 && this.#items.length >= this.#maxSize) {
      // Remove oldest item if at max capacity
      this.dequeue();
    }
    this.#items.push(item);
    return true;
  }

  /**
   * Dequeue item dari depan antrian (FIFO)
   * @returns {*} - Item yang diambil, atau undefined jika kosong
   */
  dequeue() {
    if (this.isEmpty()) {
      console.warn("Queue underflow: Queue is empty");
      return undefined;
    }
    return this.#items.shift();
  }

  /**
   * Lihat item terdepan tanpa mengambil
   * @returns {*} - Item terdepan
   */
  front() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.#items[0];
  }

  /**
   * Lihat item terakhir (paling baru)
   * @returns {*} - Item terakhir
   */
  rear() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.#items[this.#items.length - 1];
  }

  /**
   * Cek apakah queue kosong
   * @returns {boolean}
   */
  isEmpty() {
    return this.#items.length === 0;
  }

  /**
   * Get jumlah item dalam queue
   * @returns {number}
   */
  size() {
    return this.#items.length;
  }

  /**
   * Kosongkan queue
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
   * Get last N items (untuk history display)
   * @param {number} n - Jumlah item
   * @returns {Array}
   */
  getLast(n) {
    return this.#items.slice(-n);
  }

  /**
   * Process all items in queue dengan callback
   * @param {Function} callback - Function to execute for each item
   */
  processAll(callback) {
    while (!this.isEmpty()) {
      const item = this.dequeue();
      callback(item);
    }
  }

  /**
   * String representation
   */
  toString() {
    return `Queue[${this.#items.length}]: ${this.#items
      .map((i) => i.name || i.type || i)
      .join(" -> ")}`;
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = Queue;
}
