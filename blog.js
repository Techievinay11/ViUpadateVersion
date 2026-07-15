/* =========================================================
   Visuya – blog.js | Logic for displaying posts on front-end
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Check if we are on a category page
  const blogGrid = document.getElementById("blog-grid");
  if (blogGrid) {
    const category = blogGrid.getAttribute("data-category");
    renderCategoryPosts(category, blogGrid);
  }

  // 2. Check if we are on the single post page
  const singlePost = document.getElementById("single-post-content");
  if (singlePost) {
    renderSinglePost(singlePost);
  }
});

/**
 * Fetch published posts from localStorage
 */
function getPublishedPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem('va_posts')) || [];
    // Only return published posts
    return posts.filter(p => p.status === 'Published');
  } catch {
    return [];
  }
}

/**
 * Render posts for a specific category
 */
function renderCategoryPosts(categoryName, container) {
  const allPosts = getPublishedPosts();
  // Filter by category (case insensitive)
  const categoryPosts = allPosts.filter(p => 
    p.category && p.category.toLowerCase() === categoryName.toLowerCase()
  );

  if (categoryPosts.length === 0) {
    container.innerHTML = `
      <div class="blog-empty">
        <i class="fas fa-folder-open"></i>
        <h3>No posts yet</h3>
        <p>Check back later for updates on ${categoryName}.</p>
      </div>
    `;
    return;
  }

  // Sort by date (newest first)
  categoryPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = categoryPosts.map(post => {
    const defaultImg = `<div class="blog-card-img"><i class="fas fa-image"></i></div>`;
    const imgHtml = post.featured ? `<img src="${post.featured}" alt="${post.title}" class="blog-card-img" />` : defaultImg;
    
    // Fallback excerpt
    const excerpt = post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : '');

    return `
      <article class="blog-card">
        <a href="post.html?slug=${post.slug}">
          ${imgHtml}
        </a>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span><i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}</span>
            <span><i class="fas fa-eye"></i> ${post.views || 0}</span>
          </div>
          <h3 class="blog-card-title">
            <a href="post.html?slug=${post.slug}">${post.title}</a>
          </h3>
          <p class="blog-card-excerpt">${excerpt}</p>
          <div class="blog-card-footer">
            <div class="blog-card-author">
              <div class="author-avatar">${post.author ? post.author[0].toUpperCase() : 'V'}</div>
              <span>${post.author || 'Visuya Team'}</span>
            </div>
            <a href="post.html?slug=${post.slug}" class="blog-read-more">Read <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Render a single post based on URL slug
 */
function renderSinglePost(container) {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    showPostError(container, "Post not found. Please check the URL.");
    return;
  }

  const allPosts = getPublishedPosts();
  const post = allPosts.find(p => p.slug === slug);

  if (!post) {
    showPostError(container, "This article doesn't exist or has been removed.");
    return;
  }

  // Update Page Title and SEO Meta dynamically
  document.title = `${post.title} – Visuya`;
  
  // Track view (increment view count)
  incrementViewCount(post.id);

  const imgHtml = post.featured 
    ? `<img src="${post.featured}" alt="${post.title}" class="article-featured-img" />` 
    : '';

  const tagsHtml = post.tags && post.tags.length > 0
    ? `<div class="article-tags">
         ${post.tags.map(t => `<span class="article-tag">#${t}</span>`).join('')}
       </div>`
    : '';

  container.innerHTML = `
    <article>
      <header class="article-header">
        <a href="${post.category ? post.category.toLowerCase().replace(/\\s+/g, '-') + '.html' : '#'}" class="article-category">${post.category || 'Uncategorized'}</a>
        <h1 class="article-title">${post.title}</h1>
        <div class="article-meta">
          <span style="color:#1e293b;font-weight:600;"><i class="fas fa-user-circle"></i> ${post.author || 'Visuya Team'}</span>
          <span><i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}</span>
          <span><i class="fas fa-eye"></i> ${(post.views || 0) + 1} Views</span>
        </div>
      </header>
      
      ${imgHtml}
      
      <div class="article-body">
        ${post.content || 'No content provided.'}
      </div>
      
      ${tagsHtml}
    </article>
  `;
}

function showPostError(container, message) {
  container.innerHTML = `
    <div style="text-align:center;padding:100px 20px;">
      <i class="fas fa-exclamation-circle" style="font-size:64px;color:#ef4444;margin-bottom:20px;"></i>
      <h2 style="font-size:28px;margin-bottom:10px;color:#1e293b;">Oops!</h2>
      <p style="color:#64748b;font-size:16px;margin-bottom:30px;">${message}</p>
      <a href="index.html" class="btn btn-primary">Return to Home</a>
    </div>
  `;
}

function incrementViewCount(postId) {
  try {
    const allPosts = JSON.parse(localStorage.getItem('va_posts')) || [];
    const updatedPosts = allPosts.map(p => {
      if (p.id === postId) {
        return { ...p, views: (p.views || 0) + 1 };
      }
      return p;
    });
    localStorage.setItem('va_posts', JSON.stringify(updatedPosts));
  } catch (e) {
    console.error("Error updating views:", e);
  }
}

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return isNaN(date) ? d : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
