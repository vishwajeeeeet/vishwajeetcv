// Portfolio JavaScript Interactions

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Custom Mouse Cursor ---
  const cursor = document.querySelector(".custom-cursor");
  const cursorDot = document.querySelector(".custom-cursor-dot");

  if (cursor && cursorDot) {
    let isVisible = false;

    window.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;

      if (!isVisible) {
        cursor.style.display = "block";
        cursorDot.style.display = "block";
        isVisible = true;
      }
    });

    window.addEventListener("mousedown", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
    });

    window.addEventListener("mouseup", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.display = "none";
      cursorDot.style.display = "none";
      isVisible = false;
    });

    // Add Hover Listeners for Interactive Items
    const setupCursorHover = () => {
      const interactives = document.querySelectorAll("a, button, input, textarea, .filter-btn, .clickable");
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.style.width = "32px";
          cursor.style.height = "32px";
          cursor.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
          cursor.style.borderColor = "#38BDF8";
        });
        el.addEventListener("mouseleave", () => {
          cursor.style.width = "20px";
          cursor.style.height = "20px";
          cursor.style.backgroundColor = "transparent";
          cursor.style.borderColor = "rgba(96, 165, 250, 0.8)";
        });
      });
    };
    setupCursorHover();

    // Re-run listener on DOM mutations
    const observer = new MutationObserver(setupCursorHover);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // --- 2. Floating Canvas Particles System ---
  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 15), 70);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    drawParticles();
  }

  // --- 3. Typewriter Effect ---
  const roles = [
    "BCA Student",
    "IT Support Candidate",
    "Python Developer",
    "Web Developer",
    "Linux Hobbyist",
  ];
  const typeText = document.getElementById("typewriter-text");
  if (typeText) {
    let roleIdx = 0;
    let currentText = "";
    let isDeleting = false;
    
    const typeCycle = () => {
      const currentRole = roles[roleIdx];
      
      if (!isDeleting) {
        currentText = currentRole.substring(0, currentText.length + 1);
      } else {
        currentText = currentRole.substring(0, currentText.length - 1);
      }

      typeText.textContent = currentText;

      let typingSpeed = isDeleting ? 30 : 70;

      if (!isDeleting && currentText === currentRole) {
        typingSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
      }

      setTimeout(typeCycle, typingSpeed);
    };
    setTimeout(typeCycle, 500);
  }

  // --- 4. Sticky Navbar & Scroll Progress ---
  const navbar = document.getElementById("navbar");
  const scrollFill = document.querySelector(".scroll-progress-fill");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    
    // 1. Scroll Progress
    const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScrollHeight > 0 && scrollFill) {
      const percentage = (currentScrollY / totalScrollHeight) * 100;
      scrollFill.style.width = `${percentage}%`;
    }

    // 2. Hide / Show navbar on scroll
    if (navbar) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.classList.add("nav-hidden");
      } else {
        navbar.classList.remove("nav-hidden");
      }
      if (currentScrollY > 20) {
        navbar.classList.add("shadow-lg");
        navbar.style.background = "rgba(11, 17, 32, 0.85)";
      } else {
        navbar.classList.remove("shadow-lg");
        navbar.style.background = "rgba(11, 17, 32, 0.75)";
      }
    }
    lastScrollY = currentScrollY;

    // 3. Active Nav Links Indicator
    const sections = ["hero", "about", "skills", "projects", "education", "contact"];
    sections.forEach((secId) => {
      const sec = document.getElementById(secId);
      if (sec) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom >= 160) {
          const activeLink = document.querySelector(`.nav-link[href="#${secId}"]`);
          document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"));
          if (activeLink) activeLink.classList.add("active");
        }
      }
    });
  }, { passive: true });

  // --- 5. Projects Filter ---
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card-col");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (category === "all" || cardCategory === category) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // --- 6. Command Palette Overlay (Ctrl + K) ---
  const cmdOverlay = document.querySelector(".cmd-palette-overlay");
  const cmdInput = document.querySelector(".cmd-input");
  const cmdCloseBtn = document.querySelector(".cmd-close-btn");
  const cmdResults = document.querySelector(".cmd-results");

  const paletteItems = [
    { name: "Navigate to Home", category: "Navigation", action: () => document.getElementById("hero").scrollIntoView() },
    { name: "Navigate to About Me", category: "Navigation", action: () => document.getElementById("about").scrollIntoView() },
    { name: "Navigate to Technical Skills", category: "Navigation", action: () => document.getElementById("skills").scrollIntoView() },
    { name: "Navigate to Projects", category: "Navigation", action: () => document.getElementById("projects").scrollIntoView() },
    { name: "Navigate to Education", category: "Navigation", action: () => document.getElementById("education").scrollIntoView() },
    { name: "Navigate to Contact Form", category: "Navigation", action: () => document.getElementById("contact").scrollIntoView() },
    { name: "Open Direct Email Client", category: "Actions", action: () => window.open("mailto:velipvishwajeet7@gmail.com") },
  ];

  const renderPaletteResults = (query = "") => {
    if (!cmdResults) return;
    cmdResults.innerHTML = "";

    const filtered = paletteItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) || 
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      cmdResults.innerHTML = `
        <div class="text-center py-4 text-muted font-monospace" style="font-size: 0.8rem;">
          No matching commands found.
        </div>
      `;
      return;
    }

    filtered.forEach((item, idx) => {
      const button = document.createElement("button");
      button.className = "cmd-item" + (idx === 0 ? " selected" : "");
      button.innerHTML = `
        <span>${item.name}</span>
        <span class="cmd-badge">${item.category}</span>
      `;
      button.addEventListener("click", () => {
        item.action();
        closePalette();
      });
      cmdResults.appendChild(button);
    });
  };

  const openPalette = () => {
    if (cmdOverlay) {
      cmdOverlay.style.display = "flex";
      document.body.style.overflow = "hidden";
      setTimeout(() => cmdInput && cmdInput.focus(), 50);
      renderPaletteResults("");
    }
  };

  const closePalette = () => {
    if (cmdOverlay) {
      cmdOverlay.style.display = "none";
      document.body.style.overflow = "";
      if (cmdInput) cmdInput.value = "";
    }
  };

  // Trigger keyboard listener
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (cmdOverlay && cmdOverlay.style.display === "flex") {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === "Escape") {
      closePalette();
    }
  });

  if (cmdCloseBtn) cmdCloseBtn.addEventListener("click", closePalette);
  if (cmdOverlay) {
    cmdOverlay.addEventListener("click", (e) => {
      if (e.target === cmdOverlay) closePalette();
    });
  }
  if (cmdInput) {
    cmdInput.addEventListener("input", (e) => {
      renderPaletteResults(e.target.value);
    });
  }

  // --- 7. Contact Form Submission ---
  const contactForm = document.getElementById("contact-form");
  const toast = document.querySelector(".alert-toast");
  const contactStatus = document.getElementById("contact-status");

  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const requestIdInput = document.getElementById("contact-request-id");
    const originalButtonText = submitBtn.innerHTML;
    let activeRequestId = null;
    let submissionTimeout;
    let toastTimeout;

    const setContactStatus = (message, isError = false) => {
      if (!contactStatus) return;
      contactStatus.textContent = message;
      contactStatus.classList.toggle("text-danger", isError);
      contactStatus.classList.toggle("text-success", !isError);
    };

    const createRequestId = () => {
      const bytes = new Uint8Array(16);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(bytes);
      } else {
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = Math.floor(Math.random() * 256);
        }
      }

      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
      return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
    };

    window.addEventListener("message", (event) => {
      const response = event.data;
      if (
        !response ||
        response.source !== "portfolio-contact" ||
        response.requestId !== activeRequestId
      ) {
        return;
      }

      clearTimeout(submissionTimeout);
      activeRequestId = null;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalButtonText;
      requestIdInput.value = "";

      if (!response.success) {
        setContactStatus("Your message could not be saved. Please try again later.", true);
        return;
      }

      contactForm.reset();
      setContactStatus("Thanks! Your message has been saved.", false);

      if (toast) {
        toast.querySelector("span").textContent = "Message saved successfully!";
        toast.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove("show"), 4500);
      }
    });

    contactForm.addEventListener("submit", (event) => {
      const endpoint = contactForm.dataset.endpoint.trim();
      let endpointUrl;

      try {
        endpointUrl = new URL(endpoint);
      } catch {
        event.preventDefault();
        setContactStatus("The contact form is not configured yet. Please try again later.", true);
        return;
      }

      if (
        endpointUrl.protocol !== "https:" ||
        endpointUrl.hostname !== "script.google.com" ||
        !/^\/macros\/s\/[^/]+\/exec$/.test(endpointUrl.pathname)
      ) {
        event.preventDefault();
        setContactStatus("The contact form endpoint is invalid. Please try again later.", true);
        return;
      }

      activeRequestId = createRequestId();
      requestIdInput.value = activeRequestId;
      contactForm.action = endpointUrl.href;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>Sending...</span>";
      setContactStatus("Sending your message...", false);

      submissionTimeout = setTimeout(() => {
        activeRequestId = null;
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;
        requestIdInput.value = "";
        setContactStatus(
          "We could not confirm whether your message was saved. Please wait before trying again.",
          true
        );
      }, 20000);
    });
  }

});
