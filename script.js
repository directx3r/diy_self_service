const clientId = 'Ov23cttySQMaE3IwT55f';
const redirectUri = 'https://directx3r.github.io/diy_self_service/callback.html';
const authorizationEndpoint = 'https://github.com/login/oauth/authorize';
const scope = 'repo'; // Adjust the scope based on your requirements

document.getElementById('loginButton').addEventListener('click', () => {
    const state = generateRandomString();
    localStorage.setItem('oauth_state', state);

    const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=token&state=${state}`;
    window.location.href = authUrl;
});

function generateRandomString() {
    return [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
}
