// API endpoints
const API_BASE_URL = 'http://localhost:3000/api';
const RESOURCES_ENDPOINT = `${API_BASE_URL}/resources`;

// DOM Elements
const searchInput = document.getElementById('search-input');
const filterSelects = document.querySelectorAll('.filter-select');
const filterTags = document.querySelectorAll('.filter-tag');
const uploadBtn = document.getElementById('upload-btn');
const uploadModal = document.getElementById('upload-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const previewModal = document.getElementById('preview-modal');
const resourcesContainer = document.querySelector('.resources-grid');
const uploadForm = document.getElementById('upload-form');
const fileUploadArea = document.getElementById('file-upload-area');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const fileInfoContent = document.getElementById('file-info-content');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');
const removeFileBtn = document.getElementById('remove-file');
const uploadSubmitBtn = document.getElementById('upload-submit-btn');

// State
let resources = [];
let filteredResources = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadResources();
    setupEventListeners();
});

function setupEventListeners() {
    // Search input with debounce
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Filter changes
    filterSelects.forEach(select => {
        select.addEventListener('change', handleFilters);
    });

    // Filter tags
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filterType = tag.dataset.filter;
            const filterValue = tag.dataset.value;
            const select = document.querySelector(`select[data-filter="${filterType}"]`);
            if (select) {
                select.value = filterValue;
                handleFilters();
            }
        });
    });

    // Modal controls
    uploadBtn.addEventListener('click', () => {
        uploadModal.classList.add('active');
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            uploadModal.classList.remove('active');
            previewModal.classList.remove('active');
            resetUploadForm();
        });
    });

    // File upload handling
    setupFileUpload();
}

// Load resources from API
async function loadResources() {
    try {
        const response = await fetch(RESOURCES_ENDPOINT);
        if (!response.ok) throw new Error('Failed to load resources');
        
        resources = await response.json();
        filteredResources = [...resources];
        renderResources();
    } catch (error) {
        console.error('Error loading resources:', error);
        showError('Failed to load resources. Please try again later.');
    }
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    filteredResources = resources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    renderResources();
}

// Filter functionality
function handleFilters() {
    const subject = document.getElementById('subject-filter').value;
    const type = document.getElementById('type-filter').value;
    const sort = document.getElementById('sort-filter').value;

    filteredResources = resources.filter(resource => {
        if (subject && resource.subject !== subject) return false;
        if (type && resource.type !== type) return false;
        return true;
    });

    // Sort resources
    switch (sort) {
        case 'recent':
            filteredResources.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'popular':
            filteredResources.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'rating':
            filteredResources.sort((a, b) => b.rating - a.rating);
            break;
    }

    renderResources();
}

// File upload handling
function setupFileUpload() {
    const dropZone = fileUploadArea;

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    removeFileBtn.addEventListener('click', removeFile);

    // Form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!fileInput.files[0]) {
            showError('Please select a file to upload');
            return;
        }

        const formData = new FormData(uploadForm);
        
        try {
            uploadSubmitBtn.disabled = true;
            uploadSubmitBtn.innerHTML = '<div class="spinner"></div> Uploading...';

            const response = await fetch(`${RESOURCES_ENDPOINT}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const newResource = await response.json();
            resources.unshift(newResource);
            filteredResources = [...resources];
            renderResources();

            showSuccess('Resource uploaded successfully!');
            uploadModal.classList.remove('active');
            resetUploadForm();
        } catch (error) {
            console.error('Upload error:', error);
            showError(error.message || 'Failed to upload resource. Please try again.');
        } finally {
            uploadSubmitBtn.disabled = false;
            uploadSubmitBtn.textContent = 'Upload Resource';
        }
    });
}

function handleFiles(files) {
    const file = files[0];
    if (!file) return;

    fileInput.files = files;
    showFileInfo(file);
}

function showFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.classList.add('active');
}

function removeFile() {
    fileInput.value = '';
    fileInfo.classList.remove('active');
}

function resetUploadForm() {
    uploadForm.reset();
    removeFile();
}

// Preview functionality
async function handlePreview(resourceId) {
    try {
        const response = await fetch(`${RESOURCES_ENDPOINT}/${resourceId}`);
        if (!response.ok) throw new Error('Failed to load resource details');
        
        const resource = await response.json();
        
        // Update preview modal content
        document.getElementById('preview-title').textContent = resource.title;
        document.getElementById('preview-description').textContent = resource.description;
        document.getElementById('preview-subject').textContent = resource.subject;
        document.getElementById('preview-type').textContent = resource.type;
        document.getElementById('preview-uploader').textContent = resource.uploader;
        document.getElementById('preview-date').textContent = formatDate(resource.date);
        document.getElementById('preview-rating').textContent = resource.rating.toFixed(1);
        document.getElementById('preview-downloads').textContent = formatNumber(resource.downloads);
        document.getElementById('preview-views').textContent = formatNumber(resource.views);
        document.getElementById('preview-comments').textContent = formatNumber(resource.comments);

        // Show preview modal
        previewModal.classList.add('active');
    } catch (error) {
        console.error('Preview error:', error);
        showError('Failed to load resource preview');
    }
}

// Download functionality
async function handleDownload(resourceId) {
    try {
        const response = await fetch(`${RESOURCES_ENDPOINT}/${resourceId}/download`);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = ''; // Let the server set the filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Download error:', error);
        showError('Failed to download resource');
    }
}

// Render resources
function renderResources() {
    resourcesContainer.innerHTML = filteredResources.map(resource => `
        <div class="resource-card">
            <div class="resource-header">
                <h3>${resource.title}</h3>
                <div class="resource-rating">
                    <span class="rating-value">${resource.rating.toFixed(1)}</span>
                    <span class="rating-stars">${'★'.repeat(Math.round(resource.rating))}${'☆'.repeat(5 - Math.round(resource.rating))}</span>
                </div>
            </div>
            <p class="resource-description">${resource.description}</p>
            <div class="resource-meta">
                <span class="resource-subject">${resource.subject}</span>
                <span class="resource-type">${resource.type}</span>
            </div>
            <div class="resource-tags">
                ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="resource-stats">
                <span><i class="fas fa-download"></i> ${formatNumber(resource.downloads)}</span>
                <span><i class="fas fa-eye"></i> ${formatNumber(resource.views)}</span>
                <span><i class="fas fa-comments"></i> ${formatNumber(resource.comments)}</span>
            </div>
            <div class="resource-actions">
                <button class="preview-btn" onclick="handlePreview('${resource.id}')">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button class="download-btn" onclick="handleDownload('${resource.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `).join('');
}

// Utility functions
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

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
} 