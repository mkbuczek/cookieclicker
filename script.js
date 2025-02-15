import { upgrades } from "./upgrades.js";
import { buildings } from "./buildings.js";

const cookieCountText = document.getElementById("cookieCount");
const cpsText = document.getElementById("cps");
const cookie = document.getElementById("cookie");
const title = document.getElementById("title");

let cookieCount = 0;
let cps = 0;
let cookiesPerClick = 1;
let clickMultiplier = 1;

//CALLS LOAD FUNCTION
window.onload = loadGame;

//ADDS COOKIE CLICKING
cookie.addEventListener("click", function(event) {
    if (clickFrenzy) {
        clickMultiplier = 777;
    }
    else{
        clickMultiplier = 1;
    }
    cookieCount += cookiesPerClick * clickMultiplier;
    createCookieClickText(event.clientX, event.clientY);
    updateCookieCount();
});

//CREATES COOKIE CLICK TEXT
function createCookieClickText(x, y) {
    let text = document.createElement("span");
    text.textContent = `+${(cookiesPerClick * clickMultiplier).toLocaleString()}`;
    text.classList.add("cookieClickText");

    text.style.left = (x - 10) + "px";
    text.style.top = (y - 30) + "px";
    text.style.position = "absolute";

    document.body.appendChild(text);

    setTimeout(() => {
        text.remove();
    }, 5000);
}

//ADDS CPS TO COOKIECOUNT
setInterval(() => {
    cookieCount += 0.1*cps;
    saveGame();
    updateCookieCount();
}, 100);

//SAVES GAME DATA
function saveGame() {
    let data = {
        cookieCount: cookieCount,
        cps: cps,
        cookiesPerClick: cookiesPerClick,
        buildings: buildings.map(building => ({ id: building.id, cps: building.cps, count: building.count })),
        upgrades: upgrades.map(upgrades => ({ id: upgrades.id, purchased: upgrades.purchased}))
    };

    localStorage.setItem("saveData", JSON.stringify(data));
}

//LOADS GAME DATA
function loadGame() {
    let saveData = localStorage.getItem("saveData");
    updateShopVisuals();
    updateAvailablePurchases();

    if (saveData) {
        let data = JSON.parse(saveData);

        cookieCount = Number(data.cookieCount) || 0;
        cps = Number(data.cps) || 0;
        cookiesPerClick = Number(data.cookiesPerClick) || 1;

        if (data.buildings) {
            buildings.forEach(building => {
                let savedBuilding = data.buildings.find(b => b.id === building.id);
                let buildingDiv = document.getElementById(building.id);
                if (savedBuilding) {
                    building.count = savedBuilding.count;
                    building.cps = savedBuilding.cps;
                    if (!buildingDiv) return;
                    document.getElementById(building.id + "Count").textContent = building.count;
                }
            });
        }

        if (data.upgrades) {
            upgrades.forEach(upgrade => {
                let savedUpgrade = data.upgrades.find(u => u.id === upgrade.id);
                if (savedUpgrade) {
                    upgrade.purchased = savedUpgrade.purchased;
                    if (upgrade.purchased) {
                        let upgradeDiv = document.getElementById(`upg${upgrade.id}`);
                        if (upgradeDiv) {
                            upgradeDiv.style.display = "none";
                        }
                    }
                }
            })
        }
        updateCookieCount();
        updateCPS();
    }
}

//UPDATES COOKIE COUNT TEXT ELEMENT
function updateCookieCount() {
    cookieCountText.textContent = `${Math.floor(cookieCount).toLocaleString()} Cookies`;
    title.textContent = `${Math.floor(cookieCount).toLocaleString()} Cookies - Cookie Clicker`;
    updateShopVisuals();
    updateAvailablePurchases();
}

//BUYS RESPECTIVE BUILDING IF ENOUGH COOKIES
window.buyBuilding = function(buildingId) {
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
window.buyUpgrade = function(upgradeId) {
    let upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased) return;

    if (cookieCount >= upgrade.price) {
        cookieCount -= upgrade.price;
        updateCookieCount();
        upgrade.purchased = true;

        applyUpgrade(upgrade.building, upgrade.multiplier);

        if(upgrade.building === "cursor") {
            cookiesPerClick *= 2;
        }

        let upgradeDiv = document.getElementById(`upg${upgradeId}`);
        if (upgradeDiv){
            upgradeDiv.style.display = "none";
        }
    }
}

//APPLIES RESPECTIVE UPGRADE TO BUILDING
function applyUpgrade(buildingId, multiplier) {
    let building = buildings.find(b => b.id === buildingId)
    if (building) {
        building.cps *= multiplier;
        updateCPS();
    }
}

//UPGRADE TOOLTIP LOGIC
let upgradeTooltip = document.createElement("div");
let shopContainer = document.getElementById("upgradeStore");

