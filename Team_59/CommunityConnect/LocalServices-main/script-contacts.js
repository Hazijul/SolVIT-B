document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');

    // Handle contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            message: document.getElementById('contact-message').value
        };

        // Log to console (replace with server-side submission in production)
        console.log('Contact Form Submission:', formData);
        
        alert(`Thank you, ${formData.name}! Your message has been sent. We'll get back to you at ${formData.email} soon.`);

        // Reset form
        contactForm.reset();
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