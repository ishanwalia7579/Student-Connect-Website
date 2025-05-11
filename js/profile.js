// DOM Elements
const editProfileBtn = document.querySelector('.edit-profile-btn');
const themeToggle = document.querySelector('.theme-toggle');
const userMenu = document.querySelector('.user-menu');
const dropdownMenu = document.querySelector('.dropdown-menu');
const logoutBtn = document.querySelector('.logout-btn');
const editProfileModal = document.getElementById('editProfileModal');
const addEducationBtn = document.querySelector('.add-education-btn');
const addEducationModal = document.getElementById('addEducationModal');
const addSkillBtn = document.querySelector('.add-skill-btn');
const addSkillModal = document.getElementById('addSkillModal');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const closeModalBtns = document.querySelectorAll('.close-modal');
const editProfileForm = document.getElementById('editProfileForm');
const addEducationForm = document.getElementById('addEducationForm');
const addSkillForm = document.getElementById('addSkillForm');

// Image Upload Handlers
const editCoverBtn = document.querySelector('.edit-cover');
const editAvatarBtn = document.querySelector('.edit-avatar');

// Social Links
const addSocialLinkBtn = document.querySelector('.add-social-link');
const addSocialLinkModal = document.getElementById('addSocialLinkModal');
const addSocialLinkForm = document.getElementById('addSocialLinkForm');

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

// User Menu Toggle
userMenu.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Logout Handler
logoutBtn.addEventListener('click', async () => {
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove user data
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
});

// Get current user data
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Computer Science student passionate about AI and Machine Learning. Love to code and solve problems.',
    avatar: 'images/avatar.png'
};

// Initialize profile data
function initializeProfile() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userBio').textContent = currentUser.bio;
    document.querySelector('.profile-picture img').src = currentUser.avatar;
}

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        // Add active class to clicked button and corresponding pane
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Modal handling
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Edit Profile
editProfileBtn.addEventListener('click', () => {
    // Fill form with current data
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editBio').value = currentUser.bio;
    document.getElementById('editEmail').value = currentUser.email;
    openModal(editProfileModal);
});

// Add Education
addEducationBtn.addEventListener('click', () => {
    openModal(addEducationModal);
});

// Add Skill
addSkillBtn.addEventListener('click', () => {
    openModal(addSkillModal);
});

// Close modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Form submissions
editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
    setLoading(submitBtn, true);
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update user data
        currentUser.name = document.getElementById('editName').value;
        currentUser.bio = document.getElementById('editBio').value;
        currentUser.email = document.getElementById('editEmail').value;

        // Update UI
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userBio').textContent = currentUser.bio;

        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showMessage('Profile updated successfully!', 'success');
        closeModal(editProfileModal);
    } catch (error) {
        showMessage('Failed to update profile', 'error');
    } finally {
        setLoading(submitBtn, false);
    }
});

addEducationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const degree = document.getElementById('degree').value;
    const institution = document.getElementById('institution').value;
    const startYear = document.getElementById('startYear').value;
    const endYear = document.getElementById('endYear').value;

    // Create education item
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    educationItem.innerHTML = `
        <h4>${degree}</h4>
        <p>${institution}</p>
        <span>${startYear} - ${endYear || 'Present'}</span>
    `;

    // Add to education list
    document.getElementById('educationList').appendChild(educationItem);

    // Show success message
    showMessage('Education added successfully!', 'success');

    // Close modal and reset form
    closeModal(addEducationModal);
    addEducationForm.reset();
});

addSkillForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const skill = document.getElementById('skill').value;

    // Create skill tag
    const skillTag = document.createElement('span');
    skillTag.className = 'skill-tag';
    skillTag.textContent = skill;

    // Add to skills list
    document.getElementById('skillsList').appendChild(skillTag);

    // Show success message
    showMessage('Skill added successfully!', 'success');

    // Close modal and reset form
    closeModal(addSkillModal);
    addSkillForm.reset();
});

// Message handler
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

