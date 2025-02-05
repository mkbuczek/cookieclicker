let cookieCountText = document.getElementById("cookieCount");
let cookie = document.getElementById("cookie");


let cookieCount = 0;

cookie.addEventListener("click", function() {
    cookieCount++;
    cookieCountText.textContent = `${cookieCount} Cookies`;
});