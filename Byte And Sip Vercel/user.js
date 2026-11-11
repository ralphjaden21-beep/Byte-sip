const userNavItems = [
    ["dashboard", "🏠", "Dashboard / Home"], ["products", "☕", "Menu / Products"],
    ["cart", "🛒", "My Cart"], ["orders", "📝", "My Orders"], ["payment", "💳", "Payment"],
    ["history", "📜", "Order History"], ["favorites", "❤️", "Favorites"],
    ["notifications", "🔔", "Notifications"], ["profile", "👤", "My Profile"], ["settings", "⚙️", "Settings"]
];
const userProductDefaults = [
    { id: "p1", name: "First Commit Latte", category: "Hot Coffee", price: 350, stock: 28, image: "Signature Latte.png" },
    { id: "p2", name: "Kernel Cappuccino", category: "Hot Coffee", price: 330, stock: 22, image: "Cappuccino.webp" },
    { id: "p3", name: "Java Jolt Americano", category: "Hot Coffee", price: 330, stock: 30, image: "Americano.webp" },
    { id: "p4", name: "Debug Affogato", category: "Hot Coffee", price: 410, stock: 12, image: "Affogato.jpg" },
    { id: "p5", name: "Motherboard Mocha", category: "Iced Coffee", price: 300, stock: 24, image: "ice mocha.jpg" },
    { id: "p6", name: "Cold Boot Cold Brew", category: "Iced Coffee", price: 250, stock: 21, image: "Iced coffee.webp" },
    { id: "p7", name: "Cookies & Cream", category: "Non-Coffee", price: 300, stock: 20, image: "cookies and cream.webp" },
    { id: "p8", name: "Matcha", category: "Non-Coffee", price: 410, stock: 16, image: "matcha.jpg" },
    { id: "p9", name: "Butter Croissant", category: "Pastries", price: 180, stock: 18, image: "Butter Croissant.jpg" },
    { id: "p10", name: "Pesto Pasta", category: "Food", price: 420, stock: 10, image: "Pesto.jpg" }
];
let customer = readStore("currentUser", null);
let activePage = "dashboard";
let filterCategory = "All";
let searchValue = "";
let toastTimeout;

function readStore(key, fallback) {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch { return fallback; }
}
function writeStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function products() { return readStore("cafeProducts", userProductDefaults); }
function orders() { return readStore("cafeOrders", []); }
function cart() { return readStore("cart", []); }
function money(value) { return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(Number(value) || 0); }
function escapeText(value = "") { return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]); }
function customerOrders() { return orders().filter(order => order.username === customer.username || order.username === customer.email); }
function customerFavorites() { return Array.isArray(customer.favorites) ? customer.favorites : []; }
function dateText(value) { return new Date(value).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }); }
function countItems(items) { return (items || []).reduce((total, item) => total + Number(item.quantity || 1), 0); }
function getCategories() { return readStore("cafeCategories", ["Hot Coffee", "Iced Coffee", "Non-Coffee", "Pastries", "Food"]); }

if (localStorage.getItem("loggedIn") !== "true" || !customer || localStorage.getItem("userRole") !== "user") {
    window.location.replace(["admin", "super-admin"].includes(localStorage.getItem("userRole")) ? "admin.html" : "Log in.html");
} else {
    initializeUserPage();
}