document.getElementById("upgradeStore").addEventListener("mouseenter", function(event) {
    if (event.target.classList.contains("upgrade")) {
        const upgradeId = parseInt(event.target.id.replace("upg", ""), 10);
        const upgradeData = upgrades.find(u => u.id === upgradeId);

        if (upgrades.length > 5) {
            shopContainer.classList.add("expanded");
        }

        if (upgradeData) {
            upgradeTooltip.innerHTML = "";

            upgradeTooltip.classList.add("upgradeTooltip");
            upgradeTooltip.style.display = "flex";
            upgradeTooltip.style.position = "absolute";
            upgradeTooltip.style.right = "310px";
            upgradeTooltip.style.top = "50px";

            let tooltipTop = document.createElement("div");
            tooltipTop.classList.add("tooltipTop");
            let tooltipBottom = document.createElement("div");
            tooltipBottom.classList.add("tooltipBottom");

            let tooltipLeft = document.createElement("div");
            tooltipLeft.classList.add("tooltipLeft");
    
            let tooltipImg = document.createElement("img");
            tooltipImg.src = "assets/" + upgradeData.building + "upgrade.png";
            tooltipImg.classList.add("tooltipImg");
    
            let tooltipText = document.createElement("div");
            tooltipText.classList.add("tooltipText");
            tooltipText.textContent = upgradeData.text;
    
            tooltipLeft.appendChild(tooltipImg);
    
            let tooltipMiddle = document.createElement("div");
            tooltipMiddle.classList.add("tooltipMiddle");
    
            let tooltipName = document.createElement("div");
            tooltipName.classList.add("tooltipName");
            tooltipName.textContent = upgradeData.name;
    
            tooltipMiddle.appendChild(tooltipName);

            let tooltipRight = document.createElement("div");
            tooltipRight.classList.add("tooltipRight");
    
            let tooltipPrice = document.createElement("div");
            tooltipPrice.classList.add("tooltipPrice");
            let cookieIcon = document.createElement("img");
            cookieIcon.src = "assets/tinycookie.png";
            cookieIcon.style.marginRight = "5px";
            
            let priceText = document.createElement("span");
            priceText.textContent = upgradeData.price.toLocaleString();
    
            if (cookieCount >= upgradeData.price) {
                priceText.style.color = "#60F064";
            }
            else {
                priceText.style.color = "#FF6666";
            }

            tooltipPrice.appendChild(cookieIcon);
            tooltipPrice.appendChild(priceText);
            tooltipRight.appendChild(tooltipPrice);
    
            tooltipTop.appendChild(tooltipLeft);
            tooltipTop.appendChild(tooltipMiddle);
            tooltipTop.appendChild(tooltipRight);
            tooltipBottom.appendChild(tooltipText);

            upgradeTooltip.appendChild(tooltipTop);
            upgradeTooltip.appendChild(tooltipBottom);
        
            document.body.appendChild(upgradeTooltip);
        }
    }
}, true);

document.getElementById("upgradeStore").addEventListener("mouseleave", function() {
    upgradeTooltip.style.display = "none";
    shopContainer.classList.remove("expanded");
});

//UPDATES CPS TEXT ELEMENT BASED ON BUILDINGS
function updateCPS() {
    cps = buildings.reduce((total, building) => total + (building.count * building.cps), 0);

    if (isFrenzy){
        cps *= 7;
    }

    cpsText.textContent = `per second: ${cps.toLocaleString()}`;
}

//UPDATES ALL SHOP VISUALS BASED ON THE AFFORDABILITY
//DIMS OUT PURCHASES THAT ARE TOO EXPENSIVE
function updateShopVisuals() {
    buildings.forEach(building => {
        let buildingDiv = document.getElementById(building.id);

        if (buildingDiv){ //check if the buildingDiv exists in DOM first
            let priceText = document.getElementById(building.id).querySelector(".buildingPrice");
            let price = Math.floor((building.basePrice) * (1.15 ** building.count));
            priceText.textContent = price.toLocaleString();

            if (cookieCount >= price) {
                priceText.style.color = "#60F064";
                buildingDiv.style.filter = "brightness(100%)";
            }
            else {
                priceText.style.color = "#FF6666";
                buildingDiv.style.filter = "brightness(50%)";
            }
        }
    });
    upgrades.forEach(upgrade => {
        let upgradeDiv = document.getElementById(`upg${upgrade.id}`);
        if (upgradeDiv){ //check if the upgradeDiv exists in DOM first
            if (cookieCount >= upgrade.price) {
                upgradeDiv.style.filter = "brightness(100%)";
            }
            else {
                upgradeDiv.style.filter = "brightness(50%)";
            }
        }
    });
}

//UPDATES WHICH UPGRADES/BUILDINGS ARE AVAILABLE
//BASED ON IF THE PLAYER HAS UNLOCKED THEM

