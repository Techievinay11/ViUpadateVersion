import os

categories = [
    {"id": "credit-cards", "title": "Credit Cards"},
    {"id": "banking", "title": "Banking"},
    {"id": "loans", "title": "Loans"},
    {"id": "credit-score", "title": "Credit Score"},
    {"id": "investing", "title": "Investing"},
    {"id": "insurance", "title": "Insurance"},
    {"id": "calculators", "title": "Calculators"},
    {"id": "compare", "title": "Compare"},
    {"id": "reviews", "title": "Reviews"},
    {"id": "deals", "title": "Deals"},
    {"id": "news", "title": "News"}
]

header = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} – Visuya</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="blog.css" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>
<body>

<!-- ========== TOP BAR ========== -->
<div class="top-bar">
  <div class="container top-bar-inner">
    <span>🔥 New: Best Credit Cards for 2026 – Updated July 2026</span>
    <div class="top-bar-links">
      <a href="index.html#newsletter">Newsletter</a>
      <a href="index.html#subscribe" class="btn-subscribe">Subscribe</a>
    </div>
  </div>
</div>

<!-- ========== HEADER / NAVBAR ========== -->
<header class="header" id="header">
  <div class="container header-inner">
    <a href="index.html" class="logo">
      <span class="logo-v">V</span><span class="logo-text">visuya</span>
    </a>

    <div class="search-bar">
      <i class="fas fa-search"></i>
      <input type="text" id="searchInput" placeholder="Search cards, loans, calculators & more..." />
      <div class="search-dropdown" id="searchDropdown"></div>
    </div>

    <nav class="nav-menu" id="navMenu">
      <div class="nav-item"><a href="credit-cards.html">Credit Cards</a></div>
      <div class="nav-item"><a href="banking.html">Banking</a></div>
      <div class="nav-item"><a href="loans.html">Loans</a></div>
      <div class="nav-item"><a href="credit-score.html">Credit Score</a></div>
      <div class="nav-item"><a href="investing.html">Investing</a></div>
      <div class="nav-item"><a href="insurance.html">Insurance</a></div>
      <div class="nav-item"><a href="calculators.html">Calculators</a></div>
      <div class="nav-item dropdown">
        <a href="#">More <i class="fas fa-chevron-down"></i></a>
        <div class="dropdown-content">
          <a href="compare.html">Compare</a>
          <a href="reviews.html">Reviews</a>
          <a href="deals.html">Deals</a>
          <a href="news.html">News</a>
        </div>
      </div>
    </nav>
    <button class="hamburger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
"""

footer = """
<!-- ========== FOOTER ========== -->
<footer class="footer" id="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <a href="index.html" class="logo footer-logo">
        <span class="logo-v">V</span><span class="logo-text">visuya</span>
      </a>
      <p>Make Better Money Decisions</p>
      <div class="social-links">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-linkedin-in"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Top Categories</h4>
      <ul>
        <li><a href="credit-cards.html">Credit Cards</a></li>
        <li><a href="banking.html">Banking</a></li>
        <li><a href="loans.html">Loans</a></li>
        <li><a href="credit-score.html">Credit Score</a></li>
        <li><a href="investing.html">Investing</a></li>
        <li><a href="insurance.html">Insurance</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <span>© 2026 Visuya.com. All rights reserved.</span>
    </div>
  </div>
</footer>

<script src="app.js"></script>
<script src="blog.js"></script>
</body>
</html>
"""

# Create category pages
for cat in categories:
    html = header.replace("{title}", cat["title"])
    html += f"""
<div class="category-hero" style="background:#0f172a;color:white;padding:60px 0;text-align:center;">
    <div class="container">
        <h1 style="font-size:36px;margin-bottom:10px;">{cat['title']}</h1>
        <p style="color:#cbd5e1;font-size:16px;">Latest guides, reviews, and insights on {cat['title'].lower()}.</p>
    </div>
</div>
<section class="section">
    <div class="container">
        <div id="blog-grid" class="blog-grid" data-category="{cat['title']}">
            <!-- Posts will be loaded here by blog.js -->
        </div>
    </div>
</section>
"""
    html += footer
    
    with open(f"d:/Vi Fin company/{cat['id']}.html", "w", encoding="utf-8") as f:
        f.write(html)

# Create single post page (post.html)
post_html = header.replace("{title}", "Article")
post_html += """
<section class="section article-section">
    <div class="container article-container">
        <div id="single-post-content">
            <!-- Article will be loaded here by blog.js -->
            <div style="text-align:center;padding:100px 0;">Loading article...</div>
        </div>
    </div>
</section>
"""
post_html += footer

with open("d:/Vi Fin company/post.html", "w", encoding="utf-8") as f:
    f.write(post_html)

print("Generated all category pages and post.html!")
