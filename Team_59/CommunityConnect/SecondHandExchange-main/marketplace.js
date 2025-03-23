document.addEventListener('DOMContentLoaded', () => {
    let listings = JSON.parse(localStorage.getItem('listings')) || [];
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Anonymous' };

    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    const filterCategory = document.getElementById('filterCategory');

    // Get search query or category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search') || '';
    const categoryQuery = urlParams.get('category') || '';

    // Set initial values for filters
    searchInput.value = searchQuery;
    if (categoryQuery) {
        filterCategory.value = categoryQuery;
    }

    searchInput.addEventListener('input', displayMarketplace);
    filterType.addEventListener('change', displayMarketplace);
    filterStatus.addEventListener('change', displayMarketplace);
    filterCategory.addEventListener('change', displayMarketplace);

    displayMarketplace();

    function displayMarketplace() {
        const container = document.getElementById('marketplaceContainer');
        const search = searchInput.value.toLowerCase();
        const type = filterType.value;
        const status = filterStatus.value;
        const category = filterCategory.value;

        container.innerHTML = '';
        listings
            .filter(listing => listing.name.toLowerCase().includes(search))
            .filter(listing => type ? listing.type === type : true)
            .filter(listing => status ? listing.status === status : true)
            .filter(listing => category ? listing.category === category : true)
            .forEach(listing => {
                const card = `
                    <div class="col-md-4">
                        <div class="card listing-card">
                            ${listing.image ? `<img src="${listing.image}" alt="${listing.name}">` : ''}
                            <div class="card-body">
                                <h5 class="card-title">${listing.name}</h5>
                                <p class="card-text">${listing.description}</p>
                                <p>Type: ${listing.type}</p>
                                <p>Category: ${listing.category}</p>
                                <p>Price: ${listing.price === 0 ? 'Free (Donation/Exchange)' : `₹${listing.price}`}</p>
                                <p>Status: <span class="${listing.status === 'available' ? 'text-success' : 'text-danger'}">${listing.status}</span></p>
                                <p>Posted by: ${listing.userName}</p>
                                <p>Mobile: ${listing.mobile}</p>
                                <p>Email: ${listing.email}</p>
                                ${listing.status === 'available' ? `<button class="btn btn-warning" onclick="buyItem(${listing.id})">Buy</button>` : ''}
                                <div class="comment-section mt-3">
                                    ${listing.comments.map(c => `<p><strong>${c.user}:</strong> ${c.text}</p>`).join('')}
                                    <form onsubmit="addComment(event, ${listing.id})">
                                        <input type="text" class="form-control mb-2" placeholder="Add a comment..." required>
                                        <button type="submit" class="btn btn-primary btn-sm">Post</button>
                                    </form>
                                </div>
                                <div class="review-section mt-3">
                                    ${listing.reviews.map(r => `<p><strong>${r.user}:</strong> ${r.text} (${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)})</p>`).join('')}
                                    <form onsubmit="addReview(event, ${listing.id})">
                                        <input type="text" class="form-control mb-2" placeholder="Add a review..." required>
                                        <select class="form-select mb-2" required>
                                            <option value="1">1 Star</option>
                                            <option value="2">2 Stars</option>
                                            <option value="3">3 Stars</option>
                                            <option value="4">4 Stars</option>
                                            <option value="5">5 Stars</option>
                                        </select>
                                        <button type="submit" class="btn btn-success btn-sm">Submit Review</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
    }

    window.buyItem = function(id) {
        const listing = listings.find(l => l.id === id);
        if (listing) {
            listing.status = 'sold';
            listing.buyer = userInfo.name;
            localStorage.setItem('listings', JSON.stringify(listings));
            alert(`You have successfully bought "${listing.name}"! Contact the seller (${listing.userName}) at ${listing.mobile} or ${listing.email}.`);
            displayMarketplace();
        }
    };

    window.addComment = function(event, id) {
        event.preventDefault();
        const text = event.target.querySelector('input').value;
        const listing = listings.find(l => l.id === id);
        if (listing) {
            listing.comments.push({ user: userInfo.name, text });
            localStorage.setItem('listings', JSON.stringify(listings));
            displayMarketplace();
        }
        event.target.reset();
    };

    window.addReview = function(event, id) {
        event.preventDefault();
        const text = event.target.querySelector('input').value;
        const rating = parseInt(event.target.querySelector('select').value);
        const listing = listings.find(l => l.id === id);
        if (listing) {
            listing.reviews.push({ user: userInfo.name, text, rating });
            localStorage.setItem('listings', JSON.stringify(listings));
            displayMarketplace();
        }
        event.target.reset();
    };
});