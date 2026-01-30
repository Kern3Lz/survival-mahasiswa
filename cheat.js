// UNLOCK ALL - Survival Mahasiswa Cheat
window.activateCheat = function () {
  if (typeof CARDS_DATA === "undefined") {
    console.error("❌ CARDS_DATA not found! Load game first.");
    return false;
  }

  if (typeof playerProgression === "undefined") {
    console.error("❌ playerProgression not found!");
    return false;
  }

  // 1. Unlock ALL Cards dynamically
  const allCardKeys = Object.keys(CARDS_DATA);
  playerProgression.unlockedCards = [...allCardKeys];

  // 2. Complete Semesters
  playerProgression.completedSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
  playerProgression.highestSemester = 8;

  // 3. Max Stats
  playerProgression.currentLevel = 10;
  playerProgression.currentXP = 9999;
  playerProgression.totalXPEarned = 9999;

  // 4. Save
  playerProgression.save();

  // 5. Refresh UI if open
  if (typeof game !== "undefined") {
    if (game.renderDeckManager) game.renderDeckManager();
    if (game.updateMainMenuUI) game.updateMainMenuUI();

    game.showCustomAlert(
      `🎉 CHEAT ACTIVATED!\n\n🃏 ${allCardKeys.length} Kartu Unlocked\n🎓 Semester 1-8 Selesai\n⭐ Level MAX`,
      "HACKER MODE",
    );
  } else {
    alert("CHEAT SUCCESS! Refresh page to see changes.");
  }

  console.log("✅ CHEAT ACTIVATED: ALL UNLOCKED!");
  return true;
};

// Auto-execute if loaded
console.log("💉 Cheat script loaded. Waiting for game init...");

// Helper to wait for game
function waitForGame() {
  if (typeof game !== "undefined" && game instanceof GameManager) {
    console.log("🚀 Game found! Executing cheat...");
    window.activateCheat();
  } else {
    console.log("⏳ Waiting for game...");
    setTimeout(waitForGame, 500);
  }
}

// Auto-execute ONLY if route contains "cheat"
const shouldExecute =
  window.location.href.includes("/cheat") ||
  window.location.search.includes("cheat") ||
  window.location.hash.includes("cheat");

if (shouldExecute) {
  console.log("🕵️ Cheat route detected. Initializing...");

  if (document.readyState === "complete") {
    waitForGame();
  } else {
    window.addEventListener("load", waitForGame);
  }
} else {
  console.log(
    "🛡️ Cheat loaded but inactive. (Usage: Add '?cheat' or '#cheat' to URL or run activateCheat())",
  );
}
