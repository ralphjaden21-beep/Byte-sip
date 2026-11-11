let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isLoggedIn = localStorage.getItem("loggedIn") === "true";

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const count = document.getElementById("cartCount");
    if (count) {
        count.innerText = cart.length;
    }
}

function addToCart(name, price) {

    if (!isLoggedIn) {
        alert("You need to log in first!");
        window.location.href = "Log in.php";
        return;
    }

    cart.push({ name, price });
    saveCart();
    updateCartCount();

    alert(name + " added to cart!");
}

function loginSuccess() {
    localStorage.setItem("loggedIn", "true");
    isLoggedIn = true;

    alert("Login successful!");

    window.location.href = "user.php";
}

function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("cart");
    cart = [];
    location.reload();
}

window.onload = function () {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    isLoggedIn = localStorage.getItem("loggedIn") === "true";

    updateCartCount();
};
