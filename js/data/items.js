/**
 * ITEM DATA
 */
const ITEMS_DATA = {
  kopiSachet: {
    id: "kopiSachet",
    name: "Kopi Sachet",
    description: "+15 Kopi",
    type: "kopi",
    value: 15,
    icon: "☕",
    stackable: true,
    rarity: "common",
  },
  kopiSusu: {
    id: "kopiSusu",
    name: "Kopi Susu",
    description: "+30 Kopi",
    type: "kopi",
    value: 30,
    icon: "🥛",
    stackable: true,
    rarity: "uncommon",
  },
  espressoShot: {
    id: "espressoShot",
    name: "Espresso Shot",
    description: "+50 Kopi",
    type: "kopi",
    value: 50,
    icon: "☕",
    stackable: true,
    rarity: "rare",
  },
  indomie: {
    id: "indomie",
    name: "Indomie",
    description: "+20 Sanity",
    type: "healing",
    value: 20,
    icon: "🍜",
    stackable: true,
    rarity: "common",
  },
  nasiPadang: {
    id: "nasiPadang",
    name: "Nasi Padang",
    description: "+40 Sanity",
    type: "healing",
    value: 40,
    icon: "🍛",
    stackable: true,
    rarity: "uncommon",
  },
  seblak: {
    id: "seblak",
    name: "Seblak",
    description: "+60 Sanity",
    type: "healing",
    value: 60,
    icon: "🥘",
    stackable: true,
    rarity: "rare",
  },
  vitaminC: {
    id: "vitaminC",
    name: "Vitamin C",
    description: "Full Restore",
    type: "healing",
    value: 999,
    icon: "💊",
    stackable: true,
    rarity: "legendary",
  },
};

function getItemData(id) {
  return ITEMS_DATA[id] || null;
}
