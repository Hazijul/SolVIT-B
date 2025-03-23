document.addEventListener('DOMContentLoaded', function () {
    const serviceItems = document.querySelectorAll('.service-item');
    const professionalsSection = document.getElementById('professionals');
    const professionalsHeading = document.getElementById('professionals-heading');
    const professionalsList = document.getElementById('professionals-list');
    const backToServicesBtn = document.getElementById('back-to-services');
    const modal = document.getElementById('booking-modal');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    let currentProfessional = '';
    let currentService = '';

    // Sample data for professionals with Indian names and prices in ₹
    const professionalsData = {
        doctors: [
            { name: 'Rajesh', experience: '10 years', price: '₹500', rating: '4.8', about: 'Certified General Physician.' },
            { name: 'Priya', experience: '8 years', price: '₹600', rating: '4.9', about: 'Pediatric Specialist.' },
            { name: 'Anil', experience: '12 years', price: '₹700', rating: '4.7', about: 'Cardiologist.' },
            { name: 'Sunita', experience: '15 years', price: '₹1000', rating: '5.0', about: 'Orthopedic Surgeon.' },
            { name: 'Neha', experience: '7 years', price: '₹400', rating: '4.6', about: 'Dermatologist.' }
        ],
        plumbers: [
            { name: 'Ramesh', experience: '5 years', price: '₹300', rating: '4.5', about: 'Expert in pipe repairs.' },
            { name: 'Suresh', experience: '8 years', price: '₹400', rating: '4.7', about: 'Water heater specialist.' },
            { name: 'Vijay', experience: '10 years', price: '₹500', rating: '4.8', about: 'Leak detection expert.' },
            { name: 'Amit', experience: '12 years', price: '₹600', rating: '4.9', about: 'Commercial plumbing.' },
            { name: 'Deepak', experience: '6 years', price: '₹350', rating: '4.6', about: 'Residential plumbing.' }
        ],
        electricians: [
            { name: 'Sanjay', experience: '7 years', price: '₹400', rating: '4.6', about: 'Wiring and repairs expert.' },
            { name: 'Arun', experience: '9 years', price: '₹500', rating: '4.7', about: 'Electrical installations.' },
            { name: 'Rahul', experience: '11 years', price: '₹600', rating: '4.8', about: 'Industrial electrician.' },
            { name: 'Vikram', experience: '14 years', price: '₹800', rating: '4.9', about: 'Home automation expert.' },
            { name: 'Ankit', experience: '5 years', price: '₹300', rating: '4.5', about: 'Residential electrician.' }
        ],
        barbers: [
            { name: 'Ravi', experience: '6 years', price: '₹200', rating: '4.6', about: 'Professional haircuts.' },
            { name: 'Manoj', experience: '8 years', price: '₹250', rating: '4.7', about: 'Beard grooming expert.' },
            { name: 'Alok', experience: '10 years', price: '₹300', rating: '4.8', about: 'Hair styling specialist.' },
            { name: 'Rajiv', experience: '12 years', price: '₹350', rating: '4.9', about: 'Traditional shaving.' },
            { name: 'Sandeep', experience: '5 years', price: '₹150', rating: '4.5', about: 'Quick haircuts.' }
        ],
        cabs: [
            { name: 'Maruti Suzuki Dzire', seats: '4', price: '₹10/km', rating: '4.6', about: 'Compact and comfortable sedan.' },
            { name: 'Hyundai Creta', seats: '5', price: '₹12/km', rating: '4.7', about: 'Spacious and stylish SUV.' },
            { name: 'Toyota Innova Crysta', seats: '7', price: '₹15/km', rating: '4.8', about: 'Premium MPV for family trips.' },
            { name: 'Mahindra Scorpio', seats: '7', price: '₹14/km', rating: '4.7', about: 'Rugged and powerful SUV.' },
            { name: 'Tata Nexon EV', seats: '5', price: '₹18/km', rating: '4.9', about: 'Eco-friendly electric SUV.' }
        ],
        drivers: [
            { name: 'Amit', experience: '6 years', price: '₹500/day', rating: '4.6', about: 'Personal driver.' },
            { name: 'Rahul', experience: '8 years', price: '₹700/day', rating: '4.7', about: 'Corporate driver.' },
            { name: 'Vikas', experience: '10 years', price: '₹1000/day', rating: '4.8', about: 'Long-distance trips.' },
            { name: 'Anand', experience: '12 years', price: '₹1200/day', rating: '4.9', about: 'Luxury car driver.' },
            { name: 'Suresh', experience: '5 years', price: '₹400/day', rating: '4.5', about: 'Part-time driver.' }
        ]
    };

    // Function to display professionals
    function displayProfessionals(service) {
        professionalsHeading.textContent = `Top ${service.charAt(0).toUpperCase() + service.slice(1)}`;
        professionalsList.innerHTML = ''; // Clear previous content

        professionalsData[service].forEach(professional => {
            const professionalItem = document.createElement('div');
            professionalItem.classList.add('professional-item');
            professionalItem.innerHTML = `
                <h3>${professional.name}</h3>
                ${professional.seats ? `<p class="seats">Seats: ${professional.seats}</p>` : ''}
                <p class="price">Price: ${professional.price}</p>
                <p class="rating">Rating: ${professional.rating} <i class="fas fa-star"></i></p>
                <p class="about">${professional.about}</p>
                <button class="book-now-btn" data-professional="${professional.name}" data-service="${service}">Book Now</button>
            `;
            professionalsList.appendChild(professionalItem);
        });

        // Add event listeners for book now buttons
        const bookNowButtons = document.querySelectorAll('.book-now-btn');
        bookNowButtons.forEach(button => {
            button.addEventListener('click', function() {
                currentProfessional = this.getAttribute('data-professional');
                currentService = this.getAttribute('data-service');
                modal.style.display = 'block';
            });
        });

        professionalsSection.style.display = 'block';
        document.getElementById('services').style.display = 'none';
    }

    // Add click event listeners to service items
    serviceItems.forEach(item => {
        item.addEventListener('click', function () {
            const service = this.getAttribute('data-service');
            displayProfessionals(service);
        });
    });

    // Back to services button
    backToServicesBtn.addEventListener('click', function () {
        professionalsSection.style.display = 'none';
        document.getElementById('services').style.display = 'block';
    });

    // Close modal when clicking the X
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            contact: document.getElementById('contact').value,
            email: document.getElementById('email').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            address: document.getElementById('address').value,
            professional: currentProfessional,
            service: currentService
        };

        // Log to console (replace with server-side submission in production)
        console.log('Booking Details:', formData);
        
        alert(`Booking confirmed for ${currentProfessional} (${currentService})!\n
              Details:
              Name: ${formData.name}
              Contact: ${formData.contact}
              Email: ${formData.email}
              Date: ${formData.date}
              Time: ${formData.time}
              Address: ${formData.address}
              We'll contact you soon to confirm your booking.`);

        // Reset form and close modal
        bookingForm.reset();
        modal.style.display = 'none';
    });

    // Back to top button
    window.onscroll = function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById('back-to-top').style.display = 'block';
        } else {
            document.getElementById('back-to-top').style.display = 'none';
        }
    };

    document.getElementById('back-to-top').onclick = function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
});