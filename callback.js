document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('oauth_state');

    if (state !== storedState) {
        console.error('State does not match');
        document.getElementById('message').innerText = 'State does not match';
        return;
    }

    if (code) {
        try {
            const token = await fetchToken(code);
            if (token.error) {
                throw new Error(token.error_description);
            }
            localStorage.setItem('github_token', token.access_token);
            document.getElementById('message').innerText = 'Login successful!';
            localStorage.removeItem('oauth_state');

            document.getElementById('userForm').style.display = 'block';

            document.getElementById('submitButton').addEventListener('click', function(event) {
                event.preventDefault();
                const username = document.getElementById('username').value;
                addUserToYaml(username, token.access_token);
            });

        } catch (error) {
            console.error('Error exchanging token:', error);
            document.getElementById('message').innerText = 'Error exchanging token: ' + error.message;
        }
    } else {
        console.error('Authorization code not found');
        document.getElementById('message').innerText = 'Authorization code not found';
    }
});

async function fetchToken(code) {
    const clientId = 'Iv23lv23li330STWqvRxJbYs';
    const clientSecret = 'Y1d8d6805623f127cac7d4a5f732cae0e8d7eadc3';
    const redirectUri = 'https://directx3r.github.io/diy_self_service/callback.html';
    const tokenEndpoint = 'https://github.com/login/oauth/access_token';

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri
        })
    });

    return response.json();
}

async function addUserToYaml(username, token) {
    const octokit = new Octokit({ auth: token });
    const repoOwner = 'directx3rdiy_github_apps';
    const repoName = 'diy_github_apps';
    const filePath = 'users.yaml';

    try {
        const { data: fileData } = await octokit.repos.getContent({
            owner: repoOwner,
            repo: repoName,
            path: filePath
        });

        const content = atob(fileData.content);
        const updatedContent = content + `\n- ${username}`;
        const updatedContentBase64 = btoa(updatedContent);

        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            message: `Add user ${username}`,
            content: updatedContentBase64,
            sha: fileData.sha
        });

        alert('User added successfully!');
    } catch (err) {
        if (err.status === 404) {
            const initialContent = `# List of users\n- ${username}`;
            const initialContentBase64 = btoa(initialContent);

            await octokit.repos.createOrUpdateFileContents({
                owner: repoOwner,
                repo: repoName,
                path: filePath,
                message: `Create users.yaml and add user ${username}`,
                content: initialContentBase64
            });

            alert('File created and user added successfully!');
        } else {
            console.error('Error updating file:', err);
            alert('Error: ' + err.message);
        }
    }
}
