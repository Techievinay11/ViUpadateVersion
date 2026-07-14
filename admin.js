/* =====================================================
   VISUYA ADMIN PANEL – admin.js  (Full Functionality)
   ===================================================== */

// ─── STATE ───────────────────────────────────────────
let currentSection = 'dashboard';
let editingPostId = null;
let editingUserId = null;
let editingAdId = null;
let editingPageId = null;
let confirmCallback = null;
let selectedTags = [];
let postsPage = 1;
let allPostsPage = 1;
const PER_PAGE = 10;
let mediaViewMode = 'grid';
let sourceMode = false;
let menuItems = [];

// ─── STORAGE HELPERS ─────────────────────────────────
const store = {
  get: (k, def = []) => { try { return JSON.parse(localStorage.getItem('va_'+k)) || def; } catch { return def; } },
  set: (k, v) => localStorage.setItem('va_'+k, JSON.stringify(v)),
};

// ─── SEED DATA ────────────────────────────────────────
function seedData() {
  if (store.get('seeded', false)) return;

  const cats = [
    { id:1, name:'Credit Cards', slug:'credit-cards', color:'#10b981', posts:45 },
    { id:2, name:'Personal Finance', slug:'personal-finance', color:'#3b82f6', posts:28 },
    { id:3, name:'Loans', slug:'loans', color:'#f59e0b', posts:20 },
    { id:4, name:'Credit Score', slug:'credit-score', color:'#8b5cf6', posts:18 },
    { id:5, name:'Banking', slug:'banking', color:'#14b8a6', posts:17 },
    { id:6, name:'Investing', slug:'investing', color:'#ef4444', posts:14 },
  ];

  const users = [
    { id:1, name:'Rohan Sharma', email:'admin@visuya.com', role:'Admin', pass:'admin123', joined:'2024-01-15', avatar:'R' },
    { id:2, name:'Priya Patel', email:'priya@visuya.com', role:'Editor', pass:'editor123', joined:'2024-02-20', avatar:'P' },
    { id:3, name:'Aman Verma', email:'aman@visuya.com', role:'Author', pass:'author123', joined:'2024-03-10', avatar:'A' },
  ];

  const posts = [
    { id:1, title:'Best Travel Credit Cards in USA (May 2024)', author:'Rohan Sharma', category:'Credit Cards', status:'Published', views:8923, date:'2024-05-12', excerpt:'Discover the best travel credit cards...', content:'<h2>Best Travel Credit Cards</h2><p>Travel credit cards offer amazing rewards for frequent travelers...</p>', featured:'', tags:['travel','credit-cards'], slug:'best-travel-credit-cards' },
    { id:2, title:'Chase Sapphire Preferred vs Amex Gold', author:'Rohan Sharma', category:'Credit Cards', status:'Published', views:6542, date:'2024-05-10', excerpt:'A detailed comparison...', content:'<h2>Chase vs Amex</h2><p>Two of the most popular premium credit cards compared...</p>', featured:'', tags:['comparison'], slug:'chase-vs-amex' },
    { id:3, title:'How to Improve Your Credit Score Fast', author:'Priya Patel', category:'Credit Score', status:'Published', views:5105, date:'2024-05-08', excerpt:'Quick tips to boost your score...', content:'<h2>Improve Credit Score</h2><p>Here are proven strategies to improve your credit score...</p>', featured:'', tags:['credit-score'], slug:'improve-credit-score' },
    { id:4, title:'Best Cash Back Credit Cards in USA', author:'Rohan Sharma', category:'Credit Cards', status:'Published', views:4987, date:'2024-05-06', excerpt:'Earn more cash back...', content:'<h2>Best Cash Back Cards</h2><p>Maximize your everyday spending with these top cashback cards...</p>', featured:'', tags:['cashback'], slug:'best-cashback-cards' },
    { id:5, title:'Best Bank Bonuses & Offers in May 2024', author:'Aman Verma', category:'Banking', status:'Scheduled', views:0, date:'2024-05-15', excerpt:'Grab these limited time offers...', content:'<h2>Bank Bonuses</h2><p>These bank bonuses can earn you hundreds in free cash...</p>', featured:'', tags:['banking','bonuses'], slug:'bank-bonuses-may-2024' },
    { id:6, title:'Personal Loan vs Credit Card: Which is Better?', author:'Priya Patel', category:'Loans', status:'Draft', views:0, date:'2024-05-12', excerpt:'Compare your borrowing options...', content:'<h2>Personal Loan vs Credit Card</h2><p>Deciding between a personal loan and credit card...</p>', featured:'', tags:['loans','personal-finance'], slug:'personal-loan-vs-credit-card' },
    { id:7, title:'How to Get a Home Loan in USA: Complete Guide', author:'Aman Verma', category:'Loans', status:'Draft', views:0, date:'2024-05-10', excerpt:'Step by step home loan guide...', content:'<h2>Home Loan Guide</h2><p>Getting a home loan can be overwhelming. Here is everything you need to know...</p>', featured:'', tags:['home-loan','loans'], slug:'home-loan-guide' },
    { id:8, title:'Best Investments for Beginners in 2024', author:'Rohan Sharma', category:'Investing', status:'Published', views:3210, date:'2024-05-03', excerpt:'Start investing with confidence...', content:'<h2>Beginner Investments</h2><p>Here are the best investment options for beginners in 2024...</p>', featured:'', tags:['investing'], slug:'best-investments-beginners' },
  ];

  const comments = [
    { id:1, author:'John Doe', email:'john@email.com', text:'Great article! Very helpful for understanding credit cards.', post:'Best Travel Credit Cards', status:'approved', date:'2024-05-13' },
    { id:2, author:'Sarah M.', email:'sarah@email.com', text:'Can you compare with Citi Premier as well?', post:'Chase Sapphire vs Amex Gold', status:'pending', date:'2024-05-11' },
    { id:3, author:'Mike R.', email:'mike@email.com', text:'This helped me boost my score by 50 points!', post:'How to Improve Credit Score', status:'approved', date:'2024-05-09' },
    { id:4, author:'Spam Bot', email:'bot@spam.com', text:'Click here for FREE credit!!! www.spam.com', post:'Best Cash Back Cards', status:'spam', date:'2024-05-07' },
  ];

  const subscribers = ['user1@email.com', 'user2@email.com', 'finance@newsletter.com'];

  const pages = [
    { id:1, title:'About Us', content:'<h2>About Visuya</h2><p>We are your trusted finance companion...</p>', status:'Published', date:'2024-01-01' },
    { id:2, title:'Privacy Policy', content:'<h2>Privacy Policy</h2><p>Your privacy is important to us...</p>', status:'Published', date:'2024-01-01' },
    { id:3, title:'Contact Us', content:'<h2>Contact Us</h2><p>Reach out to our team...</p>', status:'Draft', date:'2024-02-01' },
  ];

  const ads = [
    { id:1, name:'Header Banner', placement:'Header', type:'Image', status:'Active', impressions:12450, code:'https://via.placeholder.com/728x90' },
    { id:2, name:'Sidebar Ad', placement:'Sidebar', type:'AdSense', status:'Active', impressions:8230, code:'<ins class="adsbygoogle"...</ins>' },
    { id:3, name:'Footer Strip', placement:'Footer', type:'Custom HTML', status:'Paused', impressions:3100, code:'<div class="ad">...</div>' },
  ];

  const settings = {
    siteName: 'Visuya', siteTagline: 'Make Better Money Decisions',
    siteUrl: 'https://techievinay11.github.io/ViUpadateVersion',
    adminEmail: 'admin@visuya.com', postsPerPage: 10,
  };

  menuItems = [
    { label: 'Home', url: '#home' }, { label: 'Credit Cards', url: '#credit-cards' },
    { label: 'Banking', url: '#banking' }, { label: 'Loans', url: '#loans' },
    { label: 'Calculators', url: '#calculators' }, { label: 'Insurance', url: '#insurance' },
  ];

  store.set('categories', cats);
  store.set('users', users);
  store.set('posts', posts);
  store.set('comments', comments);
  store.set('subscribers', subscribers);
  store.set('pages', pages);
  store.set('ads', ads);
  store.set('settings', settings);
  store.set('media', []);
  store.set('tags', ['travel', 'credit-cards', 'cashback', 'banking', 'loans', 'investing', 'personal-finance', 'comparison', 'credit-score']);
  store.set('menu', menuItems);
  store.set('notifications', [
    { text: '🆕 New comment on "Best Travel Cards"', time: '2 min ago' },
    { text: '📊 Post "How to Improve Credit Score" reached 5000 views', time: '1 hour ago' },
    { text: '👤 New subscriber: user5@email.com', time: '3 hours ago' },
  ]);
  store.set('seeded', true);
  store.set('campaigns', 0);
}

