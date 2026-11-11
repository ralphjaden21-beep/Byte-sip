<?php
$pageTitle = 'Order Receipt | Byte N Sip';
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
    <link rel="stylesheet" href="receipt.css">
</head>
<body class="receipt-page">
    <main class="receipt-shell">
        <a class="receipt-brand" href="user.php">
            <img src="byte-n-sip-logo.png" alt="">
            <span>Byte N Sip <small>ORDER RECEIPT</small></span>
        </a>
        <section class="receipt-card" aria-labelledby="receiptTitle">
            <header class="receipt-heading">
                <span class="receipt-icon" aria-hidden="true">✓</span>
                <p class="receipt-eyebrow">ORDER CONFIRMED</p>
                <h1 id="receiptTitle">Thank you for your order</h1>
                <p>Your receipt is ready. You can print or save a copy for your records.</p>
            </header>
            <p class="receipt-error" id="receiptError" role="alert" hidden></p>
            <div id="receiptContent" hidden>
                <section class="receipt-meta" aria-label="Order information">
                    <div><span>Order number</span><strong id="receiptOrderId"></strong></div>
                    <div><span>Date</span><strong id="receiptDate"></strong></div>
                    <div><span>Payment method</span><strong id="receiptMethod"></strong></div>
                    <div><span>Payment status</span><strong id="receiptPayment"></strong></div>
                    <div><span>Delivering to</span><strong id="receiptAddress"></strong></div>
                </section>
                <div class="receipt-items-wrap">
                    <table class="receipt-items">
                        <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                        <tbody id="receiptItems"></tbody>
                    </table>
                </div>
                <div class="receipt-total"><span>Total</span><strong id="receiptTotal"></strong></div>
            </div>
            <div class="receipt-actions">
                <a class="receipt-back" href="user.php">Return to account</a>
                <button class="receipt-print" id="printReceipt" type="button" hidden>Print receipt</button>
            </div>
        </section>
    </main>
    <script src="receipt.js"></script>
</body>
</html>