function updateAvailablePurchases() {

    buildings.forEach( building => {
        let buildingDiv = document.getElementById(building.id);
        let buildingStore = document.getElementById("buildingStore");

        if(!buildingDiv) { //if the buildingDiv does not already exist in the DOM, create it
            buildingDiv = document.createElement("div");
            buildingDiv.id = `${building.id}`;
            buildingDiv.classList.add("building");
            buildingDiv.onclick = () => buyBuilding(building.id);

            let buildingImg = document.createElement("img");
            buildingImg.id = `${building.id}Img`;
            buildingImg.classList.add("buildingImg");
            buildingImg.src = `assets/${building.id}.png`;
            buildingImg.draggable = false;

            let buildingText = document.createElement("div");
            buildingText.id = `${building.id}Text`;

            let buildingName = document.createElement("div");
            buildingName.id = `${building.id}Name`;
            buildingName.classList.add("buildingName");
            buildingName.textContent = (building.id.charAt(0).toUpperCase()) + (building.id.slice(1));

            let buildingPrice = document.createElement("div");
            buildingPrice.id = `${building.id}Price`;
            buildingPrice.classList.add("buildingPrice");

            buildingText.appendChild(buildingName);
            buildingText.appendChild(buildingPrice);

            let buildingCount = document.createElement("div");
            buildingCount.id = `${building.id}Count`;
            buildingCount.classList.add("buildingCount");
            buildingCount.textContent = "0";

            buildingDiv.appendChild(buildingImg);
            buildingDiv.appendChild(buildingText);
            buildingDiv.appendChild(buildingCount);

            buildingStore.appendChild(buildingDiv);
        }

        const prereqBuilding = building.displayPrereq ? buildings.find(b => b.id === building.displayPrereq) : null;

        if (prereqBuilding && prereqBuilding.count >= 1 || !prereqBuilding) {
            buildingDiv.style.display = "flex";
        } else {
            buildingDiv.style.display = "none";
        }
    })

    upgrades.forEach( upgrade => {
        let upgradeDiv = document.getElementById(`upg${upgrade.id}`);

        if (!upgradeDiv) { //if the upgradeDiv does not already exist in the DOM, create it
            upgradeDiv = document.createElement("div");
            upgradeDiv.id = `upg${upgrade.id}`;
            upgradeDiv.classList.add("upgrade");
            upgradeDiv.classList.add(`${upgrade.building}Upgrade`);
            upgradeDiv.onclick = () => buyUpgrade(upgrade.id);
            upgradeDiv.style.display = "flex";
            shopContainer.appendChild(upgradeDiv);
        }

        const buildingId = upgrade.building;
        const requiredCount = upgrade.displayPrereq[buildingId] || 0;

        const building = buildings.find(b => b.id === buildingId);

        if (building && building.count >= requiredCount && !upgrade.purchased) {
            upgradeDiv.style.display = "flex";
        }
        else {
            upgradeDiv.style.display = "none";
        }
    });
}

//RESETS PROGRESS
window.reset = function() {
    cookieCount = 0;
    cps = 0;
    cookiesPerClick = 1;

    buildings.forEach(building => {
        building.count = 0;
        building.cps = building.baseCps;
        document.getElementById(building.id + "Count").textContent = building.count;
    });

    upgrades.forEach(upgrade => {
        upgrade.purchased = false;
    });

    updateCPS();
}

//DEBUG FEATURES: SPAWN GOLDEN COOKIE, INCREASE CPS, COOKIES, ETC
let debugMode = false
let debugDiv = document.getElementById("debugDiv");

window.debug = function(num){
    switch (num) {
        case 0:
            debugMode = (!debugMode);
    
            if (debugMode) {
                
                debugDiv.style.display = "flex";
            }
            else{
                debugDiv.style.display = "none";
            }
            break;
        case 1:
            cookieCount += 100000000;
            break;
        
        case 2:
            cps += 100000;
            cpsText.textContent = `per second: ${cps.toLocaleString()}`;
            break;
        
        case 3:
            spawnGoldenCookie();
            break;
        default:
            console.error("Invalid debug key: ", num);
    }
}

//
//GOLDEN COOKIE LOGIC
//
const goldenCookie = document.getElementById("goldenCookie");
const goldenCookieTimer = document.getElementById("goldenCookieTimer");
const effectTimer = document.getElementById("effectTimer");
const timerProgress = document.createElement("div");
let isFrenzy = false;
let clickFrenzy = false;
let duration;
let progressBarWidth;
let countdown;

timerProgress.classList.add("progress");
effectTimer.appendChild(timerProgress);

let gcTimerInterval;
let effectTimerInterval;
scheduleGoldenCookie();

