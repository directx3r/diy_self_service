document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const token = document.getElementById('token').value;
    const repoOwner = 'directx3r';
    const repoName = 'diy_self_service';
    const filePath = 'users.yaml';

    // GitHub API URLs
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Fetch the existing file content and its SHA
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Decode the file content from base64
        const fileContent = atob(data.content);
        const fileSha = data.sha;

        // Append the new username to the file content
        const newContent = fileContent + `\n- ${username}`;

        // Encode the new content to base64
        const newContentBase64 = btoa(newContent);

        // Update the file content on GitHub
        fetch(apiUrl, {
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
        })
        .then(response => {
            if (response.ok) {
                alert('User added successfully!');
            } else {
                response.json().then(data => {
                    alert('Error: ' + data.message);
                });
            }
        })
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));
});
