document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            // For this example, we'll just log it to the console
            console.log('Form submitted');
            alert('Thank you for your message. We will get back to you soon!');
            this.reset();
        });
    }

    // 3D model rendering using Three.js
    const canvases = document.querySelectorAll('.model-canvas');
    canvases.forEach(canvas => {
        const modelFile = canvas.dataset.model;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const loader = new THREE.GLTFLoader();
        loader.load(
            modelFile,
            function(gltf) {
                // Traverse scene to adjust materials or properties if needed
                gltf.scene.traverse(child => {
                    if (child.isMesh) {
                        const material = child.material;
                        if (material && material.format) {
                            delete material.format;  // Fix unsupported material property 'format'
                        }
                    }
                });

                scene.add(gltf.scene);
                gltf.scene.scale.set(1.5, 1.5, 1.5);
                gltf.scene.position.set(0, 0, 0);
            },
            undefined,
            function (error) {
                console.error('An error happened during model loading:', error);
            }
        );

        camera.position.z = 5;

        let controls;
        try {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
        } catch (error) {
            console.error('Error initializing OrbitControls:', error);
        }

        if (controls) {
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = false;
        }

        function animate() {
            requestAnimationFrame(animate);
            if (controls) controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
    });

    // Intersection Observer for fade-in effect on destinations
    const destinations = document.querySelectorAll('.destination');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    destinations.forEach(destination => {
        destination.style.opacity = 0;
        destination.style.transform = 'translateY(50px)';
        destination.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(destination);
    });

    // Mars destination interaction
    const marsDestinations = document.querySelectorAll('.mars-content a');
    marsDestinations.forEach(marsLink => {
        marsLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Mars Destination clicked!');
        });
    });
        // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');
    const dropdowns = document.querySelectorAll('.dropdown-content');

    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('show');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('show');
            dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
        });
    });

    // Toggle dropdown on mobile
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const dropdownBtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        dropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownContent.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    window.addEventListener('click', (e) => {
        if (!e.target.matches('.dropbtn')) {
            dropdowns.forEach(dropdown => {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            });
        }
    });

});