//EVENT LISTENER FOR GOLDEN COOKIE CLICK
goldenCookie.addEventListener("click", function (event) {
    activateGoldenCookieEffect(event.clientX, event.clientY);
    this.style.display = "none";
    scheduleGoldenCookie();
})

//SPAWNS THE GOLDEN COOKIE AT A RANDOM POSITION ON SCREEN
//AND SCHEDULES THE NEXT ONE IF NOT CLICKED
function spawnGoldenCookie() {

    let x = Math.random() * (window.innerWidth - 200);
    let y = Math.random() * (window.innerHeight - 200);

    goldenCookie.style.left = `${x}px`;
    goldenCookie.style.top = `${y}px`;

    goldenCookie.style.display = "block";

    setTimeout(() => {
        goldenCookie.style.display = "none";
        scheduleGoldenCookie();
    }, 15000); //disappears and schedules another golden cookie after this interval
}

//SCHEDULES WHEN A GOLDEN COOKIE WILL SHOW UP AND SETS THE TIMER
function scheduleGoldenCookie() {
    let randomTime = Math.random() * (60000 - 30000) + 30000; //spawns between 30 - 60 seconds
    let countdown = Math.floor(randomTime / 1000);

    goldenCookieTimer.textContent = `${countdown}`;

    if (gcTimerInterval){
        clearInterval(gcTimerInterval);
    }

    gcTimerInterval = setInterval(() => {
        countdown--;
        goldenCookieTimer.textContent = `${countdown}`;

        if (countdown <= 0) {
            clearInterval(gcTimerInterval);
            spawnGoldenCookie();
            goldenCookieTimer.textContent = `!!!`;
        }
    }, 1000);
}

//ACTIVATES 1 OF 3 GOLDEN COOKIE EFFECTS
//SPAWNS THE GC DIV DESCRIPTION
//UPDATES CPS OR COOKIESPERCLICK OR COOKIECOUNT RESPECTIVELY
//SPAWNS PROGRESS BAR
function activateGoldenCookieEffect(x, y) {
    let randomEffectId = Math.floor(Math.random() * 3);

    let effectDiv = document.createElement("div");
    effectDiv.classList.add("effectDiv");

    effectDiv.style.left = (x - 10) + "px";
    effectDiv.style.top = (y - 100) + "px";
    effectDiv.style.position = "absolute";

    document.body.appendChild(effectDiv);

    setTimeout(() => {
        effectDiv.remove();
    }, 5000);

    switch (randomEffectId) {
        case 0: //lucky!
            let bankGain = Math.floor(((cookieCount * 0.15) + 13));
            let cpsGain = ((cps * 900) + 13);

            cookieCount += Math.min(bankGain, cpsGain);
            effectDiv.textContent = `Lucky! +${Math.min(bankGain, cpsGain).toLocaleString()} Cookies!`;
            break;
        case 1: //frenzy!
            duration = 77;
            countdown = duration;
            progressBarWidth = 100;
            updateProgressBar(progressBarWidth);

            effectTimer.style.display = "block";
            document.getElementById("effectCountdown").textContent = countdown.toFixed(1);
            isFrenzy = true;
            updateCPS();

            if (effectTimerInterval) {
                clearInterval(effectTimerInterval);
            }

            effectTimerInterval = setInterval(() => {
                countdown -= 0.1;
                document.getElementById("effectCountdown").textContent = countdown.toFixed(1);
                progressBarWidth = (countdown / duration) * 100;
                updateProgressBar(progressBarWidth);

                if (countdown <= 0) {
                    clearInterval(effectTimerInterval);
                    isFrenzy = false;
                    updateCPS();
                    
                    effectTimer.style.display = "none";
                }
            }, 100);

            effectDiv.textContent = `Frenzy! x7 cps for 77 seconds!`;
            break;
        case 2: //click frenzy!
            duration = 13;
            countdown = duration;
            progressBarWidth = 100;
            updateProgressBar(progressBarWidth);

            effectTimer.style.display = "block";
            document.getElementById("effectCountdown").textContent = countdown.toFixed(1);
            clickFrenzy = true;

            if (effectTimerInterval) {
                clearInterval(effectTimerInterval);
            }

            effectTimerInterval = setInterval(() => {
                countdown -= 0.1;
                document.getElementById("effectCountdown").textContent = countdown.toFixed(1);
                progressBarWidth = (countdown / duration) * 100;
                updateProgressBar(progressBarWidth);

                if (countdown <= 0) {
                    clearInterval(effectTimerInterval);
                    clickFrenzy = false
                    
                    effectTimer.style.display = "none";
                }
            }, 100);

            effectDiv.textContent = `Click Frenzy! x777 cookies per click for 13 seconds!`;
            break;
    }
}

//UPDATES PROGRESS BAR BASED ON GIVEN PERCENTAGE
function updateProgressBar(percentage) {
    timerProgress.style.width = percentage + "%";
}