const header = document.querySelector("header");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");
const mobileMenuClose = document.getElementById("mobileMenuClose");

if (menuToggle && mobileMenu && menuIcon) {
    const closeMenu = () => {
        mobileMenu.classList.add("translate-x-full");
        mobileMenu.classList.remove("translate-x-0");
        menuToggle.setAttribute("aria-expanded", "false");
        menuIcon.classList.remove("ri-close-line");
        menuIcon.classList.add("ri-menu-3-line");
    };

    const openMenu = () => {
        mobileMenu.classList.remove("translate-x-full");
        mobileMenu.classList.add("translate-x-0");
        menuToggle.setAttribute("aria-expanded", "true");
        menuIcon.classList.remove("ri-menu-3-line");
        menuIcon.classList.add("ri-close-line");
    };

    menuToggle.addEventListener("click", () => {
        const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener("click", closeMenu);
    }

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024) {
            closeMenu();
        }
    });
}

const navbar = document.getElementById("navbar");
const services = document.getElementById("services");
const gst_services=document.getElementById("gst-options")
const itr_services=document.getElementById("itr-options")
const tds_services=document.getElementById("tds-options")

window.addEventListener("scroll", () => {

    const triggerPoint = services.offsetTop - navbar.offsetHeight;

    if (window.scrollY >= triggerPoint) {

        navbar.classList.remove(
            "bg-white/10",
            "border-white/10"
        );

        navbar.classList.add(
            "bg-slate-900/95",
            "border-slate-800",
            "shadow-xl"
        );

    } else {

        navbar.classList.remove(
            "bg-slate-900/95",
            "border-slate-800",
            "shadow-xl"
        );

        navbar.classList.add(
            "bg-white/10",
            "border-white/10"
        );

    }

});

window.addEventListener("scroll", () => {

    const triggerPoint = gst_services.offsetTop - navbar.offsetHeight;

    if (window.scrollY >= triggerPoint) {

        navbar.classList.remove(
            "bg-white/10",
            "border-white/10"
        );

        navbar.classList.add(
            "bg-slate-900/95",
            "border-slate-800",
            "shadow-xl"
        );

    } else {

        navbar.classList.remove(
            "bg-slate-900/95",
            "border-slate-800",
            "shadow-xl"
        );

        navbar.classList.add(
            "bg-white/10",
            "border-white/10"
        );

    }

});
window.addEventListener("scroll", () => {

    const triggerPoint = itr_services.offsetTop - navbar.offsetHeight;

    if (window.scrollY >= triggerPoint) {

        navbar.classList.remove(
            "bg-white/10",
            "border-white/10"
        );

        navbar.classList.add(
            "bg-slate-900/95",
            "border-slate-800",
            "shadow-xl"
        );

    } else {

        navbar.classList.remove(
            "bg-slate-900/95",
            "border-slate-800",
            "shadow-xl"
        );

        navbar.classList.add(
            "bg-white/10",
            "border-white/10"
        );

    }

});

window.addEventListener("scroll", () => {

    const triggerPoint = tds_services.offsetTop - navbar.offsetHeight;

    if (window.scrollY >= triggerPoint) {

        navbar.classList.remove(
            "bg-white/10",
            "border-white/10"
        );

        navbar.classList.add(
            "bg-slate-900/95",
            "border-slate-800",
            "shadow-xl"
        );

    } else {

        navbar.classList.remove(
            "bg-slate-900/95",
            "border-slate-800",
            "shadow-xl"
        );

        navbar.classList.add(
            "bg-white/10",
            "border-white/10"
        );

    }

});


// Robust form open/close handlers (supports multiple forms and missing elements)
const formButtons = document.querySelectorAll('[data-form]');

function showForm(formEl, triggerBtn) {
    if (!formEl) return;
    formEl.classList.remove(
        "opacity-0",
        "-translate-y-10",
        "pointer-events-none",
        "max-h-0"
    );

    formEl.classList.add(
        "opacity-100",
        "translate-y-0",
        "max-h-[2500px]"
    );

    if (triggerBtn) {
        triggerBtn.classList.add(
            "border-cyan-500",
            "shadow-cyan-500/20",
            "scale-[1.02]"
        );
    }

    setTimeout(() => {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
}

function hideForm(formEl, triggerBtn) {
    if (!formEl) return;
    formEl.classList.remove(
        "opacity-100",
        "translate-y-0",
        "max-h-[2500px]"
    );

    formEl.classList.add(
        "opacity-0",
        "-translate-y-10",
        "pointer-events-none",
        "max-h-0"
    );

    if (triggerBtn) {
        triggerBtn.classList.remove(
            "border-cyan-500",
            "shadow-cyan-500/20",
            "scale-[1.02]"
        );
    }
}

function getTargetFormElement(target) {
    const specificForm = document.getElementById(`${target}-form`);
    if (specificForm) return specificForm;
    const tdsForm = document.getElementById('tds-form');
    if (tdsForm && ['deduction', 'filing', 'advisory'].includes(target)) return tdsForm;
    return document.getElementById('service-form');
}

formButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.form;
        const formEl = getTargetFormElement(target);

        if (formEl && formEl.id === 'tds-form') {
            openTDSForm(target);
        } else {
            showForm(formEl, btn);
        }
    });
});

