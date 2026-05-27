import { fetchGithubProfile, fetchPublicRepos } from '$lib/github';

export async function load() {
  const [profile, repos] = await Promise.all([
    fetchGithubProfile(),
    fetchPublicRepos(),
  ]);

  return { profile, repos };
}
