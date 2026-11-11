<?php
$pageTitle = 'Online Payment | Byte N Sip';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0d1517">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="icon" href="byte-n-sip-logo.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="account-theme.css?v=4">
    <link rel="stylesheet" href="sandbox-payment.css">
</head>
<body class="sandbox-page">
    <main class="sandbox-shell">
        <a class="sandbox-brand" href="user.php">
            <img src="byte-n-sip-logo.png" alt="">
            <span>Byte N Sip <small>ONLINE CHECKOUT</small></span>
        </a>

        <section class="sandbox-card" aria-labelledby="sandboxTitle">
            <div class="sandbox-heading">
                <span class="sandbox-icon" aria-hidden="true">✓</span>
                <p class="sandbox-eyebrow">ONLINE CHECKOUT</p>
                <h1 id="sandboxTitle">Choose how to pay</h1>
                <p>Enter the requested details to continue with your payment.</p>
            </div>

            <section class="sandbox-order" aria-label="Order summary">
                <div><span>Order</span><strong id="sandboxItemCount">Loading order…</strong></div>
                <div><span>Delivering to</span><strong id="sandboxAddress">Loading address…</strong></div>
                <div class="sandbox-total"><span>Order total</span><strong id="sandboxTotal">—</strong></div>
            </section>

            <fieldset class="sandbox-methods">
                <legend>Payment method</legend>
                <label class="sandbox-method">
                    <input type="radio" name="provider" value="GCash" checked>
                    <span class="provider-mark gcash-mark">G</span>
                    <span class="provider-copy"><strong>GCash</strong><small>Pay using your GCash number</small></span>
                    <span class="provider-check" aria-hidden="true"></span>
                </label>
                <label class="sandbox-method">
                    <input type="radio" name="provider" value="Maya">
                    <span class="provider-mark maya-mark">M</span>
                    <span class="provider-copy"><strong>Maya</strong><small>Pay using your Maya number</small></span>
                    <span class="provider-check" aria-hidden="true"></span>
                </label>
                <label class="sandbox-method">
                    <input type="radio" name="provider" value="Visa">
                    <span class="provider-mark visa-mark">V</span>
                    <span class="provider-copy"><strong>Visa</strong><small>Pay with a Visa card</small></span>
                    <span class="provider-check" aria-hidden="true"></span>
                </label>
                <label class="sandbox-method">
                    <input type="radio" name="provider" value="Mastercard">
                    <span class="provider-mark mastercard-mark">M</span>
                    <span class="provider-copy"><strong>Mastercard</strong><small>Pay with a Mastercard</small></span>
                    <span class="provider-check" aria-hidden="true"></span>
                </label>
            </fieldset>

            <div id="providerFields" class="provider-fields"></div>
            <p class="sandbox-notice">Payment is simulated locally. Nothing is charged, and payment details are not sent or saved. Use sample details only — never enter real payment information.</p>
            <p class="sandbox-error" id="sandboxError" role="alert" hidden></p>
            <div class="sandbox-actions">
                <button class="sandbox-cancel" id="cancelPayment" type="button">Cancel</button>
                <button class="sandbox-confirm" id="confirmPayment" type="button">Simulate successful payment</button>
            </div>
        </section>

        <a class="sandbox-back" href="user.php">← Return to your cafe account</a>
    </main>
    <script src="sandbox-payment.js?v=4"></script>
</body>
</html>
