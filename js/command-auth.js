// Command Panel Authentication Logic - Compat SDK

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    if (!loginForm) {
        console.error('Login form element not found. Check HTML IDs.');
        return;
    }

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Hide previous errors
        errorMessage.style.display = 'none';

        // Show loading state
        loginButton.disabled = true;
        loginButton.querySelector('.btn-text').style.display = 'none';
        loginButton.querySelector('.btn-loading').style.display = 'inline-flex';

        try {
            // Sign in with Firebase
            await auth.signInWithEmailAndPassword(email, password);

            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error('Login error:', error);

            // Show user-friendly error message
            let friendlyMessage = 'Login failed. Please try again.';

            switch (error.code) {
                case 'auth/invalid-email':
                    friendlyMessage = 'Invalid email address format.';
                    break;
                case 'auth/user-disabled':
                    friendlyMessage = 'This account has been disabled.';
                    break;
                case 'auth/user-not-found':
                    friendlyMessage = 'No account found with this email address.';
                    break;
                case 'auth/wrong-password':
                    friendlyMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-credential':
                    friendlyMessage = 'Invalid email or password. Please check your credentials.';
                    break;
                case 'auth/too-many-requests':
                    friendlyMessage = 'Too many failed login attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    friendlyMessage = 'Network error. Please check your internet connection.';
                    break;
                default:
                    friendlyMessage = error.message || 'An unexpected error occurred.';
            }

            errorText.textContent = friendlyMessage;
            errorMessage.style.display = 'flex';

            // Reset button state
            loginButton.disabled = false;
            loginButton.querySelector('.btn-text').style.display = 'inline';
            loginButton.querySelector('.btn-loading').style.display = 'none';
        }
    });

    // Clear error message when user starts typing
    emailInput.addEventListener('input', () => {
        errorMessage.style.display = 'none';
    });

    passwordInput.addEventListener('input', () => {
        errorMessage.style.display = 'none';
    });
});
