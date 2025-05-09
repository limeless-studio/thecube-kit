// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scrolling for Nav Links ---
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate position considering fixed navbar height
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if open
            if (document.getElementById('navLinks').classList.contains('active')) {
                document.getElementById('navLinks').classList.remove('active');
                document.getElementById('menuToggle').setAttribute('aria-expanded', 'false');
                document.getElementById('menuToggle').innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // --- Mobile Navigation Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNavLinks = document.getElementById('navLinks'); // Renamed to avoid conflict

    if (menuToggle && mainNavLinks) {
        menuToggle.addEventListener('click', () => {
            mainNavLinks.classList.toggle('active');
            const isExpanded = mainNavLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            if (isExpanded) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>'; // Change to X icon
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Change back to bars
            }
        });
    }


    // --- "Check Your Time" Modal Logic ---
    const timeModal = document.getElementById('timeModal');
    const openTimeModalBtn = document.getElementById('openTimeModalBtn');
    const closeTimeModalBtn = document.getElementById('closeTimeModalBtn');
    const checkTimeBtn = document.getElementById('checkTimeBtn');
    const operativeIdInput = document.getElementById('operativeId');
    const timeResultDiv = document.getElementById('timeResult');

    if (openTimeModalBtn) {
        openTimeModalBtn.onclick = function() {
            timeModal.classList.add('active');
            operativeIdInput.focus();
        }
    }

    if (closeTimeModalBtn) {
        closeTimeModalBtn.onclick = function() {
            timeModal.classList.remove('active');
            timeResultDiv.innerHTML = 'Awaiting Operative ID...'; // Reset result
            operativeIdInput.value = ''; // Clear input
        }
    }

    // Close modal if clicked outside of modal-content
    window.onclick = function(event) {
        if (event.target == timeModal) {
            timeModal.classList.remove('active');
            timeResultDiv.innerHTML = 'Awaiting Operative ID...';
            operativeIdInput.value = '';
        }
        if (event.target == galleryModal) {
            galleryModal.classList.remove('active');
        }
    }

    // Handle Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            if (timeModal.classList.contains('active')) {
                timeModal.classList.remove('active');
                timeResultDiv.innerHTML = 'Awaiting Operative ID...';
                operativeIdInput.value = '';
            }
            if (galleryModal.classList.contains('active')) {
                galleryModal.classList.remove('active');
            }
        }
    });


    if (checkTimeBtn) {
        checkTimeBtn.onclick = async function() {
            const username = operativeIdInput.value.trim();
            if (!username) {
                timeResultDiv.innerHTML = '<p class="error">Please enter an Operative ID.</p>';
                return;
            }

            timeResultDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Querying the Chrono-Stream...';

            // **MOCK FIREBASE INTEGRATION**
            // Replace this with your actual Firebase Cloud Function call
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Mocked responses
                const mockData = {
                    "ChronoAgent42": { hours: 10, minutes: 32, seconds: 15 },
                    "TimeBender007": { hours: 0, minutes: 5, seconds: 59 },
                    "CubeRunnerX": { hours: 100, minutes: 0, seconds: 0 },
                };

                if (mockData[username]) {
                    const timeData = mockData[username];
                    timeResultDiv.innerHTML = `
                        <p class="success">
                            <strong>${username}</strong>, your remaining Chrono-Reserve: <br>
                            <span style="font-size: 1.8rem; color: var(--primary-color); display: block; margin-top: 10px;">
                                ${String(timeData.hours).padStart(2, '0')} Hours 
                                ${String(timeData.minutes).padStart(2, '0')} Minutes 
                                ${String(timeData.seconds).padStart(2, '0')} Seconds
                            </span>
                            <br>(This is your lifeline. Use it wisely.)
                        </p>`;
                } else {
                    timeResultDiv.innerHTML = `
                        <p class="error">
                            OPERATIVE ID <strong>"${username}"</strong> NOT FOUND OR DATA UNAVAILABLE.
                            <br>(Ensure your ID is correct or that you have initiated your journey within The Cube.)
                        </p>`;
                }
            } catch (error) {
                console.error("Error fetching time (mock):", error);
                timeResultDiv.innerHTML = '<p class="error">Error connecting to the Chrono-Core. Please try again later.</p>';
            }
        }
    }

    // --- Gallery Modal Logic ---
    const galleryModal = document.getElementById('galleryModal');
    const closeGalleryModalBtn = document.getElementById('closeGalleryModalBtn');
    const galleryModalContentArea = document.getElementById('galleryModalContentArea');
    const galleryModalCaption = document.getElementById('galleryModalCaption');

    window.openImageModal = function(src, alt) {
        galleryModalContentArea.innerHTML = `<img src="${src}" alt="${alt}">`;
        galleryModalCaption.textContent = alt;
        galleryModal.classList.add('active');
    }

    window.openVideoModal = function(youtubeVideoId) {
        // Ensure you use the YouTube embed URL format
        const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`;
        galleryModalContentArea.innerHTML = `<iframe width="560" height="315" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        galleryModalCaption.textContent = "Game Trailer"; // Or fetch title if needed
        galleryModal.classList.add('active');
    }

    if (closeGalleryModalBtn) {
        closeGalleryModalBtn.onclick = function() {
            galleryModal.classList.remove('active');
            galleryModalContentArea.innerHTML = ''; // Clear content to stop video, etc.
            galleryModalCaption.textContent = '';
        }
    }


    // --- Dynamic Year for Footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id], header[id]'); // Include header for hero
    const navbarHeight = document.getElementById('navbar').offsetHeight;

    function changeNavActiveState() {
        let index = sections.length;

        while(--index && window.scrollY + navbarHeight + 50 < sections[index].offsetTop) {} // 50 is an offset
        
        navLinks.forEach((link) => link.classList.remove('active'));
        // Ensure the link exists before trying to add 'active' class
        const activeLink = document.querySelector(`.nav-link[href="#${sections[index].id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Initial call to set active link on page load (if not at the very top)
    if (window.scrollY > 0) {
       changeNavActiveState();
    }
    window.addEventListener('scroll', changeNavActiveState);

});