document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Form submission
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.querySelector('input[name="remember"]').checked;

            // Add loading state to button
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                console.log('Sign in attempt:', { email, password, remember });
                
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;

                // Show success message (you can modify this based on your needs)
                showNotification('Successfully signed in!', 'success');
            }, 1500);
        });
    }

    // Social sign in buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' :
                           this.classList.contains('facebook') ? 'Facebook' :
                           this.classList.contains('linkedin') ? 'LinkedIn' : '';
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
            this.disabled = true;

            // Simulate social sign in
            setTimeout(() => {
                console.log(`Signing in with ${provider}`);
                
                // Reset button state
                this.innerHTML = originalText;
                this.disabled = false;

                // Show message
                showNotification(`Connecting to ${provider}...`, 'info');
            }, 1000);
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                              type === 'error' ? 'fa-times-circle' : 
                              'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification to the page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add floating animation to shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(shape => {
        shape.style.animationDuration = `${20 + Math.random() * 10}s`;
        shape.style.animationDelay = `-${Math.random() * 10}s`;
    });

    // Add input focus effects
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Set initial state
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}); 