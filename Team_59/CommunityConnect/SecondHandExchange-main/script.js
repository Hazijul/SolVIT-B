// Initialize local storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let listings = JSON.parse(localStorage.getItem('listings')) || [];
let purchases = JSON.parse(localStorage.getItem('purchases')) || [];

// Update auth link based on login status
function updateAuthLink() {
    const authLinks = document.querySelectorAll('#authLink');
    authLinks.forEach(link => {
        link.textContent = currentUser ? 'Logout' : 'Login';
        if (currentUser) {
            link.onclick = () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'auth.html';
            };
        }
    });
}

// Auth Page Logic
document.addEventListener('DOMContentLoaded', () => {
    updateAuthLink();

    // Auth Form Toggle
    const authForm = document.getElementById('authForm');
    const authTitle = document.getElementById('authTitle');
    const authButton = document.getElementById('authButton');
    const toggleAuth = document.getElementById('toggleAuth');
    const signupFields = document.getElementById('signupFields');
    let isLogin = true;

    if (toggleAuth) {
        toggleAuth.addEventListener('click', (e) => {
            e.preventDefault();
            isLogin = !isLogin;
            authTitle.textContent = isLogin ? 'Login' : 'Sign Up';
            authButton.textContent = isLogin ? 'Login' : 'Sign Up';
            toggleAuth.textContent = isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login';
            signupFields.classList.toggle('d-none', isLogin);
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const email = document.getElementById('email')?.value;

            if (isLogin) {
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = 'marketplace.html';
                } else {
                    alert('Invalid credentials!');
                }
            } else {
                if (users.find(u => u.username === username)) {
                    alert('Username already exists!');
                } else {
                    const newUser = { username, password, email };
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    window.location.href = 'marketplace.html';
                }
            }
        });
    }

    // Marketplace Page
    if (document.getElementById('listingForm')) {
        document.getElementById('listingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('Please login to add a listing!');
                window.location.href = 'auth.html';
                return;
            }
            const name = document.getElementById('itemName').value;
            const type = document.getElementById('itemType').value;
            const description = document.getElementById('itemDescription').value;

            listings.push({ id: Date.now(), name, type, description, user: currentUser.username, status: 'available', comments: [] });
            localStorage.setItem('listings', JSON.stringify(listings));
            displayMarketplace();
            bootstrap.Modal.getInstance(document.getElementById('addListingModal')).hide();
            e.target.reset();
        });

        // Filter and Search
        document.getElementById('searchInput')?.addEventListener('input', displayMarketplace);
        document.getElementById('filterType')?.addEventListener('change', displayMarketplace);
        document.getElementById('filterStatus')?.addEventListener('change', displayMarketplace);
    }
    displayMarketplace();

    // Dashboard Page
    if (document.getElementById('yourListings')) {
        if (!currentUser) {
            window.location.href = 'auth.html';
        } else {
            displayDashboard();
        }
    }
});

function displayMarketplace() {
    const container = document.getElementById('marketplaceContainer');
    if (!container) return;

    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterType = document.getElementById('filterType')?.value || '';
    const filterStatus = document.getElementById('filterStatus')?.value || '';

    container.innerHTML = '';
    listings
        .filter(listing => listing.name.toLowerCase().includes(search))
        .filter(listing => filterType ? listing.type === filterType : true)
        .filter(listing => filterStatus ? listing.status === filterStatus : true)
        .forEach(listing => {
            const card = `
                <div class="col-md-4">
                    <div class="card listing-card">
                        <div class="card-body">
                            <h5 class="card-title">${listing.name}</h5>
                            <p class="card-text">${listing.description}</p>
                            <p>Type: ${listing.type}</p>
                            <p>Status: <span class="${listing.status === 'available' ? 'text-success' : 'text-danger'}">${listing.status}</span></p>
                            <p>Posted by: ${listing.user}</p>
                            ${listing.user !== currentUser?.username && listing.status === 'available' ? `<button class="btn btn-warning" onclick="buyItem(${listing.id})">Buy</button>` : ''}
                            ${listing.user === currentUser?.username && listing.status === 'available' ? `<button class="btn btn-danger" onclick="markSold(${listing.id})">Mark as Sold</button>` : ''}
                            <div class="comment-section mt-3">
                                ${listing.comments.map(c => `<p><strong>${c.user}:</strong> ${c.text}</p>`).join('')}
                                ${currentUser ? `
                                    <form onsubmit="addComment(event, ${listing.id})">
                                        <input type="text" class="form-control mb-2" placeholder="Add a comment..." required>
                                        <button type="submit" class="btn btn-primary btn-sm">Post</button>
                                    </form>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
}

function buyItem(id) {
    if (!currentUser) {
        alert('Please login to buy!');
        window.location.href = 'auth.html';
        return;
    }
    const listing = listings.find(l => l.id === id);
    if (listing) {
        listing.status = 'sold';
        purchases.push({ buyer: currentUser.username, item: listing });
        localStorage.setItem('listings', JSON.stringify(listings));
        localStorage.setItem('purchases', JSON.stringify(purchases));
        displayMarketplace();
    }
}

function markSold(id) {
    const listing = listings.find(l => l.id === id);
    if (listing && listing.user === currentUser.username) {
        listing.status = 'sold';
        localStorage.setItem('listings', JSON.stringify(listings));
        displayMarketplace();
    }
}

function addComment(event, id) {
    event.preventDefault();
    const text = event.target.querySelector('input').value;
    const listing = listings.find(l => l.id === id);
    if (listing && currentUser) {
        listing.comments.push({ user: currentUser.username, text });
        localStorage.setItem('listings', JSON.stringify(listings));
        displayMarketplace();
    }
    event.target.reset();
}

function displayDashboard() {
    const yourListings = document.getElementById('yourListings');
    const yourPurchases = document.getElementById('yourPurchases');

    yourListings.innerHTML = '';
    listings.filter(l => l.user === currentUser.username).forEach(listing => {
        const card = `
            <div class="col-md-12 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5>${listing.name}</h5>
                        <p>${listing.description}</p>
                        <p>Type: ${listing.type}</p>
                        <p>Status: <span class="${listing.status === 'available' ? 'text-success' : 'text-danger'}">${listing.status}</span></p>
                    </div>
                </div>
            </div>
        `;
        yourListings.innerHTML += card;
    });

    yourPurchases.innerHTML = '';
    purchases.filter(p => p.buyer === currentUser.username).forEach(purchase => {
        const card = `
            <div class="col-md-12 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5>${purchase.item.name}</h5>
                        <p>${purchase.item.description}</p>
                        <p>Type: ${purchase.item.type}</p>
                        <p>Seller: ${purchase.item.user}</p>
                    </div>
                </div>
            </div>
        `;
        yourPurchases.innerHTML += card;
    });
}