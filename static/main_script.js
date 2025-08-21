let cart = [];

// Function to add items to the cart
function addToCart(productName) {
    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if already in cart
    } else {
        cart.push({ name: productName, quantity: 1 }); // Add new product to cart
    }
    updateCartCount();
}

// Function to update the cart count display
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.length;
}

// Function to open the cart modal
function openCart() {
    const cartModal = document.getElementById("cartModal");
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = ""; // Clear previous items

    // Populate cart items
    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.textContent = `${item.name} (x${item.quantity})`;
        cartItems.appendChild(itemDiv);
    });

    cartModal.style.display = "block"; // Show the cart modal
}

// Function to close the cart modal
function closeCart() {
    const cartModal = document.getElementById("cartModal");
    cartModal.style.display = "none"; // Hide the cart modal
}

// Function to handle order submission
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const customerName = document.getElementById("customerName").value;
    const customerEmail = document.getElementById("customerEmail").value;
    const customerAddress = document.getElementById("customerAddress").value;

    // Prepare order data
    const orderData = {
        customerName: customerName,
        customerEmail: customerEmail,
        customerAddress: customerAddress,
        cart: cart
    };

    // Send order data to the server
    fetch('/place_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Order placed successfully!");
            closeCart(); // Close the cart modal
            cart = []; // Clear the cart
            updateCartCount(); // Update cart count
        } else {
            alert("Error placing order: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while placing the order. Please try again later.');
    });
});