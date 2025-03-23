const homeLink = document.getElementById('home-link');
const registerLink = document.getElementById('register-link');
const findLink = document.getElementById('find-link');
const registerBtn = document.getElementById('register-btn');
const findBtn = document.getElementById('find-btn');
const footerHomeLink = document.getElementById('footer-home-link');
const footerRegisterLink = document.getElementById('footer-register-link');
const footerFindLink = document.getElementById('footer-find-link');

const homePage = document.getElementById('home-page');
const registerPage = document.getElementById('register-page');
const findPage = document.getElementById('find-page');

const registerForm = document.getElementById('register-form');
const searchForm = document.getElementById('search-form');
const searchResults = document.getElementById('search-results');

const notification = document.getElementById('notification');
const notificationMessage = document.querySelector('.notification-message');
const notificationClose = document.querySelector('.notification-close');

const currentYearEl = document.getElementById('current-year');
const donorCountElement = document.getElementById('donor-count-number');

// Initialize blood group count elements
const bloodGroupCounts = {
  'A+': document.getElementById('count-aplus'),
  'A-': document.getElementById('count-aminus'),
  'B+': document.getElementById('count-bplus'),
  'B-': document.getElementById('count-bminus'),
  'AB+': document.getElementById('count-abplus'),
  'AB-': document.getElementById('count-abminus'),
  'O+': document.getElementById('count-oplus'),
  'O-': document.getElementById('count-ominus')
};

// Navigation Functions
function showPage(page) {
  // Hide all pages
  homePage.classList.remove('active');
  registerPage.classList.remove('active');
  findPage.classList.remove('active');
  
  // Remove active class from all nav links
  homeLink.classList.remove('active');
  registerLink.classList.remove('active');
  findLink.classList.remove('active');
  
  // Show selected page and highlight nav link
  if (page === 'home') {
    homePage.classList.add('active');
    homeLink.classList.add('active');
    updateDonorStats();
  } else if (page === 'register') {
    registerPage.classList.add('active');
    registerLink.classList.add('active');
  } else if (page === 'find') {
    findPage.classList.add('active');
    findLink.classList.add('active');
  }
}

// Notification System
function showNotification(message, type = 'success') {
  notificationMessage.textContent = message;
  notification.className = 'notification ' + type;
  notification.classList.remove('hide');
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.add('hide');
  }, 3000);
}

// Data Functions
function getDonors() {
  const donors = localStorage.getItem('donors');
  return donors ? JSON.parse(donors) : [];
}

function saveDonor(donor) {
  const donors = getDonors();
  donors.push({
    id: Date.now(),
    ...donor
  });
  localStorage.setItem('donors', JSON.stringify(donors));
  updateDonorStats();
}



function searchDonors(bloodGroup, location = '') {
  const donors = getDonors();
  return donors.filter(donor => 
    donor.bloodGroup === bloodGroup && 
    (location === '' || donor.location.toLowerCase().includes(location.toLowerCase()))
  );
}

function updateDonorStats() {
  const donors = getDonors();
  donorCountElement.textContent = donors.length;
  
  // Reset all blood group counts to 0
  Object.keys(bloodGroupCounts).forEach(group => {
    bloodGroupCounts[group].textContent = 0;
  });
  
  // Update count for each blood group
  donors.forEach(donor => {
    if (bloodGroupCounts[donor.bloodGroup]) {
      const currentCount = parseInt(bloodGroupCounts[donor.bloodGroup].textContent);
      bloodGroupCounts[donor.bloodGroup].textContent = currentCount + 1;
    }
  });
}

// Event Listeners for Navigation
homeLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('home');
});

registerLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('register');
});

findLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('find');
});

registerBtn.addEventListener('click', () => {
  showPage('register');
});

findBtn.addEventListener('click', () => {
  showPage('find');
});

footerHomeLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('home');
});

footerRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('register');
});

footerFindLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('find');
});

// Form Submissions
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const bloodGroup = document.getElementById('bloodGroup').value;
  const location = document.getElementById('location').value.trim();
  const contact = document.getElementById('contact').value.trim();
  
  if (!name || !bloodGroup || !location || !contact) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  saveDonor({ name, bloodGroup, location,contact });
  showNotification('Thank you for registering as a donor!', 'success');
  
  // Reset form
  registerForm.reset();
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const bloodGroup = document.getElementById('searchBloodGroup').value;
  const location = document.getElementById('searchLocation').value.trim();
  
  if (!bloodGroup) {
    showNotification('Please select a blood group', 'warning');
    return;
  }
  
  const results = searchDonors(bloodGroup, location);
  displaySearchResults(results);
});

function displaySearchResults(results) {
  searchResults.innerHTML = '';
  
  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="no-results">
        <h3>No donors found</h3>
        <p>Try changing your search criteria or check back later.</p>
      </div>
    `;
    return;
  }

  results.forEach(donor => {
    const donorCard = document.createElement('div');
    donorCard.className = 'donor-card';
    donorCard.innerHTML = `
      <div class="donor-header">
        <div class="donor-name">${donor.name}</div>
        <div class="blood-group-badge">${donor.bloodGroup}</div>
      </div>
      <div class="donor-location">${donor.location}</div>
      <div class="donor-contact">
        <a href="https://wa.me/${donor.contact}" class="btn secondary-btn">WhatsApp</a>
      </div>
    `;
    searchResults.appendChild(donorCard);
  });
}


// Close notification
notificationClose.addEventListener('click', () => {
  notification.classList.add('hide');
});

// Update current year in footer
currentYearEl.textContent = new Date().getFullYear();

// Initialize app
function init() {
  updateDonorStats();
  showPage('home');
}

init();