/* ============================================================
   KAIA LISA - scripts.js
   ============================================================ */

/* ── CONFIG ── */
const LAST_UPDATED = 'FEBRUARY 2026';
const ABOUT_IMG    = 'img/IMG_3461-scaled.webp';
const ABOUT_TEXT   = `
  <h2>About</h2>
  <p>Rakaia Lisa Fokkena is a Berlin-based multimedia producer. She holds an M.A. in Visual and Media Anthropology from Freie Universität Berlin. Her work spans cinematography, documentary film, web development, and sociocultural research with a focus on queer performance, migration, and political art.</p>
  <a class="contact-btn" href="mailto:relkasaby@gmail.com">EMAIL ME</a>
`;


/* ============================================================
   TICKER
   ============================================================ */
function initTicker() {
  const visitorNum = String(Math.floor(Math.random() * 900000) + 100000);
  const phrases = [
    'UNDER CONSTRUCTION',
    'WELCOME TO MY HOMEPAGE',
    `YOU ARE VISITOR NO. ${visitorNum}`,
    'OPTIMIZED FOR INTERNET EXPLORER',
    `LAST UPDATED: ${LAST_UPDATED}`,
    'THANKS FOR VISITING',
  ];
  const sep     = ' &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp; ';
  const segment = phrases.join(sep) + sep;
  document.getElementById('ticker').innerHTML = segment.repeat(10);
}

/* ============================================================
   ABOUT PANEL
   ============================================================ */
function initAbout() {
  const btn   = document.getElementById('aboutToggle');
  const panel = document.getElementById('aboutPanel');

  // populate
  panel.innerHTML = `
    <img src="${ABOUT_IMG}" alt="Kaia Lisa" class="about-img">
    <div class="about-text">${ABOUT_TEXT}</div>
  `;

  btn.addEventListener('click', () => {
    panel.classList.toggle('visible');
    btn.classList.toggle('active');
  });
}

/* ============================================================
   BUILD GRID FROM projects.js
   ============================================================ */
function buildGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  projects.forEach((p, i) => {
    const cats   = p.categories.join(' ');
    const hover  = p.hover ? `hover-${p.hover}` : 'hover-warm';
    const textCard = p.textCard ? 'text-card' : ''; 
    const logo = p.logo ? 'logo' : '';
    const item   = document.createElement('div');
    item.className = `grid-item ${p.grid} ${cats} ${hover} ${textCard} ${logo}`;
    item.dataset.index = i;

    item.innerHTML = `
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      <div class="item-overlay">
        <div class="item-title">${p.title}</div>
        <div class="item-meta">${p.categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' + ')}</div> 
      </div>
    `;

    grid.appendChild(item);
  });
}

/* ============================================================
   FILTER WITH GLITCH
   ============================================================ */
function initFilter() {
  const btns       = document.querySelectorAll('.filter-btn');
  let   isFiltering = false;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isFiltering) return;

      const filter = btn.dataset.filter;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const items   = document.querySelectorAll('.grid-item');
      const toHide  = [];
      const toShow  = [];

      items.forEach(item => {
        const matches = filter === 'all' || item.classList.contains(filter);
        if (!item.classList.contains('hidden')) {
          if (!matches) toHide.push(item);
        } else {
          if (matches) toShow.push(item);
        }
      });

      if (toHide.length === 0 && toShow.length === 0) return;

      isFiltering = true;

      toHide.forEach(item => item.classList.add('glitch-out'));

      setTimeout(() => {
        toHide.forEach(item => {
          item.classList.remove('glitch-out');
          item.classList.add('hidden');
        });

        toShow.forEach(item => {
          item.classList.remove('hidden');
          void item.offsetWidth;
          item.classList.add('pop-in');
        });

        setTimeout(() => {
          toShow.forEach(item => item.classList.remove('pop-in'));
          isFiltering = false;
        }, 300);

      }, 200);
    });
  });
}

/* ============================================================
   MODAL
   ============================================================ */
function initModal() {
  const overlay  = document.getElementById('modal');
  const closeBtn = document.getElementById('modalClose');

  // open on grid item click - use delegation so it works after filter
  document.getElementById('grid').addEventListener('click', e => {
    const item = e.target.closest('.grid-item');
    if (!item) return;

    const i = parseInt(item.dataset.index);
    const p = projects[i];

    const modalBox = document.querySelector('.modal-box');

    // Add or remove digital-modal class based on project type
    if (p.categories.includes('digital')) { 
    modalBox.classList.add('digital-modal');
  } else {
    modalBox.classList.remove('digital-modal');
  }

  document.getElementById('modalImg').src = p.img;

    document.getElementById('modalImg').src          = p.img;
    document.getElementById('modalImg').alt          = p.title;
    document.getElementById('modalCategory').textContent = p.categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' + ') + (p.year ? ' · ' + p.year : '');
    document.getElementById('modalTitle').textContent    = p.title;
    document.getElementById('modalRole').textContent     = p.role || '';
    document.getElementById('modalDesc').textContent     = p.desc;

    const watchBtn = document.getElementById('modalWatch');
    const linkBtn  = document.getElementById('modalLink');

    watchBtn.style.display = p.video ? 'block' : 'none';
    if (p.video) watchBtn.href = p.video;

    linkBtn.style.display = p.link ? 'block' : 'none';
    if (p.link) linkBtn.href = p.link;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ============================================================
   STATUS BAR
   ============================================================ */
function initStatusBar() {
  const bar        = document.getElementById('statusBar');
  const defaultMsg = 'KAIA LISA · BERLIN · MULTIMEDIA PRODUCER + DEVELOPER';

  bar.textContent = defaultMsg;

  document.getElementById('grid').addEventListener('mouseover', e => {
    const item = e.target.closest('.grid-item');
    if (!item) { bar.textContent = defaultMsg; return; }
    const i = parseInt(item.dataset.index);
    const p = projects[i];
    bar.textContent = p.title.toUpperCase() + '  ·  ' + p.categories.map(c => c.toUpperCase()).join(' + ');
  });

  document.getElementById('grid').addEventListener('mouseleave', () => {
    bar.textContent = defaultMsg;
  });
}

 /* ============================================================
   PIXEL TRAIL
   ============================================================ */
function initPixelTrail() {
  const colors = ['#cc2200', '#00ff00', '#ff00ff', '#00ffff', '#ffff00'];
  let isDrawing = false;
  
  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    createPixel(touch.clientX, touch.clientY);
  });
  
  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    createPixel(touch.clientX, touch.clientY);
  });
  
  document.addEventListener('mousedown', (e) => { 
    isDrawing = true;
    createPixel(e.clientX, e.clientY);
  });
  
  document.addEventListener('mouseup', () => { isDrawing = false; });
  
  document.addEventListener('mousemove', (e) => {
    if (isDrawing) {
      createPixel(e.clientX, e.clientY);
    }
  });
  
  function createPixel(x, y) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel-trail';
    pixel.style.left = x + 'px';
    pixel.style.top = (y + window.scrollY) + 'px';
    pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(pixel);
    
    setTimeout(() => pixel.remove(), 500);
  }
}


/* ============================================================
   INIT - runs when DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTicker();
  initAbout();
  buildGrid();
  initFilter();
  initModal();
  initStatusBar();
  initPixelTrail();
});