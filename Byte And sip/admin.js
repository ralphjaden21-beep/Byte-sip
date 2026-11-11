const adminNavItems = window.adminNavItems;
const adminProductDefaults = [
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
const inventoryDefaults = [
    { id: "beans", name: "Coffee beans", quantity: 12, unit: "kg", minimum: 5 },
    { id: "milk", name: "Fresh milk", quantity: 20, unit: "L", minimum: 8 },
    { id: "sugar", name: "Sugar", quantity: 8, unit: "kg", minimum: 3 },
    { id: "cups", name: "Paper cups", quantity: 160, unit: "pcs", minimum: 50 },
    { id: "syrup", name: "Flavor syrup", quantity: 6, unit: "bottles", minimum: 2 },
    { id: "tea", name: "Tea and matcha", quantity: 4, unit: "kg", minimum: 2 }
];
let administrator = readStore("currentUser", null);
let activePage = "dashboard";
let orderFilter = "All";
let searchTerm = "";
let toastTimeout;

function readStore(key, fallback) { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
function writeStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function products() { return readStore("cafeProducts", adminProductDefaults); }
function orders() { return readStore("cafeOrders", []); }
function getCategories() { return readStore("cafeCategories", ["Hot Coffee", "Iced Coffee", "Non-Coffee", "Pastries", "Food"]); }
function inventory() { return readStore("cafeInventory", inventoryDefaults); }
function money(value) { return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(Number(value) || 0); }
function escapeText(value = "") { return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]); }
function dateText(value, options = { month: "short", day: "numeric", year: "numeric" }) { return new Date(value).toLocaleDateString("en-PH", options); }
function paidOrders(list = orders()) { return list.filter(order => order.payment === "Paid"); }
function salesTotal(list = orders()) { return paidOrders(list).reduce((total, order) => total + Number(order.total || 0), 0); }
function itemCount(items) { return (items || []).reduce((total, item) => total + Number(item.quantity || 1), 0); }

if (localStorage.getItem("loggedIn") !== "true" || !administrator || !["admin", "super-admin"].includes(localStorage.getItem("userRole"))) {
    window.location.replace(localStorage.getItem("userRole") === "user" ? "user.php" : "Log in.php");
} else {
    initializeAdminPage();
}

