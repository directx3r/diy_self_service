const clientId = 'Iv23lv23li330STWqvRxJbYs';
const clientSecret = 'Y1d8d6805623f127cac7d4a5f732cae0e8d7eadc3';
const redirectUri = 'https://directx3r.github.io/diy_self_service/callback.html';
const tokenEndpoint = 'https://github.com/login/oauth/access_token';
const scope = 'repo'; // Adjust based on your needs

document.getElementById('loginButton').addEventListener('click', async () => {
    const state = generateRandomString();
    localStorage.setItem('oauth_state', state);

    const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;
    window.location.href = authUrl;
});

function generateRandomString() {
    return [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, '0')).join('');
}

