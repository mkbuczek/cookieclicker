let cookieCountText = document.getElementById("cookieCount");
let cpsText = document.getElementById("cps");
let cookie = document.getElementById("cookie");

let cookieCount = 0;
let cps = 0;
let cookiesPerClick = 1;

let buildings = [
    { id: "cursor", basePrice: 15, count: 0, cps: 0.1},
    { id: "grandma", basePrice: 100, count: 0, cps: 1},
    { id: "farm", basePrice: 1100, count: 0, cps: 8},
    { id: "mine", basePrice: 12000, count: 0, cps: 47}
];

let upgrades = [
    { id: 1, price: 100, name: "Reinforced index finger", multiplier: 2},
    { id: 2, price: 500, name: "Carpal tunnel prevention cream", multiplier: 2},
    { id: 3, price: 1000, name: "Forwards from grandma", multiplier: 2}
];

//CALLS LOAD FUNCTION
window.onload = loadGame;

//ADDS COOKIE CLICKING
cookie.addEventListener("click", function(event) {
    cookieCount += cookiesPerClick;
    createCookieClickText(event.clientX, event.clientY);
    updateCookieCount()
});

function createCookieClickText(x, y){
    let text = document.createElement("span");
    text.textContent = `+${cookiesPerClick}`;
    text.classList.add("cookieClickText");

    text.style.left = x + "px";
    text.style.top = y + "px";
    text.style.position = "absolute";

    document.body.appendChild(text);

    setTimeout(() => {
        text.remove();
    }, 1000);
}

//ADDS CPS TO COOKIECOUNT
setInterval(() => {
    cookieCount += 0.1*cps;
    saveGame();
    updateCookieCount();
}, 100);

//SAVES GAME DATA
function saveGame(){
    let data = {
        cookieCount: cookieCount,
        cps: cps,
        cookiesPerClick: cookiesPerClick,
        buildings: buildings.map(building => ({ id: building.id, count: building.count }))
    };

    localStorage.setItem("saveData", JSON.stringify(data));
}

//LOADS GAME DATA
function loadGame(){
    let saveData = localStorage.getItem("saveData");

    if (saveData) {
        let data = JSON.parse(saveData);

        cookieCount = Number(data.cookieCount) || 0;
        cps = Number(data.cps) || 0;

        if (data.buildings) {
            buildings.forEach(building => {
                let savedBuilding = data.buildings.find(b => b.id === building.id);
                if (savedBuilding) {
                    building.count = savedBuilding.count;
                    document.getElementById(building.id + "Count").textContent = building.count;
                }
            });
        }

        updateCookieCount();
        updateCPS();
    }
}

//UPDATES COOKIE COUNT TEXT ELEMENT
function updateCookieCount(){
    cookieCountText.textContent = `${Math.floor(cookieCount)} Cookies`;
    updateVisuals();
}

//BUYS RESPECTIVE BUILDING IF ENOUGH COOKIES
function buyBuilding(buildingId) {
    let building = buildings.find(b => b.id === buildingId);
    if (!building) return; 

    let price = Math.floor((building.basePrice) * (1.15 ** building.count));
    
    if (cookieCount >= price) {
        cookieCount -= price;
        updateCookieCount();

        building.count++;
        document.getElementById(building.id + "Count").textContent = building.count;

        updateCPS();
        saveGame();
    }
}

//BUYS RESPECTIVE UPGRADE IF ENOUGH COOKIES
function buyUpgrade(upgradeId) {
    let upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (cookieCount >= upgrade.price) {
        cookieCount -= upgrade.price;
        updateCookieCount();

      
        switch (upgradeId) {
            case 1:
                applyUpgrade("cursor", upgrade.multiplier);
                cookiesPerClick *= 2;
                break;
            case 2:
                applyUpgrade("cursor", upgrade.multiplier);
                cookiesPerClick *= 2;
                break;
            case 3:
                applyUpgrade("grandma", upgrade.multiplier);
                break;
            default:
                console.error("Invalid upgrade id: ", upgradeId);
        }

        let upgradeDiv = document.getElementById(`upg${upgradeId}`);
        if (upgradeDiv){
            upgradeDiv.style.display = "none";
        }
    }
}

function applyUpgrade(buildingId, multiplier){
    let building = buildings.find(b => b.id === buildingId)
    if (building) {
        building.cps *= multiplier;
        updateCPS();
    }
}

//UPDATES CPS TEXT ELEMENT BASED ON BUILDINGS
function updateCPS() {
    cps = buildings.reduce((total, building) => total + (building.count * building.cps), 0);
    cpsText.textContent = `per second: ${cps.toFixed(1)}`;
}

//UPDATES ALL VISUALS
function updateVisuals() {

    buildings.forEach(building => {
        let priceText = document.getElementById(building.id).querySelector(".buildingPrice");
        let buildingDiv = document.getElementById(building.id);
        let price = Math.floor((building.basePrice) * (1.15 ** building.count));

        priceText.textContent = price;

        if (cookieCount >= price) {
            priceText.style.color = "lime";
            buildingDiv.style.opacity = "1";
        }
        else {
            priceText.style.color = "red";
            buildingDiv.style.opacity = "0.5";
        }
    });
}

//RESETS PROGRESS
function reset() {
    cookieCount = 0;
    cps = 0;

    buildings.forEach(building => {
        building.count = 0;
        document.getElementById(building.id + "Count").textContent = building.count;

        switch (building.id) {
            case "cursor":
                building.cps = 0.1;
                break;
            case "grandma":
                building.cps = 1;
                break;
            case "farm":
                building.cps = 8;
                break;
            default:
                console.error("Cannot reset unknown building id: ", building.id);
        }
    });

    let upgradeIcons = document.querySelectorAll('.upgrade');
    upgradeIcons.forEach(upgrade =>{
        upgrade.style.display = "flex";
        
    });

    updateCPS();
}