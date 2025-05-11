// DOM Elements
const chatList = document.querySelector('.chat-list');
const chatItems = document.querySelectorAll('.chat-item');
const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.querySelector('.input-wrapper input');
const sendButton = document.querySelector('.send-btn');
const searchInput = document.querySelector('.search-bar input');
const emojiButton = document.querySelector('.emoji-btn');
const attachButton = document.querySelector('.btn-icon[title="Attach File"]');

// Chat State
let currentChat = null;
let messages = [];
let unreadCounts = {};

// Emoji Picker
const emojiBtn = document.querySelector('.action-btn[title="Add Emoji"]');
let emojiPicker = null;

// Initialize chat
function initChat() {
    // Load messages for the active chat
    const activeChat = document.querySelector('.chat-item.active');
    if (activeChat) {
        currentChat = activeChat;
        loadMessages(currentChat);
    }

    // Add click handlers for chat items
    chatItems.forEach(item => {
        item.addEventListener('click', () => switchChat(item));
    });

    // Add input handlers
    messageInput.addEventListener('keypress', handleMessageInput);
    sendButton.addEventListener('click', sendMessage);
    searchInput.addEventListener('input', handleSearch);
    emojiButton.addEventListener('click', toggleEmojiPicker);
    attachButton.addEventListener('click', handleFileAttachment);
}

// Switch between chats
function switchChat(chatItem) {
    // Remove active class from current chat
    document.querySelector('.chat-item.active')?.classList.remove('active');
    
    // Add active class to new chat
    chatItem.classList.add('active');
    
    // Update current chat
    currentChat = chatItem;
    
    // Load messages for the new chat
    loadMessages(chatItem);
    
    // Clear unread count
    const unreadBadge = chatItem.querySelector('.unread');
    if (unreadBadge) {
        unreadBadge.remove();
    }
    
    // Update chat header
    updateChatHeader(chatItem);
}

// Load messages for a chat
function loadMessages(chatItem) {
    // Clear current messages
    chatMessages.innerHTML = '';
    
    // Get chat ID from data attribute
    const chatId = chatItem.dataset.chatId;
    
    // Simulate loading messages from server
    // In a real app, this would be an API call
    setTimeout(() => {
        // Add date separator
        addDateSeparator('Today');
        
        // Add sample messages
        addMessage({
            type: 'received',
            content: 'Hey, are you free for the study group?',
            time: '10:30 AM',
            sender: {
                name: 'John Doe',
                avatar: 'images/student1.png'
            }
        });
        
        addMessage({
            type: 'sent',
            content: 'Yes, I\'m available! What time?',
            time: '10:32 AM'
        });
        
        // Scroll to bottom
        scrollToBottom();
    }, 500);
}

// Add a message to the chat
function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}`;
    
    if (message.type === 'received') {
        messageElement.innerHTML = `
            <img src="${message.sender.avatar}" alt="${message.sender.name}" class="message-avatar">
            <div class="message-content">
                <p>${message.content}</p>
                <span class="message-time">${message.time}</span>
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${message.content}</p>
                <span class="message-time">${message.time}</span>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageElement);
}

// Add date separator
function addDateSeparator(date) {
    const separator = document.createElement('div');
    separator.className = 'date-separator';
    separator.innerHTML = `<span>${date}</span>`;
    chatMessages.appendChild(separator);
}

