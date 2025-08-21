document.addEventListener('DOMContentLoaded', function() {
    fetchOrders();

    function fetchOrders() {
        fetch('/api/orders')
            .then(response => response.json())
            .then(data => {
                const orderTable = document.getElementById('orderTable');
                orderTable.innerHTML = ''; // Clear existing table data
                data.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.customer_name}</td>
                        <td>${order.customer_email}</td>
                        <td>${order.customer_address}</td>
                        <td>${order.product_name}</td>
                        <td>${order.quantity}</td>
                        <td>${new Date(order.created_at).toLocaleString()}</td>
                        <td>
                            <select id="status-${order.id}">
                                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                                <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                        <td>
                            <button onclick="updateOrder(${order.id})">Update</button>
                            <button onclick="removeOrder(${order.id})">Remove</button>
                        </td>
                    `;
                    orderTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching orders:', error));
    }

    window.removeOrder = function(orderId) {
        fetch(`/api/orders/${orderId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchOrders(); // Refresh the order list
            } else {
                console.error('Error deleting order:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting order:', error));
    };

    window.updateOrder = function(orderId) {
        const newStatus = document.getElementById(`status-${orderId}`).value; // Get the selected status
        fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => {
            if (response.ok) {
                fetchOrders(); // Refresh the order list
            } else {
                console.error('Error updating order status:', response.statusText);
            }
        })
        .catch(error => console.error('Error updating order status:', error));
    };
});