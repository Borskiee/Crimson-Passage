// VARIABLES
const normalDoors = document.querySelectorAll(".dungeon .door");
const bossDoors = document.querySelectorAll(".boss-room .door");
let exploredRooms = document.querySelector(".explored");
let battleOverlay = document.querySelector(".battle-overlay");
let spHTML = document.querySelectorAll(".sp-dot");
let winButton = document.querySelector(".win-btn");
let hpBar = document.querySelector(".player-hp");
let mainHP = document.querySelector(".hp");
const selectItem = document.querySelector(".use-item");
let selectItemSpan = document.querySelector(".span-item");
const useItem = document.querySelector(".use-itm");
const discardItem = document.querySelector(".discard-item");
const maxSP = 4;
let skillPoints = 1;
let openedDoors = 0;
let currentPlayerHP = null;
let currentEnemy = null;
let currentBoss = null;

// ARRAYS AND OBJECTS
const doorLoot = [
  {
    name: "🗡️ Razorbrand Fang",
    type: "item",
    atkDamage() {
      return Math.floor(Math.random() * 50) + 25;
    },
  },
  {
    name: "🫀 Vial of the Undying",
    type: "item",
    hp: 500,
  },
  {
    name: "🛡️ Warden’s Spineplate",
    type: "item",
    def: 40,
  },
];

let player = {
  maxHP: 100,
  inventory: [],
  gold: 0,
  status: [],
};

const enemies = [
  {
    name: "🧟‍♀️ Zombie 🧟‍♀️",
    baseHP: 65,
    hp: 65,
    type: "melee",
    getDamage() {
      return Math.floor(Math.random() * 8) + 4;
    },
  },
  {
    name: "🔮 Dark Mage 🔮",
    baseHP: 50,
    hp: 50,
    type: "ranged",
    getDamage() {
      return Math.floor(Math.random() * 14) + 10;
    },
  },
  {
    name: "👺 Goblin Brute 👺",
    baseHP: 120,
    hp: 120,
    type: "melee",
    getDamage() {
      return Math.floor(Math.random() * 11) + 8;
    },
  },
];

const bosses = [
  {
    name: "🧠 The Headless Choir 👻",
    baseHP: 380,
    hp: 380,
    type: "hybrid",
    getDamage() {
      return Math.floor(Math.random() * 45) + 10;
    },
  },
   {
    name: `☠️ Vaelruth Crimson 🩸`,
    baseHP: 860,
    hp: 860,
    type: "hybrid",
    getDamage() {
      return Math.floor(Math.random() * 52) + 21;
    },
  },
  {
    name: "⛓️‍💥 Vowbreaker Seratha 🪬",
    baseHP: 420,
    hp: 420,
    type: "melee",
    getDamage() {
      return Math.floor(Math.random() * 32) + 13;
    },
  },
 
];

const items = [];
const slots = document.querySelectorAll(".slot");

function renderInventory() {
  slots.forEach((slot, index) => {
    if (items[index]) {
      slot.textContent = `${items[index]}`;
      slot.classList.remove("empty");
    } else {
      slot.textContent = "";
      slot.classList.add("empty");
    }
  });
}

let turns = ["player", "enemy"];
let currentTurn = turns[0];

const battleClasses = {
  playerHP: document.querySelector(".player-hp"),
  enemyName: document.querySelector(".enemy-name"),
  enemyHP: document.querySelector(".enemy-hp"),
};

const attacks = {
  normalAtk: document.querySelector(".normalAtk"),
  skill: document.querySelector(".skill"),
  ultimateSkill: document.querySelector(".ultimate-btn"),
};

const attackDamage = { normalAtk: 145, skill: 11, ultimateSkill: 56 };

// FUNCTIONS
document.body.style.overflow = "hidden";

function addItemToInventory(item) {
  if (items.length >= slots.length) {
    alert("Inventory full");
    return;
  }
  items.push(item);
  renderInventory();
}

