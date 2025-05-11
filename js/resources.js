// DOM Elements
const uploadBtn = document.querySelector('.upload-btn');
const uploadModal = document.getElementById('uploadModal');
const closeModalBtn = document.querySelector('.close-modal');
const uploadForm = document.querySelector('.upload-form');
const searchInput = document.querySelector('.search-bar input');
const filterSelects = document.querySelectorAll('.filter-select');
const downloadButtons = document.querySelectorAll('.download-btn');
const shareButtons = document.querySelectorAll('.share-btn');

// Modal Functions
function openModal() {
    uploadModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    uploadModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
uploadBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
        closeModal();
    }
});

// Upload Form Handler
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        
        try {
            // Here you would typically make an API call to your backend
            console.log('Uploading resource:', Object.fromEntries(formData));
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Close modal and show success message
            closeModal();
            alert('Resource uploaded successfully!');
            uploadForm.reset();
            
            // Refresh the page or update the UI
            location.reload();
        } catch (error) {
            console.error('Failed to upload resource:', error);
            alert('Failed to upload resource. Please try again.');
        }
    });
}

// Search Functionality
if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterResources(searchTerm);
    }, 300));
}

// Filter Functionality
filterSelects.forEach(select => {
    select.addEventListener('change', () => {
        const subjectFilter = filterSelects[0].value;
        const typeFilter = filterSelects[1].value;
        filterResources(searchInput.value.toLowerCase(), subjectFilter, typeFilter);
    });
});

// Download Buttons
downloadButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const resourceCard = button.closest('.resource-card');
        const resourceName = resourceCard.querySelector('h3').textContent;
        
        try {
            // Here you would typically make an API call to your backend
            console.log('Downloading resource:', resourceName);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Show success message
            alert(`Downloading ${resourceName}...`);
            
            // In a real application, you would trigger the file download here
            // window.location.href = `/api/resources/download/${resourceId}`;
        } catch (error) {
            console.error('Failed to download resource:', error);
            alert('Failed to download resource. Please try again.');
        }
    });
});

// Share Buttons
shareButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const resourceCard = button.closest('.resource-card');
        const resourceName = resourceCard.querySelector('h3').textContent;
        
        try {
            // Here you would typically make an API call to your backend
            console.log('Sharing resource:', resourceName);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Show share options
            const shareUrl = `${window.location.origin}/resources/${encodeURIComponent(resourceName)}`;
            
            if (navigator.share) {
                // Use Web Share API if available
                await navigator.share({
                    title: resourceName,
                    text: 'Check out this study resource!',
                    url: shareUrl
                });
            } else {
                // Fallback to copying link
                await navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Failed to share resource:', error);
            alert('Failed to share resource. Please try again.');
        }
    });
});

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

function filterResources(searchTerm = '', subjectFilter = '', typeFilter = '') {
    const resourceCards = document.querySelectorAll('.resource-card');
    
    resourceCards.forEach(card => {
        const resourceName = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.resource-description').textContent.toLowerCase();
        const subject = card.querySelector('.subject').textContent.toLowerCase();
        const type = card.querySelector('.resource-type i').className.toLowerCase();
        
        const matchesSearch = resourceName.includes(searchTerm) || 
                            description.includes(searchTerm);
        
        const matchesSubject = !subjectFilter || subject.includes(subjectFilter.toLowerCase());
        const matchesType = !typeFilter || type.includes(typeFilter.toLowerCase());
        
        if (matchesSearch && matchesSubject && matchesType) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// File Upload Preview
const fileInput = document.querySelector('input[type="file"]');
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Here you could add file validation
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert('File size exceeds 10MB limit');
                fileInput.value = '';
                return;
            }
            
            // Update UI to show selected file
            const fileName = file.name;
            const fileType = file.type;
            console.log('Selected file:', fileName, fileType);
        }
    });
} 