document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();

    function fetchUsers() {
        fetch('/api/users') // Updated endpoint
            .then(response => response.json())
            .then(data => {
                const userTable = document.getElementById('userTable');
                userTable.innerHTML = ''; // Clear existing table data
                data.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.company_name}</td>
                        <td>${user.representative_fname} ${user.representative_lname}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td>${user.gst_no}</td>
                        <td><button onclick="removeUser (${user.id})">Remove</button></td>
                    `;
                    userTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    window.removeUser  = function(userId) {
        fetch(`/api/users/${userId}`, { // Updated endpoint
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchUsers(); // Refresh the user list
            } else {
                console.error('Error deleting user:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting user:', error));
    };
});
