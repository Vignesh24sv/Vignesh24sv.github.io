// Theme toggle (remembers choice, falls back to system preference)
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  else if (matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
} catch (e) {}

themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// Nav border on scroll
const nav = document.getElementById("nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });

// Highlight the nav link for the section currently in view
const navAnchors = [...navLinks.querySelectorAll('a[href^="#"]')];
const spySections = navAnchors
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function updateActiveLink() {
  const line = scrollY + innerHeight * 0.35;
  let current = null;
  for (const sec of spySections) {
    if (sec.offsetTop <= line) current = sec;
  }
  // At the very bottom, the last section wins even if it's short
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) {
    current = spySections[spySections.length - 1];
  }
  navAnchors.forEach((a) =>
    a.classList.toggle("active", !!current && a.getAttribute("href") === "#" + current.id)
  );
}
addEventListener("scroll", updateActiveLink, { passive: true });
addEventListener("resize", updateActiveLink);
updateActiveLink();

// Reveal on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
