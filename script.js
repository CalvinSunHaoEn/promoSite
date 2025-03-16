document.addEventListener('DOMContentLoaded', function() {
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        document.body.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });

    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.synopsis, .cta-buttons');
    
    const fadeInOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, fadeInOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transition = "opacity 1.5s ease-in-out, transform 1.5s ease-in-out";
        element.style.transform = "translateY(20px)";
        fadeInObserver.observe(element);
    });
    
    // Add fade-in class to trigger animation
    document.addEventListener('scroll', function() {
        fadeElements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            // Check if element is in viewport
            if(position.top < window.innerHeight && position.bottom >= 0) {
                element.classList.add('fade-in');
            }
        });
    });
    
    // Add class for fade-in animation
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .pulse {
                animation: pulse 2s infinite;
            }
        </style>
    `);
    
    // Add pulse animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.classList.add('pulse');
        });
        
        button.addEventListener('mouseout', function() {
            this.classList.remove('pulse');
        });
    });
    
    // Typewriter effect for tagline
    const tagline = document.querySelector('.tagline p');
    const taglineText = tagline.textContent;
    tagline.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < taglineText.length) {
            tagline.textContent += taglineText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typewriter effect after a short delay
    setTimeout(typeWriter, 1000);
    
    // Trailer Modal Functionality
    const modal = document.getElementById('trailer-modal');
    const closeModal = document.querySelector('.close-modal');
    const trailerPlayer = document.getElementById('trailer-player');
    const videoContainer = document.querySelector('.video-container');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Function to open the modal
    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    // Function to close the modal
    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        
        // Pause the video when modal is closed
        trailerPlayer.pause();
        trailerPlayer.currentTime = 0;
    }
    
    // Function to load and play a video
    function loadVideo(videoSrc) {
        // Update the video source
        trailerPlayer.querySelector('source').src = videoSrc;
        trailerPlayer.load();
        
        // Show the video container
        videoContainer.classList.add('active');
        
        // Play the video
        trailerPlayer.play();
        
        // Update active thumbnail
        thumbnails.forEach(thumb => {
            if (thumb.getAttribute('data-video') === videoSrc) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    // Event listener for the "WATCH TRAILER" button
    document.querySelectorAll('.cta-button').forEach(button => {
        if (button.textContent.trim() === 'WATCH TRAILER') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openModal();
                
                // Load the first trailer by default
                const firstTrailerSrc = thumbnails[0].getAttribute('data-video');
                loadVideo(firstTrailerSrc);
            });
        }
    });
    
    // Event listener for closing the modal
    closeModal.addEventListener('click', closeModalFunc);
    
    // Close modal when clicking outside the content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModalFunc();
        }
    });
    
    // Event listeners for thumbnails
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            loadVideo(videoSrc);
        });
    });
    
    // Generate thumbnail images from video files
    thumbnails.forEach(thumbnail => {
        const videoSrc = thumbnail.getAttribute('data-video');
        const thumbnailImg = thumbnail.querySelector('.thumbnail-img');
        
        // Set a background color gradient for the thumbnail
        thumbnailImg.style.background = 'linear-gradient(135deg, #111 0%, #333 100%)';
        
        // Add a data attribute to store the video source
        thumbnailImg.setAttribute('data-video', videoSrc);
    });
});