// ─── AUTH ────────────────────────────────────────────
function checkAuth() {
  const loggedIn = sessionStorage.getItem('va_loggedIn');
  if (!loggedIn) {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.querySelector('.sidebar').style.display = 'none';
    document.getElementById('adminMain').style.display = 'none';
  } else {
    document.getElementById('loginScreen').classList.add('hidden');
    document.querySelector('.sidebar').style.display = 'flex';
    document.getElementById('adminMain').style.display = 'flex';
    initAdmin();
  }
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const users = store.get('users');
  const user = users.find(u => u.email === email && u.pass === pass);
  if (user) {
    sessionStorage.setItem('va_loggedIn', JSON.stringify(user));
    document.getElementById('loginScreen').classList.add('hidden');
    document.querySelector('.sidebar').style.display = 'flex';
    document.getElementById('adminMain').style.display = 'flex';
    initAdmin();
    toast('Welcome back, ' + user.name + '! 👋', 'success');
  } else {
    toast('Invalid credentials. Try admin@visuya.com / admin123', 'error');
  }
}

function handleLogout() {
  sessionStorage.removeItem('va_loggedIn');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.querySelector('.sidebar').style.display = 'none';
  document.getElementById('adminMain').style.display = 'none';
}

function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem('va_loggedIn')) || {}; } catch { return {}; }
}

// ─── INIT ────────────────────────────────────────────
function initAdmin() {
  const user = getCurrentUser();
  document.getElementById('topUserName').textContent = user.name || 'Admin';
  document.getElementById('topUserRole').textContent = user.role || 'Admin';
  document.getElementById('topAvatar').textContent = (user.name || 'A')[0];

  renderStats();
  renderPostsTable();
  renderDonut();
  renderTopCategories();
  renderNotifications();
  updateCommentsBadge();
  renderCatCheckboxes();
  populateAuthorSelect();
  loadSettings();
  navigate('dashboard');
}

// ─── NAVIGATION ──────────────────────────────────────
function navigate(section) {
  document.querySelectorAll('.section-panel').forEach(p => p.classList.add('hidden'));
  const panel = document.getElementById('sec-' + section);
  if (panel) panel.classList.remove('hidden');

  document.querySelectorAll('.nav-link, .nav-sub-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`[data-section="${section}"]`);
  if (link) link.classList.add('active');

  currentSection = section;

  if (section === 'all-posts') { populateFilters(); applyFilters(); }
  if (section === 'media') renderMediaGrid();
  if (section === 'categories') renderCatTable();
  if (section === 'tags') renderTagsCloud();
  if (section === 'comments') renderComments();
  if (section === 'newsletter') renderNewsletter();
  if (section === 'users') renderUsers();
  if (section === 'ads') renderAds();
  if (section === 'analytics') { renderAnalyticsStats(); renderCharts(); renderTopPosts(); }
  if (section === 'pages') renderPages();
  if (section === 'menus') renderMenuBuilder();
  if (section === 'settings') loadSettings();
  if (section === 'add-post' && !editingPostId) resetEditor();
}

// Nav links
document.querySelectorAll('.nav-link[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigate(link.dataset.section);
  });
});
document.querySelectorAll('.nav-sub-link[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigate(link.dataset.section);
  });
});

// Dropdown toggles in sidebar
document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById(btn.dataset.toggle);
    if (target) {
      target.classList.toggle('open');
      btn.classList.toggle('open');
    }
  });
});

// Auto-open posts sub on posts sections
function autoOpenPostsSub() {
  document.getElementById('posts-sub').classList.add('open');
  document.querySelector('[data-toggle="posts-sub"]').classList.add('open');
}
['all-posts', 'add-post', 'categories', 'tags'].forEach(s => {
  const link = document.querySelector(`[data-section="${s}"]`);
  if (link) link.addEventListener('click', autoOpenPostsSub);
});

// ─── SIDEBAR TOGGLE ──────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('adminMain');
  if (window.innerWidth <= 900) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');
  }
}

// ─── STATS ───────────────────────────────────────────
function renderStats() {
  const posts = store.get('posts');
  const published = posts.filter(p => p.status === 'Published').length;
  const drafts = posts.filter(p => p.status === 'Draft').length;
  const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);
  const comments = store.get('comments').length;

  const html = `
    <div class="stat-card"><div class="stat-icon blue"><i class="fas fa-file-alt"></i></div>
      <div><div class="stat-num">${posts.length}</div><div class="stat-label">Total Posts</div><div class="stat-change stat-up">↑ 12.5% this month</div></div></div>
    <div class="stat-card"><div class="stat-icon green"><i class="fas fa-globe"></i></div>
      <div><div class="stat-num">${published}</div><div class="stat-label">Published Posts</div><div class="stat-change stat-up">↑ 8.2% this month</div></div></div>
    <div class="stat-card"><div class="stat-icon orange"><i class="fas fa-edit"></i></div>
      <div><div class="stat-num">${drafts}</div><div class="stat-label">Drafts</div><div class="stat-change stat-down">↓ 16.7% this month</div></div></div>
    <div class="stat-card"><div class="stat-icon purple"><i class="fas fa-eye"></i></div>
      <div><div class="stat-num">${totalViews.toLocaleString()}</div><div class="stat-label">Total Views</div><div class="stat-change stat-up">↑ 19.6% this month</div></div></div>
    <div class="stat-card"><div class="stat-icon teal"><i class="fas fa-comments"></i></div>
      <div><div class="stat-num">${comments}</div><div class="stat-label">Comments</div><div class="stat-change stat-up">↑ 7.3% this month</div></div></div>
  `;
  const row = document.getElementById('statsRow');
  if (row) row.innerHTML = html;
}

// ─── DONUT CHART ─────────────────────────────────────
function renderDonut() {
  const posts = store.get('posts');
  const total = posts.length;
  const published = posts.filter(p => p.status === 'Published').length;
  const drafts = posts.filter(p => p.status === 'Draft').length;
  const scheduled = posts.filter(p => p.status === 'Scheduled').length;

  const circle = 2 * Math.PI * 48;
  const pPublished = (published / total) * circle;
  const pDraft = (drafts / total) * circle;

  const donutEl = document.getElementById('donutPublished');
  if (donutEl) {
    donutEl.setAttribute('stroke-dasharray', `${pPublished} ${circle - pPublished}`);
    donutEl.setAttribute('stroke-dashoffset', `${circle * 0.25}`);
  }
  const draftEl = document.getElementById('donutDraft');
  if (draftEl) {
    const offset = circle * 0.25 - pPublished;
    draftEl.setAttribute('stroke', '#f59e0b');
    draftEl.setAttribute('stroke-dasharray', `${pDraft} ${circle - pDraft}`);
    draftEl.setAttribute('stroke-dashoffset', `${offset}`);
  }

  const totalEl = document.getElementById('donutTotal');
  if (totalEl) totalEl.textContent = total;

  const legend = document.getElementById('donutLegend');
  if (legend) {
    legend.innerHTML = `
      <div class="legend-item"><span><span class="legend-dot" style="background:#10b981"></span>Published</span><strong>${published} (${Math.round(published/total*100)}%)</strong></div>
      <div class="legend-item"><span><span class="legend-dot" style="background:#f59e0b"></span>Drafts</span><strong>${drafts} (${Math.round(drafts/total*100)}%)</strong></div>
      <div class="legend-item"><span><span class="legend-dot" style="background:#3b82f6"></span>Scheduled</span><strong>${scheduled} (${Math.round(scheduled/total*100)}%)</strong></div>
    `;
  }
}

// ─── TOP CATEGORIES ───────────────────────────────────
function renderTopCategories() {
  const cats = store.get('categories');
  const maxPosts = Math.max(...cats.map(c => c.posts));
  const el = document.getElementById('topCategoriesList');
  if (!el) return;
  el.innerHTML = cats.slice(0, 6).map(c => `
    <div class="top-cat-item">
      <span class="cat-name">${c.name}</span>
      <div class="cat-bar-wrap"><div class="cat-bar" style="width:${Math.round(c.posts/maxPosts*100)}%;background:${c.color}"></div></div>
      <span class="cat-count">${c.posts}</span>
    </div>
  `).join('');
}

