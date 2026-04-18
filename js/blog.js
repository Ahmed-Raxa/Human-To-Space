/* =====================================================
   HUMANTOSPACE — Blog / Journal Page JavaScript
   ===================================================== */

(function () {
  'use strict';

  /* --- Reading Progress Bar --- */
  const progressBar = document.getElementById('readingProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = ((scrolled / total) * 100).toFixed(2) + '%';
    }, { passive: true });
  }

  /* --- Category Filter Tabs --- */
  const filterTabs = document.querySelectorAll('.blog-filter-tab');
  const articles = document.querySelectorAll('.blog-card[data-category]');
  const articleCountEl = document.getElementById('articleCount');
  const noResults = document.getElementById('noResults');
  const searchInput = document.getElementById('blogSearch');

  let activeFilter = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visible = 0;
    articles.forEach((card) => {
      const cat = card.getAttribute('data-category');
      const title = card.querySelector('.blog-card-title a')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
      const matchesFilter = activeFilter === 'all' || cat === activeFilter;
      const matchesSearch = searchQuery === '' || title.includes(searchQuery) || excerpt.includes(searchQuery);

      if (matchesFilter && matchesSearch) {
        card.classList.remove('blog-hidden');
        visible++;
      } else {
        card.classList.add('blog-hidden');
      }
    });

    if (articleCountEl) articleCountEl.textContent = visible;
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';

    // Hide/show card rows if both children are hidden
    document.querySelectorAll('.blog-card-row').forEach((row) => {
      const children = Array.from(row.querySelectorAll('.blog-card'));
      const allHidden = children.every((c) => c.classList.contains('blog-hidden'));
      row.style.display = allHidden ? 'none' : '';
    });
  }

  // Tab click
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      applyFilters();
    });
  });

  // Sidebar category buttons sync to tabs
  document.querySelectorAll('.sidebar-cat-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      activeFilter = filter;
      filterTabs.forEach((t) => {
        t.classList.toggle('active', t.getAttribute('data-filter') === filter);
      });
      applyFilters();
      // Scroll to journal index
      const journalSection = document.getElementById('journalIndex');
      if (journalSection) {
        journalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Live search
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = searchInput.value.trim().toLowerCase();
        applyFilters();
      }, 250);
    });
  }

  /* --- Pagination (visual only — fully functional page change would need server) --- */
  const pageNums = document.querySelectorAll('.blog-page-num');
  const prevBtn = document.querySelector('.blog-page-prev');
  const nextBtn = document.querySelector('.blog-page-next');

  let currentPage = 1;
  const totalPages = pageNums.length;

  function updatePagination() {
    pageNums.forEach((btn, i) => {
      btn.classList.toggle('active', i + 1 === currentPage);
      btn.setAttribute('aria-current', i + 1 === currentPage ? 'page' : 'false');
    });
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  pageNums.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      currentPage = i + 1;
      updatePagination();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) { currentPage--; updatePagination(); }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) { currentPage++; updatePagination(); }
    });
  }

  /* --- Newsletter Forms (success state) --- */
  function handleNewsletterForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = '✓ You\'re subscribed!';
      btn.style.background = '#7A9E7E';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

  handleNewsletterForm('sidebarNewsletterForm');
  handleNewsletterForm('bannerNewsletterForm');

  /* --- Hero parallax --- */
  const heroSection = document.querySelector('.blog-hero');
  const heroBg = document.querySelector('.blog-hero-bg img');
  if (heroSection && heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < heroSection.offsetHeight) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* --- Blog Sort (visual demo) --- */
  const sortSelect = document.getElementById('blogSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      // In a real app, this would re-sort the DOM or fetch from API
      // For the demo, just a subtle visual reset
      document.querySelectorAll('.blog-card').forEach((card) => {
        card.style.opacity = '0.5';
        card.style.transition = 'opacity 0.2s ease';
      });
      setTimeout(() => {
        document.querySelectorAll('.blog-card').forEach((card) => {
          card.style.opacity = '';
        });
      }, 400);
    });
  }

})();
