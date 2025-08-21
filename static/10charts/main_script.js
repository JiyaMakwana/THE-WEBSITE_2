// // Initialize cart from localStorage or as an empty array
// let cart = JSON.parse(localStorage.getItem('cart')) || [];

// // Function to add items to the cart
// function addToCart(productName) {
//     // Check if the product is already in the cart
//     const existingProduct = cart.find(item => item.name === productName);
//     if (existingProduct) {
//         existingProduct.quantity += 1; // Increase quantity if already in cart
//     } else {
//         cart.push({ name: productName, quantity: 1 }); // Add new product to cart
//     }
//     updateCartCount();
//     saveCartToLocalStorage(); // Save cart to localStorage
// }

// //Function to update the cart count display
// function updateCartCount() {
//     const cartCount = document.getElementById("cart-count");
//     cartCount.textContent = cart.length; // Update cart count display
// }

// // Function to save cart to localStorage
// function saveCartToLocalStorage() {
//     localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
// }

// // Function to open the cart modal
// function openCart() {
//     const cartModal = document.getElementById("cartModal");
//     const cartItems = document.getElementById("cartItems");
//     cartItems.innerHTML = ""; // Clear previous items

//     // Populate cart items
//     cart.forEach(item => {
//         const itemDiv = document.createElement("div");
//         itemDiv.textContent = `${item.name} (x${item.quantity})`;
//         cartItems.appendChild(itemDiv);
//     });

//     cartModal.style.display = "block"; // Show the cart modal
// }

// // Function to close the cart modal
// function closeCart() {
//     const cartModal = document.getElementById("cartModal");
//     cartModal.style.display = "none"; // Hide the cart modal
// }

// // Function to handle order submission
// document.getElementById("orderForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent default form submission

//     const customerName = document.getElementById("customerName").value;
//     const customerEmail = document.getElementById("customerEmail").value;
//     const customerAddress = document.getElementById("customerAddress").value;

//     // Prepare order data
//     const orderData = {
//         customerName: customerName,
//         customerEmail: customerEmail,
//         customerAddress: customerAddress,
//         cart: cart
//     };

//     // Send order data to the server
//     fetch('/place_order', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(orderData)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.status === "success") {
//             alert("Order placed successfully!");
//             closeCart(); // Close the cart modal
//             cart = []; // Clear the cart
//             saveCartToLocalStorage(); // Save empty cart to localStorage
//             updateCartCount(); // Update cart count
//         } else {
//             alert("Error placing order: " + data.message);
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('An error occurred while placing the order. Please try again later.');
//     });
// });

// // Call this function on page load to update the cart count
// window.onload = function() {
//     updateCartCount(); // Update cart count on page load
// };



let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add items to the cart
function addToCart(productName) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if already in cart
    } else {
        cart.push({ name: productName, quantity: 1 }); // Add new product to cart
    }
    updateCartCount();
    saveCartToLocalStorage(); // Save cart to localStorage
}

// Function to update the cart count display
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0); // Update cart count display
}

// Function to save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
}

// Function to open the cart modal
function openCart() {
    const cartModal = document.getElementById("cartModal");
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = ""; // Clear previous items

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach((item, index) => {
            cartItemsDiv.innerHTML += `
                <div class="cart-item">
                    <span>${item.name} (x <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">)</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
                </div>
            `;
        });
    }

    cartModal.style.display = "block"; // Show the cart modal
}

// Function to update item quantity in the cart
function updateQuantity(index, newQuantity) {
    cart[index].quantity = parseInt(newQuantity);
    saveCartToLocalStorage(); // Save updated cart to localStorage
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    saveCartToLocalStorage(); // Save updated cart to localStorage
    openCart(); // Refresh cart display
}

// Function to close the cart modal
function closeCart() {
    const cartModal = document.getElementById("cartModal");
    cartModal.style.display = "none"; // Hide the cart modal
}

// Function to handle order submission
document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    if (cart.length === 0) {
        alert("Cart is empty! Add items before placing an order.");
        return;
    }

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
            saveCartToLocalStorage(); // Save empty cart to localStorage
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

// Call this function on page load to update the cart count
window.onload = function() {
    updateCartCount(); // Update cart count on page load
};


