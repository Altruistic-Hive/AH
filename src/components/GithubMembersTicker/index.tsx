import React, { useEffect, useState } from 'react';
import ObjectTicker from '@site/src/components/ObjectTicker';

async function fetchGithubOrgMembers(org: string) {
  const token = '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';
  const res = await fetch(`https://api.github.com/orgs/${org}/members?per_page=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) return [];
  const members = await res.json();
  return members.map((m: any) => ({
    imgSrc: m.avatar_url,
    href: m.html_url,
    alt: m.login,
  }));
}

export default function GithubMembersTicker() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchGithubOrgMembers('Altruistic-Hive').then(setMembers);
  }, []);

  return (
    <ObjectTicker
      title="Meet Our Members"
      direction="right"
      objects={members}
    />
  );
} 