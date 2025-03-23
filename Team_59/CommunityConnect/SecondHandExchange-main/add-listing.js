document.addEventListener('DOMContentLoaded', () => {
    let listings = JSON.parse(localStorage.getItem('listings')) || [];
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Anonymous' };

    const listingForm = document.getElementById('listingForm');
    listingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userName = document.getElementById('userName').value;
        const name = document.getElementById('itemName').value;
        const type = document.getElementById('itemType').value;
        const category = document.getElementById('itemCategory').value;
        const price = parseFloat(document.getElementById('itemPrice').value);
        const description = document.getElementById('itemDescription').value;
        const mobile = document.getElementById('mobile').value;
        const email = document.getElementById('email').value;
        const imageInput = document.getElementById('itemImage');
        let image = null;

        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                image = event.target.result;
                listings.push({ 
                    id: Date.now(), 
                    userName, // Added userName to the listing
                    name, 
                    type, 
                    category, 
                    price, 
                    description, 
                    status: 'available', 
                    comments: [], 
                    reviews: [], 
                    image, 
                    mobile, 
                    email 
                });
                localStorage.setItem('listings', JSON.stringify(listings));
                alert('Listing added successfully!');
                listingForm.reset();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            listings.push({ 
                id: Date.now(), 
                userName, // Added userName to the listing
                name, 
                type, 
                category, 
                price, 
                description, 
                status: 'available', 
                comments: [], 
                reviews: [], 
                image, 
                mobile, 
                email 
            });
            localStorage.setItem('listings', JSON.stringify(listings));
            alert('Listing added successfully!');
            listingForm.reset();
        }
    });
});