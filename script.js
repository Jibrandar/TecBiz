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

// Consolidated navbar scroll handling: compute earliest section trigger and toggle styles
function updateNavbarOnScroll() {
    if (!navbar) return;
    const triggers = [services, gst_services, itr_services, tds_services].filter(Boolean);
    if (triggers.length === 0) return;
    const offsets = triggers.map(t => t.offsetTop - (navbar ? navbar.offsetHeight : 0));
    const earliest = Math.min(...offsets);
    const scrolled = window.scrollY >= earliest;

    navbar.classList.toggle('bg-slate-900/95', scrolled);
    navbar.classList.toggle('border-slate-800', scrolled);
    navbar.classList.toggle('shadow-xl', scrolled);

    navbar.classList.toggle('bg-white/10', !scrolled);
    navbar.classList.toggle('border-white/10', !scrolled);
}

window.addEventListener('scroll', updateNavbarOnScroll);
window.addEventListener('resize', updateNavbarOnScroll);
// run once to set initial state
updateNavbarOnScroll();


// Robust form open/close handlers (supports multiple forms and missing elements)
const formButtons = document.querySelectorAll('[data-form]');

function showForm(formEl, triggerBtn) {
    if (!formEl) return;
    // Hide other form sections to avoid multiple open forms showing simultaneously
    const otherForms = [document.getElementById('tds-form'), document.getElementById('service-form')];
    otherForms.forEach(f => { if (f && f !== formEl) hideForm(f); });
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

// Helpers: reset form element and re-enable submit buttons
function resetFormElement(section) {
    if (!section) return null;
    const formEl = section.querySelector('form');
    if (!formEl) return null;
    formEl.reset();
    formEl.dataset.submitted = "false";
    formEl.querySelectorAll('button[type="submit"], input[type="submit"]').forEach(button => {
        button.disabled = false;
        button.removeAttribute('aria-disabled');
        button.classList.remove('opacity-70', 'cursor-not-allowed');
        if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
        button.textContent = button.dataset.originalText || 'Submit';
    });
    return formEl;
}

// Helper to update tds-form heading/description/submit and show the active group
function applyTDSContent(section, service, serviceValue, maps = {}) {
    const serviceInput = document.getElementById('serviceInput');
    if (serviceInput) serviceInput.value = serviceValue || service;

    const headingEl = document.getElementById('tdsFormHeading');
    const descriptionEl = document.getElementById('tdsFormDescription');
    const submitButton = document.getElementById('tdsSubmitButton');

    document.querySelectorAll('.tds-form-group').forEach(group => group.classList.add('hidden'));
    const activeGroup = document.querySelector(`.tds-form-group[data-service="${service}"]`);

    if (headingEl) headingEl.textContent = (maps.heading && maps.heading[service]) || maps.defaultHeading || headingEl.textContent;
    if (descriptionEl) descriptionEl.textContent = (maps.description && maps.description[service]) || maps.defaultDescription || descriptionEl.textContent;
    if (submitButton) submitButton.textContent = (maps.submit && maps.submit[service]) || maps.defaultSubmit || submitButton.textContent;
    if (activeGroup) activeGroup.classList.remove('hidden');
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

        // Pass the triggering button so the form openers can style/highlight it
        if (formEl && formEl.id === 'tds-form') {
            openTDSForm(target, btn);
            // ensure visual open state matches showForm
            showForm(formEl, btn);
        } else if (formEl && formEl.id === 'service-form') {
            openServiceForm(target, btn);
            showForm(formEl, btn);
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

function openServiceForm(svc, triggerBtn) {
    const section = document.getElementById('service-form');
    if (!section) return;
    // Ensure other forms are closed and reset fields
    const other = document.getElementById('tds-form');
    if (other) hideForm(other);

    // apply same visible classes as showForm for consistent behavior
    section.classList.remove('opacity-0', '-translate-y-10', 'pointer-events-none', 'max-h-0');
    section.classList.add('opacity-100', 'translate-y-0', 'max-h-[2500px]');
    section.style.maxHeight = 'none';
    resetFormElement(section);
    const serviceInput = document.getElementById('serviceInput');
    // Determine page from pathname and title to avoid matching footer content
    const page = window.location.pathname.toLowerCase();
    const isIncorporationPage = page.includes('companyincoporation') || /Incorporation/i.test(document.title);
    const isITRPage = page.includes('itrservice') || /ITR Services/i.test(document.title);
    const isAuditPage = page.includes('auditassurance') || /Audit|Assurance/i.test(document.title);
    if (serviceInput) {
        if (isIncorporationPage) {
            serviceInput.value =
                svc === 'deduction'
                    ? 'Private Limited Company'
                    : svc === 'filing'
                    ? 'LLP / Partnership'
                    : svc === 'advisory'
                    ? 'Name Reservation & Compliance'
                    : 'Company Incorporation';
        } else if (isAuditPage) {
            serviceInput.value =
                svc === 'deduction'
                    ? 'Statutory Audit'
                    : svc === 'filing'
                    ? 'Internal Audit'
                    : svc === 'advisory'
                    ? 'Assurance & Advisory'
                    : 'Audit & Assurance';
        } else {
            serviceInput.value = svc === 'individual' ? 'Individual ITR' : svc === 'business' ? 'Business ITR' : svc === 'revision' ? 'ITR Revision' : svc;
        }
    }

    // For incorporation page, or audit page, show/hide the specific form groups and update headings
    if (isIncorporationPage) {
        const headingEl = section.querySelector('h2');
        const descriptionEl = section.querySelector('p');
        const submitButton = section.querySelector('button[type="submit"]');

        document.querySelectorAll('.tds-form-group').forEach(group => group.classList.add('hidden'));
        const activeGroup = document.querySelector(`.tds-form-group[data-service="${svc}"]`);

        if (headingEl) {
            headingEl.textContent =
                svc === 'deduction'
                    ? 'Private Limited Company Incorporation Request'
                    : svc === 'filing'
                    ? 'LLP / Partnership Formation Request'
                    : svc === 'advisory'
                    ? 'Name Reservation & Compliance Request'
                    : 'Company Incorporation Application';
        }

        if (descriptionEl) {
            descriptionEl.textContent =
                svc === 'deduction'
                    ? 'Provide your company details and proposed share capital so we can prepare incorporation documents for a Private Limited company.'
                    : svc === 'filing'
                    ? 'Share LLP/Partnership details and partners so we can draft and file required formation documents.'
                    : svc === 'advisory'
                    ? 'Submit your proposed company names and compliance questions for name reservation and regulatory guidance.'
                    : 'Complete the form below and our team will contact you shortly to start your company incorporation process.';
        }

        if (submitButton) {
            submitButton.textContent =
                svc === 'deduction'
                    ? 'Submit Private LTD Request'
                    : svc === 'filing'
                    ? 'Submit LLP / Partnership Request'
                    : svc === 'advisory'
                    ? 'Submit Compliance Request'
                    : 'Submit Incorporation Request';
        }

        if (activeGroup) activeGroup.classList.remove('hidden');
    } else if (isAuditPage) {
        const headingEl = section.querySelector('h2');
        const descriptionEl = section.querySelector('p');
        const submitButton = section.querySelector('button[type="submit"]');

        document.querySelectorAll('.tds-form-group').forEach(group => group.classList.add('hidden'));
        const activeGroup = document.querySelector(`.tds-form-group[data-service="${svc}"]`);

        if (headingEl) {
            headingEl.textContent =
                svc === 'deduction'
                    ? 'Statutory Audit Request'
                    : svc === 'filing'
                    ? 'Internal Audit Request'
                    : svc === 'advisory'
                    ? 'Assurance & Advisory Request'
                    : 'Audit & Assurance Request';
        }

        if (descriptionEl) {
            descriptionEl.textContent =
                svc === 'deduction'
                    ? 'Provide financial year and turnover details so we can plan your statutory audit.'
                    : svc === 'filing'
                    ? 'Share your internal control areas and audit frequency so we can scope the engagement.'
                    : svc === 'advisory'
                    ? 'Tell us about the advisory service required, e.g. due diligence or IFRS support.'
                    : 'Complete the form below and our team will contact you to discuss the audit engagement.';
        }

        if (submitButton) {
            submitButton.textContent =
                svc === 'deduction'
                    ? 'Submit Statutory Audit Request'
                    : svc === 'filing'
                    ? 'Submit Internal Audit Request'
                    : svc === 'advisory'
                    ? 'Submit Advisory Request'
                    : 'Submit Audit Request';
        }

        if (activeGroup) activeGroup.classList.remove('hidden');
    } else {
        // Detect ITR page and apply ITR-specific headings and field visibility
        const pageLower = window.location.pathname.toLowerCase();
        const isITRPage = pageLower.includes('itrservice') || /ITR Services/i.test(document.title);

        if (isITRPage) {
            const headingEl = section.querySelector('h2');
            const descriptionEl = section.querySelector('p');
            const submitButton = section.querySelector('button[type="submit"]');

            // set service input value
            if (serviceInput) serviceInput.value = svc === 'individual' ? 'Individual ITR' : svc === 'business' ? 'Business ITR' : svc === 'revision' ? 'ITR Revision' : 'ITR Service';

            if (headingEl) {
                headingEl.textContent =
                    svc === 'individual'
                        ? 'Individual ITR Filing Request'
                        : svc === 'business'
                        ? 'Business ITR Filing Request'
                        : svc === 'revision'
                        ? 'ITR Revision Request'
                        : 'ITR Service Request';
            }

            if (descriptionEl) {
                descriptionEl.textContent =
                    svc === 'individual'
                        ? 'Provide your PAN, assessment year and income details so we can file your individual income tax return.'
                        : svc === 'business'
                        ? 'Share business details, PAN and turnover so we can prepare and file your business ITR.'
                        : svc === 'revision'
                        ? 'Provide original filing details and reason for revision so we can assist with revised return filing.'
                        : 'Complete the form below and our team will contact you regarding your ITR needs.';
            }

            if (submitButton) {
                submitButton.textContent =
                    svc === 'individual'
                        ? 'Submit Individual ITR Request'
                        : svc === 'business'
                        ? 'Submit Business ITR Request'
                        : svc === 'revision'
                        ? 'Submit ITR Revision Request'
                        : 'Submit ITR Request';
            }

            // Reset and show/hide fields
            resetFormElement(section);
            if (svc === 'individual') {
                document.querySelectorAll('.field-business').forEach(e => e.classList.add('hidden'));
            } else if (svc === 'business') {
                document.querySelectorAll('.field-business').forEach(e => e.classList.remove('hidden'));
            } else if (svc === 'revision') {
                document.querySelectorAll('.field-business').forEach(e => e.classList.remove('hidden'));
            }
        } else {
            showFieldsFor(svc);
        }
    }
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

function openTDSForm(service, triggerBtn) {
    const section = document.getElementById("tds-form");
    if (!section) return;
    // Ensure other forms are closed and reset fields
    const other = document.getElementById('service-form');
    if (other) hideForm(other);

    // ensure visible classes consistent with showForm
    section.classList.remove("opacity-0", "-translate-y-10", "pointer-events-none", "max-h-0");
    section.classList.add("opacity-100", "translate-y-0", "max-h-[2500px]");
    section.style.maxHeight = "none";

    // reset form state
    resetFormElement(section);

    const serviceInput = document.getElementById("serviceInput");
    const heading = section.querySelector('h2');
    const isIncorporation = heading && /Incorporation/i.test(heading.textContent);
    const page = window.location.pathname.toLowerCase();
const isLegalRepresentation = page.includes("legalrepresentation");
    const isDPR = heading && /DPR/i.test(heading.textContent);
    const isCostAudit = page.includes("costaudit");
    const isTrademark = heading && /Trademark/i.test(heading.textContent);

    if (isLegalRepresentation) {
        applyTDSContent(section, service,
            service === 'deduction' ? 'Court Representation' : service === 'filing' ? 'Notice Response' : service === 'advisory' ? 'Compliance Advisory' : service,
            {
                heading: {
                    deduction: 'Court Representation Request',
                    filing: 'Notice Response Request',
                    advisory: 'Compliance Advisory Request'
                },
                description: {
                    deduction: 'Provide case details and hearing information so our legal team can represent you in court or tribunal proceedings.',
                    filing: 'Share the notice details and attachments so we can draft an appropriate response and next steps.',
                    advisory: 'Tell us about your compliance concerns so our legal advisors can propose mitigations and next steps.'
                },
                submit: {
                    deduction: 'Submit Representation Request',
                    filing: 'Submit Notice Response',
                    advisory: 'Submit Advisory Request'
                },
                defaultHeading: 'Legal Representation Application',
                defaultDescription: 'Complete the form below and our team will contact you shortly to start your legal representation.',
                defaultSubmit: 'Submit Representation Request'
            }
        );
    } else if (isDPR) {
        applyTDSContent(section, service,
            service === 'deduction' ? 'DPR Preparation' : service === 'filing' ? 'Feasibility Study' : service === 'advisory' ? 'Funding Advisory' : 'DPR & Fund Syndication',
            {
                heading: {
                    deduction: 'DPR Preparation Request',
                    filing: 'Feasibility Study Request',
                    advisory: 'Funding Advisory Request'
                },
                description: {
                    deduction: 'Provide project name, estimated cost and timeline so we can scope the DPR and resource plan.',
                    filing: 'Share market analysis, financial assumptions and key metrics so we can prepare a feasibility study.',
                    advisory: 'Tell us the funding requirement and investor preferences so we can advise on syndication and pitch preparation.'
                },
                submit: {
                    deduction: 'Submit DPR Request',
                    filing: 'Submit Feasibility Request',
                    advisory: 'Submit Funding Advisory Request'
                },
                defaultHeading: 'DPR & Fund Syndication Application',
                defaultDescription: 'Complete the form below and our team will contact you shortly to start your DPR and funding journey.',
                defaultSubmit: 'Submit DPR Request'
            }
        );
    } else if (isCostAudit) {
        applyTDSContent(section, service,
            service === 'deduction' ? 'Cost Audit' : service === 'filing' ? 'Internal Audit' : service === 'advisory' ? 'Audit Advisory' : 'Audit & Assurance',
            {
                heading: {
                    deduction: 'Cost Audit Request',
                    filing: 'Internal Audit Request',
                    advisory: 'Audit Advisory Request'
                },
                description: {
                    deduction: 'Provide business/project name, total costs and audit period so our team can scope the cost audit and plan sample testing.',
                    filing: 'Share the department or entity, control areas of concern and desired audit frequency so we can scope your internal audit.',
                    advisory: 'Describe the advisory topic, scope and preferred timeline so our experts can recommend the right assurance approach.'
                },
                submit: {
                    deduction: 'Submit Cost Audit Request',
                    filing: 'Submit Internal Audit Request',
                    advisory: 'Submit Advisory Request'
                },
                defaultHeading: 'Audit & Assurance Application',
                defaultDescription: 'Complete the form below and our team will contact you shortly to discuss the audit engagement.',
                defaultSubmit: 'Submit Audit Request'
            }
        );
    } else if (isIncorporation) {
        applyTDSContent(section, service,
            service === 'deduction' ? 'Private Limited Company' : service === 'filing' ? 'LLP / Partnership' : service === 'advisory' ? 'Name Reservation & Compliance' : 'Company Incorporation',
            {
                heading: {
                    deduction: 'Private Limited Company Incorporation Request',
                    filing: 'LLP / Partnership Formation Request',
                    advisory: 'Name Reservation & Compliance Request'
                },
                description: {
                    deduction: 'Submit your details for private limited company registration and incorporation document preparation.',
                    filing: 'Share your LLP or partnership formation requirements so we can prepare the incorporation documents.',
                    advisory: 'Tell us about your proposed company name and compliance needs so we can assist with reservation and filings.'
                },
                submit: {
                    deduction: 'Submit Private LTD Request',
                    filing: 'Submit LLP / Partnership Request',
                    advisory: 'Submit Compliance Request'
                },
                defaultHeading: 'Company Incorporation Application',
                defaultDescription: 'Complete the form below and our team will contact you shortly to start your company incorporation process.',
                defaultSubmit: 'Submit Incorporation Request'
            }
        );
    } else if (isTrademark) {
        applyTDSContent(section, service,
            service === 'deduction' ? 'Trademark Filing' : service === 'filing' ? 'Trademark Search' : service === 'advisory' ? 'Trademark Opposition' : 'Trademark Registration',
            {
                heading: {
                    deduction: 'Trademark Filing Request',
                    filing: 'Trademark Search Request',
                    advisory: 'Trademark Opposition Request'
                },
                description: {
                    deduction: 'Provide applicant details, trademark name and preferred classes so we can prepare and file your trademark application.',
                    filing: 'Share the mark, goods/services and preferred territory so we can perform a thorough clearance search and advise on registrability.',
                    advisory: 'Provide the opposed mark and grounds for opposition so our counsel can draft a response or advise on prosecution strategy.'
                },
                submit: {
                    deduction: 'Submit Filing Request',
                    filing: 'Submit Search Request',
                    advisory: 'Submit Opposition Request'
                },
                defaultHeading: 'Trademark Application',
                defaultDescription: 'Complete the form below and our team will contact you shortly to assist with your trademark needs.',
                defaultSubmit: 'Submit Trademark Request'
            }
        );
    } else {
        if (serviceInput) serviceInput.value = service === 'deduction' ? 'TDS Deduction' : service === 'filing' ? 'TDS Filing' : service === 'advisory' ? 'TDS Advisory' : service;
    }

    setTimeout(() => {
        window.scrollTo({
            top: section.offsetTop - 20,
            behavior: "smooth"
        });
    }, 50);
}

const closeTdsBtn = document.getElementById("close-tds-form");
if (closeTdsBtn) {
    closeTdsBtn.addEventListener("click", () => {
        const section = document.getElementById("tds-form");
        if (!section) return;

        section.classList.add(
            "opacity-0",
            "-translate-y-10",
            "pointer-events-none",
            "max-h-0"
        );

        section.style.maxHeight = null;
    });
}