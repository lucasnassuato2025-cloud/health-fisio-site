const ensureStylesheet = ({ selector, href, media }) => {
  if (document.querySelector(selector)) return;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = href;
  if (media) stylesheet.media = media;
  document.head.append(stylesheet);
};

ensureStylesheet({
  selector: 'link[href*="site-mobile.css"]',
  href: "/assets/site-mobile.css?v=20260803-mobile-v2",
  media: "(max-width: 767px)",
});

ensureStylesheet({
  selector: 'link[href*="ui-ux-refinements.css"]',
  href: "/assets/ui-ux-refinements.css?v=20260803-uiux-v1",
});

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");

const closeMenu = () => {
  nav?.classList.remove("open");
  menu?.setAttribute("aria-expanded", "false");
  menu?.setAttribute("aria-label", "Abrir menu");
};

menu?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

nav
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav?.classList.contains("open")) {
    closeMenu();
    menu?.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    nav?.classList.contains("open") &&
    !nav.contains(event.target) &&
    !menu?.contains(event.target)
  ) {
    closeMenu();
  }
});

document
  .querySelectorAll("[data-year]")
  .forEach((el) => (el.textContent = new Date().getFullYear()));

const dialog = document.querySelector("#privacy-dialog");
let dialogTrigger;

document.querySelectorAll("[data-privacy]").forEach((button) =>
  button.addEventListener("click", () => {
    dialogTrigger = button;
    dialog?.showModal();
  }),
);

dialog
  ?.querySelector(".dialog-close")
  ?.addEventListener("click", () => dialog.close());

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog?.addEventListener("close", () => dialogTrigger?.focus());

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.addEventListener("click", () => {
    const location = link.dataset.whatsapp || "nao_identificado";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "whatsapp_click", location });

    if (typeof window.gtag === "function") {
      window.gtag("event", "whatsapp_click", {
        event_category: "contato",
        event_label: location,
      });
    }
  });
});

const gallery = document.querySelector("[data-gallery]");

if (gallery) {
  const cards = [...gallery.querySelectorAll("figure")];
  const progress = document.querySelector("[data-gallery-progress]");
  const status = document.querySelector("[data-gallery-status]");
  const step = () => Math.min(436, Math.max(294, window.innerWidth * 0.82));

  const updateGallery = () => {
    const max = Math.max(1, gallery.scrollWidth - gallery.clientWidth);

    if (progress) {
      progress.style.width = `${10 + (gallery.scrollLeft / max) * 90}%`;
    }

    const centers = cards.map((card) =>
      Math.abs(
        card.offsetLeft +
          card.offsetWidth / 2 -
          (gallery.scrollLeft + gallery.clientWidth / 2),
      ),
    );
    const current = centers.indexOf(Math.min(...centers)) + 1;

    if (status) {
      status.textContent = `Foto ${current} de ${cards.length}`;
    }
  };

  document
    .querySelector("[data-gallery-next]")
    ?.addEventListener("click", () =>
      gallery.scrollBy({ left: step(), behavior: "smooth" }),
    );

  document
    .querySelector("[data-gallery-prev]")
    ?.addEventListener("click", () =>
      gallery.scrollBy({ left: -step(), behavior: "smooth" }),
    );

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      gallery.scrollBy({ left: step(), behavior: "smooth" });
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      gallery.scrollBy({ left: -step(), behavior: "smooth" });
    }
  });

  gallery.addEventListener("scroll", updateGallery, { passive: true });
  updateGallery();
}

const carolinaLinkedIn = "https://www.linkedin.com/in/carolina-paes-0108511b8/";
const professionalActions = document.querySelector(
  ".professional-home .professional-actions",
);

if (
  professionalActions &&
  !professionalActions.querySelector('a[href*="linkedin.com/in/carolina-paes"]')
) {
  const linkedInButton = document.createElement("a");
  linkedInButton.className = "button button-outline professional-linkedin";
  linkedInButton.href = carolinaLinkedIn;
  linkedInButton.target = "_blank";
  linkedInButton.rel = "noopener noreferrer";
  linkedInButton.setAttribute(
    "aria-label",
    "Ver perfil profissional da Dra. Carolina Paes no LinkedIn",
  );
  linkedInButton.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M5.3 7.8H1.7V22h3.6V7.8ZM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2ZM22 13.9c0-4.3-2.3-6.3-5.3-6.3-2.4 0-3.5 1.3-4.1 2.2v-2H9V22h3.6v-7c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.7V22H22v-8.1Z" /></svg><span>Perfil profissional no LinkedIn</span>';
  professionalActions.append(linkedInButton);
}

document
  .querySelectorAll('a[href*="linkedin.com/in/carolina-paes"]')
  .forEach((link) => {
    link.classList.add("professional-linkedin");

    const textNode = [...link.childNodes].find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
    );

    if (textNode) textNode.textContent = " Perfil profissional no LinkedIn";
  });

document.querySelectorAll(".professional-role").forEach((role) => {
  role.innerHTML = `
    <span class="professional-role-main">Fisioterapeuta e responsável pela Health</span>
    <span class="professional-role-specialties">Especialista Hospitalar · Especialista em Dermato Funcional</span>
  `;
});

const professionalHomeImage = document.querySelector(
  '.professional-home .professional-photo img[src*="carolina-paes-profissional"]',
);

professionalHomeImage?.addEventListener("error", () => {
  professionalHomeImage.src = "/assets/health/profissional-recorte.webp";
  professionalHomeImage.width = 602;
  professionalHomeImage.height = 1174;
});

if (document.querySelector(".professional-home")) {
  const personSchema = document.createElement("script");
  personSchema.type = "application/ld+json";
  personSchema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Carolina Paes",
    jobTitle: "Fisioterapeuta especialista hospitalar e em Dermato Funcional",
    worksFor: {
      "@type": "MedicalClinic",
      name: "Health Fisioterapia e Bem Estar",
      url: "https://fisiobemestar.vercel.app/",
    },
    knowsAbout: [
      "Fisioterapia hospitalar",
      "Fisioterapia dermatofuncional",
      "Pilates",
      "Atendimento Home Care",
    ],
    sameAs: [
      "https://www.instagram.com/health_fisio/",
      carolinaLinkedIn,
    ],
  });
  document.head.append(personSchema);
}
