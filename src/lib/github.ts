import axios from 'axios';

export type GithubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
};

export type GithubRepo = {
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  image_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  archived: boolean;
  updated_at: string;
};

type GithubRepoResponse = Omit<GithubRepo, 'description' | 'image_url'> & {
  fork: boolean;
  description: string | null;
};

const githubToken = process.env.GITHUB_TOKEN;
const githubHeaders = githubToken ? { Authorization: `Bearer ${githubToken}` } : undefined;

export async function fetchGithubProfile(username = 'watchakorn-18k'): Promise<GithubProfile | null> {
  try {
    const response = await axios.get<GithubProfile>(`https://api.github.com/users/${username}`, {
      headers: githubHeaders,
    });

    return {
      login: response.data.login,
      name: response.data.name,
      avatar_url: response.data.avatar_url,
      html_url: response.data.html_url,
      followers: response.data.followers,
      following: response.data.following,
    };
  } catch {
    return null;
  }
}

export async function fetchPublicRepos(username = 'watchakorn-18k'): Promise<GithubRepo[]> {
  let response;

  try {
    response = await axios.get<GithubRepoResponse[]>(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      { headers: githubHeaders }
    );
  } catch {
    return [];
  }

  const repos = response.data.filter((repo) => !repo.fork);

  return repos.map((repo) => ({
    name: repo.name,
    description: repo.description ?? 'No description provided.',
    html_url: repo.html_url,
    homepage: repo.homepage || null,
    image_url: `https://opengraph.githubassets.com/watchakorn-18k/${username}/${repo.name}`,
    language: repo.language,
    topics: repo.topics ?? [],
    stargazers_count: repo.stargazers_count,
    archived: repo.archived,
    updated_at: repo.updated_at,
  }));
}