// ─── POSTS TABLE ─────────────────────────────────────
function renderPostsTable(search = '') {
  const posts = store.get('posts');
  const filtered = search ? posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase())) : posts;
  const body = document.getElementById('postsTableBody');
  if (!body) return;

  const start = (postsPage - 1) * 5;
  const page = filtered.slice(start, start + 5);

  body.innerHTML = page.map(p => `
    <tr>
      <td><input type="checkbox" class="row-check" value="${p.id}"/></td>
      <td>
        <div class="post-title-cell">
          <div class="post-thumb">${p.featured ? `<img src="${p.featured}" alt=""/>` : '📄'}</div>
          <span class="post-title-txt" title="${p.title}">${p.title}</span>
        </div>
      </td>
      <td><div class="author-cell"><div class="mini-avatar">${p.author[0]}</div>${p.author}</div></td>
      <td><span class="cat-badge">${p.category}</span></td>
      <td><span class="status-badge ${p.status.toLowerCase()}">${p.status}</span></td>
      <td>${p.views ? p.views.toLocaleString() : '—'}</td>
      <td>${formatDate(p.date)}</td>
      <td><div class="action-btns">
        <button class="action-btn edit" title="Edit" onclick="editPost(${p.id})"><i class="fas fa-edit"></i></button>
        <button class="action-btn view" title="View"><i class="fas fa-eye"></i></button>
        <button class="action-btn del" title="Delete" onclick="confirmDelete('post',${p.id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');

  renderPagination('postsPagination', filtered.length, 5, postsPage, (p) => { postsPage = p; renderPostsTable(search); });
}

function applyFilters() {
  const cat = document.getElementById('filterCat')?.value || '';
  const author = document.getElementById('filterAuthor')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';
  const date = document.getElementById('filterDate')?.value || '';
  const search = document.getElementById('allPostsSearch')?.value?.toLowerCase() || '';

  let posts = store.get('posts');
  if (cat) posts = posts.filter(p => p.category === cat);
  if (author) posts = posts.filter(p => p.author === author);
  if (status) posts = posts.filter(p => p.status === status);
  if (date) posts = posts.filter(p => p.date === date);
  if (search) posts = posts.filter(p => p.title.toLowerCase().includes(search));

  const body = document.getElementById('allPostsBody');
  if (!body) return;
  const start = (allPostsPage - 1) * PER_PAGE;
  const page = posts.slice(start, start + PER_PAGE);

  body.innerHTML = page.map(p => `
    <tr>
      <td><input type="checkbox" class="row-check2" value="${p.id}"/></td>
      <td>
        <div class="post-title-cell">
          <div class="post-thumb">${p.featured ? `<img src="${p.featured}" alt=""/>` : '📄'}</div>
          <span class="post-title-txt" title="${p.title}">${p.title}</span>
        </div>
      </td>
      <td><div class="author-cell"><div class="mini-avatar">${p.author[0]}</div>${p.author}</div></td>
      <td><span class="cat-badge">${p.category}</span></td>
      <td><span class="status-badge ${p.status.toLowerCase()}">${p.status}</span></td>
      <td>${p.views ? p.views.toLocaleString() : '—'}</td>
      <td>${formatDate(p.date)}</td>
      <td><div class="action-btns">
        <button class="action-btn edit" onclick="editPost(${p.id})"><i class="fas fa-edit"></i></button>
        <button class="action-btn view"><i class="fas fa-eye"></i></button>
        <button class="action-btn del" onclick="confirmDelete('post',${p.id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');

  renderPagination('allPostsPagination', posts.length, PER_PAGE, allPostsPage,
    (p) => { allPostsPage = p; applyFilters(); },
    `Showing ${Math.min(start+1, posts.length)}–${Math.min(start+PER_PAGE, posts.length)} of ${posts.length} posts`
  );
}

function populateFilters() {
  const cats = store.get('categories');
  const users = store.get('users');
  const catSel = document.getElementById('filterCat');
  const authSel = document.getElementById('filterAuthor');
  if (catSel) catSel.innerHTML = '<option value="">All Categories</option>' + cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  if (authSel) authSel.innerHTML = '<option value="">All Authors</option>' + users.map(u => `<option value="${u.name}">${u.name}</option>`).join('');
}

// ─── PAGINATION ──────────────────────────────────────
function renderPagination(id, total, perPage, current, onChange, info = '') {
  const pages = Math.ceil(total / perPage);
  const el = document.getElementById(id);
  if (!el || pages <= 1) { if (el) el.innerHTML = ''; return; }
  const shown = info || `Showing ${Math.min((current-1)*perPage+1, total)}–${Math.min(current*perPage, total)} of ${total}`;
  let btns = '';
  const start = Math.max(1, current - 2), end = Math.min(pages, current + 2);
  if (start > 1) { btns += `<button class="page-btn" onclick="${onChange.toString().replace(/\n/g,'').trim().replace(/^function.*?\{|\}$/g,'')}">1</button>`; }
  if (start > 2) btns += '<span style="padding:0 4px">...</span>';
  for (let i = start; i <= end; i++) {
    btns += `<button class="page-btn ${i===current?'active':''}" onclick="(${onChange.toString()})(${i})">${i}</button>`;
  }
  if (end < pages - 1) btns += '<span style="padding:0 4px">...</span>';
  if (end < pages) btns += `<button class="page-btn" onclick="(${onChange.toString()})(${pages})">${pages}</button>`;
  el.innerHTML = `<span>${shown}</span><div class="pagination-btns"><button class="page-btn" onclick="(${onChange.toString()})(${Math.max(1,current-1)})" ${current===1?'disabled':''}><i class="fas fa-chevron-left"></i></button>${btns}<button class="page-btn" onclick="(${onChange.toString()})(${Math.min(pages,current+1)})" ${current===pages?'disabled':''}><i class="fas fa-chevron-right"></i></button></div>`;
}

// ─── POST EDITOR ─────────────────────────────────────
function resetEditor() {
  editingPostId = null;
  selectedTags = [];
  document.getElementById('postTitle').value = '';
  document.getElementById('postSlug').value = '';
  document.getElementById('richEditor').innerHTML = '';
  document.getElementById('ytLinkInput').value = '';
  document.getElementById('ytPreview').innerHTML = '';
  document.getElementById('postExcerpt').value = '';
  document.getElementById('seoTitle').value = '';
  document.getElementById('seoDesc').value = '';
  document.getElementById('seoKeyword').value = '';
  document.getElementById('postStatus').value = 'Draft';
  removeFeaturedImage();
  renderTagsContainer();
  document.getElementById('postEditorTitle').textContent = 'Add New Post';
  renderCatCheckboxes();
}

function editPost(id) {
  const posts = store.get('posts');
  const p = posts.find(x => x.id === id);
  if (!p) return;
  editingPostId = id;
  selectedTags = [...(p.tags || [])];

  document.getElementById('postTitle').value = p.title;
  document.getElementById('postSlug').value = p.slug || '';
  document.getElementById('richEditor').innerHTML = p.content || '';
  document.getElementById('postExcerpt').value = p.excerpt || '';
  document.getElementById('seoTitle').value = p.seoTitle || p.title;
  document.getElementById('seoDesc').value = p.seoDesc || p.excerpt || '';
  document.getElementById('seoKeyword').value = p.seoKeyword || '';
  document.getElementById('postStatus').value = p.status;

  if (p.featured) {
    document.getElementById('featImgPreview').src = p.featured;
    document.getElementById('featImgPreview').style.display = 'block';
    document.getElementById('featImgPlaceholder').style.display = 'none';
    document.getElementById('removeFeatImg').style.display = 'inline-flex';
  } else {
    removeFeaturedImage();
  }

  renderTagsContainer();
  renderCatCheckboxes(p.category);
  document.getElementById('postEditorTitle').textContent = 'Edit Post: ' + p.title;
  navigate('add-post');
  updateWordCount();
}

function savePostDraft() {
  savePost('Draft');
}
function publishPost() {
  savePost(document.getElementById('postStatus').value || 'Published');
}

function savePost(status) {
  const title = document.getElementById('postTitle').value.trim();
  if (!title) { toast('Please enter a post title!', 'error'); return; }

  const content = document.getElementById('richEditor').innerHTML;
  const excerpt = document.getElementById('postExcerpt').value.trim();
  const slug = document.getElementById('postSlug').value.trim() || slugify(title);
  const featImg = document.getElementById('featImgPreview').src;

  const selectedCats = [...document.querySelectorAll('#catCheckboxes input:checked')].map(cb => cb.value);
  const category = selectedCats[0] || 'Uncategorized';

  const author = document.getElementById('postAuthor')?.value || getCurrentUser().name;
  const seoTitle = document.getElementById('seoTitle').value;
  const seoDesc = document.getElementById('seoDesc').value;
  const seoKeyword = document.getElementById('seoKeyword').value;

  let posts = store.get('posts');

  if (editingPostId) {
    posts = posts.map(p => p.id === editingPostId ? {
      ...p, title, content, excerpt, slug, category, status,
      tags: selectedTags, featured: featImg.startsWith('data:') || featImg.startsWith('blob:') || featImg.startsWith('http') ? featImg : '',
      seoTitle, seoDesc, seoKeyword, author, date: p.date
    } : p);
    toast(`Post updated successfully! ✅`, 'success');
  } else {
    const newPost = {
      id: Date.now(), title, content, excerpt, slug, category,
      status, author, views: 0, date: new Date().toISOString().split('T')[0],
      tags: selectedTags, featured: featImg.startsWith('data:') || featImg.startsWith('blob:') ? featImg : '',
      seoTitle, seoDesc, seoKeyword
    };
    posts.unshift(newPost);

    // Update category post count
    const cats = store.get('categories');
    const catIdx = cats.findIndex(c => c.name === category);
    if (catIdx !== -1) cats[catIdx].posts++;
    store.set('categories', cats);

    toast(`Post ${status === 'Published' ? 'published' : 'saved'}! ✅`, 'success');
  }

  store.set('posts', posts);
  renderStats();
  renderPostsTable();
  renderDonut();
  renderTopCategories();
  addNotification(`Post "${title}" was ${status.toLowerCase()}`);
  navigate('all-posts');
}

