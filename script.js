// DOORS
const normalDoors = document.querySelectorAll(".dungeon .door");
const bossDoors = document.querySelectorAll(".boss-room .door");
let openedDoors = 0;
let exploredRooms = document.querySelector(".explored")

// LOOT
const doorLoot = {
  "The Rusted Gate": "🪙 100 Gold",
  "The Hollow Watch": "🗝️ Iron Key",
  "The Warden’s Keep": "⚔️ Broken Sword",
  "The Black Altar": "📜 Cursed Scroll",
  "The Knight's Wake": "🪞 Mirror of Echoes"
};

const inventory = [];

// FUNCTIONS 
let player = {
maxHP: 100,
inventory: [],
gold: 0,
status: []
}





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
    
    console.log(player.maxHP);
  })
}


