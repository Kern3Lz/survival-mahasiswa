/**
 * MAIN.JS - Entry Point
 * Survival Mahasiswa: Semester Sanity
 *
 * Struktur Data yang digunakan:
 * - Stack (LIFO): Draw Pile, Discard Pile
 * - Queue (FIFO): Action History
 * - Array/List: Hand (kartu di tangan)
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 Survival Mahasiswa: Semester Sanity");
  console.log("");
  console.log("📚 OOP Structure:");
  console.log("  MakhlukHidup (Parent)");
  console.log("    ├── Mahasiswa (Player)");
  console.log("    └── Masalah (Enemy)");
  console.log("");
  console.log("📊 Data Structures:");
  console.log("  ├── Stack (LIFO): Draw Pile, Discard Pile");
  console.log("  ├── Queue (FIFO): Action History");
  console.log("  └── Array: Hand (kartu di tangan)");
  console.log("");

  const game = new GameManager();
  window.game = game;

  console.log("✅ Game initialized!");
});