// Handle message input
function handleMessageInput(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Send message
function sendMessage() {
    const content = messageInput.value.trim();
    if (!content) return;
    
    // Create message object
    const message = {
        type: 'sent',
        content: content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Add message to chat
    addMessage(message);
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    scrollToBottom();
    
    // Simulate response (in a real app, this would be handled by the server)
    setTimeout(() => {
        addMessage({
            type: 'received',
            content: 'Thanks for your message! I\'ll get back to you soon.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: {
                name: 'John Doe',
                avatar: 'images/student1.png'
            }
        });
        scrollToBottom();
    }, 1000);
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    chatItems.forEach(item => {
        const name = item.querySelector('h3').textContent.toLowerCase();
        const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || lastMessage.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Toggle emoji picker
function toggleEmojiPicker() {
    if (!emojiPicker) {
        initEmojiPicker();
    }
    const pickerContainer = document.createElement('div');
    pickerContainer.className = 'emoji-picker-container';
    pickerContainer.appendChild(emojiPicker);
    document.body.appendChild(pickerContainer);

    // Position the picker
    const rect = emojiButton.getBoundingClientRect();
    pickerContainer.style.position = 'absolute';
    pickerContainer.style.top = `${rect.bottom + 10}px`;
    pickerContainer.style.left = `${rect.left}px`;
    pickerContainer.style.zIndex = '1000';

    // Close picker when clicking outside
    document.addEventListener('click', function closePicker(e) {
        if (!pickerContainer.contains(e.target) && e.target !== emojiButton) {
            pickerContainer.remove();
            document.removeEventListener('click', closePicker);
        }
    });
}

// Handle file attachment
function handleFileAttachment() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,application/pdf';
    
    // Handle file selection
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, this would upload the file and send a message with the file
            console.log('File selected:', file.name);
        }
    };
    
    // Trigger file input
    fileInput.click();
}

// Update chat header
function updateChatHeader(chatItem) {
    const name = chatItem.querySelector('h3').textContent;
    const avatar = chatItem.querySelector('.chat-avatar').src;
    
    document.querySelector('.chat-user-info h2').textContent = name;
    document.querySelector('.chat-user-info .chat-avatar').src = avatar;
}

// Scroll chat to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', initChat);

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        // Mobile view adjustments
        const sidebar = document.querySelector('.chat-sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }
});

function initEmojiPicker() {
    emojiPicker = new EmojiMart.Picker({
        onEmojiSelect: (emoji) => {
            messageInput.value += emoji.native;
            messageInput.focus();
        },
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
        showPreview: false,
        showSkinTones: false,
        style: {
            width: '100%',
            height: '300px'
        }
    });
}

// Message Reactions
function addReaction(messageId, emoji) {
    const message = document.querySelector(`[data-message-id="${messageId}"]`);
    if (!message) return;

    const reactionsContainer = message.querySelector('.message-reactions') || 
        (() => {
            const container = document.createElement('div');
            container.className = 'message-reactions';
            message.querySelector('.message-bubble').appendChild(container);
            return container;
        })();

    const reaction = document.createElement('div');
    reaction.className = 'reaction';
    reaction.innerHTML = `
        <span class="reaction-emoji">${emoji}</span>
        <span class="reaction-count">1</span>
    `;

    reactionsContainer.appendChild(reaction);
}

// Add reaction button click handler
document.addEventListener('click', (e) => {
    if (e.target.closest('.action-btn[title="React"]')) {
        const messageItem = e.target.closest('.message-item');
        const messageId = messageItem.dataset.messageId;
        
        // Show reaction picker
        const pickerContainer = document.createElement('div');
        pickerContainer.className = 'reaction-picker';
        pickerContainer.innerHTML = `
            <div class="quick-reactions">
                <span>👍</span>
                <span>❤️</span>
                <span>😂</span>
                <span>😮</span>
                <span>😢</span>
                <span>🙏</span>
            </div>
        `;

        // Position the picker
        const rect = e.target.getBoundingClientRect();
        pickerContainer.style.position = 'absolute';
        pickerContainer.style.top = `${rect.top - 40}px`;
        pickerContainer.style.left = `${rect.left}px`;
        pickerContainer.style.zIndex = '1000';

        document.body.appendChild(pickerContainer);

        // Handle reaction selection
        pickerContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'SPAN') {
                addReaction(messageId, e.target.textContent);
                pickerContainer.remove();
            }
        });

        // Close picker when clicking outside
        document.addEventListener('click', function closePicker(e) {
            if (!pickerContainer.contains(e.target) && e.target !== e.target.closest('.action-btn[title="React"]')) {
                pickerContainer.remove();
                document.removeEventListener('click', closePicker);
            }
        });
    }
}); 