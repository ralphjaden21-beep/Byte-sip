const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");

function hasValidEmailDomain(value) {
    const [localPart, domain, ...extraParts] = value.trim().split("@");
    return Boolean(
        localPart &&
        domain &&
        extraParts.length === 0 &&
        /^(?=.{1,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(domain)
    );
}

function validateEmail() {
    const isValid = !emailInput.value || hasValidEmailDomain(emailInput.value);
    emailInput.setCustomValidity(isValid ? "" : "Enter a valid email address, such as name@gmail.com.");
}

function showRegisterMessage(message, isError = false) {
    registerMessage.textContent = message;
    registerMessage.hidden = false;
    registerMessage.classList.toggle("is-error", isError);
}

function getDefaultAccounts() {
    return [
        {
            username: "user",
            password: "user123",
            role: "user",
            name: "Cafe User",
            email: "user@ovenorigin.com",
            status: "Active",
            page: "user.php"
        },
        {
            username: "admin",
            password: "admin123",
            role: "admin",
            name: "Admin Staff",
            email: "admin@ovenorigin.com",
            status: "Active",
            page: "admin.php"
        },
        {
            username: "superadmin",
            password: "super123",
            role: "super-admin",
            name: "Super Admin",
            email: "superadmin@ovenorigin.com",
            status: "Active",
            page: "admin.php"
        }
    ];
}

function getAccounts() {
    const storedAccounts = localStorage.getItem("managedAccounts");

    if (!storedAccounts) {
        return getDefaultAccounts();
    }

    const accounts = JSON.parse(storedAccounts);
    if (!Array.isArray(accounts)) {
        throw new Error("Saved account data is invalid.");
    }

    return accounts;
}

confirmPasswordInput.addEventListener("input", () => {
    confirmPasswordInput.setCustomValidity(
        confirmPasswordInput.value === passwordInput.value ? "" : "Passwords do not match."
    );
});

passwordInput.addEventListener("input", () => {
    confirmPasswordInput.setCustomValidity(
        confirmPasswordInput.value === passwordInput.value ? "" : "Passwords do not match."
    );
});

emailInput.addEventListener("input", validateEmail);

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = addressInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    validateEmail();
    if (!emailInput.reportValidity()) return;

    if (!address) {
        addressInput.setCustomValidity("Enter a delivery address.");
        addressInput.reportValidity();
        return;
    }
    addressInput.setCustomValidity("");

    if (password !== confirmPassword) {
        confirmPasswordInput.setCustomValidity("Passwords do not match.");
        confirmPasswordInput.reportValidity();
        return;
    }

    try {
        const accounts = getAccounts();
        const normalizedUsername = username.toLowerCase();
        const normalizedEmail = email.toLowerCase();
        const accountExists = accounts.some((account) =>
            account.username.toLowerCase() === normalizedUsername ||
            account.email.toLowerCase() === normalizedEmail
        );

        if (accountExists) {
            showRegisterMessage("That username or email is already registered. Try signing in instead.", true);
            return;
        }

        accounts.push({
            username,
            password,
            role: "user",
            name,
            email,
            address,
            status: "Active",
            page: "user.php"
        });
        localStorage.setItem("managedAccounts", JSON.stringify(accounts));
        registerForm.reset();
        showRegisterMessage("Your account is ready! You can now sign in.");
    } catch (error) {
        console.error("Unable to save the new account.", error);
        showRegisterMessage("We couldn't save your account. Please check browser storage and try again.", true);
    }
});
