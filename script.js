let cookieCountText = document.getElementById("cookieCount");
let cpsText = document.getElementById("cps");
let cookie = document.getElementById("cookie");

let cookieCount = 0;
let cps = 0;
let cursorCount = 0;
let grandmaCount = 0;
let farmCount = 0;

//CALLS LOAD FUNCTION
window.onload = loadGame;

//ADDS COOKIE CLICKING
cookie.addEventListener("click", function() {
    cookieCount++;
    updateCookieCount()
});

//ADDS CPS TO COOKIECOUNT
setInterval(() => {
    cookieCount += cps;
    saveGame();
    updateCookieCount();
}, 1000);

//SAVES GAME DATA
function saveGame(){
    let data = {
        cookieCount: cookieCount,
        cursorCount: cursorCount,
        grandmaCount: grandmaCount,
        farmCount: farmCount,
        cps: cps
    };
    localStorage.setItem("saveData", JSON.stringify(data));
}

//LOADS GAME DATA
function loadGame(){
    let saveData = localStorage.getItem("saveData");

    if (saveData) {
        let data = JSON.parse(saveData);

        cookieCount = data.cookieCount || 0;
        cursorCount = data.cursorCount || 0;
        grandmaCount = data.grandmaCount || 0;
        farmCount = data.farmCount || 0;
        cps = data.cps || 0;

        document.getElementById("cursorCount").textContent = cursorCount;
        document.getElementById("grandmaCount").textContent = grandmaCount;
        document.getElementById("farmCount").textContent = farmCount;

        updateCookieCount();
        updateCPS();
    }
}

//UPDATES COOKIE COUNT TEXT ELEMENT
function updateCookieCount(){
    cookieCountText.textContent = `${Math.floor(cookieCount)} Cookies`;
    updateShopVisuals();
}

//BUYS RESPECTIVE BUILDING IF ENOUGH COOKIES
function buyBuilding(building, price, buildingCountId) {
    if (price > cookieCount) {
        return;
    }
    else {
        cookieCount -= price;
        updateCookieCount()

        let buildingCount = document.getElementById(buildingCountId);
        let count = parseInt(buildingCount.textContent) || 0;
        count++;
        buildingCount.textContent = count;

        switch (building) {
            case "cursor":
                cursorCount++;
                break;
            case "grandma":
                grandmaCount++;
                break;
            case "farm":
                farmCount++;
                break;
            default:
                console.error("Invalid building type: ", building);
        }

        updateCPS();
    }
}

//UPDATES CPS TEXT ELEMENT BASED ON BUILDINGS
function updateCPS() {
    cps = (0.1*cursorCount)+(grandmaCount)+(8*farmCount);
    cpsText.textContent = `per second: ${cps.toFixed(1)}`;
}

//UPDATES SHOP VISUALS BASED ON COOKIE COUNT
function updateShopVisuals() {
    let buildings = [
        { id: "cursor", price: 15},
        { id: "grandma", price: 100},
        { id: "farm", price: 1100}
    ];

    buildings.forEach(building => {
        let priceText = document.getElementById(building.id).querySelector(".buildingPrice");
        let buildingDiv = document.getElementById(building.id);
        if (cookieCount >= building.price) {
            priceText.style.color = "lime";
            buildingDiv.style.opacity = "1";
        }
        else {
            priceText.style.color = "red";
            buildingDiv.style.opacity = "0.5";
        }
    });
}