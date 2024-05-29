const clientId = 'Ov23cttySQMaE3IwT55f';
const redirectUri = 'https://directx3r.github.io/diy_self_service/callback.html';
const authorizationEndpoint = 'https://github.com/login/oauth/authorize';
const tokenEndpoint = 'https://github.com/login/oauth/access_token';
const scope = 'repo'; // Adjust based on your needs

document.getElementById('loginButton').addEventListener('click', async () => {
    const state = generateRandomString();
    const codeVerifier = generateRandomString();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    localStorage.setItem('oauth_state', state);
    localStorage.setItem('code_verifier', codeVerifier);

    const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    window.location.href = authUrl;
});

function generateRandomString() {
    return [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
