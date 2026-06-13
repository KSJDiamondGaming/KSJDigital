const DEFAULT_BRANCH = 'main';

function requireConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPO || process.env.GITHUB_REPOSITORY || 'KSJHub/KSJDigital';
  const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;

  if (!token) {
    throw new Error('Missing GITHUB_TOKEN environment variable.');
  }

  if (!repository.includes('/')) {
    throw new Error('GITHUB_REPO must use owner/name format.');
  }

  return { token, repository, branch };
}

function assertSafeContentPath(path) {
  if (!path || typeof path !== 'string') throw new Error('contentFilePath is required.');
  if (!path.startsWith('content/')) throw new Error('contentFilePath must stay inside the content/ folder.');
  if (!path.endsWith('.json')) throw new Error('contentFilePath must target a JSON file.');
  if (path.includes('..')) throw new Error('contentFilePath cannot contain path traversal.');
}

function getGitHubHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

function encodeBase64(value) {
  return Buffer.from(value, 'utf8').toString('base64');
}

async function readExistingFile({ token, repository, branch, path }) {
  const url = `https://api.github.com/repos/${repository}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, { headers: getGitHubHeaders(token) });

  if (response.status === 404) return null;

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.message || `GitHub read failed with status ${response.status}.`);
  }

  return body;
}

export async function publishContentFile(preparedWrite) {
  const { token, repository, branch } = requireConfig();
  const contentFilePath = preparedWrite?.contentFilePath;
  const serialisedContent = preparedWrite?.serialisedContent;
  const commitMessage = preparedWrite?.commitMessage || `Publish content file ${contentFilePath}`;

  assertSafeContentPath(contentFilePath);

  if (!serialisedContent || typeof serialisedContent !== 'string') {
    throw new Error('serialisedContent is required.');
  }

  const existingFile = await readExistingFile({ token, repository, branch, path: contentFilePath });
  const url = `https://api.github.com/repos/${repository}/contents/${encodeURIComponent(contentFilePath).replace(/%2F/g, '/')}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: getGitHubHeaders(token),
    body: JSON.stringify({
      message: commitMessage,
      content: encodeBase64(serialisedContent),
      branch,
      sha: existingFile?.sha,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.message || `GitHub write failed with status ${response.status}.`);
  }

  return {
    ok: true,
    repository,
    branch,
    contentFilePath,
    commitSha: body?.commit?.sha,
    fileSha: body?.content?.sha,
    htmlUrl: body?.content?.html_url,
    message: 'Content file published to GitHub.',
  };
}
