const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
    const username = nameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    const defaultAccounts = [
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
    let savedAccounts = [];
    try {
        const storedAccounts = JSON.parse(localStorage.getItem("managedAccounts"));
        if (Array.isArray(storedAccounts)) savedAccounts = storedAccounts;
    } catch (error) {
        console.error("Saved account data is invalid.", error);
    }
    const accounts = [
        ...defaultAccounts.filter((defaultAccount) =>
            !savedAccounts.some((savedAccount) => String(savedAccount.username || "").toLowerCase() === defaultAccount.username)
        ),
        ...savedAccounts
    ];
    const account = accounts.find((item) => String(item.username || "").trim().toLowerCase() === username && item.password === password);

    if (!account) {
        alert("Incorrect username or password. Please try again.");
        return;
    }

    if (account.status !== "Active") {
        alert("This account is currently kicked or disabled.");
        return;
    }

    localStorage.setItem("managedAccounts", JSON.stringify(accounts));

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userRole", account.role);
    localStorage.setItem("currentUser", JSON.stringify({
        username: account.username,
        name: account.name,
        email: account.email,
        phone: account.phone || "",
        address: account.address || "",
        favorites: account.favorites || ["p1"]
    }));

    window.location.href = account.role === "user" ? "user.php" : "admin.php";
});
