<?php
$pageTitle = 'Byte N Sip | Coffee for curious minds';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Byte N Sip is your cozy coffee stop for great brews, study sessions, and big ideas. Made for students, educators, IT pros, and every coffee lover.">
    <meta name="theme-color" content="#173a32">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="icon" href="byte-n-sip-logo.png" type="image/png">
    <link rel="stylesheet" href="index.css">
</head>
<body class="home-page">
    <header class="header">
        <a class="logo" href="index.php" aria-label="Byte N Sip home">
            <img src="byte-n-sip-logo.png" alt="Byte &amp; Sip coffee shop logo">
            <span>Byte <span class="logo-accent">N</span> Sip</span>
        </a>
        <nav class="nav" aria-label="Main navigation">
            <a class="active" href="index.php">Home</a>
            <a href="menu.php">Menu</a>
            <a href="gallery.php">Gallery</a>
            <a href="about us.php">About Us</a>
            <a href="contact us.php">Contact</a>
            <a href="Log in.php" class="login-link">Log in <span aria-hidden="true">↗</span></a>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="hero-content">
                <p class="eyebrow"><span class="status-dot"></span> YOUR COZY CORNER OF THE INTERNET</p>
                <h1>Fuel your<br>next <span class="highlight">big idea.</span></h1>
                <p class="hero-copy">Good coffee, good company, and a little inspiration between every line of code. Your new favorite spot to sip, study, and stay curious.</p>
                <div class="buttons">
                    <a href="menu.php" class="btn primary">Explore the menu <span aria-hidden="true">→</span></a>
                    <a href="about us.php" class="btn secondary">Get to know us</a>
                </div>
                <div class="hero-note"><span class="code-mark">&lt;/&gt;</span> For late-night thinkers and early-morning dreamers.</div>
            </div>
            <div class="hero-visual">
                <img class="hero-photo" src="byte-n-sip-dev-cafe.svg" alt="Illustration of a laptop displaying code beside a freshly brewed coffee">
                <div class="photo-label"><span class="label-icon">☕</span><span><strong>Freshly brewed</strong><small>One cup at a time</small></span></div>
                <div class="code-sticker" aria-hidden="true"><span>while (coffee) {</span><strong>keep creating</strong><span>}</span></div>
                <span class="hero-spark spark-one" aria-hidden="true">✳</span>
                <span class="hero-spark spark-two" aria-hidden="true">✦</span>
            </div>
            <div class="hero-bottom"><span>SCROLL TO EXPLORE</span><span class="scroll-line"></span><span>01 / 03</span></div>
        </section>

        <section class="welcome-section">
            <div class="section-intro">
                <p class="eyebrow">A LITTLE BIT OF BOTH WORLDS</p>
                <h2>Where coffee<br>meets <span class="serif-accent">curiosity.</span></h2>
            </div>
            <div class="welcome-copy">
                <p>Whether you're debugging your code, planning your next lecture, powering through a study session, or simply here for a really good latte—there's a seat at our table for you.</p>
                <a class="text-link" href="about us.php">More about our cafe <span aria-hidden="true">↗</span></a>
            </div>
            <div class="audience-grid">
                <article class="audience-card">
                    <span class="card-number">01</span>
                    <span class="audience-icon" aria-hidden="true">⌘</span>
                    <h3>For the builders</h3>
                    <p>IT pros and makers, meet your new favorite coffee break.</p>
                </article>
                <article class="audience-card featured-card">
                    <span class="card-number">02</span>
                    <span class="audience-icon" aria-hidden="true">✎</span>
                    <h3>For the learners</h3>
                    <p>Students and educators—bring your ideas, we've got the brew.</p>
                </article>
                <article class="audience-card">
                    <span class="card-number">03</span>
                    <span class="audience-icon" aria-hidden="true">♡</span>
                    <h3>For the coffee lovers</h3>
                    <p>No tech degree required. Just a love for a good cup.</p>
                </article>
            </div>
        </section>

        <section class="menu-preview">
            <div class="menu-heading">
                <div>
                    <p class="eyebrow">BREWED FOR YOUR BREAK</p>
                    <h2>Good things<br><span class="serif-accent">on the menu.</span></h2>
                </div>
                <a href="menu.php" class="text-link">See the full menu <span aria-hidden="true">↗</span></a>
            </div>
            <div class="menu-cards">
                <article class="menu-card">
                    <a class="menu-image" href="menu.php" aria-label="Explore our signature latte">
                        <img src="Signature Latte.png" alt="Signature latte with latte art" loading="lazy">
                        <span class="menu-tag">BARISTA FAVORITE</span>
                    </a>
                    <div class="menu-card-info"><div><h3>Signature Latte</h3><p>Your classic, with a little extra love.</p></div><span class="menu-arrow" aria-hidden="true">↗</span></div>
                </article>
                <article class="menu-card">
                    <a class="menu-image" href="menu.php" aria-label="Explore our iced coffee">
                        <img src="Iced coffee.webp" alt="Chilled iced coffee" loading="lazy">
                        <span class="menu-tag">COOL DOWN</span>
                    </a>
                    <div class="menu-card-info"><div><h3>Iced Coffee</h3><p>A refreshing reset for your brain.</p></div><span class="menu-arrow" aria-hidden="true">↗</span></div>
                </article>
                <article class="menu-card">
                    <a class="menu-image" href="menu.php" aria-label="Explore our butter croissant">
                        <img src="Butter Croissant.jpg" alt="Freshly baked golden butter croissant" loading="lazy">
                        <span class="menu-tag">FRESH FROM THE OVEN</span>
                    </a>
                    <div class="menu-card-info"><div><h3>Butter Croissant</h3><p>Flaky, buttery, and gone in a byte.</p></div><span class="menu-arrow" aria-hidden="true">↗</span></div>
                </article>
            </div>
        </section>

        <section class="cta-section">
            <div class="cta-code" aria-hidden="true">{ brew: "something good" }</div>
            <p class="eyebrow">YOUR NEXT GREAT IDEA STARTS HERE</p>
            <h2>Come for the coffee.<br><span class="serif-accent">Stay for the vibe.</span></h2>
            <p>Take a little pause, find your focus, and let the good ideas flow.</p>
            <a href="contact us.php" class="btn light-btn">Plan your visit <span aria-hidden="true">→</span></a>
        </section>
    </main>

    <footer class="footer">
        <div class="footer-main">
            <div class="footer-brand">
                <a class="logo footer-logo" href="index.php">
                    <img src="byte-n-sip-logo.png" alt="Byte &amp; Sip coffee shop logo">
                    <span>Byte <span class="logo-accent">N</span> Sip</span>
                </a>
                <p>Good coffee for curious minds.<br>Pull up a chair and stay a while.</p>
            </div>
            <div class="footer-col">
                <h3>Find your way</h3>
                <a href="menu.php">Menu</a>
                <a href="gallery.php">Gallery</a>
                <a href="about us.php">Our story</a>
            </div>
            <div class="footer-col">
                <h3>Come say hello</h3>
                <p>2383 Beata St. Pandacan, Manila</p>
                <p>Mon–Fri · 7:00 AM–9:00 PM</p>
                <p>Sat–Sun · 8:00 AM–10:00 PM</p>
            </div>
        </div>
        <div class="footer-bottom"><span>© 2026 Byte N Sip. Made with coffee &lt;3</span><a href="contact us.php">Contact us <span aria-hidden="true">↗</span></a></div>
    </footer>
</body>
</html>
