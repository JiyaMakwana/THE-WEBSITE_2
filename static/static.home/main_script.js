let slideIndex = 0;

function showSlides() {
    let slides = document.querySelectorAll(".slide"); // Get all images
    let dots = document.querySelectorAll(".dot");

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; // Hide all images
    }

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    slides[slideIndex - 1].style.display = "block"; // Show current image

    // Remove "active" class from all dots
    dots.forEach(dot => dot.classList.remove("active"));
    
    // Add "active" class to the current dot
    dots[slideIndex - 1].classList.add("active");

    setTimeout(showSlides, 1000); // Change image every 2 seconds
}

function currentSlide(n)
{
    slideIndex=n;
    showSlides();
}

// Initialize Slideshow
document.addEventListener("DOMContentLoaded", () => {
    showSlides();
});