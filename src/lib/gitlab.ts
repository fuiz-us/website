import { env } from '$env/dynamic/private';

export async function createFileInGit(file_path: string, file_content: string): Promise<string> {
	await fetch(
		`https://gitlab.com/api/v4/projects/${
			env.GITLAB_PROJECT_ID
		}/repository/files/${encodeURIComponent(file_path)}`,
		{
			method: 'POST',
			headers: {
				'PRIVATE-TOKEN': env.GITLAB_PERSONAL_API,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				branch: 'main',
				content: file_content,
				commit_message: `add ${file_path}`
			})
		}
	);

	return `${env.GITLAB_PUBLIC_LINK}/-/raw/main/${file_path}`;
}

export async function updateFileInGit(file_path: string, file_content: string) {
	await fetch(
		`https://gitlab.com/api/v4/projects/${
			env.GITLAB_PROJECT_ID
		}/repository/files/${encodeURIComponent(file_path)}`,
		{
			method: 'PUT',
			headers: {
				'PRIVATE-TOKEN': env.GITLAB_PERSONAL_API,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				branch: 'main',
				content: file_content,
				commit_message: `update ${file_path}`
			})
		}
	);
}
