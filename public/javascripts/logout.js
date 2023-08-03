// Client-side script to handle logout form submission
document.getElementById('logoutForm').addEventListener('submit', function (event) {
    event.preventDefault();

    fetch('/logout', {
        method: 'POST',
    })
        .then((response) => {
            if (response.ok) {
                // On successful logout, reload the page to show the login form
                location.reload();
            }
        })
        .catch((error) => {
            console.error('Error during logout:', error);
        });
});