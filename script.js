/* ===================================================================
   CONTACT FORM SETUP — READ ME
   This site is static (GitHub Pages has no backend), so the form
   sends mail through Formspree (free tier, no server needed):
     1. Go to https://formspree.io and create a free account.
     2. Create a new form, copy the endpoint it gives you
        (looks like: https://formspree.io/f/xxxxxxxx)
     3. Paste it below into FORMSPREE_ENDPOINT.
   Until you do this, the form will show a friendly error and the
   "mailto" link in the contact info still works as a fallback.
=================================================================== */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mqevnlkw"; // <-- replace YOUR_FORM_ID

/* ---------- mobile nav ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ---------- scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector('.nav-links a[href="#' + id + '"]');
    if (!link) return;
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));

/* ---------- hero typing effect ---------- */
const roles = [
  "Cloud & Backend Developer",
  "Generative AI Developer",
  "Data Analyst",
  "Python Developer",
  "AWS Certified Cloud Practitioner"
];
const typeEl = document.getElementById('typeTarget');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop(){
  const current = roles[roleIdx];
  if (!deleting){
    charIdx++;
    typeEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    charIdx--;
    typeEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0){ deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

/* ---------- animated counters ---------- */
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    let cur = 0;
    const step = Math.max(1, Math.round(target / 40));
    const tick = () => {
      cur += step;
      if (cur >= target){ el.textContent = target + suffix; return; }
      el.textContent = cur + suffix;
      requestAnimationFrame(() => setTimeout(tick, 16));
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ---------- node diagram (signature element) ---------- */
(function buildDiagram(){
  const svgNS = "http://www.w3.org/2000/svg";
  const linksG = document.querySelector('.links');
  const nodesG = document.querySelector('.nodes');
  if (!linksG || !nodesG) return;
  const cx = 230, cy = 230, r = 168;

  const nodes = [
    { label: "AWS" }, { label: "Python" }, { label: "FastAPI" },
    { label: "React" }, { label: "Gemini AI" }, { label: "PostgreSQL" },
    { label: "Git" }, { label: "Scikit-learn" }
  ];

  nodes.forEach((n, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    n.x = cx + r * Math.cos(angle);
    n.y = cy + r * Math.sin(angle);
  });

  nodes.forEach(n => {
    const staticLine = document.createElementNS(svgNS, "line");
    staticLine.setAttribute("x1", cx); staticLine.setAttribute("y1", cy);
    staticLine.setAttribute("x2", n.x); staticLine.setAttribute("y2", n.y);
    staticLine.setAttribute("class", "link-line");
    linksG.appendChild(staticLine);

    const flowLine = document.createElementNS(svgNS, "line");
    flowLine.setAttribute("x1", cx); flowLine.setAttribute("y1", cy);
    flowLine.setAttribute("x2", n.x); flowLine.setAttribute("y2", n.y);
    flowLine.setAttribute("class", "link-flow");
    flowLine.style.animationDelay = (Math.random() * 4) + "s";
    linksG.appendChild(flowLine);
  });

  nodes.forEach(n => {
    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("class", "node-group");
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", n.x); circle.setAttribute("cy", n.y);
    circle.setAttribute("r", 40);
    circle.setAttribute("class", "node-circle");
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", n.x); text.setAttribute("y", n.y);
    text.setAttribute("class", "node-label");
    text.textContent = n.label;
    g.appendChild(circle); g.appendChild(text);
    nodesG.appendChild(g);
  });

  const centerG = document.createElementNS(svgNS, "g");
  centerG.setAttribute("class", "center-node");
  const centerCircle = document.createElementNS(svgNS, "circle");
  centerCircle.setAttribute("cx", cx); centerCircle.setAttribute("cy", cy);
  centerCircle.setAttribute("r", 46);
  const centerText = document.createElementNS(svgNS, "text");
  centerText.setAttribute("x", cx); centerText.setAttribute("y", cy);
  centerText.setAttribute("text-anchor", "middle");
  centerText.setAttribute("dominant-baseline", "middle");
  centerText.textContent = "GP";
  centerG.appendChild(centerCircle); centerG.appendChild(centerText);
  nodesG.appendChild(centerG);
})();

/* ---------- image fallbacks (profile photo + project thumbnails) ----------
   If an image file hasn't been added to /assets yet (or fails to load),
   swap in a clean placeholder instead of showing a broken image icon.
------------------------------------------------------------------------ */
document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const fallback = document.getElementById(img.dataset.fallback);
    if (fallback) fallback.style.display = 'flex';
  }, { once: true });
});

/* ---------- copy buttons ---------- */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const original = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => btn.textContent = original, 1500);
    } catch (e) { /* clipboard unavailable, ignore silently */ }
  });
});

/* ---------- contact form submit ---------- */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitLabel = document.getElementById('submitLabel');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMsg.textContent = "";
  formMsg.className = "form-msg";

  if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
    formMsg.textContent = "Form isn't connected yet — email me directly at gubbalapavan9347@gmail.com instead.";
    formMsg.classList.add('err');
    return;
  }

  submitBtn.disabled = true;
  submitLabel.textContent = "Sending...";

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    });
    if (res.ok) {
      formMsg.textContent = "Message sent — thanks for reaching out, I'll reply soon.";
      formMsg.classList.add('ok');
      form.reset();
    } else {
      formMsg.textContent = "Something went wrong. Try emailing me directly instead.";
      formMsg.classList.add('err');
    }
  } catch (err) {
    formMsg.textContent = "Network error — please email me directly at gubbalapavan9347@gmail.com.";
    formMsg.classList.add('err');
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = "Send message";
  }
});

/* ---------- resume download button ---------- */
/* Replace 'assets/resume.pdf' with the actual filename you add to your repo */
document.getElementById('resumeBtn').setAttribute('href', 'assets/resume.pdf');

/* ---------- theme switcher logic ---------- */
const themeBtn = document.getElementById('themeBtn');
const themeDropdown = document.getElementById('themeDropdown');
const themeButtons = themeDropdown.querySelectorAll('button');

// Load theme from localStorage
const storedTheme = localStorage.getItem('portfolio-theme') || 'dark';
document.documentElement.setAttribute('data-theme', storedTheme);
updateActiveThemeButton(storedTheme);

// Toggle dropdown
themeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  themeDropdown.classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
  themeDropdown.classList.remove('open');
});

// Theme selection
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedTheme = btn.dataset.theme;
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('portfolio-theme', selectedTheme);
    updateActiveThemeButton(selectedTheme);
    themeDropdown.classList.remove('open');
  });
});

function updateActiveThemeButton(theme) {
  themeButtons.forEach(btn => {
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* ---------- image lightbox logic ---------- */
const lightbox = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const projectImages = document.querySelectorAll('.proj-thumb img');

projectImages.forEach(img => {
  img.addEventListener('click', () => {
    // If the image failed and fallback is shown, don't open the lightbox
    if (img.style.display === 'none') return;
    
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Unlock background scrolling
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});