// Initialize profile
initializeProfile();

// Check if user is logged in
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'login.html';
} else {
    // Update profile information
    document.querySelector('.profile-text h1').textContent = user.name;
    document.querySelector('.profile-picture').src = user.avatar;
}

// Image Upload Handlers
editCoverBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Update cover photo
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.querySelector('.cover-photo img').src = e.target.result;
                    currentUser.coverPhoto = e.target.result;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    showMessage('Cover photo updated successfully!', 'success');
                };
                reader.readAsDataURL(file);
            } catch (error) {
                showMessage('Failed to update cover photo', 'error');
            }
        }
    };
    input.click();
});

editAvatarBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Update avatar
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.querySelector('.profile-picture img').src = e.target.result;
                    currentUser.avatar = e.target.result;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    showMessage('Profile picture updated successfully!', 'success');
                };
                reader.readAsDataURL(file);
            } catch (error) {
                showMessage('Failed to update profile picture', 'error');
            }
        }
    };
    input.click();
});

// Add loading state to buttons
function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || button.innerHTML;
    }
}

// Add confirmation for education deletion
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-education')) {
        if (confirm('Are you sure you want to delete this education entry?')) {
            e.target.closest('.education-item').remove();
            showMessage('Education entry deleted successfully!', 'success');
        }
    }
});

// Add confirmation for skill deletion
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-skill')) {
        if (confirm('Are you sure you want to delete this skill?')) {
            e.target.closest('.skill-tag').remove();
            showMessage('Skill deleted successfully!', 'success');
        }
    }
});

// Add keyboard navigation for modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal);
        }
    }
});

// Add form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Add error message
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
            errorMsg.textContent = 'This field is required';
        } else {
            input.classList.remove('error');
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });

    return isValid;
}

// Add validation to all forms
[editProfileForm, addEducationForm, addSkillForm].forEach(form => {
    form.addEventListener('submit', (e) => {
        if (!validateForm(form)) {
            e.preventDefault();
            showMessage('Please fill in all required fields', 'error');
        }
    });
});

// Social Links
addSocialLinkBtn.addEventListener('click', () => {
    openModal(addSocialLinkModal);
});

addSocialLinkForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const platform = document.getElementById('socialPlatform').value;
    const url = document.getElementById('socialUrl').value;

    // Create social link
    const socialLink = document.createElement('a');
    socialLink.href = url;
    socialLink.className = `social-link ${platform}`;
    socialLink.title = platform.charAt(0).toUpperCase() + platform.slice(1);
    
    // Set icon based on platform
    const icon = document.createElement('i');
    switch (platform) {
        case 'github':
            icon.className = 'fab fa-github';
            break;
        case 'linkedin':
            icon.className = 'fab fa-linkedin';
            break;
        case 'twitter':
            icon.className = 'fab fa-twitter';
            break;
        case 'portfolio':
            icon.className = 'fas fa-globe';
            break;
        default:
            icon.className = 'fas fa-link';
    }
    
    socialLink.appendChild(icon);
    
    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-social-link';
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.onclick = (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to remove this social link?')) {
            socialLink.remove();
            showMessage('Social link removed successfully!', 'success');
        }
    };
    
    socialLink.appendChild(deleteBtn);
    
    // Insert before the add button
    addSocialLinkBtn.parentNode.insertBefore(socialLink, addSocialLinkBtn);
    
    // Save to user data
    if (!currentUser.socialLinks) {
        currentUser.socialLinks = [];
    }
    currentUser.socialLinks.push({ platform, url });
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showMessage('Social link added successfully!', 'success');
    closeModal(addSocialLinkModal);
    addSocialLinkForm.reset();
});

// Achievements
const addAchievementBtn = document.querySelector('.add-achievement-btn');
const addAchievementModal = document.getElementById('addAchievementModal');
const addAchievementForm = document.getElementById('addAchievementForm');

addAchievementBtn.addEventListener('click', () => {
    openModal(addAchievementModal);
});

addAchievementForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('achievementTitle').value;
    const description = document.getElementById('achievementDescription').value;
    const date = document.getElementById('achievementDate').value;
    const icon = document.getElementById('achievementIcon').value;

    // Create achievement item
    const achievementItem = document.createElement('div');
    achievementItem.className = 'achievement-item';
    achievementItem.innerHTML = `
        <div class="achievement-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="achievement-info">
            <h4>${title}</h4>
            <p>${description}</p>
            <span class="achievement-date">Earned ${formatDate(date)}</span>
        </div>
        <button class="delete-achievement" title="Delete Achievement">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to achievements list
    document.getElementById('achievementsList').appendChild(achievementItem);

    // Save to user data
    if (!currentUser.achievements) {
        currentUser.achievements = [];
    }
    currentUser.achievements.push({ title, description, date, icon });
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showMessage('Achievement added successfully!', 'success');
    closeModal(addAchievementModal);
    addAchievementForm.reset();
});

// Enhanced Activity Feed
function addActivityItem(type, content, timeAgo) {
    const activityFeed = document.querySelector('.activity-feed');
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';

    let icon, title;
    switch (type) {
        case 'group':
            icon = 'users';
            title = 'Joined Study Group';
            break;
        case 'resource':
            icon = 'book';
            title = 'Shared Resource';
            break;
        case 'achievement':
            icon = 'trophy';
            title = 'Earned Achievement';
            break;
        default:
            icon = 'bell';
            title = 'New Activity';
    }

    activityItem.innerHTML = `
        <div class="activity-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="activity-content">
            <h4>${title}</h4>
            <p>${content}</p>
            <span class="activity-time">${timeAgo}</span>
            <div class="activity-actions">
                <button class="activity-action-btn" title="Like">
                    <i class="far fa-heart"></i> Like
                </button>
                <button class="activity-action-btn" title="Comment">
                    <i class="far fa-comment"></i> Comment
                </button>
                <button class="activity-action-btn" title="Share">
                    <i class="far fa-share-square"></i> Share
                </button>
            </div>
        </div>
    `;

    activityFeed.insertBefore(activityItem, activityFeed.firstChild);

    // Add event listeners for action buttons
    const likeBtn = activityItem.querySelector('.activity-action-btn[title="Like"]');
    likeBtn.addEventListener('click', () => {
        likeBtn.innerHTML = likeBtn.innerHTML.includes('far') 
            ? '<i class="fas fa-heart"></i> Liked'
            : '<i class="far fa-heart"></i> Like';
    });
}

// Helper Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
}

// Initialize social links and achievements from user data
function initializeUserData() {
    // Initialize social links
    if (currentUser.socialLinks) {
        currentUser.socialLinks.forEach(link => {
            const socialLink = document.createElement('a');
            socialLink.href = link.url;
            socialLink.className = `social-link ${link.platform}`;
            socialLink.title = link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
            
            const icon = document.createElement('i');
            switch (link.platform) {
                case 'github':
                    icon.className = 'fab fa-github';
                    break;
                case 'linkedin':
                    icon.className = 'fab fa-linkedin';
                    break;
                case 'twitter':
                    icon.className = 'fab fa-twitter';
                    break;
                case 'portfolio':
                    icon.className = 'fas fa-globe';
                    break;
                default:
                    icon.className = 'fas fa-link';
            }
            
            socialLink.appendChild(icon);
            addSocialLinkBtn.parentNode.insertBefore(socialLink, addSocialLinkBtn);
        });
    }

    // Initialize achievements
    if (currentUser.achievements) {
        currentUser.achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.className = 'achievement-item';
            achievementItem.innerHTML = `
                <div class="achievement-icon">
                    <i class="fas fa-${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    <span class="achievement-date">Earned ${formatDate(achievement.date)}</span>
                </div>
                <button class="delete-achievement" title="Delete Achievement">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.getElementById('achievementsList').appendChild(achievementItem);
        });
    }
}

// Call initialization
initializeUserData(); 