<?php
$pageTitle = 'Customer Account | Byte N Sip';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#173a32">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="icon" href="byte-n-sip-logo.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="user.css">
    <link rel="stylesheet" href="account-theme.css?v=4">
</head>
<body>
    <div class="app-shell">
        <aside class="sidebar" id="sidebar">
            <a class="brand" href="index.php"><img src="byte-n-sip-logo.png" alt=""><span>Byte <b>N</b> Sip<small>YOUR CAFE ACCOUNT</small></span></a>
            <div class="profile-chip"><div class="avatar" id="sidebarAvatar">U</div><div><strong id="sidebarName">Customer</strong><span>CUSTOMER ACCOUNT</span></div></div>
            <p class="nav-caption">MY CAFE</p>
            <nav class="account-nav" id="accountNav" aria-label="Customer navigation"></nav>
            <div class="sidebar-bottom"><a class="site-link" href="menu.php"><span>↗</span> Visit cafe menu</a><button class="logout-button" id="logoutButton" type="button"><span>⇥</span> Logout</button></div>
        </aside>
        <main class="main-area">
            <header class="topbar"><button class="mobile-menu" id="mobileMenu" type="button" aria-label="Open navigation" aria-expanded="false">☰</button><div class="breadcrumbs"><a href="index.php">Byte N Sip</a><span>/</span><strong id="currentSection">Dashboard / Home</strong></div><div class="topbar-right"><span class="open-status"><i></i> Cafe is open</span><div class="top-avatar" id="topAvatar">U</div></div></header>
            <div class="page-content" id="pageContent" aria-live="polite"></div>
            <footer class="app-footer"><span>Byte N Sip</span><span>Good coffee. Good company.</span></footer>
        </main>
    </div>
    <div class="sidebar-scrim" id="sidebarScrim"></div>
    <script src="user.js?v=2"></script>
</body>
</html>
