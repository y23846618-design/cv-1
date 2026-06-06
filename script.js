const panelGroups = {
  home: [".hero", ".profile-band", ".skills"],
  practice: ["#practice"],
  portfolio: ["#portfolio"],
  photography: ["#photography"],
  contact: ["#contact"],
};

const navLinks = Array.from(document.querySelectorAll(".nav a, .hero-actions a, .brand"));
const panels = Object.values(panelGroups)
  .flat()
  .map((selector) => document.querySelector(selector))
  .filter(Boolean);

function showPanel(name, updateHash = true) {
  const panelName = panelGroups[name] ? name : "home";
  const active = new Set(panelGroups[panelName].map((selector) => document.querySelector(selector)));

  panels.forEach((panel) => {
    panel.hidden = !active.has(panel);
  });

  navLinks.forEach((link) => {
    const target = (link.getAttribute("href") || "#home").replace("#", "") || "home";
    link.classList.toggle("is-active", target === panelName || (panelName === "home" && target === "top"));
  });

  if (updateHash) {
    history.replaceState(null, "", panelName === "home" ? "#top" : `#${panelName}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const target = href.replace("#", "");
    const panelName = target === "top" ? "home" : target;
    if (!panelGroups[panelName]) return;

    event.preventDefault();
    showPanel(panelName);
  });
});

const startPanel = location.hash ? location.hash.replace("#", "") : "home";
showPanel(startPanel === "top" ? "home" : startPanel, false);

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCount = document.querySelector("#lightbox-count");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item[data-src]"));
let activeGallery = [];
let activeIndex = 0;

function setLightboxImage() {
  const item = activeGallery[activeIndex];
  if (!item) return;

  lightboxImage.src = item.dataset.src;
  lightboxImage.alt = item.dataset.alt || "";
  lightboxTitle.textContent = item.dataset.alt || item.dataset.gallery || "图片";
  lightboxCount.textContent = `${activeIndex + 1} / ${activeGallery.length}`;
}

function openLightbox(item) {
  activeGallery = galleryItems.filter((candidate) => candidate.dataset.gallery === item.dataset.gallery);
  activeIndex = Math.max(0, activeGallery.indexOf(item));
  setLightboxImage();
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");
}

function stepLightbox(direction) {
  if (!activeGallery.length) return;
  activeIndex = (activeIndex + direction + activeGallery.length) % activeGallery.length;
  setLightboxImage();
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => openLightbox(item));
});

document.querySelectorAll("[data-lightbox-close]").forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

document.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => stepLightbox(-1));
document.querySelector("[data-lightbox-next]")?.addEventListener("click", () => stepLightbox(1));

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") stepLightbox(-1);
  if (event.key === "ArrowRight") stepLightbox(1);
});
