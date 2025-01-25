// Get the screen-saver container
const screenSaver = document.getElementById('screen-saver');

// Add click event listener
screenSaver.addEventListener('click', function() {
    console.log('SS clicked');

    // Add a class to start the right-to-left transition
    screenSaver.classList.add('clicked');

    // Wait for the animation duration (0.5s) before navigating
    setTimeout(function() {
        // Redirect to the new page
        window.location.href = 'src/waitlist';  // Replace with your target URL
    }, 500);  // 500ms corresponds to the duration of the transition
});
