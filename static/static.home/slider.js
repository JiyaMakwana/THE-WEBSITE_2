document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelector(".flav_slides");
    const images = document.querySelectorAll(".slide-img");
    const totalSlides = images.length;
    let index = 1; // Start from 1 since we'll add cloned slides
    const slideWidth = images[0].clientWidth;

    // Clone first and last slides
    const firstClone = images[0].cloneNode(true);
    const lastClone = images[totalSlides - 1].cloneNode(true);

    // Add clones to the slider
    slides.appendChild(firstClone);
    slides.insertBefore(lastClone, slides.firstChild);

    // Adjust the slider to show the first actual slide
    slides.style.transform = `translateX(-${index * slideWidth}px)`;

    function nextSlide() {
        index++;
        slides.style.transition = "transform 0.5s ease-in-out";
        slides.style.transform = `translateX(-${index * slideWidth}px)`;

        // Reset to the first slide instantly after reaching the end
        slides.addEventListener("transitionend", () => {
            if (index === totalSlides + 1) {
                slides.style.transition = "none"; // Disable transition
                index = 1; // Reset to first actual slide
                slides.style.transform = `translateX(-${index * slideWidth}px)`;
            }
        });
    }

    // Auto-slide every 3 seconds
    setInterval(nextSlide, 3000);
});