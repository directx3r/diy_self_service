document.addEventListener('DOMContentLoaded', function() {
    const code = new URL(window.location.href).searchParams.get('code');
    const clientId = 'Ov23cttySQMaE3IwT55f';
    const clientSecret = '59e8d383efe87a11ed955a6b883cf0f4f753f7f3';
    const tokenUrl = `https://github.com/login/oauth/access_token`;
    
    if (code) {
        fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code: code
            })
        })
        .then(response => response.json())
        .then(data => {
            const accessToken = data.access_token;
            if (accessToken) {
                localStorage.setItem('github_token', accessToken);
                document.getElementById('message').innerText = 'Successfully authenticated!';
                document.getElementById('userForm').style.display = 'block';
            } else {
                document.getElementById('message').innerText = 'Failed to authenticate.';
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

document.getElementById('submitButton').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const token = localStorage.getItem('github_token');
    const repoOwner = 'directx3r';
    const repoName = 'diy_self_service';
    const filePath = 'users.yaml'; // Update this line based on your file location

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
            // File does not exist, create it
            const initialContent = `# List of users\n- ${username}`;
            const initialContentBase64 = btoa(initialContent);

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
        if (data.content) {
            const fileContent = atob(data.content);
            const fileSha = data.sha;
            const newContent = fileContent + `\n- ${username}`;
            const newContentBase64 = btoa(newContent);

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
});
