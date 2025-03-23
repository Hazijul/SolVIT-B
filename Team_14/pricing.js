document.addEventListener('DOMContentLoaded', function() {
    // Get the billing toggle element
    const billingToggle = document.getElementById('billing-toggle');
    
    // Get all price elements
    const monthlyPrices = document.querySelectorAll('.amount.monthly');
    const yearlyPrices = document.querySelectorAll('.amount.yearly');
    
    // Function to update prices based on billing period
    function updatePrices(isYearly) {
        monthlyPrices.forEach(price => {
            price.style.display = isYearly ? 'none' : 'inline';
        });
        
        yearlyPrices.forEach(price => {
            price.style.display = isYearly ? 'inline' : 'none';
        });
    }
    
    // Add event listener to toggle
    billingToggle.addEventListener('change', function() {
        updatePrices(this.checked);
    });
    
    // Initialize prices (show monthly by default)
    updatePrices(false);
    
    // Add hover effect to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}); 