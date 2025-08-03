// VARIABLES
const normalDoors = document.querySelectorAll(".dungeon .door");
const bossDoors = document.querySelectorAll(".boss-room .door");
let exploredRooms = document.querySelector(".explored");
let battleOverlay = document.querySelector(".battle-overlay");
let spHTML = document.querySelectorAll(".sp-dot");
let winButton = document.querySelector(".win-btn");
let hpBar = document.querySelector(".player-hp");
let mainHP = document.querySelector(".hp");
let inventoryBtn = document.querySelector(".inventory-icon-btn");
let inv = document.querySelector(".inventory-popup");
const maxSP = 4;
let skillPoints = 1;
let openedDoors = 0;
let currentPlayerHP = null;
let currentEnemy = null;

// ARRAYS AND OBJECTS
const doorLoot = {
  "The Rusted Gate": "🪙 100 Gold",
  "The Hollow Watch": "🗝️ Iron Key",
  "The Warden’s Keep": "⚔️ Broken Sword",
  "The Black Altar": "📜 Cursed Scroll",
  "The Knight's Wake": "🪞 Mirror of Echoes",
};

let player = {
  maxHP: 100,
  inventory: [],
  gold: 0,
  status: [],
};

const enemies = [
  {
    name: "🧟‍♀️ Zombie 🧟‍♀️",
    hp: 65,
    type: "melee",
    getDamage() {
      return Math.floor(Math.random() * 8) + 4;
    },
  },
  {
    name: "🔮 Dark Mage 🔮",
    hp: 50,
    type: "ranged",
    getDamage() {
      return Math.floor(Math.random() * 14) + 10;
    },
  },
  {
    name: "👺 Goblin Brute 👺",
    hp: 120,
    type: "melee",
    getDamage() {
      return Math.floor(Math.random() * 11) + 8;
    },
  },
];

const inventory = [];

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

attackDamage = { normalAtk: 6, skill: 11, ultimateSkill: 26 };

// FUNCTIONS
document.body.style.overflow = "hidden";

inventoryBtn.onclick = () => inv.classList.remove("hidden");
document.querySelector(".inventory-close").onclick = () => {
  inv.classList.add("hidden");
};

for (const room of normalDoors) {
  room.addEventListener("click", (event) => {
    if (room.classList.contains("opened")) return;
    room.classList.add("opened");
    openedDoors++;
    exploredRooms.innerHTML = `Rooms Explored ${openedDoors}/5`;
    if (openedDoors === 5) {
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
      currentEnemy.hp = 0;
      attacks.skill.classList.add("disabled");
      attacks.ultimateSkill.classList.add("disabled");
      skillPoints = 1;
      battleOverlay.classList.add("hidden");
      document.querySelector(".win-popup").classList.remove("hidden");
    }

    // Skill points ✨
    spHTML.forEach((point, i) => {
      point.classList.toggle("filled", i < skillPoints);
    });

    for (let key in attacks) {
      attacks[key].classList.add("disabled");

      currentTurn = "enemy";

      setTimeout(() => {
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
    }
    mainHP.textContent = `❤️${currentEnemy.hp}`;
    battleClasses.enemyHP.textContent = currentEnemy.hp;
  });
}
