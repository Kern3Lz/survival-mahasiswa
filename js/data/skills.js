/**
 * SKILLS DATA
 */
const SKILLS_DATA = {
  basicAttack: {
    id: "basicAttack",
    name: "Bengong",
    description: "Serangan dasar",
    kopiCost: 0,
    type: "damage",
    icon: "👊",
  },
  sistemKebut: {
    id: "sistemKebut",
    name: "Sistem Kebut Semalam",
    description: "3x damage, -10 Sanity",
    kopiCost: 50,
    sanityCost: 10,
    type: "ultimate",
    icon: "⚡",
  },
  copyPaste: {
    id: "copyPaste",
    name: "Copy Paste",
    description: "50% instan kill, 50% -30 Sanity",
    kopiCost: 25,
    type: "gambling",
    icon: "🎰",
  },
  alasanLaptop: {
    id: "alasanLaptop",
    name: "Alasan Laptop Rusak",
    description: "Skip giliran musuh",
    kopiCost: 20,
    type: "utility",
    icon: "🛡️",
  },
};

function getSkillData(id) {
  return SKILLS_DATA[id] || null;
}
function getAllSkills() {
  return Object.values(SKILLS_DATA);
}