function generateSlug() {
  const title = document.getElementById('postTitle').value;
  document.getElementById('postSlug').value = slugify(title);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── RICH TEXT EDITOR ────────────────────────────────
function fmt(cmd, val) {
  document.getElementById('richEditor').focus();
  document.execCommand(cmd, false, val || null);
  updateWordCount();
}

document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('richEditor');
  if (editor) {
    editor.addEventListener('input', updateWordCount);
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '    '); }
    });
  }
  const seoTitle = document.getElementById('seoTitle');
  const seoDesc = document.getElementById('seoDesc');
  if (seoTitle) seoTitle.addEventListener('input', () => document.getElementById('seoTitleCount').textContent = `${seoTitle.value.length}/60`);
  if (seoDesc) seoDesc.addEventListener('input', () => document.getElementById('seoDescCount').textContent = `${seoDesc.value.length}/160`);
});

function updateWordCount() {
  const text = document.getElementById('richEditor')?.innerText || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const wc = document.getElementById('wordCount');
  const cc = document.getElementById('charCount');
  if (wc) wc.textContent = `${words} words`;
  if (cc) cc.textContent = `${chars} chars`;
}

function toggleSource() {
  const editor = document.getElementById('richEditor');
  const source = document.getElementById('sourceEditor');
  const btn = document.getElementById('sourceBtn');
  if (!sourceMode) {
    source.value = editor.innerHTML;
    editor.classList.add('hidden');
    source.classList.remove('hidden');
    btn.style.background = '#dbeafe';
    sourceMode = true;
  } else {
    editor.innerHTML = source.value;
    source.classList.add('hidden');
    editor.classList.remove('hidden');
    btn.style.background = '';
    sourceMode = false;
  }
}

function insertLink() {
  const url = prompt('Enter URL:', 'https://');
  if (url) fmt('createLink', url);
}

function insertTable() {
  const rows = prompt('Number of rows:', '3');
  const cols = prompt('Number of columns:', '3');
  if (!rows || !cols) return;
  let html = '<table><tbody>';
  for (let r = 0; r < parseInt(rows); r++) {
    html += '<tr>';
    for (let c = 0; c < parseInt(cols); c++) {
      html += r === 0 ? '<th>Header</th>' : '<td>Cell</td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  document.getElementById('richEditor').focus();
  document.execCommand('insertHTML', false, html);
}

function insertEditorImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('richEditor').focus();
    document.execCommand('insertHTML', false, `<img src="${e.target.result}" alt="${file.name}" style="max-width:100%;"/>`);
  };
  reader.readAsDataURL(file);
  input.value = '';
}

// ─── YOUTUBE EMBED ───────────────────────────────────
function showYouTubeModal() { document.getElementById('ytModal').classList.remove('hidden'); }
function closeYouTubeModal() { document.getElementById('ytModal').classList.add('hidden'); }

function getYouTubeId(url) {
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&\n?#]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function embedYouTube() {
  const url = document.getElementById('ytLinkInput').value.trim();
  const ytId = getYouTubeId(url);
  if (!ytId) { toast('Invalid YouTube URL', 'error'); return; }
  const preview = document.getElementById('ytPreview');
  preview.innerHTML = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px">
    <iframe style="position:absolute;top:0;left:0;width:100%;height:100%"
      src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen></iframe>
  </div>`;
  toast('YouTube video embedded!', 'success');
}

function insertYouTubeInEditor() {
  const url = document.getElementById('ytModalUrl').value.trim();
  const w = document.getElementById('ytWidth').value || '100%';
  const h = document.getElementById('ytHeight').value || '315';
  const ytId = getYouTubeId(url);
  if (!ytId) { toast('Invalid YouTube URL', 'error'); return; }
  document.getElementById('richEditor').focus();
  document.execCommand('insertHTML', false,
    `<div style="text-align:center;margin:16px 0"><iframe width="${w}" height="${h}" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen style="border-radius:10px;max-width:100%"></iframe></div>`
  );
  closeYouTubeModal();
  toast('YouTube video inserted!', 'success');
}

// ─── FEATURED IMAGE ──────────────────────────────────
function handleFeatImgUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { toast('File too large! Max 5MB', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('featImgPreview').src = e.target.result;
    document.getElementById('featImgPreview').style.display = 'block';
    document.getElementById('featImgPlaceholder').style.display = 'none';
    document.getElementById('removeFeatImg').style.display = 'inline-flex';
  };
  reader.readAsDataURL(file);
}

function handleFeatImgDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const input = document.getElementById('featImgInput');
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    handleFeatImgUpload(input);
  }
}

function removeFeaturedImage() {
  document.getElementById('featImgPreview').src = '';
  document.getElementById('featImgPreview').style.display = 'none';
  document.getElementById('featImgPlaceholder').style.display = 'block';
  document.getElementById('removeFeatImg').style.display = 'none';
  document.getElementById('featImgInput').value = '';
}

// ─── TAGS ────────────────────────────────────────────
function addTag(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const val = e.target.value.trim().toLowerCase().replace(/\s+/g, '-');
    if (val && !selectedTags.includes(val)) {
      selectedTags.push(val);
      renderTagsContainer();
    }
    e.target.value = '';
  }
}

function removeTagFromPost(tag) {
  selectedTags = selectedTags.filter(t => t !== tag);
  renderTagsContainer();
}

function renderTagsContainer() {
  const c = document.getElementById('tagsContainer');
  if (!c) return;
  c.innerHTML = selectedTags.map(t =>
    `<span class="tag-chip">${t}<button onclick="removeTagFromPost('${t}')">×</button></span>`
  ).join('');
}

// ─── CATEGORIES ──────────────────────────────────────
function renderCatCheckboxes(selected = '') {
  const cats = store.get('categories');
  const c = document.getElementById('catCheckboxes');
  if (!c) return;
  c.innerHTML = cats.map(cat => `
    <label class="checkbox-item">
      <input type="checkbox" value="${cat.name}" ${cat.name === selected ? 'checked' : ''}/>
      <span style="display:flex;align-items:center;gap:6px">
        <span style="width:10px;height:10px;border-radius:50%;background:${cat.color};display:inline-block"></span>
        ${cat.name}
      </span>
    </label>
  `).join('');

  // Only one category at a time
  c.querySelectorAll('input').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) c.querySelectorAll('input').forEach(o => { if (o !== cb) o.checked = false; });
    });
  });
}

function populateAuthorSelect() {
  const users = store.get('users');
  const sel = document.getElementById('postAuthor');
  if (!sel) return;
  sel.innerHTML = users.map(u => `<option value="${u.name}">${u.name}</option>`).join('');
}

function quickAddCategory() {
  const name = document.getElementById('quickCatInput').value.trim();
  if (!name) return;
  addCategoryWithName(name);
  document.getElementById('quickCatInput').value = '';
}

function addCategory() {
  const name = document.getElementById('newCatName').value.trim();
  const slug = document.getElementById('newCatSlug').value.trim() || slugify(name);
  const desc = document.getElementById('newCatDesc').value.trim();
  const color = document.getElementById('newCatColor').value;
  if (!name) { toast('Category name required', 'error'); return; }
  addCategoryWithName(name, slug, desc, color);
  document.getElementById('newCatName').value = '';
  document.getElementById('newCatSlug').value = '';
  document.getElementById('newCatDesc').value = '';
}

function addCategoryWithName(name, slug = '', desc = '', color = '#10b981') {
  const cats = store.get('categories');
  if (cats.find(c => c.name.toLowerCase() === name.toLowerCase())) { toast('Category already exists', 'error'); return; }
  cats.push({ id: Date.now(), name, slug: slug || slugify(name), desc, color, posts: 0 });
  store.set('categories', cats);
  renderCatTable();
  renderCatCheckboxes();
  renderTopCategories();
  populateSettingsCatSelect();
  toast('Category added!', 'success');
}

function renderCatTable() {
  const cats = store.get('categories');
  const posts = store.get('posts');
  const body = document.getElementById('catTableBody');
  if (!body) return;
  body.innerHTML = cats.map(c => {
    const count = posts.filter(p => p.category === c.name).length;
    return `<tr>
      <td><span style="display:flex;align-items:center;gap:8px"><span style="width:12px;height:12px;border-radius:50%;background:${c.color};display:inline-block"></span><strong>${c.name}</strong></span></td>
      <td><code>${c.slug}</code></td>
      <td>${count}</td>
      <td><div class="action-btns">
        <button class="action-btn del" onclick="confirmDelete('category',${c.id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`;
  }).join('');
}

