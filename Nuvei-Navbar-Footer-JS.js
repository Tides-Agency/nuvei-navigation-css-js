<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {
  
  // Lottie icons
  function setupLottieEventListeners() {
    // Check if viewport width is greater than or equal to 992px
    if (window.innerWidth >= 992) {
      const parentLinks = document.getElementsByClassName("navbar_dropdown-content_dropdown-lottie-link");
      const parentLinksArray = Array.from(parentLinks);

      parentLinksArray.forEach((parentLink) => {
        const lottiePlayer = parentLink.querySelector(".nav-animated-icon");

        parentLink.addEventListener("mouseenter", () => {
          lottiePlayer.play();
        });

        parentLink.addEventListener("mouseleave", () => {
          lottiePlayer.stop();
        });
      });
    }
  }

  // Call the function when the document is ready
  setupLottieEventListeners();

  //Navigation
  const navigation = document.querySelector(".navbar_component");
  const navWrappper = document.querySelector(".nav_wrapper");
  const navLinks = document.querySelectorAll(".nav_link");
  const navContent = document.querySelectorAll(".nav_link-content-wrap");
  const navContentWrap = document.querySelector(".nav_link-content-outer-wrap");
  const navContentInnerWrap = document.querySelector(".nav_link-content-inner-wrap");
  const navRightMenu = document.querySelector(".navbar_menu-right");
  const navMenuBtn = document.querySelector(".navbar_menu-button.w-nav-button");
  //Nav mobile dropdown
  const mobileDdLinks = document.querySelectorAll(".nav_mob-link");

  //Add active class and aria-expanded true to the link
  function activeLink(link) {
    link.classList.add("is-active");
    link.setAttribute("aria-expanded", "true");
  }

  //Remove active class and aria-expanded true from the link
  function removeActiveLink(link) {
    link.classList.remove("is-active");
    link.setAttribute("aria-expanded", "false");
  }

  // Reveal dropdown with optional focus
  function revealDropdown(currentContent, shouldFocus) {
    gsap.to([navContentWrap, navContentInnerWrap], {
      autoAlpha: 1,
      duration: 0.1,
    });
    gsap.to(".nav-blur-main", {
      autoAlpha: 1,
    });
    gsap.set(navContent, {
      autoAlpha: 0,
    });
    gsap.to(".nav_pad", {
      height: currentContent.offsetHeight,
      duration: 0.1,
    });
    gsap.to(currentContent, {
      autoAlpha: 1,
      onComplete: function () {
        if (shouldFocus) {
          const firstLink = currentContent.querySelector(
            ".navbar_dropdown-content_dropdown-link, .navbar_dropdown-content_dropdown-lottie-link"
          );
          if (firstLink) {
            firstLink.focus();
          }
        }
      },
    });
  }

  // Switch dropdown content between hovered links
  let switchDropdownTimer; // Define a timer for switchDropdown function
  function switchDropdown(currentContent, prevContent) {
    clearTimeout(switchDropdownTimer); // Clear any previous timer
    switchDropdownTimer = setTimeout(() => {
      gsap.to(navContentWrap, {
        opacity: 1,
        duration: 0,
      });
      gsap.to(".nav-blur-main", {
        autoAlpha: 1,
      });
      gsap.to(prevContent, {
        autoAlpha: 0,
        duration: 0,
      });
      gsap.to(".nav_pad", {
        height: currentContent.offsetHeight,
        duration: 0.1,
      });
      gsap.to(currentContent, {
        autoAlpha: 1,
        duration: 0.1,
      });
    }, 50);
  }

  // Initial state for nav elements
  function initialState() {
    if (window.getComputedStyle(navMenuBtn, null).display == "none") {
      gsap.set(navContentWrap, {
        opacity: 0,
      });
      gsap.set(navContent, {
        autoAlpha: 0,
        opacity: 0,
      });
    }
    gsap.to(".nav-blur-main", {
      autoAlpha: 0,
    });
    gsap.to(".nav_pad", {
      height: 0,
      duration: 0.2,
    });
  }

  // Set initial states
  initialState();

  let timer;
  let isHovering = false;

  if (window.getComputedStyle(navMenuBtn, null).display == "none") {
    navLinks.forEach((link, i) => {
      // Mouseenter event
      link.addEventListener("mouseenter", function () {
        isHovering = true;
        clearTimeout(timer);
        let previousLinks = [...navLinks].map((item) => {
          return item.classList.contains("is-active");
        });
        let checkPrev = previousLinks.filter((item) => !!item);
        let prevIndex = previousLinks.indexOf(true);
        if (checkPrev.length === 0) {
          gsap.killTweensOf([navContent, navContent[i], ".nav-blur-main", ".nav_pad"]);
          revealDropdown(navContent[i], false);
        }
        if (checkPrev.length > 0) {
          gsap.killTweensOf([navContent, ".nav-blur-main", ".nav_pad"]);
          switchDropdown(navContent[i], navContent[prevIndex]);
          removeActiveLink(navLinks[prevIndex]);
        }
      });

      // Accessibility
      link.addEventListener("keydown", function (e) {
        const firstDdItem = navContent[i].querySelector("a");
        const ddItems = navContent[i].querySelectorAll("a");
        const lastDdItem = ddItems[ddItems.length - 1];

        // On press Enter key
        if (e.key === "Enter") {
          revealDropdown(navContent[i], true);
        }
        // On press Tab key
        if (e.key === "Tab") {
          setTimeout(function () {
            firstDdItem.focus();
          }, 50);

          // Add listener to the last item in dropdown
          lastDdItem.addEventListener("keydown", function (event) {
            if (event.key === "Tab") {
              setTimeout(function () {
                initialState();
                link.nextElementSibling.focus();
              }, 50);
            }
          });
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          link.nextElementSibling.focus();
        }
      });
    });

    navigation.addEventListener("mouseout", function (event) {
      // Check if the mouse has moved to an element outside the nav
      if (!navigation.contains(event.relatedTarget)) {
        isHovering = false;
        initialState();

        timer = setTimeout(() => {
          if (!isHovering) {
            initialState();
          }
        }, 100);
      }
    });

    navRightMenu.addEventListener("mouseenter", function (event) {
      isHovering = false;
      initialState();

      timer = setTimeout(() => {
        if (!isHovering) {
          initialState();
        }
      }, 100);
    });

    //Close dropdown on press Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        navLinks.forEach((link) => link.blur());
        initialState();
        navLinks[0].focus();
      }
    });
  } else {
    mobileDdLinks.forEach((link) => {
      const ddMenu = link.parentElement.querySelector(".navbar_dropdown-content");
      const content = ddMenu.querySelector(".navbar_dropdown-content-inner");

      let dropdownTl = gsap.timeline({ reversed: true, paused: true });

      dropdownTl.to(content, {
        height: "auto",
        willChange: "transform",
      });

      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdownTl.reversed() ? dropdownTl.play() : dropdownTl.reverse();

        ddMenu.classList.toggle("is-active");
        link.classList.toggle("is-active");
      });
    });
  }

  // Stop body scroll when full menu is open
  const body = document.body;
  function letBodyScroll(bool) {
    if (bool) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }
  const targetNode = document.querySelector(".navbar_menu-button");
  const config = { attributes: true, childList: false, subtree: false };
  const callback = function (mutationsList, observer) {
    for (let i = 0; i < mutationsList.length; i++) {
      if (mutationsList[i].type === "attributes") {
        const menuIsOpen = mutationsList[i].target.classList.contains("w--open");
        letBodyScroll(menuIsOpen);
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

});
</script>