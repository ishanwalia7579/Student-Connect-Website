// DOM Elements
const calendarGrid = document.querySelector('.calendar-grid');
const currentMonthElement = document.querySelector('.current-month');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');
const viewOptions = document.querySelectorAll('.view-options .btn');
const createEventBtn = document.querySelector('.create-event');
const createEventModal = document.getElementById('createEventModal');
const eventDetailsModal = document.getElementById('eventDetailsModal');
const createEventForm = document.getElementById('createEventForm');
const closeModalBtns = document.querySelectorAll('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const eventsList = document.querySelector('.events-list');

// Calendar State
let currentDate = new Date();
let currentView = 'month';
let events = JSON.parse(localStorage.getItem('events')) || [];

// Initialize Calendar
function initCalendar() {
    updateCalendarHeader();
    renderCalendar();
    renderEventsList();
    setupEventListeners();
}

// Update Calendar Header
function updateCalendarHeader() {
    const options = { month: 'long', year: 'numeric' };
    currentMonthElement.textContent = currentDate.toLocaleDateString('en-US', options);
}

// Render Calendar
function renderCalendar() {
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // Previous month days
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
        const dayElement = createDayElement(prevMonthLastDay - i, 'other-month');
        calendarGrid.appendChild(dayElement);
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayElement = createDayElement(day, '', date);
        calendarGrid.appendChild(dayElement);
    }

    // Next month days
    const remainingDays = 42 - (startingDay + totalDays); // 42 = 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
        const dayElement = createDayElement(day, 'other-month');
        calendarGrid.appendChild(dayElement);
    }
}

// Create Day Element
function createDayElement(day, className, date) {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${className}`;
    dayElement.textContent = day;

    if (date) {
        const isToday = isSameDay(date, new Date());
        if (isToday) {
            dayElement.classList.add('today');
        }

        const hasEvents = events.some(event => isSameDay(new Date(event.date), date));
        if (hasEvents) {
            dayElement.classList.add('has-events');
        }

        dayElement.addEventListener('click', () => showDayEvents(date));
    }

    return dayElement;
}

// Render Events List
function renderEventsList() {
    eventsList.innerHTML = '';
    
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    upcomingEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsList.appendChild(eventCard);
    });
}

// Create Event Card
function createEventCard(event) {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    
    const eventDate = new Date(event.date);
    const timeString = `${event.startTime} - ${event.endTime}`;
    
    eventCard.innerHTML = `
        <div class="event-time">${eventDate.toLocaleDateString()} ${timeString}</div>
        <div class="event-title">${event.title}</div>
        <div class="event-location">
            <i class="fas fa-map-marker-alt"></i>
            ${event.location}
        </div>
    `;

    eventCard.addEventListener('click', () => showEventDetails(event));
    return eventCard;
}

// Show Event Details
function showEventDetails(event) {
    const eventDetails = document.querySelector('.event-details');
    const eventDate = new Date(event.date);
    
    eventDetails.innerHTML = `
        <div class="event-info">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
        </div>
        <div class="event-info">
            <h3>Date & Time</h3>
            <p>${eventDate.toLocaleDateString()} ${event.startTime} - ${event.endTime}</p>
        </div>
        <div class="event-info">
            <h3>Location</h3>
            <p>${event.location}</p>
        </div>
        <div class="event-info">
            <h3>Event Type</h3>
            <p>${event.type}</p>
        </div>
    `;

    eventDetailsModal.classList.add('show');
}

// Show Day Events
function showDayEvents(date) {
    const dayEvents = events.filter(event => isSameDay(new Date(event.date), date));
    
    if (dayEvents.length > 0) {
        const eventDetails = document.querySelector('.event-details');
        eventDetails.innerHTML = `
            <h3>Events on ${date.toLocaleDateString()}</h3>
            ${dayEvents.map(event => `
                <div class="event-info">
                    <h4>${event.title}</h4>
                    <p>${event.startTime} - ${event.endTime}</p>
                    <p>${event.location}</p>
                </div>
            `).join('')}
        `;
        eventDetailsModal.classList.add('show');
    }
}

// Create Event
function createEvent(eventData) {
    events.push(eventData);
    localStorage.setItem('events', JSON.stringify(events));
    renderCalendar();
    renderEventsList();
}

// Helper Functions
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Event Listeners
function setupEventListeners() {
    // Previous Month
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendarHeader();
        renderCalendar();
    });

    // Next Month
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendarHeader();
        renderCalendar();
    });

    // View Options
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            viewOptions.forEach(btn => btn.classList.remove('active'));
            option.classList.add('active');
            currentView = option.dataset.view;
            renderCalendar();
        });
    });

    // Create Event Modal
    createEventBtn.addEventListener('click', () => {
        createEventModal.classList.add('show');
    });

    // Close Modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            createEventModal.classList.remove('show');
            eventDetailsModal.classList.remove('show');
        });
    });

    cancelBtn.addEventListener('click', () => {
        createEventModal.classList.remove('show');
    });

    // Create Event Form
    createEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const eventData = {
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            startTime: document.getElementById('eventStartTime').value,
            endTime: document.getElementById('eventEndTime').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            type: document.getElementById('eventType').value
        };

        createEvent(eventData);
        createEventModal.classList.remove('show');
        createEventForm.reset();
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === createEventModal) {
            createEventModal.classList.remove('show');
        }
        if (e.target === eventDetailsModal) {
            eventDetailsModal.classList.remove('show');
        }
    });
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', initCalendar); 