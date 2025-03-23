document.addEventListener('DOMContentLoaded', () => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authLink = document.getElementById('authLink');
    authLink.textContent = currentUser ? 'Logout' : 'Login';
    if (currentUser) {
        authLink.onclick = () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'auth.html';
        };
    } else {
        window.location.href = 'auth.html';
        return;
    }

    const profileForm = document.getElementById('profileForm');
    const usernameInput = document.getElementById('profileUsername');
    const emailInput = document.getElementById('profileEmail');
    const passwordInput = document.getElementById('profilePassword');

    usernameInput.value = currentUser.username;
    emailInput.value = currentUser.email || '';
    
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        currentUser.email = email;
        if (password) currentUser.password = password;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        users = users.map(u => u.username === currentUser.username ? currentUser : u);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Profile updated successfully!');
        passwordInput.value = '';
    });
});