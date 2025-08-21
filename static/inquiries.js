document.addEventListener('DOMContentLoaded', function() {
    fetchInquiries();

    function fetchInquiries() {
        fetch('/api/inquiries')
            .then(response => response.json())
            .then(data => {
                const inquiryTable = document.getElementById('inquiryTable');
                inquiryTable.innerHTML = ''; // Clear existing table data
                data.forEach(inquiry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${inquiry.id}</td>
                        <td>${inquiry.name}</td>
                        <td>${inquiry.email}</td>
                        <td>${inquiry.message}</td>
                        <td><button onclick="removeInquiry(${inquiry.id})">Remove</button></td>
                    `;
                    inquiryTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching inquiries:', error));
    }

    window.removeInquiry = function(inquiryId) {
        fetch(`/api/inquiries/${inquiryId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchInquiries(); // Refresh the inquiry list
            } else {
                console.error('Error deleting inquiry:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting inquiry:', error));
    };
});