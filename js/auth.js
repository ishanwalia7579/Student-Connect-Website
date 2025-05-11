// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const themeToggle = document.querySelector('.theme-toggle');

// Data Storage Functions
const DataStore = {
    // User Data
    users: JSON.parse(localStorage.getItem('users')) || [],
    
    // Save user data
    saveUser(userData) {
        this.users.push(userData);
        localStorage.setItem('users', JSON.stringify(this.users));
    },
    
    // Get user by email
    getUserByEmail(email) {
        return this.users.find(user => user.email === email);
    },
    
    // Update user data
    updateUser(email, newData) {
        const userIndex = this.users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...newData };
            localStorage.setItem('users', JSON.stringify(this.users));
            return true;
        }
        return false;
    },
    
    // Delete user
    deleteUser(email) {
        this.users = this.users.filter(user => user.email !== email);
        localStorage.setItem('users', JSON.stringify(this.users));
    },
    
    // Check if email exists
    emailExists(email) {
        return this.users.some(user => user.email === email);
    }
};

// Theme Toggle
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Toggle Password Visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        btn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
});

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}

// Login Form Handler
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        const rememberMe = loginForm.querySelector('input[type="checkbox"]').checked;

        // Validate email
        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        try {
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            submitBtn.disabled = true;

            // Check if user exists
            const user = DataStore.getUserByEmail(email);
            if (!user || user.password !== password) {
                throw new Error('Invalid email or password');
            }

            // Store current user data
            const userData = {
                email: user.email,
                name: user.name,
                avatar: user.avatar || 'https://via.placeholder.com/150',
                theme: document.documentElement.getAttribute('data-theme')
            };

            localStorage.setItem('currentUser', JSON.stringify(userData));
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            }

            // Show success message
            showMessage('Login successful! Redirecting...', 'success');

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            showError(error.message || 'Invalid email or password');
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Signup Form Handler
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = signupForm.querySelector('input[name="firstName"]').value;
        const lastName = signupForm.querySelector('input[name="lastName"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[name="password"]').value;
        const confirmPassword = signupForm.querySelector('input[name="confirmPassword"]').value;
        const termsAccepted = signupForm.querySelector('input[type="checkbox"]').checked;

        // Validate form
        if (!firstName || !lastName) {
            showError('Please enter your full name');
            return;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            showError('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (!termsAccepted) {
            showError('Please accept the terms and conditions');
            return;
        }

        try {
            // Check if email already exists
            if (DataStore.emailExists(email)) {
                throw new Error('Email already registered');
            }

            // Show loading state
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            submitBtn.disabled = true;

            // Create new user
            const newUser = {
                email,
                password,
                name: `${firstName} ${lastName}`,
                avatar: 'https://via.placeholder.com/150',
                createdAt: new Date().toISOString()
            };

            // Save user data
            DataStore.saveUser(newUser);

            // Store current user data
            const userData = {
                email: newUser.email,
                name: newUser.name,
                avatar: newUser.avatar,
                theme: document.documentElement.getAttribute('data-theme')
            };

            localStorage.setItem('currentUser', JSON.stringify(userData));

            // Show success message
            showMessage('Account created successfully! Redirecting...', 'success');

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            showError(error.message || 'An error occurred during signup');
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Social Login Handlers
const googleLoginBtn = document.querySelector('.social-btn.google');
const facebookLoginBtn = document.querySelector('.social-btn.facebook');

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        try {
            // Simulate Google login
            await new Promise(resolve => setTimeout(resolve, 1000));
            showError('Google login not implemented yet');
        } catch (error) {
            showError('Google login failed');
        }
    });
}

if (facebookLoginBtn) {
    facebookLoginBtn.addEventListener('click', async () => {
        try {
            // Simulate Facebook login
            await new Promise(resolve => setTimeout(resolve, 1000));
            showError('Facebook login not implemented yet');
        } catch (error) {
            showError('Facebook login failed');
        }
    });
}

// Error Handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const form = document.querySelector('form');
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    form.insertBefore(errorDiv, form.firstChild);

    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Check for remembered email
const rememberedEmail = localStorage.getItem('rememberedEmail');
if (rememberedEmail && loginForm) {
    loginForm.querySelector('input[type="email"]').value = rememberedEmail;
    loginForm.querySelector('input[type="checkbox"]').checked = true;
}

// Message Handler
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;

    document.body.appendChild(messageDiv);

    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
} 