// Highlight clicked service card visually (keeps existing behavior but only for visual cards)
const cards = document.querySelectorAll(".service-card");
cards.forEach(card => {
    card.addEventListener("click", () => {
        cards.forEach(c => {
            c.classList.remove(
                "border-cyan-500",
                "shadow-cyan-500/20",
                "scale-[1.02]"
            );
        });
        card.classList.add(
            "border-cyan-500",
            "shadow-cyan-500/20",
            "scale-[1.02]"
        );
    });
});

// Close buttons (ids prefixed with "close-") will hide the corresponding form
const closeButtons = document.querySelectorAll('[id^="close-"]');
closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.id; // e.g. close-registration-form
        const target = id.replace(/^close-/, ''); // registration-form
        const formEl = document.getElementById(target);
        hideForm(formEl);
    });
});

// Prevent duplicate submissions across all forms on the page.
document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
        if (form.dataset.submitted === "true") {
            event.preventDefault();
            return;
        }

        form.dataset.submitted = "true";

        form.querySelectorAll('button[type="submit"], input[type="submit"]').forEach((button) => {
            button.disabled = true;
            button.setAttribute("aria-disabled", "true");
            button.classList.add("opacity-70", "cursor-not-allowed");

            if (button.tagName === "BUTTON" && button.textContent.trim() !== "") {
                button.textContent = "Submitted";
            }
        });
    });
});

const serviceFormSection = document.getElementById('service-form');
const closeServiceFormBtn = document.getElementById('close-service-form');

if (serviceFormSection) {
    document.querySelectorAll('.service-card').forEach(btn => {
        btn.addEventListener('click', () => {
            const svc = btn.getAttribute('data-form') || btn.dataset.service;
            openServiceForm(svc);
        });
    });
}

function openServiceForm(svc) {
    const section = document.getElementById('service-form');
    if (!section) return;

    section.classList.remove('opacity-0', '-translate-y-10', 'pointer-events-none');
    section.style.maxHeight = 'none';
    const serviceInput = document.getElementById('serviceInput');
    if (serviceInput) {
        serviceInput.value = svc === 'individual' ? 'Individual ITR' : svc === 'business' ? 'Business ITR' : svc === 'revision' ? 'ITR Revision' : svc;
    }
    showFieldsFor(svc);
    setTimeout(() => window.scrollTo({ top: section.offsetTop - 20, behavior: 'smooth' }), 50);
}

if (closeServiceFormBtn) {
    closeServiceFormBtn.addEventListener('click', closeServiceForm);
}

function closeServiceForm() {
    const section = document.getElementById('service-form');
    if (!section) return;

    section.classList.add('opacity-0', '-translate-y-10', 'pointer-events-none');
    section.style.maxHeight = null;
}

function showFieldsFor(svc) {
    const el = selector => document.querySelectorAll(selector).forEach(e => e.style.display = '');
    const hide = selector => document.querySelectorAll(selector).forEach(e => e.style.display = 'none');
    // Default: show most fields
    el('.field-business');
    if (svc === 'individual') {
        hide('.field-business');
    } else if (svc === 'business') {
        el('.field-business');
    } else if (svc === 'revision') {
        el('.field-business');
    }
}

function openTDSForm(service) {
    const section = document.getElementById("tds-form");
    if (!section) return;

    section.classList.remove(
        "opacity-0",
        "-translate-y-10",
        "pointer-events-none"
    );

    section.style.maxHeight = "none";

    const serviceInput = document.getElementById("serviceInput");
    if (serviceInput) {
        serviceInput.value =
            service === "deduction"
                ? "TDS Deduction"
                : service === "filing"
                ? "TDS Filing"
                : service === "advisory"
                ? "TDS Advisory"
                : service;
    }

    setTimeout(() => {
        window.scrollTo({
            top: section.offsetTop - 20,
            behavior: "smooth"
        });
    }, 50);
}

document.getElementById("close-tds-form").addEventListener("click", () => {
    const section = document.getElementById("tds-form");
    if (!section) return;

    section.classList.add(
        "opacity-0",
        "-translate-y-10",
        "pointer-events-none"
    );

    section.style.maxHeight = null;
});