function deleteCategory(id) {
  let cats = store.get('categories');
  cats = cats.filter(c => c.id !== id);
  store.set('categories', cats);
  renderCatTable();
  renderCatCheckboxes();
  renderTopCategories();
  toast('Category deleted', 'success');
}

// ─── TAGS PAGE ───────────────────────────────────────
function addTag2() {
  const name = document.getElementById('newTagName').value.trim().toLowerCase();
  if (!name) return;
  const tags = store.get('tags');
  if (!tags.includes(name)) { tags.push(name); store.set('tags', tags); }
  document.getElementById('newTagName').value = '';
  document.getElementById('newTagSlug').value = '';
  renderTagsCloud();
  toast('Tag added!', 'success');
}

function renderTagsCloud() {
  const tags = store.get('tags');
  const el = document.getElementById('tagsCloud');
  if (!el) return;
  el.innerHTML = tags.map(t => `
    <span class="tag-pill">#${t}
      <button class="del-tag" onclick="deleteTag('${t}')"><i class="fas fa-times"></i></button>
    </span>
  `).join('');
}

function deleteTag(tag) {
  let tags = store.get('tags');
  tags = tags.filter(t => t !== tag);
  store.set('tags', tags);
  renderTagsCloud();
}

// ─── MEDIA LIBRARY ───────────────────────────────────
function uploadMediaFiles(input) {
  const files = Array.from(input.files);
  let media = store.get('media');
  let uploaded = 0;
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) { toast(`${file.name} too large (max 10MB)`, 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      media.push({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        size: formatFileSize(file.size),
        url: e.target.result,
        date: new Date().toLocaleDateString()
      });
      store.set('media', media);
      uploaded++;
      if (uploaded === files.length) { renderMediaGrid(); toast(`${uploaded} file(s) uploaded!`, 'success'); }
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function handleMediaDrop(e) {
  e.preventDefault();
  document.getElementById('mediaDropZone').classList.remove('drag-over');
  const dt = new DataTransfer();
  Array.from(e.dataTransfer.files).forEach(f => dt.items.add(f));
  const input = document.getElementById('mediaUploadInput');
  input.files = dt.files;
  uploadMediaFiles(input);
}

function renderMediaGrid() {
  const typeFilter = document.getElementById('mediaTypeFilter')?.value || '';
  const search = document.getElementById('mediaSearch')?.value?.toLowerCase() || '';
  let media = store.get('media');
  if (typeFilter) media = media.filter(m => m.type === typeFilter);
  if (search) media = media.filter(m => m.name.toLowerCase().includes(search));

  const grid = document.getElementById('mediaGrid');
  if (!grid) return;

  if (media.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#94a3b8"><i class="fas fa-photo-video" style="font-size:40px;display:block;margin-bottom:10px"></i>No media files yet. Upload some!</div>';
    return;
  }
  grid.innerHTML = media.map(m => `
    <div class="media-item">
      ${m.type === 'image'
        ? `<img src="${m.url}" alt="${m.name}"/>`
        : `<video src="${m.url}" style="width:100%;height:120px;object-fit:cover"></video>`
      }
      <button class="media-copy" onclick="copyToClipboard('${m.url.substring(0,100)}...')">Copy URL</button>
      <button class="media-del" onclick="deleteMedia(${m.id})"><i class="fas fa-times"></i></button>
      <div class="media-info">
        <div class="media-name">${m.name}</div>
        <div class="media-size">${m.size} · ${m.date}</div>
      </div>
    </div>
  `).join('');
}

function deleteMedia(id) {
  let media = store.get('media');
  media = media.filter(m => m.id !== id);
  store.set('media', media);
  renderMediaGrid();
  toast('Media deleted', 'success');
}

function setMediaView(mode) {
  mediaViewMode = mode;
  const grid = document.getElementById('mediaGrid');
  if (!grid) return;
  grid.style.gridTemplateColumns = mode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(160px, 1fr))';
}

// ─── COMMENTS ────────────────────────────────────────
function renderComments() {
  const filter = document.getElementById('commentFilter')?.value || '';
  let comments = store.get('comments');
  if (filter) comments = comments.filter(c => c.status === filter);
  const body = document.getElementById('commentsBody');
  if (!body) return;
  body.innerHTML = comments.map(c => `
    <tr>
      <td><div class="author-cell"><div class="mini-avatar">${c.author[0]}</div>${c.author}<br/><small>${c.email}</small></div></td>
      <td><span class="comment-text" title="${c.text}">${c.text}</span></td>
      <td>${c.post}</td>
      <td><span class="status-badge ${c.status === 'approved' ? 'published' : c.status === 'spam' ? 'draft' : 'scheduled'}">${c.status}</span></td>
      <td>${c.date}</td>
      <td><div class="action-btns">
        ${c.status !== 'approved' ? `<button class="action-btn edit" title="Approve" onclick="updateComment(${c.id},'approved')"><i class="fas fa-check"></i></button>` : ''}
        ${c.status !== 'spam' ? `<button class="action-btn view" title="Mark Spam" onclick="updateComment(${c.id},'spam')"><i class="fas fa-ban"></i></button>` : ''}
        <button class="action-btn del" title="Delete" onclick="confirmDelete('comment',${c.id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}

function updateComment(id, status) {
  let comments = store.get('comments');
  comments = comments.map(c => c.id === id ? {...c, status} : c);
  store.set('comments', comments);
  renderComments();
  updateCommentsBadge();
  toast(`Comment ${status}`, 'success');
}

function deleteComment(id) {
  let comments = store.get('comments');
  comments = comments.filter(c => c.id !== id);
  store.set('comments', comments);
  renderComments();
  updateCommentsBadge();
}

function updateCommentsBadge() {
  const pending = store.get('comments').filter(c => c.status === 'pending').length;
  const badge = document.getElementById('commentsBadge');
  if (badge) { badge.textContent = pending; badge.style.display = pending ? 'inline-block' : 'none'; }
}

// ─── NEWSLETTER ──────────────────────────────────────
function renderNewsletter() {
  const subs = store.get('subscribers', []);
  const campaigns = store.get('campaigns', 0);
  const subEl = document.getElementById('subCount');
  const campEl = document.getElementById('campSent');
  if (subEl) subEl.textContent = subs.length;
  if (campEl) campEl.textContent = campaigns;

  const list = document.getElementById('subscriberList');
  if (!list) return;
  list.innerHTML = subs.map(s => `
    <li class="sub-item">
      <span><i class="fas fa-envelope" style="color:var(--primary);margin-right:8px"></i>${s}</span>
      <button onclick="removeSubscriber('${s}')"><i class="fas fa-times"></i></button>
    </li>
  `).join('');
}

function addSubscriber() {
  const email = document.getElementById('addSubEmail').value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Invalid email address', 'error'); return; }
  const subs = store.get('subscribers', []);
  if (subs.includes(email)) { toast('Already subscribed', 'error'); return; }
  subs.push(email);
  store.set('subscribers', subs);
  document.getElementById('addSubEmail').value = '';
  renderNewsletter();
  toast('Subscriber added!', 'success');
}

function removeSubscriber(email) {
  let subs = store.get('subscribers', []);
  subs = subs.filter(s => s !== email);
  store.set('subscribers', subs);
  renderNewsletter();
  toast('Subscriber removed', 'success');
}

function sendCampaign() {
  const subject = document.getElementById('campSubject').value.trim();
  const body = document.getElementById('campBody').value.trim();
  if (!subject || !body) { toast('Please fill in subject and message', 'error'); return; }
  const subs = store.get('subscribers', []);
  if (!subs.length) { toast('No subscribers found', 'error'); return; }
  const campaigns = store.get('campaigns', 0) + 1;
  store.set('campaigns', campaigns);
  document.getElementById('campSubject').value = '';
  document.getElementById('campBody').value = '';
  renderNewsletter();
  addNotification(`Campaign "${subject}" sent to ${subs.length} subscribers`);
  toast(`Campaign sent to ${subs.length} subscribers! 📧`, 'success');
}

// ─── PAGES ───────────────────────────────────────────
function renderPages() {
  const pages = store.get('pages');
  const body = document.getElementById('pagesBody');
  if (!body) return;
  body.innerHTML = pages.map(p => `
    <tr>
      <td><strong>${p.title}</strong></td>
      <td><span class="status-badge ${p.status.toLowerCase()}">${p.status}</span></td>
      <td>${p.date}</td>
      <td><div class="action-btns">
        <button class="action-btn edit" onclick="editPageFn(${p.id})"><i class="fas fa-edit"></i></button>
        <button class="action-btn del" onclick="confirmDelete('page',${p.id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}

function openPageEditor(id = null) {
  editingPageId = id;
  document.getElementById('pageTitle').value = '';
  document.getElementById('pageEditor').innerHTML = '';
  document.getElementById('pageStatus').value = 'Published';
  document.getElementById('pageModalTitle').textContent = 'Add Page';
  document.getElementById('pageEditorModal').classList.remove('hidden');
}

function editPageFn(id) {
  const pages = store.get('pages');
  const p = pages.find(x => x.id === id);
  if (!p) return;
  editingPageId = id;
  document.getElementById('pageTitle').value = p.title;
  document.getElementById('pageEditor').innerHTML = p.content;
  document.getElementById('pageStatus').value = p.status;
  document.getElementById('pageModalTitle').textContent = 'Edit Page';
  document.getElementById('pageEditorModal').classList.remove('hidden');
}

function closePageEditor() {
  document.getElementById('pageEditorModal').classList.add('hidden');
  editingPageId = null;
}

function savePage() {
  const title = document.getElementById('pageTitle').value.trim();
  const content = document.getElementById('pageEditor').innerHTML;
  const status = document.getElementById('pageStatus').value;
  if (!title) { toast('Page title required', 'error'); return; }

  let pages = store.get('pages');
  if (editingPageId) {
    pages = pages.map(p => p.id === editingPageId ? {...p, title, content, status} : p);
    toast('Page updated!', 'success');
  } else {
    pages.push({ id: Date.now(), title, content, status, date: new Date().toLocaleDateString() });
    toast('Page created!', 'success');
  }
  store.set('pages', pages);
  renderPages();
  closePageEditor();
}

function deletePage(id) {
  let pages = store.get('pages');
  pages = pages.filter(p => p.id !== id);
  store.set('pages', pages);
  renderPages();
}

// ─── USERS ───────────────────────────────────────────
function renderUsers() {
  const users = store.get('users');
  const posts = store.get('posts');
  const body = document.getElementById('usersBody');
  if (!body) return;
  body.innerHTML = users.map(u => {
    const userPosts = posts.filter(p => p.author === u.name).length;
    return `<tr>
      <td><div class="mini-avatar" style="width:38px;height:38px;font-size:15px">${u.avatar || u.name[0]}</div></td>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td><span class="status-badge ${u.role === 'Admin' ? 'published' : u.role === 'Editor' ? 'scheduled' : 'draft'}">${u.role}</span></td>
      <td>${userPosts}</td>
      <td>${u.joined}</td>
      <td><div class="action-btns">
        <button class="action-btn edit" onclick="editUser(${u.id})"><i class="fas fa-edit"></i></button>
        <button class="action-btn del" onclick="confirmDelete('user',${u.id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`;
  }).join('');
}

function openUserModal(id = null) {
  editingUserId = id;
  document.getElementById('userName').value = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('userRole').value = 'Author';
  document.getElementById('userPass').value = '';
  document.getElementById('userModalTitle').textContent = 'Add User';
  document.getElementById('userModal').classList.remove('hidden');
}

function editUser(id) {
  const users = store.get('users');
  const u = users.find(x => x.id === id);
  if (!u) return;
  editingUserId = id;
  document.getElementById('userName').value = u.name;
  document.getElementById('userEmail').value = u.email;
  document.getElementById('userRole').value = u.role;
  document.getElementById('userPass').value = u.pass;
  document.getElementById('userModalTitle').textContent = 'Edit User';
  document.getElementById('userModal').classList.remove('hidden');
}

function closeUserModal() {
  document.getElementById('userModal').classList.add('hidden');
  editingUserId = null;
}

function saveUser() {
  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const role = document.getElementById('userRole').value;
  const pass = document.getElementById('userPass').value;
  if (!name || !email) { toast('Name and email required', 'error'); return; }

  let users = store.get('users');
  if (editingUserId) {
    users = users.map(u => u.id === editingUserId ? {...u, name, email, role, pass: pass || u.pass, avatar: name[0]} : u);
    toast('User updated!', 'success');
  } else {
    users.push({ id: Date.now(), name, email, role, pass: pass || 'password', avatar: name[0], joined: new Date().toISOString().split('T')[0] });
    toast('User added!', 'success');
  }
  store.set('users', users);
  renderUsers();
  closeUserModal();
  populateAuthorSelect();
}

function deleteUser(id) {
  let users = store.get('users');
  users = users.filter(u => u.id !== id);
  store.set('users', users);
  renderUsers();
}

// ─── ADS ────────────────────────────────────────────
function renderAds() {
  const ads = store.get('ads');
  const body = document.getElementById('adsBody');
  if (!body) return;
  body.innerHTML = ads.map(a => `
    <tr>
      <td><strong>${a.name}</strong></td>
      <td>${a.placement}</td>
      <td>${a.type}</td>
      <td><span class="status-badge ${a.status === 'Active' ? 'published' : 'draft'}">${a.status}</span></td>
      <td>${a.impressions.toLocaleString()}</td>
      <td><div class="action-btns">
        <button class="action-btn edit" onclick="editAd(${a.id})"><i class="fas fa-edit"></i></button>
        <button class="action-btn del" onclick="confirmDelete('ad',${a.id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}

function openAdModal() {
  editingAdId = null;
  document.getElementById('adName').value = '';
  document.getElementById('adCode').value = '';
  document.getElementById('adStatus').value = 'Active';
  document.getElementById('adModal').classList.remove('hidden');
}

function editAd(id) {
  const ads = store.get('ads');
  const a = ads.find(x => x.id === id);
  if (!a) return;
  editingAdId = id;
  document.getElementById('adName').value = a.name;
  document.getElementById('adPlacement').value = a.placement;
  document.getElementById('adType').value = a.type;
  document.getElementById('adCode').value = a.code;
  document.getElementById('adStatus').value = a.status;
  document.getElementById('adModal').classList.remove('hidden');
}

function closeAdModal() { document.getElementById('adModal').classList.add('hidden'); }

function saveAd() {
  const name = document.getElementById('adName').value.trim();
  if (!name) { toast('Ad name required', 'error'); return; }
  const placement = document.getElementById('adPlacement').value;
  const type = document.getElementById('adType').value;
  const code = document.getElementById('adCode').value.trim();
  const status = document.getElementById('adStatus').value;
  let ads = store.get('ads');
  if (editingAdId) {
    ads = ads.map(a => a.id === editingAdId ? {...a, name, placement, type, code, status} : a);
    toast('Ad updated!', 'success');
  } else {
    ads.push({ id: Date.now(), name, placement, type, code, status, impressions: 0 });
    toast('Ad created!', 'success');
  }
  store.set('ads', ads);
  renderAds();
  closeAdModal();
}

function deleteAd(id) {
  let ads = store.get('ads');
  ads = ads.filter(a => a.id !== id);
  store.set('ads', ads);
  renderAds();
}

// ─── SETTINGS ────────────────────────────────────────
function loadSettings() {
  const s = store.get('settings', {});
  if (document.getElementById('siteName')) document.getElementById('siteName').value = s.siteName || 'Visuya';
  if (document.getElementById('siteTagline')) document.getElementById('siteTagline').value = s.siteTagline || '';
  if (document.getElementById('siteUrl')) document.getElementById('siteUrl').value = s.siteUrl || '';
  if (document.getElementById('adminEmail')) document.getElementById('adminEmail').value = s.adminEmail || '';
  if (document.getElementById('postsPerPage')) document.getElementById('postsPerPage').value = s.postsPerPage || 10;
  if (document.getElementById('smFb')) document.getElementById('smFb').value = s.smFb || '';
  if (document.getElementById('smTw')) document.getElementById('smTw').value = s.smTw || '';
  if (document.getElementById('smIg')) document.getElementById('smIg').value = s.smIg || '';
  if (document.getElementById('smLi')) document.getElementById('smLi').value = s.smLi || '';
  if (document.getElementById('smYt')) document.getElementById('smYt').value = s.smYt || '';
  const user = getCurrentUser();
  if (document.getElementById('profileName')) document.getElementById('profileName').value = user.name || '';
  populateSettingsCatSelect();
}

function populateSettingsCatSelect() {
  const cats = store.get('categories');
  const sel = document.getElementById('defaultCat');
  if (sel) sel.innerHTML = cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
}

function saveSettings() {
  const s = store.get('settings', {});
  s.siteName = document.getElementById('siteName').value;
  s.siteTagline = document.getElementById('siteTagline').value;
  s.siteUrl = document.getElementById('siteUrl').value;
  s.adminEmail = document.getElementById('adminEmail').value;
  s.postsPerPage = document.getElementById('postsPerPage').value;
  store.set('settings', s);
  toast('Settings saved! ✅', 'success');
}

function saveSocial() {
  const s = store.get('settings', {});
  s.smFb = document.getElementById('smFb').value;
  s.smTw = document.getElementById('smTw').value;
  s.smIg = document.getElementById('smIg').value;
  s.smLi = document.getElementById('smLi').value;
  s.smYt = document.getElementById('smYt').value;
  store.set('settings', s);
  toast('Social links saved! ✅', 'success');
}

function saveProfile() {
  const name = document.getElementById('profileName').value;
  const bio = document.getElementById('profileBio').value;
  let user = getCurrentUser();
  user.name = name;
  user.bio = bio;
  sessionStorage.setItem('va_loggedIn', JSON.stringify(user));
  document.getElementById('topUserName').textContent = name;
  toast('Profile updated! ✅', 'success');
}

function changePassword() {
  const cur = document.getElementById('curPass').value;
  const newP = document.getElementById('newPass').value;
  const conf = document.getElementById('confPass').value;
  const user = getCurrentUser();
  if (cur !== user.pass) { toast('Current password incorrect', 'error'); return; }
  if (newP !== conf) { toast('Passwords do not match', 'error'); return; }
  if (newP.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
  user.pass = newP;
  let users = store.get('users');
  users = users.map(u => u.id === user.id ? {...u, pass: newP} : u);
  store.set('users', users);
  sessionStorage.setItem('va_loggedIn', JSON.stringify(user));
  document.getElementById('curPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confPass').value = '';
  toast('Password changed! 🔒', 'success');
}

function switchTab(tab, btn) {
  document.querySelectorAll('.settings-tab-content').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.remove('hidden');
  btn.classList.add('active');
}

// ─── SEO ANALYZER ────────────────────────────────────
function runSEOAnalysis() {
  const content = document.getElementById('seoAnalyzeContent').value;
  const kw = document.getElementById('seoAnalyzeKw').value.trim().toLowerCase();
  const result = document.getElementById('seoAnalysisResult');
  if (!content) { toast('Please enter content to analyze', 'error'); return; }

  const text = content.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const kwDensity = kw ? ((text.split(kw).length - 1) / wordCount * 100).toFixed(1) : 0;
  const hasH1 = /<h1/i.test(content);
  const hasH2 = /<h2/i.test(content);
  const hasImg = /<img/i.test(content);
  const hasAlt = /alt="/i.test(content);
  const hasLink = /<a /i.test(content);

  const checks = [
    { ok: wordCount >= 300, label: `Word count: ${wordCount} words (${wordCount >= 300 ? '✅ Good' : '⚠️ Needs more content (min 300)'})` },
    { ok: hasH1, label: `H1 tag: ${hasH1 ? '✅ Found' : '❌ Missing H1 tag'}` },
    { ok: hasH2, label: `H2 tags: ${hasH2 ? '✅ Found' : '⚠️ Add H2 subheadings'}` },
    { ok: hasImg, label: `Images: ${hasImg ? '✅ Found' : '⚠️ Add images'}` },
    { ok: hasAlt, label: `Alt text: ${hasAlt ? '✅ Present' : '❌ Add alt text to images'}` },
    { ok: hasLink, label: `Links: ${hasLink ? '✅ Found' : '⚠️ Add internal/external links'}` },
    { ok: kw && parseFloat(kwDensity) >= 0.5 && parseFloat(kwDensity) <= 3, label: kw ? `Keyword density: ${kwDensity}% (${parseFloat(kwDensity) >= 0.5 && parseFloat(kwDensity) <= 3 ? '✅ Optimal' : parseFloat(kwDensity) < 0.5 ? '⚠️ Too low' : '❌ Too high'})` : '⚠️ No focus keyword entered' },
  ];

  const score = Math.round(checks.filter(c => c.ok).length / checks.length * 100);
  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  result.innerHTML = `
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:48px;font-weight:800;color:${scoreColor}">${score}</div>
      <div style="font-size:14px;color:#64748b">SEO Score out of 100</div>
    </div>
    ${checks.map(c => `<div class="seo-score-item"><i class="fas fa-${c.ok ? 'check-circle seo-ok' : 'times-circle seo-fail'}"></i><span>${c.label}</span></div>`).join('')}
    <div style="margin-top:20px;padding:14px;background:#f0fdf4;border-radius:8px;font-size:13px;color:#065f46">
      <strong>💡 Quick Tips:</strong> Use your keyword in the title, first paragraph, and headings. Add 2-3 images with alt text. Aim for 500+ words.
    </div>
  `;
}

// ─── ANALYTICS ───────────────────────────────────────
function renderAnalyticsStats() {
  const posts = store.get('posts');
  const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);
  const el = document.getElementById('analyticsStats');
  if (!el) return;
  el.innerHTML = `
    <div class="stat-card"><div class="stat-icon blue"><i class="fas fa-eye"></i></div><div><div class="stat-num">${totalViews.toLocaleString()}</div><div class="stat-label">Total Views</div></div></div>
    <div class="stat-card"><div class="stat-icon green"><i class="fas fa-users"></i></div><div><div class="stat-num">${store.get('subscribers',[]).length}</div><div class="stat-label">Subscribers</div></div></div>
    <div class="stat-card"><div class="stat-icon orange"><i class="fas fa-share-alt"></i></div><div><div class="stat-num">1.2K</div><div class="stat-label">Social Shares</div></div></div>
    <div class="stat-card"><div class="stat-icon purple"><i class="fas fa-clock"></i></div><div><div class="stat-num">3m 42s</div><div class="stat-label">Avg. Session</div></div></div>
    <div class="stat-card"><div class="stat-icon red"><i class="fas fa-sign-out-alt"></i></div><div><div class="stat-num">42%</div><div class="stat-label">Bounce Rate</div></div></div>
  `;
}

function renderCharts() {
  const viewsCtx = document.getElementById('viewsChart');
  const trafficCtx = document.getElementById('trafficChart');
  if (!viewsCtx || !trafficCtx) return;

  // Views Chart
  drawBarChart(viewsCtx,
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    [820, 1240, 980, 1560, 1320, 890, 1100],
    '#10b981'
  );

  // Traffic Chart
  drawBarChart(trafficCtx,
    ['Organic','Social','Direct','Referral','Email'],
    [45, 25, 18, 8, 4],
    '#6366f1'
  );
}

function drawBarChart(canvas, labels, data, color) {
  const ctx = canvas.getContext('2d');
  const W = canvas.clientWidth || 400;
  const H = canvas.clientHeight || 120;
  canvas.width = W; canvas.height = H;

  ctx.clearRect(0, 0, W, H);
  const maxVal = Math.max(...data);
  const barW = (W - 40) / data.length - 8;
  const padL = 36, padB = 24, chartH = H - padB - 10;

  // Grid
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  [0.25, 0.5, 0.75, 1].forEach(f => {
    const y = H - padB - chartH * f;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W, y); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px Inter';
    ctx.fillText(Math.round(maxVal * f), 0, y + 4);
  });

  // Bars
  data.forEach((val, i) => {
    const x = padL + i * (barW + 8);
    const barH = (val / maxVal) * chartH;
    const y = H - padB - barH;
    const grad = ctx.createLinearGradient(0, y, 0, H - padB);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '40');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]) : ctx.rect(x, y, barW, barH);
    ctx.fill();
    // Labels
    ctx.fillStyle = '#475569'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 4);
  });
}

function renderTopPosts() {
  const posts = store.get('posts').filter(p => p.views > 0).sort((a, b) => b.views - a.views).slice(0, 5);
  const body = document.getElementById('topPostsBody');
  if (!body) return;
  body.innerHTML = posts.map((p, i) => `
    <tr>
      <td><strong>#${i+1}</strong></td>
      <td>${p.title}</td>
      <td><span class="cat-badge">${p.category}</span></td>
      <td><strong>${p.views.toLocaleString()}</strong></td>
      <td><span class="status-badge ${p.status.toLowerCase()}">${p.status}</span></td>
    </tr>
  `).join('');
}

// ─── MENUS ───────────────────────────────────────────
function renderMenuBuilder() {
  menuItems = store.get('menu', []);
  const builder = document.getElementById('menuBuilder');
  if (!builder) return;
  builder.innerHTML = menuItems.map((item, i) => `
    <div class="menu-item-row" draggable="true">
      <i class="fas fa-grip-vertical drag-handle"></i>
      <span>${item.label}</span>
      <a href="${item.url}">${item.url}</a>
      <button onclick="removeMenuItem(${i})"><i class="fas fa-times"></i></button>
    </div>
  `).join('');
}

function addMenuItem() {
  const label = document.getElementById('menuItemLabel').value.trim();
  const url = document.getElementById('menuItemUrl').value.trim();
  if (!label || !url) { toast('Label and URL required', 'error'); return; }
  menuItems.push({ label, url });
  store.set('menu', menuItems);
  renderMenuBuilder();
  document.getElementById('menuItemLabel').value = '';
  document.getElementById('menuItemUrl').value = '';
}

function removeMenuItem(i) {
  menuItems.splice(i, 1);
  store.set('menu', menuItems);
  renderMenuBuilder();
}

function saveMenu() {
  store.set('menu', menuItems);
  toast('Menu saved! ✅', 'success');
}

// ─── BACKUP ──────────────────────────────────────────
function exportData() {
  const data = {
    posts: store.get('posts'),
    categories: store.get('categories'),
    users: store.get('users'),
    comments: store.get('comments'),
    subscribers: store.get('subscribers'),
    pages: store.get('pages'),
    ads: store.get('ads'),
    settings: store.get('settings'),
    tags: store.get('tags'),
    menu: store.get('menu'),
    exported: new Date().toISOString()
  };
  downloadJSON(data, 'visuya-backup-' + new Date().toISOString().split('T')[0] + '.json');
  toast('Data exported! 💾', 'success');
}

function exportPosts() {
  const data = { posts: store.get('posts'), exported: new Date().toISOString() };
  downloadJSON(data, 'visuya-posts-' + new Date().toISOString().split('T')[0] + '.json');
  toast('Posts exported!', 'success');
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.posts) store.set('posts', data.posts);
      if (data.categories) store.set('categories', data.categories);
      if (data.users) store.set('users', data.users);
      if (data.comments) store.set('comments', data.comments);
      if (data.subscribers) store.set('subscribers', data.subscribers);
      if (data.pages) store.set('pages', data.pages);
      if (data.ads) store.set('ads', data.ads);
      if (data.settings) store.set('settings', data.settings);
      if (data.tags) store.set('tags', data.tags);
      toast('Data imported successfully! ✅', 'success');
      renderStats();
    } catch {
      toast('Invalid backup file', 'error');
    }
  };
  reader.readAsText(file);
}

function clearAllData() {
  confirmAction('Clear All Data', 'This will delete ALL content permanently. This cannot be undone!', () => {
    Object.keys(localStorage).filter(k => k.startsWith('va_')).forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem('va_loggedIn');
    window.location.reload();
  });
}

// ─── NOTIFICATIONS ───────────────────────────────────
function renderNotifications() {
  const notifs = store.get('notifications', []);
  const list = document.getElementById('notifList');
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = notifs.length ? 'block' : 'none';
  if (!list) return;
  list.innerHTML = notifs.length
    ? notifs.map(n => `<div class="notif-item"><div>${n.text}</div><small style="color:#94a3b8">${n.time}</small></div>`).join('')
    : '<div style="padding:16px;text-align:center;color:#94a3b8;font-size:13px">No notifications</div>';
}

function addNotification(text) {
  const notifs = store.get('notifications', []);
  notifs.unshift({ text, time: 'Just now' });
  store.set('notifications', notifs.slice(0, 10));
  renderNotifications();
}

function clearNotifs() {
  store.set('notifications', []);
  renderNotifications();
  document.getElementById('notifDropdown').classList.remove('active');
}

function toggleNotif() {
  document.getElementById('notifDropdown').classList.toggle('active');
  document.getElementById('userDropdown').classList.remove('active');
}

// ─── DELETE CONFIRM ──────────────────────────────────
function confirmDelete(type, id) {
  const labels = { post: 'post', category: 'category', comment: 'comment', user: 'user', ad: 'ad', page: 'page' };
  confirmAction(`Delete ${labels[type]}`, `Are you sure you want to delete this ${labels[type]}? This cannot be undone.`, () => {
    if (type === 'post') deletePost(id);
    if (type === 'category') deleteCategory(id);
    if (type === 'comment') deleteComment(id);
    if (type === 'user') deleteUser(id);
    if (type === 'ad') deleteAd(id);
    if (type === 'page') deletePage(id);
  });
}

function confirmAction(title, msg, callback) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirmModal').classList.remove('hidden');
  confirmCallback = callback;
  document.getElementById('confirmOkBtn').onclick = () => { confirmCallback && confirmCallback(); closeConfirm(); };
}

function closeConfirm() {
  document.getElementById('confirmModal').classList.add('hidden');
  confirmCallback = null;
}

function deletePost(id) {
  let posts = store.get('posts');
  posts = posts.filter(p => p.id !== id);
  store.set('posts', posts);
  renderStats();
  renderPostsTable();
  renderDonut();
  applyFilters();
  toast('Post deleted', 'success');
}

// ─── SELECT ALL ──────────────────────────────────────
function toggleSelectAll(cb) {
  document.querySelectorAll('.row-check').forEach(c => c.checked = cb.checked);
}
function toggleSelectAll2(cb) {
  document.querySelectorAll('.row-check2').forEach(c => c.checked = cb.checked);
}

function bulkDelete() {
  const checked = [...document.querySelectorAll('.row-check2:checked')].map(c => parseInt(c.value));
  if (!checked.length) { toast('No posts selected', 'error'); return; }
  confirmAction('Bulk Delete', `Delete ${checked.length} selected post(s)?`, () => {
    let posts = store.get('posts');
    posts = posts.filter(p => !checked.includes(p.id));
    store.set('posts', posts);
    renderStats(); renderPostsTable(); renderDonut(); applyFilters();
    toast(`${checked.length} post(s) deleted`, 'success');
  });
}

// ─── DARK MODE ───────────────────────────────────────
function toggleDark() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  document.getElementById('darkIcon').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('va_darkMode', isDark);
}
if (localStorage.getItem('va_darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  const icon = document.getElementById('darkIcon');
  if (icon) icon.className = 'fas fa-sun';
}

// ─── USER MENU ───────────────────────────────────────
function toggleUserMenu() {
  document.getElementById('userDropdown').classList.toggle('active');
  document.getElementById('notifDropdown').classList.remove('active');
}

// Close dropdowns on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.user-menu')) document.getElementById('userDropdown')?.classList.remove('active');
  if (!e.target.closest('.notif-btn') && !e.target.closest('.notif-dropdown')) document.getElementById('notifDropdown')?.classList.remove('active');
  if (!e.target.closest('.topbar-search')) {
    document.getElementById('searchResults')?.classList.remove('active');
  }
});

// ─── GLOBAL SEARCH ───────────────────────────────────
function globalSearchFn(q) {
  const results = document.getElementById('searchResults');
  if (!results) return;
  if (!q) { results.classList.remove('active'); return; }
  const posts = store.get('posts');
  const filtered = posts.filter(p => p.title.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
  const sections = [
    { icon: 'fa-tachometer-alt', text: 'Dashboard', sec: 'dashboard' },
    { icon: 'fa-file-alt', text: 'All Posts', sec: 'all-posts' },
    { icon: 'fa-plus', text: 'Add New Post', sec: 'add-post' },
    { icon: 'fa-photo-video', text: 'Media Library', sec: 'media' },
    { icon: 'fa-chart-bar', text: 'Analytics', sec: 'analytics' },
    { icon: 'fa-cog', text: 'Settings', sec: 'settings' },
  ].filter(s => s.text.toLowerCase().includes(q.toLowerCase()));

  results.innerHTML = [
    ...sections.map(s => `<div class="sr-item" onclick="navigate('${s.sec}');document.getElementById('globalSearch').value=''"><i class="fas ${s.icon}"></i>${s.text}</div>`),
    ...filtered.map(p => `<div class="sr-item" onclick="editPost(${p.id});document.getElementById('globalSearch').value=''"><i class="fas fa-file-alt"></i>${p.title}</div>`)
  ].join('') || '<div class="sr-item"><i class="fas fa-times"></i>No results found</div>';

  results.classList.add('active');
}

// ─── TOAST ───────────────────────────────────────────
let toastTimer;
function toast(msg, type = 'success') {
  const t = document.getElementById('adminToast');
  t.textContent = msg;
  t.className = `admin-toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ─── HELPERS ─────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date) ? d : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / 1024 / 1024).toFixed(1) + 'MB';
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => toast('URL copied!', 'success'));
}

// postStatus schedule toggle
document.getElementById('postStatus')?.addEventListener('change', function () {
  const row = document.getElementById('schedDateRow');
  if (row) row.style.display = this.value === 'Scheduled' ? 'block' : 'none';
});

// Post title → auto slug
document.getElementById('postTitle')?.addEventListener('input', function () {
  const slug = document.getElementById('postSlug');
  if (slug && !editingPostId) slug.value = slugify(this.value);
});

// ─── STARTUP ────────────────────────────────────────
seedData();
checkAuth();
