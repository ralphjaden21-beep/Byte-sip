function readStore(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.error(`Unable to read ${key} from browser storage.`, error);
        return fallback;
    }
}

function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);
}

const customer = readStore("currentUser", null);
const pendingPayment = readStore("pendingSandboxPayment", null);
const sandboxError = document.getElementById("sandboxError");
const confirmButton = document.getElementById("confirmPayment");
const cancelButton = document.getElementById("cancelPayment");
const providerFields = document.getElementById("providerFields");

if (
    localStorage.getItem("loggedIn") !== "true" ||
    localStorage.getItem("userRole") !== "user" ||
    !customer
) {
    window.location.replace("Log in.php");
} else if (
    !pendingPayment ||
    pendingPayment.username !== customer.username ||
    !Array.isArray(pendingPayment.items) ||
    pendingPayment.items.length === 0
) {
    localStorage.removeItem("pendingSandboxPayment");
    window.location.replace("user.php");
} else {
    const itemCount = pendingPayment.items.reduce(
        (total, item) => total + Math.max(1, Number(item.quantity) || 1),
        0
    );
    const total = pendingPayment.items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * Math.max(1, Number(item.quantity) || 1),
        0
    );

    document.getElementById("sandboxItemCount").textContent = `${itemCount} item${itemCount === 1 ? "" : "s"}`;
    document.getElementById("sandboxAddress").textContent = pendingPayment.address;
    document.getElementById("sandboxTotal").textContent = money(total);

    function renderProviderFields(provider) {
        sandboxError.hidden = true;
        confirmButton.textContent = `Pay ${money(total)} with ${provider}`;
        if (provider === "GCash" || provider === "Maya") {
            providerFields.innerHTML = `
                <div class="sandbox-input">
                    <label for="walletPhone">${provider} mobile number</label>
                    <input id="walletPhone" name="walletPhone" type="tel" inputmode="tel" autocomplete="off"
                        placeholder="09XX XXX XXXX" minlength="9" maxlength="18" required
                        aria-describedby="paymentInputHint">
                </div>`;
        } else {
            providerFields.innerHTML = `
                <div class="sandbox-input">
                    <label for="cardNumber">${provider} card number</label>
                    <input id="cardNumber" name="cardNumber" type="text" inputmode="numeric" autocomplete="off"
                        placeholder="1234 5678 9012 3456" pattern="[0-9 ]{12,23}" maxlength="23" required
                        aria-describedby="paymentInputHint">
                </div>
                `;
        }

        const hint = document.createElement("small");
        hint.id = "paymentInputHint";
        hint.className = "sandbox-input-hint";
        hint.textContent = provider === "Visa" || provider === "Mastercard"
            ? "Enter any 12–19 digit sample number. Sample details only."
            : "Sample details only. This form is not connected to a payment provider.";
        providerFields.append(hint);

        const cardNumber = providerFields.querySelector("#cardNumber");
        if (cardNumber) {
            cardNumber.addEventListener("input", () => {
                const digits = cardNumber.value.replace(/\D/g, "").slice(0, 19);
                cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
            });
        }
    }

    function validateProviderDetails(provider) {
        const inputs = providerFields.querySelectorAll("input");
        for (const input of inputs) {
            if (!input.checkValidity()) {
                input.reportValidity();
                return false;
            }
        }

        if (provider === "GCash" || provider === "Maya") {
            const phone = providerFields.querySelector("#walletPhone");
            const normalizedPhone = phone.value.replace(/[^\d+]/g, "");
            if (!/^(?:09\d{9}|\+639\d{9})$/.test(normalizedPhone)) {
                phone.setCustomValidity("Enter a valid Philippine mobile number.");
                phone.reportValidity();
                phone.setCustomValidity("");
                return false;
            }
        }

        if (provider === "Visa" || provider === "Mastercard") {
            const number = providerFields.querySelector("#cardNumber");
            const digits = number.value.replace(/\s/g, "");
            if (!/^\d{12,19}$/.test(digits)) {
                number.setCustomValidity("Enter a 12–19 digit sample card number.");
                number.reportValidity();
                number.setCustomValidity("");
                return false;
            }
        }
        return true;
    }

    document.querySelectorAll('input[name="provider"]').forEach(input => {
        input.addEventListener("change", () => renderProviderFields(input.value));
    });
    renderProviderFields(document.querySelector('input[name="provider"]:checked').value);

    confirmButton.addEventListener("click", async () => {
        const provider = document.querySelector('input[name="provider"]:checked')?.value;
        if (!provider) {
            showError("Choose a payment provider to continue.");
            return;
        }
        if (!validateProviderDetails(provider)) return;

        confirmButton.disabled = true;
        cancelButton.disabled = true;
        confirmButton.textContent = "Processing payment…";

        await new Promise(resolve => setTimeout(resolve, 700));

        try {
            const orderId = `BNS-${String(Date.now()).slice(-6)}`;
            const allOrders = readStore("cafeOrders", []);
            allOrders.unshift({
                id: orderId,
                username: pendingPayment.username,
                customer: pendingPayment.customer || customer.name || "Cafe member",
                address: pendingPayment.address,
                items: pendingPayment.items,
                total,
                status: "Preparing",
                payment: "Paid",
                method: `${provider} (Simulated)`,
                createdAt: new Date().toISOString()
            });

            const catalog = readStore("cafeProducts", []);
            pendingPayment.items.forEach(item => {
                const product = catalog.find(entry => entry.id === item.id);
                if (product) {
                    product.stock = Math.max(
                        0,
                        Number(product.stock || 0) - Math.max(1, Number(item.quantity) || 1)
                    );
                }
            });

            writeStore("cafeOrders", allOrders);
            writeStore("cafeProducts", catalog);
            writeStore("cart", []);
            localStorage.removeItem("pendingSandboxPayment");
            window.location.replace(`receipt.php?order=${encodeURIComponent(orderId)}`);
        } catch (error) {
            console.error("Unable to complete sandbox payment.", error);
            confirmButton.disabled = false;
            cancelButton.disabled = false;
            confirmButton.textContent = `Pay ${money(total)} with ${provider}`;
            showError("The simulated payment could not be completed. Please try again.");
        }
    });

    cancelButton.addEventListener("click", () => {
        localStorage.removeItem("pendingSandboxPayment");
        window.location.href = "user.php";
    });
}

function showError(message) {
    sandboxError.textContent = message;
    sandboxError.hidden = false;
}
