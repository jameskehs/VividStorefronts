alert('TEST');

async function fetchScriptSrcFromRepo(gitUsername, repoName, fileName) {
  const apiUrl = `https://api.github.com/repos/${username}/${repoName}/commits/main`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return `https://cdn.jsdelivr.net/gh/${gitUsername}/${repoName}@${data.sha}/build/${fileName}`;
  } catch (error) {
    console.error('Failed to fetch the latest commit hash:', error);
  }
}

fetchScriptSrcFromRepo('jameskehs', 'VividStorefronts', 'index.js').then((scriptSrc) => {
  if (scriptSrc) {
    $.getScript(scriptSrc);
  }
});
