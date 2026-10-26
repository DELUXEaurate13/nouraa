
/* =========================================
   NOURA BINTANG — PASSION PAGE JAVASCRIPT
   Independent page interactions
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const header = document.querySelector(".passion-header");
    const menuToggle = document.getElementById("passion-menu-toggle");
    const nav = document.getElementById("passion-nav");
    const yearElement = document.getElementById("passion-current-year");

    /* =========================================
       FOOTER YEAR
    ========================================= */

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* =========================================
       PASSION MOBILE NAVIGATION
    ========================================= */

    function setMenuOpen(isOpen) {
        if (!menuToggle || !nav) return;

        nav.classList.toggle("is-open", isOpen);
        menuToggle.classList.toggle("is-open", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = nav.classList.contains("is-open");
            setMenuOpen(!isOpen);
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                setMenuOpen(false);
            });
        });

        document.addEventListener("click", (event) => {
            if (
                header &&
                !header.contains(event.target) &&
                nav.classList.contains("is-open")
            ) {
                setMenuOpen(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        });

        const mobileQuery = window.matchMedia("(max-width: 900px)");

        function handleBreakpointChange() {
            if (!mobileQuery.matches) {
                setMenuOpen(false);
            }
        }

        if (mobileQuery.addEventListener) {
            mobileQuery.addEventListener(
                "change",
                handleBreakpointChange
            );
        } else {
            mobileQuery.addListener(handleBreakpointChange);
        }
    } else {
        console.warn(
            "Passion navigation could not initialize.",
            {
                headerFound: Boolean(header),
                toggleFound: Boolean(menuToggle),
                navFound: Boolean(nav)
            }
        );
    }

    /* =========================================
       HEADER SCROLL EFFECT
    ========================================= */

    function updateHeader() {
        if (!header) return;

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 20
        );
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    /* =========================================
       SCROLL PROGRESS
    ========================================= */

    let progressBar = document.querySelector(
        ".passion-scroll-progress"
    );

    if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.className = "passion-scroll-progress";
        progressBar.setAttribute("aria-hidden", "true");
        document.body.appendChild(progressBar);
    }

    function updateProgress() {
        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = documentHeight > 0
            ? (window.scrollY / documentHeight) * 100
            : 0;

        progressBar.style.width = `${progress}%`;
    }

    updateProgress();

    window.addEventListener("scroll", updateProgress, {
        passive: true
    });

    window.addEventListener("resize", updateProgress);

    /* =========================================
       SMOOTH SCROLL
    ========================================= */

    document.querySelectorAll('.passion-page a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    /* =========================================
       REVEAL ELEMENTS ON SCROLL
    ========================================= */

    const revealElements = document.querySelectorAll(
        ".passion-reveal"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        "IntersectionObserver" in window &&
        !reducedMotion
    ) {
        revealElements.forEach((element) => {
            element.classList.remove("is-visible");
        });

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }

    /* =========================================
       OPTIONAL CARD POINTER LIGHT
    ========================================= */

    const cards = document.querySelectorAll(
        ".passion-interest-card"
    );

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (finePointer && !reducedMotion) {
        cards.forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                card.style.setProperty("--pointer-x", `${x}px`);
                card.style.setProperty("--pointer-y", `${y}px`);
            });

            card.addEventListener("pointerleave", () => {
                card.style.removeProperty("--pointer-x");
                card.style.removeProperty("--pointer-y");
            });
        });
    }

    console.log("Noura Passion page initialized.");
});
