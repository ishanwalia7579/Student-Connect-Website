// DOM Elements
const createGroupBtn = document.querySelector('.create-group-btn');
const createGroupModal = document.getElementById('createGroupModal');
const closeModalBtn = document.querySelector('.close-modal');
const createGroupForm = document.querySelector('.create-group-form');
const searchInput = document.querySelector('.search-bar input');
const filterSelects = document.querySelectorAll('.filter-select');
const joinButtons = document.querySelectorAll('.join-btn');
const connectButtons = document.querySelectorAll('.connect-btn');
const messageButtons = document.querySelectorAll('.message-btn');
const filtersSidebar = document.querySelector('.filters-sidebar');
const viewButtons = document.querySelectorAll('.view-btn');
const studentsGrid = document.querySelector('.students-grid');
const studyGroupsGrid = document.querySelector('.study-groups-grid');
const applyFiltersBtn = document.querySelector('.apply-filters-btn');
const tagsInput = document.querySelector('.tags-input input');
const selectedTags = document.querySelector('.selected-tags');

// State
let currentView = 'grid';
let selectedFilters = {
    courses: [],
    yearLevels: [],
    interests: []
};
let tags = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    loadStudents();
    loadStudyGroups();
    setupEventListeners();
});

// Initialize Filters
function initializeFilters() {
    const filterOptions = document.querySelectorAll('.filter-option input');
    filterOptions.forEach(option => {
        option.addEventListener('change', () => {
            const filterType = option.closest('.filter-group').querySelector('h3').textContent.toLowerCase();
            const value = option.value;

            if (option.checked) {
                switch (filterType) {
                    case 'course':
                        selectedFilters.courses.push(value);
                        break;
                    case 'year level':
                        selectedFilters.yearLevels.push(value);
                        break;
                    case 'study interests':
                        selectedFilters.interests.push(value);
                        break;
                }
            } else {
                switch (filterType) {
                    case 'course':
                        selectedFilters.courses = selectedFilters.courses.filter(c => c !== value);
                        break;
                    case 'year level':
                        selectedFilters.yearLevels = selectedFilters.yearLevels.filter(y => y !== value);
                        break;
                    case 'study interests':
                        selectedFilters.interests = selectedFilters.interests.filter(i => i !== value);
                        break;
                }
            }
        });
    });
}

// Load Students
function loadStudents() {
    // Simulate loading students from server
    const students = [
        {
            id: 1,
            name: 'John Doe',
            course: 'Computer Science',
            year: 'Third Year',
            interests: ['Programming', 'AI', 'Web Dev'],
            avatar: 'images/student1.jpg',
            status: 'online'
        },
        // Add more students here
    ];

    renderStudents(students);
}

// Render Students
function renderStudents(students) {
    studentsGrid.innerHTML = students.map(student => `
        <div class="student-card" data-student-id="${student.id}">
            <div class="student-header">
                <img src="${student.avatar}" alt="${student.name}" class="student-avatar">
                <div class="student-status ${student.status}"></div>
            </div>
            <div class="student-info">
                <h3>${student.name}</h3>
                <p class="student-course">${student.course}</p>
                <p class="student-year">${student.year}</p>
                <div class="student-interests">
                    ${student.interests.map(interest => `
                        <span class="interest-tag">${interest}</span>
                    `).join('')}
                </div>
            </div>
            <div class="student-actions">
                <button class="action-btn connect-btn" onclick="connectWithStudent(${student.id})">
                    <i class="fas fa-user-plus"></i> Connect
                </button>
                <button class="action-btn message-btn" onclick="messageStudent(${student.id})">
                    <i class="fas fa-comment"></i> Message
                </button>
            </div>
        </div>
    `).join('');
}

// Load Study Groups
function loadStudyGroups() {
    // Simulate loading study groups from server
    const groups = [
        {
            id: 1,
            name: 'AI & Machine Learning',
            description: 'Study group for AI and ML enthusiasts',
            members: 15,
            memberAvatars: [
                'images/student1.jpg',
                'images/student2.jpg',
                'images/student3.jpg'
            ],
            tags: ['Computer Science', 'AI'],
            avatar: 'images/group1.jpg'
        },
        // Add more groups here
    ];

    renderStudyGroups(groups);
}

