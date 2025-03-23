
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const formMessage = document.getElementById('form-message');
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        

        
        formMessage.textContent = "Thank you for contacting us, " + name + "! Your message has been sent.";
        formMessage.style.color = "red";
        
        
        document.getElementById('contact-form').reset();
    });
});