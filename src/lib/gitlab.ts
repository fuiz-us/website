import { env } from '$env/dynamic/private';

export async function createFileInGit(filePath: string, fileContent: string): Promise<string> {
	await fetch(
		`https://gitlab.com/api/v4/projects/${
			env.GITLAB_PROJECT_ID
		}/repository/files/${encodeURIComponent(filePath)}`,
		{
			method: 'POST',
			headers: {
				'PRIVATE-TOKEN': env.GITLAB_PERSONAL_API,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				branch: 'main',
				content: fileContent,
				commit_message: `add ${filePath}`
			})
		}
	);

	return `${env.GITLAB_PUBLIC_LINK}/-/raw/main/${filePath}`;
}

export async function updateFileInGit(filePath: string, fileContent: string) {
	await fetch(
		`https://gitlab.com/api/v4/projects/${
			env.GITLAB_PROJECT_ID
		}/repository/files/${encodeURIComponent(filePath)}`,
		{
			method: 'PUT',
			headers: {
				'PRIVATE-TOKEN': env.GITLAB_PERSONAL_API,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				branch: 'main',
				content: fileContent,
				commit_message: `update ${filePath}`
			})
		}
	);

	return `${env.GITLAB_PUBLIC_LINK}/-/raw/main/${filePath}`;
}
