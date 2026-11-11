<?php
$pageTitle = 'Create an Account | Byte N Sip';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0d1517">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="icon" href="byte-n-sip-logo.png" type="image/png">
    <link rel="stylesheet" href="log in.css?v=3">
</head>
<body class="signup-page">
    <main class="login-layout">
        <section class="login-visual" aria-labelledby="signup-promo-title">
            <img src="coffee.jpeg" alt="Coffee and latte art served at a cafe">
            <div class="login-visual-content">
                <span class="login-kicker">YOUR NEXT FAVORITE CUP STARTS HERE</span>
                <h1 id="signup-promo-title">Make room<br>for good things.</h1>
                <p>Create your cafe account to save favorite drinks, follow your orders, and make every coffee break yours.</p>
                <div class="login-highlights" aria-label="Cafe highlights">
                    <span>Save your favorites</span>
                    <span>Track your orders</span>
                    <span>Come as you are</span>
                </div>
            </div>
            <a class="login-home-link" href="index.php" aria-label="Back to Byte N Sip home">← Back to Byte N Sip</a>
        </section>

        <section class="login-card" aria-labelledby="signup-title">
            <nav class="login-tabs" aria-label="Account access">
                <a class="login-tab" href="Log in.php">Log in</a>
                <span class="login-tab active" aria-current="page">Sign up</span>
            </nav>

            <div class="login-heading">
                <img src="byte-n-sip-logo.png" alt="" class="brand">
                <p class="login-kicker">JOIN THE BYTE N SIP COMMUNITY</p>
                <h2 id="signup-title">Create your account</h2>
                <p>A better coffee break is just a few details away.</p>
            </div>

            <form id="registerForm">
                <div class="login-field">
                    <label for="fullName">Full name</label>
                    <input type="text" id="fullName" name="fullName" autocomplete="name" required minlength="2" maxlength="60">
                </div>
                <div class="login-field">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" autocomplete="username" required minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" title="Use 3–24 letters, numbers, or underscores.">
                </div>
                <div class="login-field">
                    <label for="email">Email address</label>
                    <input type="email" id="email" name="email" autocomplete="email" required maxlength="254" aria-describedby="emailHelp">
                    <small id="emailHelp">Use a valid email domain, such as name@gmail.com.</small>
                </div>
                <div class="login-field">
                    <label for="address">Delivery address</label>
                    <textarea id="address" name="address" autocomplete="street-address" required minlength="8" maxlength="500" rows="3" placeholder="House/building, street, barangay, city"></textarea>
                </div>
                <div class="login-field">
                    <label for="password">Password <span>(at least 8 characters)</span></label>
                    <input type="password" id="password" name="password" autocomplete="new-password" required minlength="8">
                </div>
                <div class="login-field">
                    <label for="confirmPassword">Confirm password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" autocomplete="new-password" required minlength="8">
                </div>
                <p id="registerMessage" class="register-message" role="status" aria-live="polite" hidden></p>
                <button type="submit" class="login-btn">Create account</button>
            </form>

            <p class="login-signup">Already have an account? <a href="Log in.php">Sign in</a></p>
            <a class="login-mobile-home" href="index.php">Back to Byte N Sip</a>
        </section>
    </main>

    <script src="register.js"></script>
</body>
</html>
