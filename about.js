
/* =========================================
   NOURA BINTANG — ABOUT PAGE JAVASCRIPT
   Independent About Navigation
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // About-specific navigation elements
    const header = document.querySelector(".about-header");
    const menuToggle = document.getElementById("about-menu-toggle");
    const mainNav = document.getElementById("about-nav");

    // Footer year
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* =========================================
       ABOUT MOBILE NAVIGATION
    ========================================= */

    if (menuToggle && mainNav) {
        function setMenuOpen(isOpen) {
            mainNav.classList.toggle("is-open", isOpen);
            menuToggle.classList.toggle("is-open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        }

        // Toggle burger menu
        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = mainNav.classList.contains("is-open");
            setMenuOpen(!isOpen);
        });

        // Close menu after clicking a navigation link
        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                setMenuOpen(false);
            });
        });

        // Close menu when clicking outside the header
        document.addEventListener("click", (event) => {
            if (
                !header?.contains(event.target) &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        });

        // Close menu with Escape
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        });

        // Close menu when switching back to desktop
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
            "About burger menu not found. Check the HTML IDs:",
            {
                toggle: Boolean(menuToggle),
                navigation: Boolean(mainNav)
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
       SCROLL PROGRESS INDICATOR
    ========================================= */

    let progressBar = document.querySelector(
        ".about-scroll-progress"
    );

    if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.className = "about-scroll-progress";
        progressBar.setAttribute("aria-hidden", "true");
        body.appendChild(progressBar);
    }

    function updateScrollProgress() {
        const scrollableHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progressBar.style.width = `${progress}%`;
    }

    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, {
        passive: true
    });

    window.addEventListener("resize", updateScrollProgress);

    /* =========================================
       SMOOTH SCROLLING FOR IN-PAGE LINKS
    ========================================= */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    /* =========================================
       REVEAL SECTIONS ON SCROLL
    ========================================= */

    const revealElements = document.querySelectorAll(
        [
            ".about-section-heading",
            ".introduction-main",
            ".info-card",
            ".journey-item",
            ".beyond-card",
            ".values-panel",
            ".closing-panel"
        ].join(",")
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        "IntersectionObserver" in window &&
        !reduceMotion
    ) {
        revealElements.forEach((element) => {
            element.classList.add("about-reveal");
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
                rootMargin: "0px 0px -35px 0px"
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
       SUBTLE POINTER EFFECT ON CARDS
    ========================================= */

    const interactiveCards = document.querySelectorAll(
        ".beyond-card, .info-card"
    );

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (finePointer && !reduceMotion) {
        interactiveCards.forEach((card) => {
            card.addEventListener("mousemove", (event) => {
                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                card.style.setProperty("--pointer-x", `${x}px`);
                card.style.setProperty("--pointer-y", `${y}px`);
            });

            card.addEventListener("mouseleave", () => {
                card.style.removeProperty("--pointer-x");
                card.style.removeProperty("--pointer-y");
            });
        });
    }

    console.log("Noura About page initialized.");
});
