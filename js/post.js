// =====================================================
//  HUMANTOSPACE — Blog Post JavaScript
//  Handles: reading progress, TOC highlight, share, toast
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- READING PROGRESS BAR ---
  const progressBar = document.getElementById('readingProgress');
  const article = document.getElementById('articleContent');

  function updateReadingProgress() {
    if (!progressBar || !article) return;
    const articleTop = article.getBoundingClientRect().top + window.scrollY;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrolled = window.scrollY - articleTop + windowHeight * 0.5;
    const progress = Math.min(Math.max(scrolled / articleHeight, 0), 1);
    progressBar.style.width = (progress * 100) + '%';

    // TOC progress bar
    const tocBar = document.getElementById('tocProgressBar');
    if (tocBar) tocBar.style.width = (progress * 100) + '%';
  }

  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  updateReadingProgress();

  // --- ACTIVE TABLE OF CONTENTS ---
  const tocLinks = document.querySelectorAll('.post-toc-link');
  const sections = [];

  tocLinks.forEach(link => {
    const id = link.getAttribute('data-section');
    const section = document.getElementById(id);
    if (section) sections.push({ link, section });
  });

  function updateActiveToc() {
    let activeSet = false;
    for (let i = sections.length - 1; i >= 0; i--) {
      const { link, section } = sections[i];
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4) {
        tocLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        activeSet = true;
        break;
      }
    }
    if (!activeSet && sections.length > 0) {
      tocLinks.forEach(l => l.classList.remove('active'));
      sections[0].link.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveToc, { passive: true });
  updateActiveToc();

  // --- SMOOTH TOC SCROLL ---
  tocLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('data-section');
      const target = document.getElementById(id);
      if (target) {
        const offset = 120; // header + filter bar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- NEWSLETTER FORM ---
  const sidebarForm = document.getElementById('sidebarNewsletterForm');
  if (sidebarForm) {
    sidebarForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = sidebarForm.querySelector('.btn');
      btn.textContent = 'Subscribed ✓';
      btn.style.background = '#7A9E7E';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
        btn.disabled = false;
        sidebarForm.reset();
      }, 3000);
    });
  }

});

// --- COPY LINK ---
function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast();
  }).catch(() => {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast();
  });
}

function showToast() {
  const toast = document.getElementById('copyToast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// --- SHARE ---
function shareArticle(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  let shareUrl = '';
  if (platform === 'twitter') {
    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
  }
  if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
}