function initializeUserPage() {
    if (!customer.username) customer.username = customer.email || "user";
    if (!Array.isArray(customer.favorites)) customer.favorites = ["p1"];
    writeStore("currentUser", customer);
    if (!localStorage.getItem("cafeProducts")) writeStore("cafeProducts", userProductDefaults);
    if (!localStorage.getItem("cafeCategories")) writeStore("cafeCategories", ["Hot Coffee", "Iced Coffee", "Non-Coffee", "Pastries", "Food"]);
    if (!localStorage.getItem("cafeOrders")) writeStore("cafeOrders", [
        { id: "BNS-1048", username: "user", customer: "Cafe User", items: [{ name: "First Commit Latte", quantity: 2, price: 350 }, { name: "Butter Croissant", quantity: 1, price: 180 }], total: 880, status: "Preparing", payment: "Paid", createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: "BNS-1047", username: "user", customer: "Cafe User", items: [{ name: "Matcha", quantity: 1, price: 410 }], total: 410, status: "Completed", payment: "Paid", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() }
    ]);
    document.getElementById("sidebarName").textContent = customer.name || "Cafe Member";
    document.getElementById("sidebarAvatar").textContent = (customer.name || "U").trim().charAt(0).toUpperCase();
    document.getElementById("topAvatar").textContent = (customer.name || "U").trim().charAt(0).toUpperCase();
    document.getElementById("accountNav").addEventListener("click", event => {
        const link = event.target.closest("[data-page]");
        if (link) { event.preventDefault(); closeMobileNav(); renderPage(link.dataset.page); }
    });
    document.getElementById("pageContent").addEventListener("click", onPageClick);
    document.getElementById("pageContent").addEventListener("submit", onPageSubmit);
    document.getElementById("pageContent").addEventListener("change", onPageChange);
    document.getElementById("pageContent").addEventListener("input", onPageInput);
    document.getElementById("logoutButton").addEventListener("click", logout);
    document.getElementById("mobileMenu").addEventListener("click", () => {
        const open = document.body.classList.toggle("sidebar-open");
        document.getElementById("mobileMenu").setAttribute("aria-expanded", String(open));
    });
    document.getElementById("sidebarScrim").addEventListener("click", closeMobileNav);
    renderPage("dashboard");
}

