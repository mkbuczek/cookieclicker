const cookieCountText = document.getElementById("cookieCount");
const cpsText = document.getElementById("cps");
const cookie = document.getElementById("cookie");
const title = document.getElementById("title");

let cookieCount = 0;
let cps = 0;
let cookiesPerClick = 1;
let clickMultiplier = 1;

const buildings = [
    { id: "cursor", basePrice: 15, count: 0, cps: 0.1},
    { id: "grandma", basePrice: 100, count: 0, cps: 1},
    { id: "farm", basePrice: 1100, count: 0, cps: 8},
    { id: "mine", basePrice: 12000, count: 0, cps: 47}
];

const upgrades = [
    { id: 1, price: 100, name: "Reinforced index finger", text: "The mouse and cursors are twice as efficient.",
        building: "cursor", multiplier: 2, purchased: false},
    { id: 2, price: 500, name: "Carpal tunnel prevention cream", text: "The mouse and cursors are twice as efficient.",
        building: "cursor", multiplier: 2, purchased: false},
    { id: 3, price: 1000, name: "Forwards from grandma", text: "Grandmas are twice as efficient.", 
        building: "grandma", multiplier: 2, purchased: false}
];

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
    updateCookieCount()
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

    if (saveData) {
        let data = JSON.parse(saveData);

        cookieCount = Number(data.cookieCount) || 0;
        cps = Number(data.cps) || 0;
        cookiesPerClick = Number(data.cookiesPerClick) || 1;

        if (data.buildings) {
            buildings.forEach(building => {
                let savedBuilding = data.buildings.find(b => b.id === building.id);
                if (savedBuilding) {
                    building.count = savedBuilding.count;
                    building.cps = savedBuilding.cps;
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

document.querySelectorAll(".upgrade").forEach(upgrade => {
    upgrade.addEventListener("mouseenter", function(event) {
        const upgradeId = parseInt(this.id.replace("upg", ""), 10);
        const upgradeData = upgrades.find(u => u.id === upgradeId);

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
            tooltipText.innerHTML = upgradeData.text;
    
            tooltipLeft.appendChild(tooltipImg);
    
            let tooltipMiddle = document.createElement("div");
            tooltipMiddle.classList.add("tooltipMiddle");
    
            let tooltipName = document.createElement("div");
            tooltipName.classList.add("tooltipName");
            tooltipName.innerHTML = upgradeData.name;
    
            tooltipMiddle.appendChild(tooltipName);

            let tooltipRight = document.createElement("div");
            tooltipRight.classList.add("tooltipRight");
    
            let tooltipPrice = document.createElement("div");
            tooltipPrice.classList.add("tooltipPrice");
            let cookieIcon = document.createElement("img");
            cookieIcon.src = "assets/tinycookie.png";
            cookieIcon.style.marginRight = "5px";
            let priceText = document.createTextNode(upgradeData.price.toLocaleString());
    
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
    });

    upgrade.addEventListener("mouseleave", function() {
        upgradeTooltip.style.display = "none";
    })
})


//UPDATES CPS TEXT ELEMENT BASED ON BUILDINGS
function updateCPS() {
    cps = buildings.reduce((total, building) => total + (building.count * building.cps), 0);

    if (isFrenzy){
        cps *= 7;
    }

    cpsText.textContent = `per second: ${cps.toFixed(1).toLocaleString()}`;
}

//UPDATES ALL VISUALS
function updateVisuals() {

    buildings.forEach(building => {
        let priceText = document.getElementById(building.id).querySelector(".buildingPrice");
        let buildingDiv = document.getElementById(building.id);
        let price = Math.floor((building.basePrice) * (1.15 ** building.count));

        priceText.textContent = price.toLocaleString();

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
    cookiesPerClick = 1;

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
            case "mine":
                building.cps = 47;
                break;
            default:
                console.error("Cannot reset unknown building id: ", building.id);
        }
    });

    upgrades.forEach(upgrade => {
        upgrade.purchased = false;
    });

    let upgradeIcons = document.querySelectorAll('.upgrade');
    upgradeIcons.forEach(upgrade =>{
        upgrade.style.display = "flex";
        
    });
    updateCPS();
}

//DEBUG FEATURES: SPAWN GOLDEN COOKIE, INCREASE CPS, COOKIES, ETC
let debugMode = false
let debugDiv = document.getElementById("debugDiv");

function debug(num){
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
            cookieCount += 10000;
            break;
        
        case 2:
            cps += 10000;
            cpsText.textContent = `per second: ${cps.toFixed(1).toLocaleString()}`;
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
let tickDecrement;

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
    let randomTime = Math.random() * (120000 - 60000) + 60000; //spawns between 120 - 60 seconds
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

