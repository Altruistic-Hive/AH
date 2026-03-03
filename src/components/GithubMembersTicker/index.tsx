import React, { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ObjectTicker from '@site/src/components/ObjectTicker';

async function fetchGithubOrgMembers(org: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/orgs/${org}/members?per_page=100`, {
      headers,
    });
    if (!res.ok) return [];
    const members = await res.json();
    return members.map((m: any) => ({
      imgSrc: m.avatar_url,
      href: m.html_url,
      alt: m.login,
    }));
  } catch {
    return [];
  }
}

export default function GithubMembersTicker() {
  const { siteConfig } = useDocusaurusContext();
  const githubToken = (siteConfig.customFields?.githubToken as string) || '';
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchGithubOrgMembers('Altruistic-Hive', githubToken || undefined).then(setMembers);
  }, [githubToken]);

  return (
    <ObjectTicker
      title="Meet Our Members"
      direction="right"
      objects={members}
    />
  );
}