// Normal Doors 🚪
for (const room of normalDoors) {
  room.addEventListener("click", (event) => {
    if (room.classList.contains("opened")) return;
    room.classList.add("opened");
    openedDoors++;
    exploredRooms.innerHTML = `Rooms Explored ${openedDoors}/5`;
    if (openedDoors === 5) {
      addItemToInventory("🛡️");
      bossDoors[0].classList.remove("disabled");
      bossDoors[2].classList.remove("disabled");
    }
    let eventsARR = ["battle", "trap", "loot"];
    let randomNumber = Math.floor(Math.random() * eventsARR.length);
    let randomEvents = eventsARR[randomNumber];
    if (randomEvents === "battle") {
      battleOverlay.classList.remove("hidden");
      const randomIndex = Math.floor(Math.random() * enemies.length);
      currentEnemy = enemies[randomIndex];
      battleClasses.enemyName.textContent = currentEnemy.name;
      battleClasses.enemyHP.textContent = currentEnemy.hp;

      currentPlayerHP = player.maxHP;

      winButton.onclick = () => {
        document.querySelector(".win-popup").classList.add("hidden");
      };
    }
    if (randomEvents === "trap") {
    }
    if (randomEvents === "loot") {
    }
  });
}

// Boss Door 😈
for (const room of bossDoors) {
  room.addEventListener("click", function (event) {
    room.classList.add("opened");
    openedDoors++;
    battleOverlay.classList.remove("hidden");
    if (openedDoors === 7) {
      bossDoors.forEach(door => door.classList.remove("disabled"));
    }

    const bossIndex = room.dataset.bossIndex;
    if (bossIndex !== undefined) {
      const boss = bosses[bossIndex];
       currentEnemy = boss; 
      battleClasses.enemyName.textContent = boss.name;
      battleClasses.enemyHP.textContent = boss.hp;
      currentPlayerHP = player.maxHP;
    }

    winButton.onclick = () => {
      document.querySelector(".win-popup").classList.add("hidden");
    };
  });
} 

// Battle Logic ⚔️
for (let atk in attacks) {
  attacks[atk].addEventListener("click", function (event) {
    if (currentTurn !== "player") return;
    if (!currentEnemy) return;

    if (atk === "normalAtk") {
      skillPoints++;
      if (skillPoints > maxSP) skillPoints = maxSP;
    }

    if (atk === "skill") {
      if (skillPoints < 2) return;
      skillPoints -= 2;
    }
    if (atk === "ultimateSkill") {
      if (skillPoints < 4) return;
      skillPoints -= 4;
    }

    // Damage 💥
    currentEnemy.hp -= attackDamage[atk];
    if (currentEnemy.hp <= 0) {
      attacks.skill.classList.add("disabled");
      attacks.ultimateSkill.classList.add("disabled");
      skillPoints = 1;
      battleOverlay.classList.add("hidden");
      document.querySelector(".win-popup").classList.remove("hidden");
      currentEnemy.hp = currentEnemy.baseHP;
    }

    // Skill points ✨
    spHTML.forEach((point, i) => {
      point.classList.toggle("filled", i < skillPoints);
    });

    // Disable attacks for enemy turn
    for (let key in attacks) {
      attacks[key].classList.add("disabled");
    }

    // Enemy Turn 🏹
    currentTurn = "enemy";

    setTimeout(() => {
        if (currentEnemy.hp <= 0) return;

      attacks.normalAtk.classList.toggle("disabled");
      attacks.skill.classList.toggle("disabled", skillPoints < 2);
      attacks.ultimateSkill.classList.toggle("disabled", skillPoints < 4);

      if (currentTurn === "enemy") {
        let dmg = currentEnemy.getDamage();
        currentPlayerHP -= dmg;
        console.log(`${currentEnemy.name} Damaged you for ${dmg} damage`);
        if (currentPlayerHP <= 0) {
          currentPlayerHP = 0;
          console.log("You died ☠️");
        }
        currentTurn = "player";
        hpBar.textContent = currentPlayerHP;
      }
    }, 1000);


    battleHP = currentPlayerHP;
    mainHP.textContent = `❤️HP: ${battleHP}`;
    battleClasses.enemyHP.textContent = currentEnemy.hp;
  });
}
