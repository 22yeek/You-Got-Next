// Set inactivity timeout in milliseconds (e.g., 5 minutes = 300000 ms)
const INACTIVITY_TIMEOUT_MINUTES = 1; // 5 minutes
const INACTIVITY_TIMEOUT = INACTIVITY_TIMEOUT_MINUTES * 60 * 1000; // Convert to milliseconds

let inactivityTimer;

// Function to redirect to homepage after inactivity
function redirectToHomePage() {
    window.location.href = '/'; // Redirect to homepage
}

// Function to reset the inactivity timer
function resetInactivityTimer() {
    // Clear the existing timer
    clearTimeout(inactivityTimer);

    // Start a new inactivity timer
    inactivityTimer = setTimeout(redirectToHomePage, INACTIVITY_TIMEOUT);
}

// Attach event listeners to track user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);

// Initialize the inactivity timer when the page loads
resetInactivityTimer();