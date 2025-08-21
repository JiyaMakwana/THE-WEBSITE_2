function handleCancelButtonClick(button) {
    const orderId = button.getAttribute('data-order-id');
    if (confirm("Are you sure you want to cancel this order?")) {
        cancelOrder(orderId);
    }
}

function cancelOrder(orderId) {
    fetch(`/cancel/${orderId}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            // Update the order status in the table
            const orderRow = document.getElementById(`order-${orderId}`);
            orderRow.querySelector('.status').textContent = 'Cancelled';
            const cancelButton = orderRow.querySelector('button');
            cancelButton.disabled = true;
            cancelButton.textContent = 'Cancelled';
        } else {
            alert('Failed to cancel the order. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}


