document.addEventListener('DOMContentLoaded', () => {
    let listings = JSON.parse(localStorage.getItem('listings')) || [];
    let userInfo = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Anonymous', email: 'Not provided' };

    const userInfoForm = document.getElementById('userInfoForm');
    const dashName = document.getElementById('dashName');
    const dashEmail = document.getElementById('dashEmail');

    dashName.textContent = userInfo.name;
    dashEmail.textContent = userInfo.email;

    userInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        userInfo = { name, email };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        dashName.textContent = name;
        dashEmail.textContent = email;
        userInfoForm.reset();
    });

    const dashListings = document.getElementById('dashListings');
    dashListings.innerHTML = '';
    listings.forEach(listing => {
        const card = `
            <div class="col-md-12 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5>${listing.name}</h5>
                        <p>${listing.description}</p>
                        <p>Type: ${listing.type}</p>
                        <p>Category: ${listing.category}</p>
                        <p>Price: ${listing.price === 0 ? 'Free (Donation/Exchange)' : `₹${listing.price}`}</p>
                        <p>Status: <span class="${listing.status === 'available' ? 'text-success' : 'text-danger'}">${listing.status}</span></p>
                        <p>Posted by: ${listing.userName}</p>
                        <p>Mobile: ${listing.mobile}</p>
                        <p>Email: ${listing.email}</p>
                    </div>
                </div>
            </div>
        `;
        dashListings.innerHTML += card;
    });
});