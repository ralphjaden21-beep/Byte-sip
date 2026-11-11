function readReceiptStore(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.error(`Unable to read ${key} from browser storage.`, error);
        return fallback;
    }
}

function receiptMoney(value) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);
}

function showReceiptError(message) {
    const error = document.getElementById("receiptError");
    error.textContent = message;
    error.hidden = false;
}

const receiptCustomer = readReceiptStore("currentUser", null);
const requestedOrderId = new URLSearchParams(window.location.search).get("order");
const receiptOrders = readReceiptStore("cafeOrders", []);
const receiptOrder = Array.isArray(receiptOrders)
    ? receiptOrders.find(order => order.id === requestedOrderId && order.username === receiptCustomer?.username)
    : null;

if (
    localStorage.getItem("loggedIn") !== "true" ||
    localStorage.getItem("userRole") !== "user" ||
    !receiptCustomer
) {
    window.location.replace("Log in.php");
} else if (!receiptOrder) {
    showReceiptError("We couldn't find this receipt. Your order may still be available in your account order history.");
} else {
    document.getElementById("receiptOrderId").textContent = receiptOrder.id;
    document.getElementById("receiptDate").textContent = receiptOrder.createdAt
        ? new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(receiptOrder.createdAt))
        : "—";
    document.getElementById("receiptMethod").textContent = receiptOrder.method || "—";
    document.getElementById("receiptPayment").textContent = receiptOrder.payment || "Unpaid";
    document.getElementById("receiptAddress").textContent = receiptOrder.address || "—";
    document.getElementById("receiptTotal").textContent = receiptMoney(receiptOrder.total);

    const rows = document.getElementById("receiptItems");
    (Array.isArray(receiptOrder.items) ? receiptOrder.items : []).forEach(item => {
        const row = document.createElement("tr");
        const name = document.createElement("td");
        const quantity = document.createElement("td");
        const price = document.createElement("td");
        const itemQuantity = Math.max(1, Number(item.quantity) || 1);
        name.textContent = item.name || "Cafe item";
        quantity.textContent = String(itemQuantity);
        price.textContent = receiptMoney((Number(item.price) || 0) * itemQuantity);
        row.append(name, quantity, price);
        rows.append(row);
    });

    document.getElementById("receiptContent").hidden = false;
    const printButton = document.getElementById("printReceipt");
    printButton.hidden = false;
    printButton.addEventListener("click", () => window.print());
}
