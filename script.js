
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    const header = document.querySelector(".site-header");
    const progressBar = document.getElementById("scroll-progress");
    const currentYear = document.getElementById("current-year");

    /* 01. CURRENT YEAR */
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* 02. MOBILE NAVIGATION */
    function closeMenu() {
        if (!menuToggle || !mainNav) return;

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        mainNav.classList.remove("open");
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Open navigation" : "Close navigation"
            );

            mainNav.classList.toggle("open", !isOpen);
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (
                header &&
                !header.contains(event.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    /* 03. HEADER SCROLL EFFECT */
    function updateHeader() {
        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 35
        );
    }

    /* 04. SCROLL PROGRESS */
    function updateScrollProgress() {
        if (!progressBar) return;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = documentHeight > 0
            ? (window.scrollY / documentHeight) * 100
            : 0;

        progressBar.style.width =
            `${Math.min(100, Math.max(0, progress))}%`;
    }

    let scrollScheduled = false;

    function handleScroll() {
        if (scrollScheduled) return;

        scrollScheduled = true;

        window.requestAnimationFrame(() => {
            updateHeader();
            updateScrollProgress();
            scrollScheduled = false;
        });
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    window.addEventListener("resize", updateScrollProgress);

    updateHeader();
    updateScrollProgress();

    /* 05. OPTIONAL IDENTITY CARD TILT */
    const identityCard = document.querySelector(".identity-card");

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (identityCard && finePointer && !reducedMotion) {
        identityCard.addEventListener("pointermove", (event) => {
            const bounds = identityCard.getBoundingClientRect();

            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;

            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            const rotateY = ((x - centerX) / centerX) * 2;
            const rotateX = ((centerY - y) / centerY) * 2;

            identityCard.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        identityCard.addEventListener("pointerleave", () => {
            identityCard.style.transform = "";
        });
    }
});

