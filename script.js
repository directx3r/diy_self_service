document.getElementById('loginButton').addEventListener('click', function() {
    const clientId = 'Ov23cttySQMaE3IwT55f';
    const redirectUri = 'https://directx3r.github.io/diy_self_service/callback.html';
    const scope = 'repo'; // Adjust the scope based on your requirements

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
});
