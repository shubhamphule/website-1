// Preloader
window.addEventListener('load', () => {
  document.getElementById('preloader').style.display = 'none';
});

// Sticky nav, smooth scroll, active link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});
window.addEventListener('scroll', () => {
  let fromTop = window.scrollY + 80;
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

// Typing effect
const introText = "Shubham Phule";
let i = 0;
function type() {
  if (i < introText.length) {
    document.getElementById('typed-text').textContent += introText.charAt(i);
    i++;
    setTimeout(type, 120);
  }
}
window.addEventListener('DOMContentLoaded', type);

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
function setTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  localStorage.setItem('theme', theme);
}
themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.body.classList.add('light');
});

// Scroll-triggered fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Back to Top
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Lazy loading images (if any)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[data-src]').forEach(img => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    io.observe(img);
  });
});

// PWA install prompt
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});
installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') installBtn.style.display = 'none';
    deferredPrompt = null;
  }
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}

// Dynamic Projects from JSON
fetch('projects.json').then(r=>r.json()).then(projects=>{
  const container = document.getElementById('projects-container');
  container.innerHTML = projects.map(p=>`
    <div class="project-card fade-in">
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.description}</div>
      <div class="project-links">
        ${p.demo ? `<a href="${p.demo}" target="_blank">Demo</a>` : ''}
        ${p.code ? `<a href="${p.code}" target="_blank">Code</a>` : ''}
      </div>
    </div>`).join('');
  document.querySelectorAll('.project-card').forEach(el => observer.observe(el));
});

// Testimonials slider (CSS scroll snap, optional JS for auto-scroll)
const slider = document.getElementById('testimonials-slider');
fetch('testimonials.json').then(r=>r.json()).then(testimonials=>{
  slider.innerHTML = testimonials.map(t=>`
    <div class="testimonial fade-in">
      <p>"${t.text}"</p>
      <div><strong>- ${t.author}</strong></div>
    </div>`).join('');
  document.querySelectorAll('.testimonial').forEach(el => observer.observe(el));
});

// Blog posts
fetch('blog.json').then(r=>r.json()).then(posts=>{
  const blog = document.getElementById('blog-posts');
  blog.innerHTML = posts.map(post=>`
    <div class="blog-post fade-in">
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <a href="${post.url}" target="_blank">Read more</a>
    </div>`).join('');
  document.querySelectorAll('.blog-post').forEach(el => observer.observe(el));
});

// Contact form validation
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const message = this.message.value.trim();
  const status = document.getElementById('form-status');
  if (!name || !email || !message) {
    status.textContent = 'Please fill in all fields.';
    return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    status.textContent = 'Please enter a valid email.';
    return;
  }
  status.textContent = 'Sending...';
  setTimeout(()=>{
    status.textContent = 'Thank you for your message!';
    contactForm.reset();
  }, 1200);
}); 