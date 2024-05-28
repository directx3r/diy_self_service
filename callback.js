document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('oauth_state');
    const codeVerifier = localStorage.getItem('code_verifier');

    if (state !== storedState) {
        console.error('State does not match');
        document.getElementById('message').innerText = 'State does not match';
        return;
    }

    if (code) {
        try {
            const token = await fetchToken(code, codeVerifier);
            localStorage.setItem('github_token', token.access_token);
            document.getElementById('message').innerText = 'Login successful!';
            localStorage.removeItem('oauth_state');
            localStorage.removeItem('code_verifier');

            document.getElementById('userForm').style.display = 'block';

            document.getElementById('submitButton').addEventListener('click', function(event) {
                event.preventDefault();
                const username = document.getElementById('username').value;
                addUserToYaml(username, token.access_token);
            });

        } catch (error) {
            console.error('Error exchanging token:', error);
            document.getElementById('message').innerText = 'Error exchanging token';
        }
    } else {
        console.error('Authorization code not found');
        document.getElementById('message').innerText = 'Authorization code not found';
    }
});

async function fetchToken(code, codeVerifier) {
    const clientId = 'Ov23cttySQMaE3IwT55f';
    const redirectUri = 'https://directx3r.github.io/diy_self_service/callback.html';
    const tokenEndpoint = 'https://github.com/login/oauth/access_token';

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            code: code,
            code_verifier: codeVerifier
        })
    });

    if (!response.ok) {
        throw new Error('Token exchange failed');
    }

    return response.json();
}

function addUserToYaml(username, token) {
    const repoOwner = 'directx3r';
    const repoName = 'diy_self_service';
    const filePath = 'users.yaml';

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => {
        if (response.status === 404) {
            const initialContent = `# List of users\n- ${username}`;
            const initialContentBase64 = btoa(unescape(encodeURIComponent(initialContent)));

            return fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Create users.yaml and add user ${username}`,
                    content: initialContentBase64
                })
            });
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data && data.content) {
            const fileContent = atob(data.content);
            const fileSha = data.sha;
            const newContent = fileContent + `\n- ${username}`;
            const newContentBase64 = btoa(unescape(encodeURIComponent(newContent)));

            return fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Add user ${username}`,
                    content: newContentBase64,
                    sha: fileSha
                })
            });
        }
    })
    .then(response => {
        if (response && response.ok) {
            alert('User added successfully!');
        } else if (response) {
            response.json().then(data => {
                alert('Error: ' + data.message);
            });
        }
    })
    .catch(error => console.error('Error:', error));
}