// Render Study Groups
function renderStudyGroups(groups) {
    studyGroupsGrid.innerHTML = groups.map(group => `
        <div class="group-card" data-group-id="${group.id}">
            <div class="group-header">
                <img src="${group.avatar}" alt="${group.name}" class="group-avatar">
                <div class="group-members">
                    <span>${group.members} members</span>
                    <div class="member-avatars">
                        ${group.memberAvatars.map(avatar => `
                            <img src="${avatar}" alt="Member">
                        `).join('')}
                        <span class="more-members">+${group.members - 3}</span>
                    </div>
                </div>
            </div>
            <div class="group-info">
                <h3>${group.name}</h3>
                <p>${group.description}</p>
                <div class="group-tags">
                    ${group.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
            </div>
            <div class="group-actions">
                <button class="action-btn join-btn" onclick="joinGroup(${group.id})">
                    <i class="fas fa-sign-in-alt"></i> Join Group
                </button>
            </div>
        </div>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    // View toggle
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            updateView();
        });
    });

    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Apply filters
    applyFiltersBtn.addEventListener('click', applyFilters);

    // Tags input
    tagsInput.addEventListener('keydown', handleTagInput);

    // Create group form
    createGroupForm.addEventListener('submit', handleCreateGroup);
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const studentCards = document.querySelectorAll('.student-card');
    const groupCards = document.querySelectorAll('.group-card');

    studentCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const course = card.querySelector('.student-course').textContent.toLowerCase();
        const interests = Array.from(card.querySelectorAll('.interest-tag'))
            .map(tag => tag.textContent.toLowerCase());

        if (name.includes(searchTerm) || 
            course.includes(searchTerm) || 
            interests.some(interest => interest.includes(searchTerm))) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    groupCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag'))
            .map(tag => tag.textContent.toLowerCase());

        if (name.includes(searchTerm) || 
            description.includes(searchTerm) || 
            tags.some(tag => tag.includes(searchTerm))) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Apply Filters
function applyFilters() {
    const studentCards = document.querySelectorAll('.student-card');
    const groupCards = document.querySelectorAll('.group-card');

    studentCards.forEach(card => {
        const course = card.querySelector('.student-course').textContent.toLowerCase();
        const year = card.querySelector('.student-year').textContent.toLowerCase();
        const interests = Array.from(card.querySelectorAll('.interest-tag'))
            .map(tag => tag.textContent.toLowerCase());

        const matchesCourse = selectedFilters.courses.length === 0 || 
            selectedFilters.courses.some(c => course.includes(c));
        const matchesYear = selectedFilters.yearLevels.length === 0 || 
            selectedFilters.yearLevels.some(y => year.includes(y));
        const matchesInterests = selectedFilters.interests.length === 0 || 
            selectedFilters.interests.some(i => interests.includes(i));

        if (matchesCourse && matchesYear && matchesInterests) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    // Similar filtering for study groups
    groupCards.forEach(card => {
        const tags = Array.from(card.querySelectorAll('.tag'))
            .map(tag => tag.textContent.toLowerCase());

        const matchesInterests = selectedFilters.interests.length === 0 || 
            selectedFilters.interests.some(i => tags.includes(i));

        if (matchesInterests) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Handle Tag Input
function handleTagInput(e) {
    if (e.key === 'Enter' && e.target.value.trim()) {
        e.preventDefault();
        const tag = e.target.value.trim();
        if (!tags.has(tag)) {
            tags.add(tag);
            renderTags();
        }
        e.target.value = '';
    }
}

// Render Tags
function renderTags() {
    selectedTags.innerHTML = Array.from(tags).map(tag => `
        <span class="tag">
            ${tag}
            <button class="remove-tag" onclick="removeTag('${tag}')">
                <i class="fas fa-times"></i>
            </button>
        </span>
    `).join('');
}

// Remove Tag
function removeTag(tag) {
    tags.delete(tag);
    renderTags();
}

// Handle Create Group
function handleCreateGroup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const groupData = {
        name: formData.get('name'),
        description: formData.get('description'),
        course: formData.get('course'),
        tags: Array.from(tags)
    };

    // In a real app, this would send the data to the server
    console.log('Creating group:', groupData);
    closeModal(document.getElementById('createGroupModal'));
}

// Connect with Student
function connectWithStudent(studentId) {
    // In a real app, this would send a connection request
    console.log('Connecting with student:', studentId);
    showMessage('Connection request sent!', 'success');
}

// Message Student
function messageStudent(studentId) {
    // In a real app, this would open the chat with the student
    console.log('Messaging student:', studentId);
    window.location.href = `chat.html?student=${studentId}`;
}

// Join Group
function joinGroup(groupId) {
    // In a real app, this would send a join request
    console.log('Joining group:', groupId);
    showMessage('Join request sent!', 'success');
}

// Update View
function updateView() {
    if (currentView === 'list') {
        studentsGrid.style.gridTemplateColumns = '1fr';
        studyGroupsGrid.style.gridTemplateColumns = '1fr';
    } else {
        studentsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        studyGroupsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    }
}

// Helper Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showMessage(message, type = 'info') {
    // In a real app, this would show a toast notification
    console.log(`${type}: ${message}`);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeFilters,
        loadStudents,
        loadStudyGroups,
        handleSearch,
        applyFilters,
        handleTagInput,
        handleCreateGroup,
        connectWithStudent,
        messageStudent,
        joinGroup
    };
}

// Modal Functions
function openModal() {
    createGroupModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    createGroupModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
createGroupBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === createGroupModal) {
        closeModal();
    }
});

// Create Group Form Handler
if (createGroupForm) {
    createGroupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createGroupForm);
        const data = Object.fromEntries(formData);
        
        try {
            // Here you would typically make an API call to your backend
            console.log('Creating group:', data);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Close modal and show success message
            closeModal();
            alert('Study group created successfully!');
            createGroupForm.reset();
            
            // Refresh the page or update the UI
            location.reload();
        } catch (error) {
            console.error('Failed to create group:', error);
            alert('Failed to create study group. Please try again.');
        }
    });
}

// Search Functionality
if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterGroups(searchTerm);
    }, 300));
}

// Filter Functionality
filterSelects.forEach(select => {
    select.addEventListener('change', () => {
        const courseFilter = filterSelects[0].value;
        const yearFilter = filterSelects[1].value;
        filterGroups(searchInput.value.toLowerCase(), courseFilter, yearFilter);
    });
});

// Join Group Buttons
joinButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const groupCard = button.closest('.group-card');
        const groupName = groupCard.querySelector('h3').textContent;
        
        try {
            // Here you would typically make an API call to your backend
            console.log('Joining group:', groupName);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Update button state
            button.textContent = 'Joined';
            button.disabled = true;
            button.style.background = '#28a745';
            
            // Show success message
            alert(`Successfully joined ${groupName}!`);
        } catch (error) {
            console.error('Failed to join group:', error);
            alert('Failed to join group. Please try again.');
        }
    });
});

// Connect Buttons
connectButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const studentCard = button.closest('.student-card');
        const studentName = studentCard.querySelector('h3').textContent;
        
        try {
            // Here you would typically make an API call to your backend
            console.log('Connecting with:', studentName);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Update button state
            button.innerHTML = '<i class="fas fa-check"></i> Connected';
            button.disabled = true;
            button.style.background = '#28a745';
            
            // Show success message
            alert(`Successfully connected with ${studentName}!`);
        } catch (error) {
            console.error('Failed to connect:', error);
            alert('Failed to connect. Please try again.');
        }
    });
});

// Message Buttons
messageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const studentCard = button.closest('.student-card');
        const studentName = studentCard.querySelector('h3').textContent;
        
        // Redirect to chat page with the student
        window.location.href = `chat.html?user=${encodeURIComponent(studentName)}`;
    });
});

// Helper Functions
function filterGroups(searchTerm = '', courseFilter = '', yearFilter = '') {
    const groupCards = document.querySelectorAll('.group-card');
    
    groupCards.forEach(card => {
        const groupName = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.group-description').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const matchesSearch = groupName.includes(searchTerm) || 
                            description.includes(searchTerm) ||
                            tags.some(tag => tag.includes(searchTerm));
        
        const matchesCourse = !courseFilter || tags.some(tag => tag.includes(courseFilter.toLowerCase()));
        const matchesYear = !yearFilter || tags.some(tag => tag.includes(yearFilter.toLowerCase()));
        
        if (matchesSearch && matchesCourse && matchesYear) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize tooltips
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 5}px`;
        tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    });
    
    element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
}); 