function closeMobileNav() { document.body.classList.remove("sidebar-open"); document.getElementById("mobileMenu").setAttribute("aria-expanded", "false"); }
function logout() { localStorage.removeItem("loggedIn"); localStorage.removeItem("userRole"); localStorage.removeItem("currentUser"); window.location.replace("Log in.html"); }
function renderNav() {
    const count = cart().reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    document.getElementById("accountNav").innerHTML = userNavItems.map(([id, icon, label]) => `<a href="#${id}" data-page="${id}" class="${id === activePage ? "active" : ""}"><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>${id === "cart" && count ? `<span class="nav-count">${count}</span>` : ""}</a>`).join("");
}
function go(page) { renderPage(page); }
function renderPage(page) {
    if (!userNavItems.some(item => item[0] === page)) page = "dashboard";
    activePage = page; renderNav();
    document.getElementById("currentSection").textContent = userNavItems.find(item => item[0] === page)[2];
    const pages = { dashboard: renderDashboard, products: renderProducts, cart: renderCart, orders: renderOrders, payment: renderPayment, history: renderHistory, favorites: renderFavorites, notifications: renderNotifications, profile: renderProfile, settings: renderSettings };
    document.getElementById("pageContent").innerHTML = pages[page]();
    window.scrollTo({ top: 0, behavior: "smooth" });
}
function heading(kicker, title, description = "", action = "") { return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1>${description ? `<p class="description">${description}</p>` : ""}</div>${action}</div>`; }
function stat(label, value, note, icon) { return `<article class="stat-card"><div class="stat-label"><span>${label}</span><span class="stat-icon">${icon}</span></div><strong class="stat-value">${value}</strong><span class="stat-note">${note}</span></article>`; }
function statusBadge(status) { const style = status === "Pending" ? "pending" : status === "Cancelled" ? "cancelled" : ""; return `<span class="status-badge ${style}">${escapeText(status)}</span>`; }
function empty(title, description, action = "") { return `<div class="empty-state"><strong>${title}</strong>${description}${action ? `<div style="margin-top:13px">${action}</div>` : ""}</div>`; }
function orderRow(order) { return `<article class="activity-row"><span class="activity-mark">☕</span><div><strong>${escapeText(order.id)} · ${money(order.total)}</strong><p>${countItems(order.items)} item(s) · ${statusBadge(order.status)}</p><time>${dateText(order.createdAt)}</time></div></article>`; }
function productRow(product) {
    const isSaved = customerFavorites().includes(product.id);
    return `<article class="product-item"><div class="product-thumb">${product.image ? `<img src="${escapeText(product.image)}" alt="${escapeText(product.name)}" loading="lazy" onerror="this.style.display='none'">` : "☕"}</div><div class="product-details"><strong>${escapeText(product.name)}</strong><span>${escapeText(product.category)}</span></div><span class="product-price">${money(product.price)}</span><div class="product-actions"><button class="favorite-toggle ${isSaved ? "saved" : ""}" data-favorite="${escapeText(product.id)}" aria-label="${isSaved ? "Remove from" : "Add to"} favorites" aria-pressed="${isSaved}">${isSaved ? "♥" : "♡"}</button><button class="product-add" data-add="${escapeText(product.id)}" aria-label="Add ${escapeText(product.name)} to cart">+</button></div></article>`;
}
function renderDashboard() {
    const currentOrders = customerOrders();
    const recent = currentOrders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
    return `<section class="welcome-banner"><div><p class="eyebrow">YOUR CAFE, YOUR WAY</p><h1>Good to see you, ${escapeText((customer.name || "friend").split(" ")[0])}.</h1><p>Take a pause, pick a favorite, and let us make your next coffee break a good one.<br><strong>This week: pair any drink with a pastry for a freshly made cafe break.</strong></p></div><button class="button banner-action" data-go="products">Explore the menu ↗</button></section>
        <section class="stat-grid">${stat("My orders", currentOrders.length, "Orders placed with us", "▤")}${stat("In progress", currentOrders.filter(order => !["Completed", "Cancelled"].includes(order.status)).length, "We are preparing your order", "◷")}${stat("Cart items", countItems(cart()), "Ready when you are", "＋")}${stat("Saved favorites", customerFavorites().length, "Your go-to cafe picks", "♡")}</section>
        <div class="content-grid"><section class="panel"><div class="panel-header"><h2>Made for your next break</h2><a href="#products" data-go="products">View full menu ↗</a></div><div class="panel-body"><div class="product-list">${products().slice(0, 4).map(productRow).join("")}</div></div></section><section class="panel"><div class="panel-header"><h2>Recent orders</h2><a href="#orders" data-go="orders">View orders ↗</a></div><div class="panel-body">${recent.length ? `<div class="activity-list">${recent.map(orderRow).join("")}</div>` : empty("No orders yet", "Your first cafe order will show up here.")}</div></section></div>`;
}
function renderProducts() {
    return `${heading("THE CAFE MENU", "Menu / Products", "Browse the drinks and bites currently available.")}
        <div class="toolbar"><div class="filter-group"><button class="filter-button active" data-category="All">All items</button>${getCategories().map(category => `<button class="filter-button" data-category="${escapeText(category)}">${escapeText(category)}</button>`).join("")}</div><input class="search-field" id="productSearch" type="search" placeholder="Search the menu" aria-label="Search menu products"></div>
        <section class="panel"><div class="panel-body"><div class="product-list" id="productList">${products().map(productRow).join("")}</div></div></section>`;
}
function renderCart() {
    const items = cart();
    const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0);
    return `${heading("YOUR ORDER", "My Cart", "Review your cafe picks before checking out.", `<button class="button secondary" data-go="products">＋ Add items</button>`)}${items.length ? `<div class="table-wrap"><table><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr></thead><tbody>${items.map((item, index) => `<tr><td><strong>${escapeText(item.name)}</strong></td><td>${money(item.price)}</td><td><input class="status-select" type="number" min="1" max="20" value="${Number(item.quantity || 1)}" data-quantity="${index}" aria-label="Quantity for ${escapeText(item.name)}"></td><td><strong>${money(Number(item.price) * Number(item.quantity || 1))}</strong></td><td><button class="button danger" data-remove-cart="${index}">Remove</button></td></tr>`).join("")}</tbody><tfoot><tr><td colspan="3"><strong>Order total</strong></td><td colspan="2"><strong>${money(total)}</strong></td></tr></tfoot></table></div><div class="form-actions"><button class="button" data-go="payment">Continue to payment · ${money(total)} →</button></div>` : `<section class="panel">${empty("Your cart is taking a coffee break", "Add a drink or bite from the menu to get started.", `<button class="button" data-go="products">Browse the menu</button>`)}</section>`}`;
}
function renderOrders() { const list = customerOrders().filter(order => !["Completed", "Cancelled"].includes(order.status)); return `${heading("IN THE MAKING", "My Orders", "Follow the progress of your current orders.")}${renderOrderTable(list, "No active orders", "Your new orders will appear here.")}`; }
function renderHistory() { return `${heading("PAST VISITS", "Order History", "A little record of the good things you've enjoyed.")}${renderOrderTable(customerOrders(), "No order history yet", "Your completed and previous orders will appear here.")}`; }
function renderOrderTable(list, title, message) { const sorted = list.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); return sorted.length ? `<div class="table-wrap"><table><thead><tr><th>Order</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>${sorted.map(order => `<tr><td><strong>${escapeText(order.id)}</strong></td><td>${(order.items || []).map(item => `${escapeText(item.name)} × ${Number(item.quantity || 1)}`).join(", ")}</td><td>${money(order.total)}</td><td>${escapeText(order.payment || "Unpaid")}</td><td>${statusBadge(order.status)}</td><td>${dateText(order.createdAt)}</td></tr>`).join("")}</tbody></table></div>` : `<section class="panel">${empty(title, message)}</section>`; }
function renderPayment() {
    const items = cart(); const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0);
    return `${heading("CHECKOUT", "Payment", "Choose how you'd like to pay for your order.")}${items.length ? `<div class="content-grid"><section class="panel"><div class="panel-header"><h2>Order summary</h2></div><div class="panel-body"><div class="activity-list">${items.map(item => `<article class="activity-row"><span class="activity-mark">☕</span><div><strong>${escapeText(item.name)} × ${Number(item.quantity || 1)}</strong><p>${money(item.price * (item.quantity || 1))}</p></div></article>`).join("")}</div><div class="preference-row"><strong>Total due</strong><strong>${money(total)}</strong></div></div></section><form class="settings-panel" id="paymentForm"><h2>Delivery address</h2><p>Your order will be delivered to this address.</p><div class="field full"><label for="deliveryAddress">Address</label><textarea id="deliveryAddress" name="address" required minlength="8" maxlength="500">${escapeText(customer.address || "")}</textarea></div><h2>Payment method</h2><p>Online payments open a safe, simulated sandbox. No real charges are made.</p><label class="preference-row"><span><strong>Cash on delivery</strong><p>Pay the courier when your order arrives.</p></span><input type="radio" name="method" value="Cash on delivery" checked></label><label class="preference-row"><span><strong>Online payment</strong><p>GCash, Maya, Visa, or Mastercard · sandbox</p></span><input type="radio" name="method" value="Online payment"></label><div class="form-actions"><button class="button" type="submit">Continue · ${money(total)}</button></div></form></div>` : `<section class="panel">${empty("Nothing to pay for yet", "Add something delicious to your cart first.", `<button class="button" data-go="products">Browse menu</button>`)}</section>`}`;
}
function renderFavorites() { const saved = products().filter(product => customerFavorites().includes(product.id)); return `${heading("YOUR SHORTLIST", "Favorites", "Your saved sips and bites, all in one place.", `<button class="button secondary" data-go="products">＋ Find a favorite</button>`)}${saved.length ? `<div class="favorite-grid">${saved.map(product => `<article class="favorite-card"><div class="product-thumb"><img src="${escapeText(product.image || "")}" alt="${escapeText(product.name)}" onerror="this.style.display='none'"></div><div class="favorite-info"><strong>${escapeText(product.name)}</strong><p>${money(product.price)}</p><div class="favorite-actions"><button class="button" data-add="${escapeText(product.id)}">Add to cart</button><button class="button danger favorite-remove" data-remove-favorite="${escapeText(product.id)}" aria-label="Remove favorite">×</button></div></div></article>`).join("")}</div>` : `<section class="panel">${empty("No favorites saved", "Save a menu item and it will be easy to find next time.", `<button class="button" data-go="products">Browse menu</button>`)}</section>`}`; }
function renderNotifications() {
    const notices = customerOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4).map(order => ({ icon: "☕", title: `Order ${order.id}: ${order.status}`, body: `Your ${countItems(order.items)}-item order is currently ${order.status.toLowerCase()}.`, time: order.createdAt }));
    notices.push({ icon: "✦", title: "A little something for your next visit", body: "Explore the menu and find a new cafe favorite.", time: new Date().toISOString() });
    return `${heading("STAY IN THE LOOP", "Notifications", "Order updates and cafe news in one place.")}<div class="notice-list">${notices.map((note, index) => `<article class="notice-item ${index === 0 ? "unread" : ""}"><span class="notice-icon">${note.icon}</span><div class="notice-copy"><strong>${escapeText(note.title)}</strong><p>${escapeText(note.body)}</p><time>${dateText(note.time)}</time></div></article>`).join("")}</div>`;
}
function renderProfile() { return `${heading("ACCOUNT DETAILS", "My Profile", "Keep your contact information up to date.")}<form class="settings-panel" id="profileForm"><h2>Personal information</h2><p>Your delivery address is required for orders.</p><div class="form-grid"><div class="field"><label for="profileName">Full name</label><input id="profileName" name="name" required maxlength="60" value="${escapeText(customer.name || "")}"></div><div class="field"><label for="profileEmail">Email address</label><input id="profileEmail" name="email" type="email" required maxlength="254" value="${escapeText(customer.email || "")}"></div><div class="field full"><label for="profileAddress">Delivery address</label><textarea id="profileAddress" name="address" required minlength="8" maxlength="500" rows="3">${escapeText(customer.address || "")}</textarea></div><div class="field"><label for="profilePhone">Contact number</label><input id="profilePhone" name="phone" type="tel" maxlength="24" value="${escapeText(customer.phone || "")}" placeholder="09XX XXX XXXX"></div><div class="field"><label>Username</label><input value="${escapeText(customer.username)}" disabled></div></div><div class="form-actions"><button class="button" type="submit">Save changes</button></div></form>`; }
function preference(key, fallback) { return readStore(`preferences-${customer.username}`, {})[key] ?? fallback; }
function renderSettings() { return `${heading("PREFERENCES & SECURITY", "Settings", "Manage your account preferences and password.")}<div class="settings-layout"><nav class="settings-tabs" aria-label="Settings sections"><button class="active" data-settings="preferences">Preferences</button><button data-settings="security">Password &amp; security</button></nav><section class="settings-panel" id="settingsPanel"><h2>Account preferences</h2><p>Choose which cafe updates you'd like to receive.</p><div class="preference-row"><span><strong>Order updates</strong><p>Get notified when your order status changes.</p></span><label class="switch"><input type="checkbox" data-pref="orderUpdates" ${preference("orderUpdates", true) ? "checked" : ""}><span></span></label></div><div class="preference-row"><span><strong>Promotions and cafe news</strong><p>Hear about seasonal drinks and special offers.</p></span><label class="switch"><input type="checkbox" data-pref="promotions" ${preference("promotions", true) ? "checked" : ""}><span></span></label></div><div class="form-actions"><button class="button danger" data-logout type="button">Logout</button></div></section></div>`; }
function toast(message) { document.querySelector(".toast")?.remove(); const node = document.createElement("div"); node.className = "toast"; node.setAttribute("role", "status"); node.textContent = message; document.body.append(node); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => node.remove(), 2500); }
function addToCart(id) { const product = products().find(item => item.id === id); if (!product) return; const items = cart(); const found = items.find(item => item.id === id || item.name === product.name); if (found) found.quantity = Number(found.quantity || 1) + 1; else items.push({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 }); writeStore("cart", items); renderNav(); toast(`${product.name} added to your cart.`); }
function toggleFavorite(id) { customer.favorites = customerFavorites(); customer.favorites = customer.favorites.includes(id) ? customer.favorites.filter(item => item !== id) : [...customer.favorites, id]; writeStore("currentUser", customer); const accounts = readStore("managedAccounts", []); const account = accounts.find(item => item.username === customer.username); if (account) { account.favorites = customer.favorites; writeStore("managedAccounts", accounts); } renderPage(activePage); }
function onPageClick(event) {
    const target = event.target.closest("button, a"); if (!target) return;
    if (target.dataset.go) { renderPage(target.dataset.go); return; }
    if (target.dataset.add) { addToCart(target.dataset.add); return; }
    if (target.dataset.favorite) { toggleFavorite(target.dataset.favorite); return; }
    if (target.dataset.removeCart !== undefined) { const items = cart(); items.splice(Number(target.dataset.removeCart), 1); writeStore("cart", items); renderPage("cart"); return; }
    if (target.dataset.removeFavorite) { customer.favorites = customerFavorites().filter(id => id !== target.dataset.removeFavorite); writeStore("currentUser", customer); renderPage("favorites"); return; }
    if (target.dataset.category) { filterCategory = target.dataset.category; document.querySelectorAll("[data-category]").forEach(button => button.classList.toggle("active", button === target)); filterProducts(); return; }
    if (target.dataset.settings) { renderSettingsTab(target.dataset.settings); return; }
    if (target.dataset.logout !== undefined) logout();
}
function onPageSubmit(event) {
    event.preventDefault(); const form = event.target; const data = new FormData(form);
    if (form.id === "paymentForm") {
        const items = cart(); if (!items.length) return;
        const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0);
        const deliveryAddress = String(data.get("address") || "").trim();
        if (!deliveryAddress) { toast("Enter a delivery address before placing the order."); return; }
        customer.address = deliveryAddress;
        writeStore("currentUser", customer);
        const accounts = readStore("managedAccounts", []);
        const account = accounts.find(item => item.username === customer.username);
        if (account) { account.address = deliveryAddress; writeStore("managedAccounts", accounts); }
        if (data.get("method") === "Online payment") {
            writeStore("pendingSandboxPayment", {
                username: customer.username,
                customer: customer.name,
                address: deliveryAddress,
                items: items.map(item => ({ ...item })),
                total
            });
            window.location.href = "sandbox-payment.html";
            return;
        }
        const allOrders = orders(); const id = `BNS-${String(Date.now()).slice(-6)}`;
        allOrders.unshift({ id, username: customer.username, customer: customer.name, address: deliveryAddress, items: items.map(item => ({ ...item })), total, status: "Preparing", payment: "Unpaid", method: "Cash on delivery", createdAt: new Date().toISOString() });
        writeStore("cafeOrders", allOrders);
        const catalog = products();
        items.forEach(item => { const product = catalog.find(entry => entry.id === item.id); if (product) product.stock = Math.max(0, Number(product.stock || 0) - Number(item.quantity || 1)); });
        writeStore("cafeProducts", catalog); writeStore("cart", []);
        window.location.href = `receipt.html?order=${encodeURIComponent(id)}`;
        return;
    }
    if (form.id === "profileForm") {
        customer.name = String(data.get("name")).trim(); customer.email = String(data.get("email")).trim(); customer.address = String(data.get("address")).trim(); customer.phone = String(data.get("phone")).trim(); writeStore("currentUser", customer);
        const accounts = readStore("managedAccounts", []); const account = accounts.find(item => item.username === customer.username); if (account) Object.assign(account, { name: customer.name, email: customer.email, address: customer.address, phone: customer.phone }); writeStore("managedAccounts", accounts);
        document.getElementById("sidebarName").textContent = customer.name; document.getElementById("sidebarAvatar").textContent = customer.name.charAt(0).toUpperCase(); document.getElementById("topAvatar").textContent = customer.name.charAt(0).toUpperCase(); toast("Your profile has been updated."); return;
    }
    if (form.id === "passwordForm") {
        const accounts = readStore("managedAccounts", []); const account = accounts.find(item => item.username === customer.username);
        if (!account || account.password !== data.get("currentPassword")) { toast("Current password is incorrect."); return; }
        if (data.get("newPassword") !== data.get("confirmPassword")) { toast("The new passwords do not match."); return; }
        account.password = String(data.get("newPassword")); writeStore("managedAccounts", accounts); toast("Password updated successfully."); renderPage("settings");
    }
}
function onPageChange(event) {
    if (event.target.dataset.quantity !== undefined) { const items = cart(); const item = items[Number(event.target.dataset.quantity)]; if (item) { item.quantity = Math.max(1, Math.min(20, Number(event.target.value) || 1)); writeStore("cart", items); renderPage("cart"); } }
    if (event.target.dataset.pref) { const prefs = readStore(`preferences-${customer.username}`, {}); prefs[event.target.dataset.pref] = event.target.checked; writeStore(`preferences-${customer.username}`, prefs); }
}
function onPageInput(event) { if (event.target.id === "productSearch") { searchValue = event.target.value; filterProducts(); } }
function filterProducts() { const list = document.getElementById("productList"); if (!list) return; const matches = products().filter(item => (filterCategory === "All" || item.category === filterCategory) && `${item.name} ${item.category}`.toLowerCase().includes(searchValue.toLowerCase())); list.innerHTML = matches.map(productRow).join("") || empty("No menu items found", "Try another search or category."); }
function renderSettingsTab(tab) {
    const panel = document.getElementById("settingsPanel"); document.querySelectorAll("[data-settings]").forEach(button => button.classList.toggle("active", button.dataset.settings === tab));
    if (tab !== "security") { renderPage("settings"); return; }
    panel.innerHTML = `<h2>Password &amp; security</h2><p>Choose a new password for your account.</p><form id="passwordForm"><div class="form-grid"><div class="field full"><label for="currentPassword">Current password</label><input id="currentPassword" name="currentPassword" type="password" required autocomplete="current-password"></div><div class="field"><label for="newPassword">New password</label><input id="newPassword" name="newPassword" type="password" required minlength="8" autocomplete="new-password"></div><div class="field"><label for="confirmPassword">Confirm new password</label><input id="confirmPassword" name="confirmPassword" type="password" required minlength="8" autocomplete="new-password"></div></div><div class="form-actions"><button class="button" type="submit">Update password</button></div></form>`;
}
