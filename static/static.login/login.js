async function login(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });

        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);  // Display success message
            window.location.href = result.redirect;  // Redirect to home page
        } else {
            errorMessage.textContent=result.message;  // Display error message
        } 
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
    finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }
}

