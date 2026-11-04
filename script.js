const languageSelect = document.querySelector("#language-select");
const translatableElements = document.querySelectorAll("[data-th][data-en][data-zh][data-ja]");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll(".section-anchor")];
const supportedLanguages = ["th", "en", "zh", "ja"];
const htmlLanguages = { th: "th", en: "en", zh: "zh-Hans", ja: "ja" };

let language = "th";

try {
  const savedLanguage = localStorage.getItem("seashyne-language");
  if (supportedLanguages.includes(savedLanguage)) {
    language = savedLanguage;
  }
} catch {
  // The site still works when browser storage is unavailable.
}

function setLanguage(nextLanguage) {
  if (!supportedLanguages.includes(nextLanguage)) return;

  language = nextLanguage;
  document.documentElement.lang = htmlLanguages[language];
  languageSelect.value = language;

  translatableElements.forEach((element) => {
    element.textContent = element.dataset[language];
  });

  try {
    localStorage.setItem("seashyne-language", language);
  } catch {
    // Language switching does not depend on storage.
  }
}

languageSelect.addEventListener("change", (event) => {
  setLanguage(event.target.value);
});

function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSection) {
        setActiveLink(visibleSection.target.id);
      }
    },
    { rootMargin: "-15% 0px -55%", threshold: [0.05, 0.25, 0.5] },
  );

  sections.forEach((section) => observer.observe(section));
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveLink(link.getAttribute("href").slice(1));
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
setLanguage(language);
