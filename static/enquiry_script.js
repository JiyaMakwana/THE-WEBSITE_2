document.addEventListener("DOMContentLoaded", function () {
    generateCaptcha();

    const form = document.getElementById("form");
    const successPopup = document.getElementById("successPopup");
    const captchaError = document.getElementById("captchaError");
    const inquiryForm = document.getElementById("inquiryForm");
    const inquiryButton = document.getElementById("inquiryButton");

    // Hide the captcha error message initially
    captchaError.style.display = "none";

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const captchaInput = document.getElementById("captcha").value.trim();
        const captchaText = document.getElementById("captchaText").textContent.trim();

        if (captchaInput !== captchaText) {
            captchaError.style.display = "inline-block";
            return;
        } else {
            captchaError.style.display = "none";
        }

        // Prepare form data for submission
        const formData = new FormData(form);

        // Send the form data to the server
        fetch('/submit_inquiry', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                successPopup.classList.add("show");
                setTimeout(() => {
                    successPopup.classList.remove("show");
                }, 3000);
                form.reset();
                generateCaptcha();
                // Close Form After Submission
                setTimeout(() => {
                    inquiryForm.classList.remove("open");
                    inquiryButton.style.display = "block"; // Show button again
                }, 2000);
            } else {
                alert(data.message); // Show error message
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the inquiry. Please try again later.');
        });
    });
});

function toggleForm() {
    const inquiryForm = document.getElementById("inquiryForm");
    inquiryForm.classList.toggle("open");

    document.getElementById("inquiryButton").style.display = inquiryForm.classList.contains("open") ? "none" : "block";
}

function generateCaptcha() {
    document.getElementById("captchaText").textContent = Math.random().toString(36).substring(2, 8);
}