function initializeAdminPage() {
    if (!administrator.username) administrator.username = administrator.email || "admin";
    writeStore("currentUser", administrator);
    if (!localStorage.getItem("cafeProducts")) writeStore("cafeProducts", adminProductDefaults);
    if (!localStorage.getItem("cafeCategories")) writeStore("cafeCategories", ["Hot Coffee", "Iced Coffee", "Non-Coffee", "Pastries", "Food"]);
    if (!localStorage.getItem("cafeInventory")) writeStore("cafeInventory", inventoryDefaults);
    if (!localStorage.getItem("cafeOrders")) writeStore("cafeOrders", [
        { id: "BNS-1048", username: "user", customer: "Cafe User", items: [{ name: "First Commit Latte", quantity: 2, price: 350 }, { name: "Butter Croissant", quantity: 1, price: 180 }], total: 880, status: "Preparing", payment: "Paid", createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: "BNS-1047", username: "walk-in", customer: "Walk-in Customer", items: [{ name: "Kernel Cappuccino", quantity: 2, price: 330 }, { name: "Pesto Pasta", quantity: 1, price: 420 }], total: 1080, status: "Completed", payment: "Paid", createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
        { id: "BNS-1046", username: "walk-in", customer: "Walk-in Customer", items: [{ name: "Motherboard Mocha", quantity: 2, price: 300 }], total: 600, status: "Pending", payment: "Unpaid", createdAt: new Date(Date.now() - 2 * 3600000).toISOString() }
    ]);
    document.getElementById("sidebarName").textContent = administrator.name || "Administrator";
    document.getElementById("sidebarAvatar").textContent = (administrator.name || "A").trim().charAt(0).toUpperCase();
    document.getElementById("topAvatar").textContent = (administrator.name || "A").trim().charAt(0).toUpperCase();
    document.getElementById("accountNav").addEventListener("click", event => {
        const link = event.target.closest("[data-page]");
        if (link) { event.preventDefault(); closeMobileNav(); renderPage(link.dataset.page); }
    });
    document.getElementById("pageContent").addEventListener("click", onPageClick);
    document.getElementById("pageContent").addEventListener("submit", onPageSubmit);
    document.getElementById("pageContent").addEventListener("change", onPageChange);
    document.getElementById("pageContent").addEventListener("input", onPageInput);
    document.getElementById("pageContent").addEventListener("reset", event => {
        if (event.target.id === "productForm") {
            document.getElementById("productFormTitle").textContent = "Add a product";
            document.getElementById("cancelProductEdit").hidden = true;
        }
    });
    document.getElementById("logoutButton").addEventListener("click", logout);
    document.getElementById("mobileMenu").addEventListener("click", () => { const open = document.body.classList.toggle("sidebar-open"); document.getElementById("mobileMenu").setAttribute("aria-expanded", String(open)); });
    document.getElementById("sidebarScrim").addEventListener("click", closeMobileNav);
    renderPage("dashboard");
}

function closeMobileNav() { document.body.classList.remove("sidebar-open"); document.getElementById("mobileMenu").setAttribute("aria-expanded", "false"); }
function logout() { localStorage.removeItem("loggedIn"); localStorage.removeItem("userRole"); localStorage.removeItem("currentUser"); window.location.replace("Log in.php"); }
function nav() { const pending = orders().filter(order => order.status === "Pending").length; document.getElementById("accountNav").innerHTML = adminNavItems.map(([id, icon, label]) => `<a href="#${id}" data-page="${id}" class="${id === activePage ? "active" : ""}"><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>${id === "orders" && pending ? `<span class="nav-count">${pending}</span>` : ""}</a>`).join(""); }
function renderPage(page) {
    if (!adminNavItems.some(item => item[0] === page)) page = "dashboard";
    activePage = page; nav(); document.getElementById("currentSection").textContent = adminNavItems.find(item => item[0] === page)[2];
    const pages = { dashboard: renderDashboard, products: renderProducts, pos: renderPos, orders: renderOrders, inventory: renderInventory, transactions: renderTransactions, reports: renderReports, categories: renderCategories, customers: renderCustomers, profile: renderProfile, settings: renderSettings };
    document.getElementById("pageContent").innerHTML = pages[page](); window.scrollTo({ top: 0, behavior: "smooth" });
}
function heading(kicker, title, description = "", action = "") { return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1>${description ? `<p class="description">${description}</p>` : ""}</div>${action}</div>`; }
function stat(label, value, note, icon) { return `<article class="stat-card"><div class="stat-label"><span>${label}</span><span class="stat-icon">${icon}</span></div><strong class="stat-value">${value}</strong><span class="stat-note">${note}</span></article>`; }
function badge(status) { const style = status === "Pending" ? "pending" : status === "Cancelled" ? "cancelled" : ""; return `<span class="status-badge ${style}">${escapeText(status)}</span>`; }
function empty(title, description) { return `<div class="empty-state"><strong>${title}</strong>${description}</div>`; }
function orderActivity(order) { return `<article class="activity-row"><span class="activity-mark">☕</span><div><strong>${escapeText(order.id)} · ${escapeText(order.customer || "Cafe member")}</strong><p>${itemCount(order.items)} item(s) · ${money(order.total)} · ${badge(order.status)}</p><time>${dateText(order.createdAt, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time></div></article>`; }
function productRow(product) { return `<article class="product-item"><div class="product-thumb">${product.image ? `<img src="${escapeText(product.image)}" alt="" onerror="this.style.display='none'">` : "☕"}</div><div class="product-details"><strong>${escapeText(product.name)}</strong><span>${escapeText(product.category)}</span></div><span class="product-price">${money(product.price)}</span></article>`; }
function renderDashboard() {
    const now = new Date(); const todayOrders = orders().filter(order => new Date(order.createdAt).toDateString() === now.toDateString()); const todaySales = salesTotal(todayOrders); const pending = orders().filter(order => order.status === "Pending").length; const customerCount = managedAccounts().filter(account => account.role === "user").length;
    const latest = orders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
    return `<section class="welcome-banner"><div><p class="eyebrow">OWNER WORKSPACE</p><h1>Here's the cafe at a glance.</h1><p>Keep service moving, stay on top of stock, and see how the day is shaping up.</p></div><button class="button banner-action" data-go="pos">Start a new sale ↗</button></section>
        <section class="stat-grid">${stat("Today's sales", money(todaySales), `${todayOrders.length} orders today`, "₱")}${stat("Total orders", orders().length, "Across all order channels", "▤")}${stat("Needs attention", pending, "Orders awaiting action", "◷")}${stat("Cafe members", customerCount, "Registered customer accounts", "♙")}</section>
        <section class="admin-highlight"><div><span>Recorded revenue</span><strong>${money(salesTotal())}</strong><small>Paid transactions to date</small></div><div><span>Low supplies</span><strong>${inventory().filter(item => Number(item.quantity) <= Number(item.minimum)).length}</strong><small>Items at or below minimum stock</small></div><div><span>Menu products</span><strong>${products().length}</strong><small>Items in the cafe catalog</small></div></section>
        <div class="content-grid"><section class="panel"><div class="panel-header"><h2>Latest orders</h2><a href="#orders" data-go="orders">Manage orders ↗</a></div><div class="panel-body">${latest.length ? `<div class="activity-list">${latest.map(orderActivity).join("")}</div>` : empty("No orders found", "New customer orders will appear here.")}</div></section><section class="panel"><div class="panel-header"><h2>Quick actions</h2></div><div class="panel-body"><div class="quick-actions"><button class="quick-action" data-go="products"><span>☕</span><span><strong>Add a product</strong><small>Update the cafe menu</small></span></button><button class="quick-action" data-go="pos"><span>＋</span><span><strong>New order</strong><small>Ring up a customer</small></span></button><button class="quick-action" data-go="inventory"><span>📦</span><span><strong>Check supplies</strong><small>Review inventory</small></span></button></div></div></section></div>`;
}
function renderProducts() {
    const rows = products().map(product => `<tr><td><strong>${escapeText(product.name)}</strong></td><td>${escapeText(product.category)}</td><td>${money(product.price)}</td><td>${Number(product.stock || 0)}</td><td><button class="button secondary" data-edit-product="${escapeText(product.id)}">Edit</button> <button class="button danger" data-delete-product="${escapeText(product.id)}">Delete</button></td></tr>`).join("");
    return `${heading("CAFE CATALOG", "Product Management", "Add, update, or remove coffee products and food.", `<button class="button" data-focus="productForm">＋ Add product</button>`)}<form class="settings-panel" id="productForm"><h2 id="productFormTitle">Add a product</h2><p>Updates will appear in the customer menu.</p><input type="hidden" name="productId"><div class="form-grid"><div class="field"><label for="productName">Product name</label><input id="productName" name="name" required maxlength="60"></div><div class="field"><label for="productCategory">Category</label><select id="productCategory" name="category">${getCategories().map(category => `<option>${escapeText(category)}</option>`).join("")}</select></div><div class="field"><label for="productPrice">Price (PHP)</label><input id="productPrice" name="price" type="number" min="1" required></div><div class="field"><label for="productStock">Product stock</label><input id="productStock" name="stock" type="number" min="0" value="0" required></div><div class="field full"><label for="productImage">Image filename (optional)</label><input id="productImage" name="image" maxlength="120" placeholder="Example: Cappuccino.webp"></div></div><div class="form-actions"><button class="button secondary" type="reset" id="cancelProductEdit" hidden>Cancel edit</button><button class="button" type="submit">Save product</button></div></form><div style="height:15px"></div><div class="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function renderPos() {
    const available = products().filter(product => Number(product.stock) > 0);
    return `${heading("POINT OF SALE", "POS / New Order", "Input a customer order and record the sale.")}
        <div class="content-grid"><form class="settings-panel" id="posForm"><h2>New sale</h2><p>Create an order for a cafe member or walk-in customer.</p><div class="form-grid"><div class="field full"><label for="posCustomer">Customer name</label><input id="posCustomer" name="customer" required maxlength="60" placeholder="Walk-in customer"></div><div class="field"><label for="posUsername">Customer username (optional)</label><input id="posUsername" name="username" maxlength="60" placeholder="Registered member username"></div><div class="field"><label for="posProduct">Product</label><select id="posProduct" name="productId" required>${available.map(product => `<option value="${escapeText(product.id)}">${escapeText(product.name)} · ${money(product.price)} (${product.stock} left)</option>`).join("")}</select></div><div class="field"><label for="posQuantity">Quantity</label><input id="posQuantity" name="quantity" type="number" min="1" value="1" required></div><div class="field"><label for="posPayment">Payment status</label><select id="posPayment" name="payment"><option>Paid</option><option>Unpaid</option></select></div></div><div class="form-actions"><button class="button" type="submit">Create order</button></div></form><section class="panel"><div class="panel-header"><h2>In-stock menu</h2><a href="#inventory" data-go="inventory">Review inventory ↗</a></div><div class="panel-body"><div class="product-list">${available.slice(0, 5).map(productRow).join("") || empty("No products in stock", "Update product stock before starting a sale.")}</div></div></section></div>`;
}
function renderOrders() {
    const list = orders().filter(order => (orderFilter === "All" || order.status === orderFilter) && `${order.id} ${order.customer} ${order.username} ${order.address || ""}`.toLowerCase().includes(searchTerm.toLowerCase())).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const rows = list.map(order => `<tr><td><strong>${escapeText(order.id)}</strong></td><td>${escapeText(order.customer || "Cafe member")}</td><td>${escapeText(order.address || "—")}</td><td>${(order.items || []).map(item => `${escapeText(item.name)} × ${Number(item.quantity || 1)}`).join(", ")}</td><td>${money(order.total)}</td><td>${escapeText(order.payment || "Unpaid")}</td><td>${badge(order.status)}</td><td>${dateText(order.createdAt, { month: "short", day: "numeric" })}</td><td><select class="status-select" data-status="${escapeText(order.id)}"><option ${order.status === "Pending" ? "selected" : ""}>Pending</option><option ${order.status === "Preparing" ? "selected" : ""}>Preparing</option><option ${order.status === "Ready" ? "selected" : ""}>Ready</option><option ${order.status === "Completed" ? "selected" : ""}>Completed</option><option ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option></select></td></tr>`).join("");
    return `${heading("ORDER FULFILLMENT", "Order Management", "Review incoming orders and keep each order status current.")}<div class="toolbar"><div class="filter-group">${["All", "Pending", "Preparing", "Ready", "Completed", "Cancelled"].map(filter => `<button class="filter-button ${filter === orderFilter ? "active" : ""}" data-filter="${filter}">${filter}</button>`).join("")}</div><input id="orderSearch" class="search-field" value="${escapeText(searchTerm)}" type="search" placeholder="Search order or customer"></div><div class="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Delivery address</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Update</th></tr></thead><tbody>${rows || `<tr><td colspan="9">No matching orders.</td></tr>`}</tbody></table></div>`;
}
function renderInventory() {
    const stock = inventory();
    const rows = stock.map(item => `<tr><td><strong>${escapeText(item.name)}</strong></td><td>${Number(item.quantity)} ${escapeText(item.unit)}</td><td>${Number(item.minimum)} ${escapeText(item.unit)}</td><td><span class="status-badge ${Number(item.quantity) <= Number(item.minimum) ? "pending" : ""}">${Number(item.quantity) <= Number(item.minimum) ? "Restock soon" : "In stock"}</span></td><td><button class="button secondary" data-stock="${escapeText(item.id)}" data-delta="5">＋ Add 5</button> <button class="button danger" data-stock="${escapeText(item.id)}" data-delta="-1">− Remove 1</button></td></tr>`).join("");
    const lowCount = stock.filter(item => Number(item.quantity) <= Number(item.minimum)).length;
    return `${heading("SUPPLY CHECK", "Inventory Management", "Track coffee beans, milk, sugar, cups, and other cafe supplies.", `<button class="button" data-focus="inventoryForm">＋ Add supply</button>`)}<div class="admin-highlight"><div><span>Tracked supplies</span><strong>${stock.length}</strong><small>Inventory line items</small></div><div><span>Low stock alerts</span><strong>${lowCount}</strong><small>At or below minimum level</small></div><div><span>Menu products</span><strong>${products().length}</strong><small>Separately tracked in catalog</small></div></div><form class="settings-panel" id="inventoryForm"><h2>Add an inventory item</h2><p>Enter a supply and its current stock level.</p><div class="form-grid"><div class="field"><label for="supplyName">Supply name</label><input id="supplyName" name="name" required maxlength="50" placeholder="e.g. Oat milk"></div><div class="field"><label for="supplyQuantity">Quantity</label><input id="supplyQuantity" name="quantity" type="number" min="0" value="0" required></div><div class="field"><label for="supplyUnit">Unit</label><input id="supplyUnit" name="unit" required maxlength="15" placeholder="kg, L, pcs"></div><div class="field"><label for="supplyMinimum">Minimum stock</label><input id="supplyMinimum" name="minimum" type="number" min="0" value="2" required></div></div><div class="form-actions"><button class="button" type="submit">Save supply</button></div></form><div style="height:15px"></div><div class="table-wrap"><table><thead><tr><th>Supply</th><th>Current stock</th><th>Minimum</th><th>Status</th><th>Quick update</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function renderTransactions() {
    const list = paidOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return `${heading("PAYMENT LEDGER", "Sales & Transactions", "Review payments recorded against customer orders.")}${stat("Total sales", money(salesTotal()), `${list.length} paid transactions`, "₱")}<div style="height:15px"></div><div class="table-wrap"><table><thead><tr><th>Transaction</th><th>Customer</th><th>Payment method</th><th>Amount</th><th>Date</th></tr></thead><tbody>${list.map(order => `<tr><td><strong>${escapeText(order.id)}</strong></td><td>${escapeText(order.customer || "Cafe member")}</td><td>${escapeText(order.method || "Cafe checkout")}</td><td>${money(order.total)}</td><td>${dateText(order.createdAt)}</td></tr>`).join("") || `<tr><td colspan="5">No paid transactions yet.</td></tr>`}</tbody></table></div>`;
}
function renderReports() {
    const periods = [1, 7, 30].map(days => { const since = Date.now() - days * 86400000; const list = paidOrders().filter(order => new Date(order.createdAt).getTime() >= since); return { days, total: salesTotal(list), count: list.length }; });
    const max = Math.max(...periods.map(period => period.total), 1);
    return `${heading("BUSINESS PERFORMANCE", "Sales Reports", "Daily, weekly, and monthly sales from recorded paid transactions.")}<section class="stat-grid">${periods.map(period => stat(period.days === 1 ? "Daily sales" : period.days === 7 ? "Weekly sales" : "Monthly sales", money(period.total), `${period.count} paid orders`, "↗")).join("")}</section><section class="panel"><div class="panel-header"><h2>Sales by period</h2><span class="description">Based on recorded payments</span></div><div class="panel-body"><div class="activity-list">${periods.map(period => `<div class="preference-row"><span><strong>${period.days === 1 ? "Today" : `Last ${period.days} days`}</strong><p>${period.count} transactions</p></span><span style="width:42%;height:8px;background:linear-gradient(90deg,#244c3d ${Math.max(4, period.total / max * 100)}%,#e9ede4 ${Math.max(4, period.total / max * 100)}%);border-radius:8px"></span><strong>${money(period.total)}</strong></div>`).join("")}</div></div></section>`;
}
function renderCategories() {
    const rows = getCategories().map(category => `<tr><td><strong>${escapeText(category)}</strong></td><td>${products().filter(product => product.category === category).length}</td><td><button class="button danger" data-delete-category="${escapeText(category)}">Remove</button></td></tr>`).join("");
    return `${heading("MENU ORGANIZATION", "Category Management", "Manage categories used to organize the cafe menu.")}<form class="settings-panel" id="categoryForm"><h2>Add a category</h2><p>Examples: Hot Coffee, Iced Coffee, Non-Coffee, and Pastries.</p><div class="toolbar" style="margin:0"><input class="search-field" name="category" required maxlength="40" placeholder="Category name"><button class="button" type="submit">＋ Add category</button></div></form><div style="height:15px"></div><div class="table-wrap"><table><thead><tr><th>Category</th><th>Products</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function managedAccounts() {
    const fallback = [{ username: "user", role: "user", name: "Cafe User", email: "user@ovenorigin.com", status: "Active" }];
    return readStore("managedAccounts", fallback);
}
function renderCustomers() {
    const customers = managedAccounts().filter(account => account.role === "user");
    return `${heading("CAFE COMMUNITY", "Customer Management", "View the customer details provided with member accounts.")}${stat("Registered customers", customers.length, "Cafe member accounts", "♙")}<div style="height:15px"></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Contact</th><th>Status</th></tr></thead><tbody>${customers.map(account => `<tr><td><strong>${escapeText(account.name)}</strong></td><td>${escapeText(account.username)}</td><td>${escapeText(account.email)}</td><td>${escapeText(account.phone || "Not provided")}</td><td>${escapeText(account.status || "Active")}</td></tr>`).join("") || `<tr><td colspan="5">No registered customers yet.</td></tr>`}</tbody></table></div>`;
}
function renderProfile() { return `${heading("ADMIN ACCOUNT", "My Profile", "Update the account details for the cafe owner or administrator.")}<form class="settings-panel" id="profileForm"><h2>Personal information</h2><p>These details are saved to this browser account.</p><div class="form-grid"><div class="field"><label for="profileName">Full name</label><input id="profileName" name="name" required maxlength="60" value="${escapeText(administrator.name || "")}"></div><div class="field"><label for="profileEmail">Email address</label><input id="profileEmail" name="email" type="email" required maxlength="254" value="${escapeText(administrator.email || "")}"></div><div class="field"><label for="profilePhone">Contact number</label><input id="profilePhone" name="phone" type="tel" maxlength="24" value="${escapeText(administrator.phone || "")}" placeholder="09XX XXX XXXX"></div><div class="field"><label>Username</label><input value="${escapeText(administrator.username || "")}" disabled></div></div><div class="form-actions"><button class="button" type="submit">Save changes</button></div></form>`; }
function renderSettings() { return `${heading("SYSTEM PREFERENCES", "Settings", "Manage account security and admin workspace preferences.")}<div class="settings-layout"><nav class="settings-tabs"><button class="active" data-settings="preferences">Preferences</button><button data-settings="security">Account security</button></nav><section class="settings-panel" id="settingsPanel"><h2>Workspace preferences</h2><p>Basic admin workspace settings for this browser.</p><div class="preference-row"><span><strong>Low-stock reminders</strong><p>Show supplies that reach their minimum stock level.</p></span><label class="switch"><input type="checkbox" data-pref="lowStock" checked><span></span></label></div><div class="preference-row"><span><strong>Confirm before deleting</strong><p>Ask before removing products and categories.</p></span><label class="switch"><input type="checkbox" data-pref="confirmDelete" checked><span></span></label></div><div class="form-actions"><button class="button danger" data-logout type="button">Logout</button></div></section></div>`; }
function toast(message) { document.querySelector(".toast")?.remove(); const node = document.createElement("div"); node.className = "toast"; node.setAttribute("role", "status"); node.textContent = message; document.body.append(node); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => node.remove(), 2600); }
function findProduct(id) { return products().find(product => product.id === id); }
function saveOrder({ username, customer, items, payment, method = "POS" }) {
    const list = orders(); const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0); const id = `BNS-${String(Date.now()).slice(-6)}`;
    list.unshift({ id, username, customer, items, total, status: payment === "Paid" ? "Preparing" : "Pending", payment, method, createdAt: new Date().toISOString() }); writeStore("cafeOrders", list); return id;
}
function onPageClick(event) {
    const target = event.target.closest("button, a"); if (!target) return;
    if (target.dataset.go) { renderPage(target.dataset.go); return; }
    if (target.dataset.focus) { document.getElementById(target.dataset.focus)?.scrollIntoView({ behavior: "smooth", block: "center" }); document.getElementById("productName")?.focus({ preventScroll: true }); return; }
    if (target.dataset.filter) { orderFilter = target.dataset.filter; renderPage("orders"); return; }
    if (target.dataset.editProduct) { editProduct(target.dataset.editProduct); return; }
    if (target.dataset.deleteProduct) { deleteProduct(target.dataset.deleteProduct); return; }
    if (target.dataset.stock) { adjustSupply(target.dataset.stock, Number(target.dataset.delta)); return; }
    if (target.dataset.deleteCategory) { deleteCategory(target.dataset.deleteCategory); return; }
    if (target.dataset.settings) { settingsTab(target.dataset.settings); return; }
    if (target.dataset.logout !== undefined) logout();
}
function onPageSubmit(event) {
    event.preventDefault(); const form = event.target; const data = new FormData(form);
    if (form.id === "productForm") { saveProduct(data); return; }
    if (form.id === "posForm") {
        const catalog = products(); const product = catalog.find(item => item.id === String(data.get("productId"))); const quantity = Number(data.get("quantity"));
        if (!product || quantity < 1 || quantity > Number(product.stock)) { toast("Check the available stock and order quantity."); return; }
        const id = saveOrder({ username: String(data.get("username") || "walk-in").trim() || "walk-in", customer: String(data.get("customer")).trim(), items: [{ id: product.id, name: product.name, price: product.price, quantity }], payment: String(data.get("payment")) });
        product.stock -= quantity; writeStore("cafeProducts", catalog); toast(`Order ${id} created.`); renderPage("orders"); return;
    }
    if (form.id === "categoryForm") {
        const name = String(data.get("category")).trim(); const categories = getCategories();
        if (categories.some(category => category.toLowerCase() === name.toLowerCase())) { toast("That category already exists."); return; }
        categories.push(name); writeStore("cafeCategories", categories); renderPage("categories"); toast("Category added."); return;
    }
    if (form.id === "inventoryForm") {
        const stock = inventory(); stock.push({ id: `s${Date.now()}`, name: String(data.get("name")).trim(), quantity: Number(data.get("quantity")), unit: String(data.get("unit")).trim(), minimum: Number(data.get("minimum")) }); writeStore("cafeInventory", stock); renderPage("inventory"); toast("Inventory item added."); return;
    }
    if (form.id === "profileForm") {
        administrator.name = String(data.get("name")).trim(); administrator.email = String(data.get("email")).trim(); administrator.phone = String(data.get("phone")).trim(); writeStore("currentUser", administrator);
        const accounts = managedAccounts(); const savedAccount = accounts.find(account => account.username === administrator.username); if (savedAccount) Object.assign(savedAccount, { name: administrator.name, email: administrator.email, phone: administrator.phone }); writeStore("managedAccounts", accounts);
        document.getElementById("sidebarName").textContent = administrator.name; document.getElementById("sidebarAvatar").textContent = administrator.name.charAt(0).toUpperCase(); document.getElementById("topAvatar").textContent = administrator.name.charAt(0).toUpperCase(); toast("Profile updated."); return;
    }
    if (form.id === "passwordForm") {
        const accounts = managedAccounts(); const account = accounts.find(item => item.username === administrator.username);
        if (!account || account.password !== data.get("currentPassword")) { toast("Current password is incorrect."); return; }
        if (data.get("newPassword") !== data.get("confirmPassword")) { toast("The new passwords do not match."); return; }
        account.password = String(data.get("newPassword")); writeStore("managedAccounts", accounts); toast("Password updated."); renderPage("settings");
    }
}
function onPageChange(event) {
    if (event.target.dataset.status) { const list = orders(); const order = list.find(item => item.id === event.target.dataset.status); if (order) { order.status = event.target.value; writeStore("cafeOrders", list); toast(`${order.id} updated to ${order.status}.`); renderPage("orders"); } }
    if (event.target.dataset.pref) { const preferences = readStore("adminPreferences", {}); preferences[event.target.dataset.pref] = event.target.checked; writeStore("adminPreferences", preferences); }
}
function onPageInput(event) {
    if (event.target.id === "orderSearch") { searchTerm = event.target.value; const cursor = event.target.selectionStart; renderPage("orders"); const input = document.getElementById("orderSearch"); input.focus(); input.setSelectionRange(cursor, cursor); }
}
function saveProduct(data) {
    const list = products(); const id = String(data.get("productId") || ""); const item = { id: id || `p${Date.now()}`, name: String(data.get("name")).trim(), category: String(data.get("category")), price: Number(data.get("price")), stock: Number(data.get("stock")), image: String(data.get("image") || "").trim() };
    if (id) { const index = list.findIndex(product => product.id === id); if (index >= 0) list[index] = item; } else list.push(item);
    writeStore("cafeProducts", list); renderPage("products"); toast(id ? "Product updated." : "Product added to the menu.");
}
function editProduct(id) {
    const product = findProduct(id); const form = document.getElementById("productForm"); if (!product || !form) return;
    form.elements.productId.value = product.id; form.elements.name.value = product.name; form.elements.category.value = product.category; form.elements.price.value = product.price; form.elements.stock.value = product.stock; form.elements.image.value = product.image || "";
    document.getElementById("productFormTitle").textContent = `Edit ${product.name}`; document.getElementById("cancelProductEdit").hidden = false; form.scrollIntoView({ behavior: "smooth", block: "center" });
}
function deleteProduct(id) { const product = findProduct(id); if (!product || !window.confirm(`Remove ${product.name} from the menu?`)) return; writeStore("cafeProducts", products().filter(item => item.id !== id)); renderPage("products"); toast("Product removed."); }
function adjustSupply(id, delta) { const stock = inventory(); const item = stock.find(supply => supply.id === id); if (!item) return; item.quantity = Math.max(0, Number(item.quantity) + delta); writeStore("cafeInventory", stock); renderPage("inventory"); toast(`${item.name}: ${item.quantity} ${item.unit} remaining.`); }
function deleteCategory(name) { if (products().some(product => product.category === name)) { toast("Move products out of this category before removing it."); return; } if (!window.confirm(`Remove the ${name} category?`)) return; writeStore("cafeCategories", getCategories().filter(category => category !== name)); renderPage("categories"); toast("Category removed."); }
function settingsTab(tab) {
    const panel = document.getElementById("settingsPanel"); document.querySelectorAll("[data-settings]").forEach(button => button.classList.toggle("active", button.dataset.settings === tab));
    if (tab !== "security") { renderPage("settings"); return; }
    panel.innerHTML = `<h2>Account security</h2><p>Choose a new password for this admin account.</p><form id="passwordForm"><div class="form-grid"><div class="field full"><label for="currentPassword">Current password</label><input id="currentPassword" name="currentPassword" type="password" required></div><div class="field"><label for="newPassword">New password</label><input id="newPassword" name="newPassword" type="password" minlength="8" required></div><div class="field"><label for="confirmPassword">Confirm new password</label><input id="confirmPassword" name="confirmPassword" type="password" minlength="8" required></div></div><div class="form-actions"><button class="button" type="submit">Update password</button></div></form>`;
}
