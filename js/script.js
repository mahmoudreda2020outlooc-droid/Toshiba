document.addEventListener('DOMContentLoaded', () => {

    // 0. Password Protection
    const passwordOverlay = document.getElementById('password-overlay');
    const sitePasswordInput = document.getElementById('site-password');
    const unlockBtn = document.getElementById('unlock-btn');
    const passwordError = document.getElementById('password-error');


    // Check if already unlocked in this session
    if (sessionStorage.getItem('site_unlocked') === 'true') {
        if (passwordOverlay) passwordOverlay.style.display = 'none';
    }

    const verifyPassword = async () => {
        const password = sitePasswordInput.value;

        // Disable input and button while loading
        sitePasswordInput.disabled = true;
        unlockBtn.disabled = true;
        unlockBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحقق...';

        try {
            const response = await fetch('/api/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem('site_unlocked', 'true');
                if (passwordOverlay) {
                    passwordOverlay.style.opacity = '0';
                    setTimeout(() => {
                        passwordOverlay.style.display = 'none';
                    }, 500);
                }
                passwordError.style.display = 'none';
            } else {
                throw new Error('Invalid password');
            }
        } catch (error) {
            passwordError.style.display = 'block';
            sitePasswordInput.value = '';
            sitePasswordInput.disabled = false;
            unlockBtn.disabled = false;
            unlockBtn.innerHTML = 'دخول <i class="fa-solid fa-right-to-bracket"></i>';
            sitePasswordInput.focus();

            // Shake effect
            const card = document.querySelector('.password-card');
            if (card) {
                card.style.animation = 'none';
                void card.offsetWidth; // trigger reflow
                card.style.animation = 'shake 0.4s ease-in-out';
            }
        }
    };


    if (unlockBtn) {
        unlockBtn.addEventListener('click', verifyPassword);
    }

    if (sitePasswordInput) {
        sitePasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyPassword();
        });
    }


    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle display block/none
            if (window.getComputedStyle(navLinks).display === 'none') {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'var(--background-white)';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = 'var(--shadow-md)';
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } else {
                navLinks.style.display = 'none';
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    navLinks.style.display = 'none';
                    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            });
        });
    }

    // Fix navbar display on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && navLinks) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'row';
            navLinks.style.position = 'static';
            navLinks.style.boxShadow = 'none';
            navLinks.style.padding = '0';
        } else if (window.innerWidth <= 992 && navLinks) {
            navLinks.style.display = 'none';
            if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

    // 2. FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;

            // Close other open faqs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });

            faqItem.classList.toggle('active');
        });
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position for sticky navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Update Active Link on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // 5. Booking Form Submission Mockup
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                // Success state
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> تم استلام طلبك بنجاح!';
                submitBtn.style.backgroundColor = 'var(--success-green)';
                submitBtn.style.opacity = '1';
                bookingForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = 'var(--toshiba-red)';
                }, 3000);
            }, 1000);
        });
    }

});
