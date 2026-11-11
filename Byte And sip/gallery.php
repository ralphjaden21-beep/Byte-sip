<?php
$pageTitle = 'Gallery | Byte N Sip';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="stylesheet" href="gallery.css">
    <link rel="stylesheet" href="site-theme.css?v=2">
</head>
<body>

    <header class="header">
        <a class="logo" href="index.php" aria-label="Byte N Sip home">
            <img src="byte-n-sip-logo.png" alt="Byte &amp; Sip coffee shop logo">
            <span>Byte <span class="logo-accent">N</span> Sip</span>
        </a>

        <nav class="nav">
            <a href="index.php">Home</a>
            <a href="menu.php">Menu</a>
            <a class="active" href="gallery.php" aria-current="page">Gallery</a>
            <a href="about us.php">About Us</a>
            <a href="contact us.php">Contact Us</a>
            <a href="Log in.php">Log in</a>
        </nav>
    </header>

    <section class="menu-section">

        <section class="pet-section">
            <div class="pet-box">
                <div class="pet-icon">☕ Coffee, code &amp; community</div>

                <h2>Your space to sip, think, and recharge.</h2>

                <p>
                    Whether you're studying for an exam, building your next big idea, catching up with friends, or simply
                    craving a great cup, there's a seat for you at Byte N Sip.
                </p>

                <p class="subtitle">
                    Good coffee. Fresh ideas. Better breaks.
                </p>
            </div>
        </section>

        <section class="hero">

                <h1>Good coffee. Great moments.</h1>

  
                <div class="gallery">
                    <div class="card"><img src="Americano.webp" alt="Barista serving coffee"><span class="tag">Coffee craft</span></div>
                    <div class="card"><img src="Cappuccino.webp" alt="Cappuccino with latte art"><span class="tag">A little latte art</span></div>
                    <div class="card"><img src="byte-n-sip-dev-cafe.svg" alt="Illustrated cafe desk with a laptop and coffee"><span class="tag">Cafe workspace</span></div>   
                    <div class="card"><img src="Iced coffee.webp" alt="Chilled coffee"><span class="tag">Coffee moments</span></div>
                    <div class="card"><img src="quote.jpg" alt="Coffee quote"><span class="tag">Coffee thoughts</span></div>
                    <div class="card"><img src="coffee.jpeg" alt="Coffee served with a pastry"><span class="tag">A cozy cup</span></div>
                    <div class="card"><img src="cafe art.jpg" alt="Illustrated coffee cup"><span class="tag">Cafe inspiration</span></div>
                    <div class="card"><img src="Signature Latte.png" alt="Signature latte"><span class="tag">Coffee break</span></div>
                    <div class="card"><img src="cafe art 3.jpg" alt="Coffee art"><span class="tag">Coffee craft</span></div>
                </div>


                <section class="cta">
                    <h2>Take a break with us.</h2>
                    <p>Drop by for a fresh brew and a little inspiration.</p>
                    <a href="contact us.php"><button id="bookBtn">☕ Plan your visit</button></a>
                </section>

            </div>
        </section>

    </section>
    
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-col">
                <h3>☕ Byte N Sip</h3>
                <p>Good coffee for curious minds. Pull up a chair and stay a while.</p>
            </div>

            <div class="footer-col">
                <h4>Opening Hours</h4>
                <p>Monday - Friday: 7:00 AM - 9:00 PM</p>
                <p>Saturday - Sunday: 8:00 AM - 10:00 PM</p>
            </div>

            <div class="footer-col">
                <h4>Contact Us</h4>
                <p>📍 2383 Beata St. Pandacan Manila</p>
                <p>📞 (555) 123-4567</p>
                <p>✉ Marg19@gmail.com</p>
            </div>
        </div>
    </footer>

    <script src="gallery.js"></script>
</body>
</html>