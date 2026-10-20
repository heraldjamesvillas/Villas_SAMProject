/* ==========================================================================
   SYSADMIN PATH - APPLICATION SCRIPT
   ========================================================================== */

   document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initNavigation();
    initCertFiltersAndSearch();
    initExpandableDetails();
    initSkillsObserver();
    initJourneyPlanner();
    initBackToTop();
  
    // Premium redesign enhancements
    initPremiumBackground();
    initMobileEnhancements();
    initSectionReveal();
  });
  
  
  /* --------------------------------------------------------------------------
     1. HERO TERMINAL TYPEWRITER EFFECT
     -------------------------------------------------------------------------- */
  
  function initTypewriter() {
    const typewriterElem = document.getElementById('hero-typewriter');
  
    if (!typewriterElem) return;
  
    const commands = [
      'tail -f /var/log/sysadmin_career.log',
      'grep -i "SUCCESS" /etc/certifications.conf',
      'ansible-playbook deploy_skills.yml --check',
      'uptime --pretty'
    ];
  
    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 70;
  
    function type() {
      const currentCmd = commands[cmdIndex];
  
      if (isDeleting) {
        typewriterElem.textContent =
          currentCmd.substring(0, charIndex - 1);
  
        charIndex--;
        typeSpeed = 35;
      } else {
        typewriterElem.textContent =
          currentCmd.substring(0, charIndex + 1);
  
        charIndex++;
        typeSpeed = 70;
      }
  
      if (!isDeleting && charIndex === currentCmd.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        cmdIndex = (cmdIndex + 1) % commands.length;
        typeSpeed = 500;
      }
  
      setTimeout(type, typeSpeed);
    }
  
    type();
  }
  
  
  /* --------------------------------------------------------------------------
     2. NAVIGATION & ACTIVE SCROLL INDICATOR
     -------------------------------------------------------------------------- */
  
  function initNavigation() {
    const mobileBtn = document.getElementById('mobile-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
  
    const navLinks = document.querySelectorAll(
      '.desktop-nav .nav-link'
    );
  
    const mobileLinks = document.querySelectorAll(
      '.mobile-nav-link'
    );
  
    const sections = document.querySelectorAll(
      'section[id]'
    );
  
    // Mobile menu
    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => {
        const isExpanded =
          mobileBtn.getAttribute('aria-expanded') === 'true';
  
        mobileBtn.setAttribute(
          'aria-expanded',
          String(!isExpanded)
        );
  
        mobileDrawer.classList.toggle('open');
      });
  
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
  
          mobileBtn.setAttribute(
            'aria-expanded',
            'false'
          );
        });
      });
    }
  
    // Active navigation while scrolling
    window.addEventListener('scroll', () => {
      let current = '';
  
      const scrollPos =
        window.scrollY + 150;
  
      sections.forEach(section => {
        const sectionTop =
          section.offsetTop;
  
        const sectionHeight =
          section.offsetHeight;
  
        if (
          scrollPos >= sectionTop &&
          scrollPos < sectionTop + sectionHeight
        ) {
          current =
            section.getAttribute('id');
        }
      });
  
      navLinks.forEach(link => {
        link.classList.remove('active');
  
        if (
          link.getAttribute('href') ===
          `#${current}`
        ) {
          link.classList.add('active');
        }
      });
    });
  }
  
  
  /* --------------------------------------------------------------------------
     3. CERTIFICATION FILTERING & LIVE SEARCH
     -------------------------------------------------------------------------- */
  
  function initCertFiltersAndSearch() {
    const filterBtns =
      document.querySelectorAll('.filter-btn');
  
    const searchInput =
      document.getElementById('cert-search-input');
  
    const certCards =
      document.querySelectorAll('.cert-card');
  
    let activeFilter = 'all';
    let searchQuery = '';
  
    function filterCards() {
      certCards.forEach(card => {
        const tags =
          card.getAttribute('data-tags')
            ? card
                .getAttribute('data-tags')
                .toLowerCase()
            : '';
  
        const level =
          card.getAttribute('data-level')
            ? card
                .getAttribute('data-level')
                .toLowerCase()
            : '';
  
        const cardText =
          card.textContent.toLowerCase();
  
        const matchesFilter =
          activeFilter === 'all' ||
          level.includes(activeFilter) ||
          tags.includes(activeFilter);
  
        const matchesSearch =
          searchQuery === '' ||
          cardText.includes(searchQuery);
  
        if (matchesFilter && matchesSearch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
  
    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
        });
  
        btn.classList.add('active');
  
        activeFilter =
          (
            btn.getAttribute('data-filter') ||
            'all'
          ).toLowerCase();
  
        filterCards();
      });
    });
  
    // Search
    if (searchInput) {
      searchInput.addEventListener(
        'input',
        event => {
          searchQuery =
            event.target.value
              .toLowerCase()
              .trim();
  
          filterCards();
        }
      );
    }
  }
  
  
  /* --------------------------------------------------------------------------
     4. EXPANDABLE CERTIFICATION DETAILS
     -------------------------------------------------------------------------- */
  
  function initExpandableDetails() {
    const toggleBtns =
      document.querySelectorAll(
        '.btn-toggle-details'
      );
  
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId =
          btn.getAttribute('data-target');
  
        const detailsElem =
          document.getElementById(targetId);
  
        if (!detailsElem) return;
  
        const isOpen =
          detailsElem.classList.contains('open');
  
        // Close all other details
        document
          .querySelectorAll('.expandable-details')
          .forEach(el => {
            el.classList.remove('open');
          });
  
        document
          .querySelectorAll('.btn-toggle-details')
          .forEach(button => {
            button.classList.remove('active');
          });
  
        // Open selected detail
        if (!isOpen) {
          detailsElem.classList.add('open');
          btn.classList.add('active');
        }
      });
    });
  }
  
  
  /* --------------------------------------------------------------------------
     5. SKILL BARS ANIMATION
     -------------------------------------------------------------------------- */
  
  function initSkillsObserver() {
    const skillsContainer =
      document.getElementById(
        'skills-bars-container'
      );
  
    const skillBarItems =
      document.querySelectorAll(
        '.skill-bar-item'
      );
  
    if (!skillsContainer) return;
  
    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      skillBarItems.forEach(item => {
        const percent =
          item.getAttribute('data-percent');
  
        const fillBar =
          item.querySelector('.bar-fill');
  
        if (fillBar) {
          fillBar.style.width =
            `${percent}%`;
        }
      });
  
      return;
    }
  
    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
  
            skillBarItems.forEach(item => {
              const percent =
                item.getAttribute('data-percent');
  
              const fillBar =
                item.querySelector('.bar-fill');
  
              if (fillBar) {
                fillBar.style.width =
                  `${percent}%`;
              }
            });
  
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.3
        }
      );
  
    observer.observe(skillsContainer);
  }
  
  
  /* --------------------------------------------------------------------------
     6. INTERACTIVE CAREER JOURNEY PLANNER
     -------------------------------------------------------------------------- */
  
  function initJourneyPlanner() {
    const optionBtns =
      document.querySelectorAll(
        '.planner-opt-btn'
      );
  
    const resultBox =
      document.getElementById(
        'planner-result'
      );
  
    const pathRecommendations = {
  
      newbie: {
        title:
          'RECOMMENDED PATH: CompTIA A+ & Fundamental Support',
  
        desc:
          'Start by building core knowledge of desktop hardware, OS installation (Windows & Linux), and helpdesk support procedures.',
  
        steps: [
          '1. Study CompTIA A+ core objectives',
          '2. Build a local virtual lab using VirtualBox',
          '3. Apply for entry-level IT Support / Helpdesk roles'
        ]
      },
  
      basics: {
        title:
          'RECOMMENDED PATH: Networking Fundamentals (CompTIA Network+)',
  
        desc:
          'You have basic hardware literacy. Now focus on understanding IP addressing, subnetting, VLANs, and firewall mechanics.',
  
        steps: [
          '1. Prep for CompTIA Network+',
          '2. Practice Wireshark packet inspection',
          '3. Configure basic home/lab routers and switches'
        ]
      },
  
      network: {
        title:
          'RECOMMENDED PATH: Linux System Administration (RHCSA)',
  
        desc:
          'Networking skills provide an ideal bridge into server administration. Target enterprise Linux systems management.',
  
        steps: [
          '1. Install RHEL or AlmaLinux on a server/VM',
          '2. Learn CLI administration, systemd, and LVM storage',
          '3. Work toward Red Hat Certified System Administrator (RHCSA)'
        ]
      },
  
      linux: {
        title:
          'RECOMMENDED PATH: Infrastructure Automation & Hardening',
  
        desc:
          'Advance from standard administration to automated infrastructure management and cluster maintenance.',
  
        steps: [
          '1. Learn Bash scripting and Ansible automation',
          '2. Study CompTIA Security+ for system hardening',
          '3. Explore containerization with Docker and Podman'
        ]
      },
  
      security: {
        title:
          'RECOMMENDED PATH: Security Administrator / Hardening Specialist',
  
        desc:
          'Combine SysAdmin fundamentals with defensive security, access control, and vulnerability management.',
  
        steps: [
          '1. Earn CompTIA Security+',
          '2. Implement IAM, SELinux enforcement, and firewall policies',
          '3. Practice log analysis with SIEM tools (e.g., Elastic Stack)'
        ]
      }
  
    };
  
    function updateResult(pathKey) {
      const rec =
        pathRecommendations[pathKey];
  
      if (!rec || !resultBox) return;
  
      resultBox.innerHTML = `
        <h4>${rec.title}</h4>
  
        <p style="
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        ">
          ${rec.desc}
        </p>
  
        <ul style="
          padding-left: 1.2rem;
          list-style-type: square;
          color: var(--text-secondary);
        ">
          ${rec.steps
            .map(
              step => `
                <li style="
                  margin-bottom: 0.25rem;
                ">
                  ${step}
                </li>
              `
            )
            .join('')}
        </ul>
      `;
    }
  
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
  
        optionBtns.forEach(b => {
          b.classList.remove('active');
        });
  
        btn.classList.add('active');
  
        const pathKey =
          btn.getAttribute('data-path');
  
        updateResult(pathKey);
      });
    });
  
    // Default
    updateResult('newbie');
  }
  
  
  /* --------------------------------------------------------------------------
     7. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  
  function initBackToTop() {
    const backToTopBtn =
      document.getElementById(
        'back-to-top'
      );
  
    if (!backToTopBtn) return;
  
    function updateBackToTop() {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add(
          'visible'
        );
      } else {
        backToTopBtn.classList.remove(
          'visible'
        );
      }
    }
  
    window.addEventListener(
      'scroll',
      updateBackToTop,
      { passive: true }
    );
  
    backToTopBtn.addEventListener(
      'click',
      () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    );
  
    updateBackToTop();
  }
  
  
  /* --------------------------------------------------------------------------
     8. PREMIUM BACKGROUND VIDEO
     -------------------------------------------------------------------------- */
  
  function initPremiumBackground() {
    const video =
      document.querySelector(
        '.background-video'
      );
  
    const particleHost =
      document.getElementById(
        'bg-particles'
      );
  
    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
  
    /*
     * Background video
     */
    if (video) {
      video.muted = true;
      video.playsInline = true;
  
      const playVideo = () => {
        const playPromise =
          video.play();
  
        if (
          playPromise &&
          typeof playPromise.catch ===
            'function'
        ) {
          playPromise.catch(() => {
            // Browser may block autoplay.
            // Video remains available as background.
          });
        }
      };
  
      video.addEventListener(
        'canplay',
        playVideo,
        { once: true }
      );
  
      playVideo();
  
      // Try again when the page becomes visible
      document.addEventListener(
        'visibilitychange',
        () => {
          if (
            document.visibilityState ===
            'visible'
          ) {
            playVideo();
          }
        }
      );
    }
  
    /*
     * Stop here if reduced motion is enabled.
     */
    if (
      !particleHost ||
      reduceMotion
    ) {
      return;
    }
  
    /*
     * Number of particles depending
     * on screen size.
     */
    const width =
      window.innerWidth;
  
    const count =
      width <= 480
        ? 12
        : width <= 900
          ? 18
          : 28;
  
    const fragment =
      document.createDocumentFragment();
  
    for (
      let i = 0;
      i < count;
      i++
    ) {
      const particle =
        document.createElement(
          'span'
        );
  
      particle.className =
        'bg-particle';
  
      particle.style.setProperty(
        '--x',
        `${Math.random() * 100}%`
      );
  
      particle.style.setProperty(
        '--y',
        `${Math.random() * 100}%`
      );
  
      particle.style.setProperty(
        '--size',
        `${1 + Math.random() * 2.5}px`
      );
  
      particle.style.setProperty(
        '--delay',
        `${Math.random() * 8}s`
      );
  
      particle.style.setProperty(
        '--duration',
        `${7 + Math.random() * 9}s`
      );
  
      fragment.appendChild(
        particle
      );
    }
  
    particleHost.appendChild(
      fragment
    );
  }
  
  
  /* --------------------------------------------------------------------------
     9. MOBILE ACCESSIBILITY ENHANCEMENTS
     -------------------------------------------------------------------------- */
  
  function initMobileEnhancements() {
    const mobileBtn =
      document.getElementById(
        'mobile-toggle-btn'
      );
  
    const mobileDrawer =
      document.getElementById(
        'mobile-drawer'
      );
  
    if (
      !mobileBtn ||
      !mobileDrawer
    ) {
      return;
    }
  
    /*
     * Close mobile menu with ESC.
     */
    document.addEventListener(
      'keydown',
      event => {
        if (
          event.key === 'Escape' &&
          mobileDrawer.classList.contains(
            'open'
          )
        ) {
          mobileDrawer.classList.remove(
            'open'
          );
  
          mobileBtn.setAttribute(
            'aria-expanded',
            'false'
          );
        }
      }
    );
  
    /*
     * Close mobile menu when resizing
     * back to desktop.
     */
    window.addEventListener(
      'resize',
      () => {
        if (
          window.innerWidth > 900 &&
          mobileDrawer.classList.contains(
            'open'
          )
        ) {
          mobileDrawer.classList.remove(
            'open'
          );
  
          mobileBtn.setAttribute(
            'aria-expanded',
            'false'
          );
        }
      }
    );
  }
  
  
  /* --------------------------------------------------------------------------
     10. SECTION REVEAL ANIMATIONS
     -------------------------------------------------------------------------- */
  
  function initSectionReveal() {
  
    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
  
    const targets =
      document.querySelectorAll(
        [
          '.section-header',
          '.cert-card',
          '.resource-card',
          '.skill-detail-card',
          '.roadmap-node',
          '.journey-planner',
          '.about-card',
          '.comparison-wrapper'
        ].join(', ')
      );
  
    /*
     * If reduced motion is enabled,
     * show everything immediately.
     */
    if (reduceMotion) {
      targets.forEach(element => {
        element.classList.add(
          'is-visible'
        );
      });
  
      return;
    }
  
    /*
     * Browser fallback.
     */
    if (
      !('IntersectionObserver' in window)
    ) {
      targets.forEach(element => {
        element.classList.add(
          'is-visible'
        );
      });
  
      return;
    }
  
    const observer =
      new IntersectionObserver(
        (entries, obs) => {
  
          entries.forEach(entry => {
  
            if (
              !entry.isIntersecting
            ) {
              return;
            }
  
            entry.target.classList.add(
              'is-visible'
            );
  
            obs.unobserve(
              entry.target
            );
          });
  
        },
        {
          threshold: 0.08,
  
          rootMargin:
            '0px 0px -40px 0px'
        }
      );
  
    targets.forEach(element => {
      observer.observe(element);
    });
  }
  
  
  /* --------------------------------------------------------------------------
     11. SMOOTH INTERNAL NAVIGATION
     -------------------------------------------------------------------------- */
  
  function initSmoothNavigation() {
    const links =
      document.querySelectorAll(
        'a[href^="#"]'
      );
  
    links.forEach(link => {
  
      link.addEventListener(
        'click',
        event => {
  
          const targetId =
            link.getAttribute(
              'href'
            );
  
          if (
            !targetId ||
            targetId === '#'
          ) {
            return;
          }
  
          const target =
            document.querySelector(
              targetId
            );
  
          if (!target) {
            return;
          }
  
          event.preventDefault();
  
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
  
        }
      );
  
    });
  }
  
  
  /* --------------------------------------------------------------------------
     12. CARD MICRO-INTERACTIONS
     -------------------------------------------------------------------------- */
  
  function initCardInteractions() {
  
    const cards =
      document.querySelectorAll(
        '.cert-card, .resource-card, .skill-detail-card, .about-card'
      );
  
    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return;
    }
  
    cards.forEach(card => {
  
      card.addEventListener(
        'mousemove',
        event => {
  
          const rect =
            card.getBoundingClientRect();
  
          const x =
            event.clientX -
            rect.left;
  
          const y =
            event.clientY -
            rect.top;
  
          const rotateX =
            ((y / rect.height) - 0.5) * -2;
  
          const rotateY =
            ((x / rect.width) - 0.5) * 2;
  
          card.style.setProperty(
            '--mouse-x',
            `${x}px`
          );
  
          card.style.setProperty(
            '--mouse-y',
            `${y}px`
          );
  
          card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-3px)`;
        }
      );
  
      card.addEventListener(
        'mouseleave',
        () => {
          card.style.transform =
            '';
        }
      );
  
    });
  }
  
  
  /* --------------------------------------------------------------------------
     13. INITIALIZE OPTIONAL ENHANCEMENTS
     -------------------------------------------------------------------------- */
  
  document.addEventListener(
    'DOMContentLoaded',
    () => {
  
      initSmoothNavigation();
      initCardInteractions();
  
    }
  );