document.addEventListener('DOMContentLoaded', function() {
    // Fetch orders when the page loads
    fetchOrders();

    function fetchOrders() {
        fetch('/api/orders')
            .then(response => response.json())
            .then(data => {
                const ordersTable = document.getElementById('ordersTable');
                ordersTable.innerHTML = ''; // Clear existing table data
                data.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.product_name}</td>
                        <td>${order.quantity}</td>
                        <td>${order.created_at}</td>
                        <td>${order.status}</td>
                        <td><button onclick="cancelOrder(${order.id})">Cancel</button></td>
                    `;
                    ordersTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching orders:', error));
    }

    window.cancelOrder = function(orderId) {
        fetch(`/cancel/${orderId}`, {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                fetchOrders(); // Refresh the order list
            } else {
                console.error('Error cancelling order:', response.statusText);
            }
        })
        .catch(error => console.error('Error cancelling order:', error));
    };
});