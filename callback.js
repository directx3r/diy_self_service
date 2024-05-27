document.addEventListener('DOMContentLoaded', () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const state = hashParams.get('state');
    const storedState = localStorage.getItem('oauth_state');

   // if (state !== storedState) {
   //     console.error('State does not match');
   //     return;
   // }

    if (accessToken) {
        console.log('Access Token:', accessToken);
        localStorage.setItem('github_token', accessToken);
        document.body.innerHTML += '<p>Login successful!</p>';
        localStorage.removeItem('oauth_state');

        // Perform further actions with the token if necessary
    } else {
        console.error('Access token not found');
    }
});
