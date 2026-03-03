import React from 'react';
import Layout from '@theme/Layout';
import HomepageHeader from '@site/src/components/HomepageHeader'
import FloatingShowcase from '@site/src/components/FloatingShowcase';
import FadingFeatures from '@site/src/components/FadingFeatures';
import Footer from '@theme/Footer';
import styles from './index.module.css';
import ObjectTicker from '@site/src/components/ObjectTicker';
import GithubMembersTicker from '@site/src/components/GithubMembersTicker';

const homepageHeaderData = {
  titleLines: ['Welcome to the', 'Altruistic Hive', 'Where', 'Happens!'],
  dynamicItems: [
    { word: 'Friendship', keyword: 'friendship' },
    { word: 'Fun', keyword: 'fun' },
    { word: 'Coding', keyword: 'coding' },
    { word: 'Learning', keyword: 'learning' },
    { word: 'Creating', keyword: 'creating' },
    { word: 'Building', keyword: 'building' },
    { word: 'Hacking', keyword: 'hacking' },
    { word: 'Growing', keyword: 'growing' },
    { word: 'Sharing', keyword: 'sharing' },
    { word: 'Exploring', keyword: 'exploring' },
  ],
  subtitle: "A crew of devs who build cool stuff, help each other out, and have a blast doing it.",
  button: { text: "Let's Go!", link: '/docs/intro' },
};

// 2. docsTickerData 데이터 (제목 및 링크 수정)
const docsTickerData = {
    title: "Topics We've Explored",
    logos: [
      { imgSrc: 'https://cdn.svgporn.com/logos/javascript.svg', href: '/docs/category/javascript', alt: 'JavaScript' },
      { imgSrc: 'https://cdn.svgporn.com/logos/java.svg', href: '/docs/category/java', alt: 'Java' },
      { imgSrc: 'https://cdn.svgporn.com/logos/python.svg', href: '/docs/category/python', alt: 'Python' },
      { imgSrc: 'https://cdn.svgporn.com/logos/react.svg', href: '/docs/category/react', alt: 'React' },
      { imgSrc: 'https://cdn.svgporn.com/logos/spring-icon.svg', href: '/docs/category/spring', alt: 'Spring' },
      { imgSrc: 'https://cdn.svgporn.com/logos/oracle.svg', href: '/docs/category/oracle-db', alt: 'Oracle DB' },
      { imgSrc: 'https://cdn.svgporn.com/logos/mysql.svg', href: '/docs/category/mysql', alt: 'MySQL' },
      { imgSrc: 'https://cdn.svgporn.com/logos/docker-icon.svg', href: '/docs/category/docker', alt: 'Docker' },
      { imgSrc: 'https://cdn.svgporn.com/logos/kubernetes.svg', href: '/docs/category/kubernetes', alt: 'Kubernetes' },
      { imgSrc: 'https://cdn.svgporn.com/logos/aws.svg', href: '/docs/category/aws', alt: 'AWS' },
      { imgSrc: 'https://cdn.svgporn.com/logos/typescript-icon.svg', href: '/docs/category/typescript', alt: 'TypeScript' },
      { imgSrc: 'https://cdn.svgporn.com/logos/nodejs-icon.svg', href: '/docs/category/nodejs', alt: 'Node.js' },
    ]
  };

// 3. FloatingShowcase 데이터
const floatingShowcaseData = [
  {
    title: "Weekend Hackathons",
    description: "Every other weekend, we pick a wild idea and build it from scratch. No rules, no deadlines — just vibes and code. Some of our best projects started as 2am jokes.",
    imageUrl: {
        light: 'https://placehold.co/800x600/fff5f5/E63B2E?text=Hack+Night',
        dark: 'https://placehold.co/800x600/1a1016/FF6B5E?text=Hack+Night',
    },
    link: '/docs/intro',
    layout: 'right',
  },
  {
    title: "Open Source Adventures",
    description: "We contribute to open source together — fixing bugs, writing docs, and shipping features. It's way less scary when your friends have your back on code reviews.",
    imageUrl: {
        light: 'https://placehold.co/800x600/f5fff5/2E8B57?text=Open+Source',
        dark: 'https://placehold.co/800x600/101a10/5EFF8B?text=Open+Source',
    },
    link: '/docs/intro',
    layout: 'left',
  },
  {
    title: "Study Groups & Tech Talks",
    description: "From algorithms to system design, we run casual study sessions where everyone teaches what they know. The best way to learn is to explain it to a friend.",
    imageUrl: {
        light: 'https://placehold.co/800x600/f5f5ff/4169E1?text=Study+Group',
        dark: 'https://placehold.co/800x600/10101a/6B8BFF?text=Study+Group',
    },
    link: '/docs/intro',
    layout: 'right',
  }
];

// 4. FadingFeatures 데이터
const fadingFeaturesData = [
    {
    title: 'Build Stuff Together',
    description: "Whether it's a side project, a startup idea, or just messing around with a new framework — we pair up and make things happen. No solo grinding here.",
    imageUrl: {
        light: 'https://placehold.co/1200x900/fff5f0/E63B2E?text=Build+Together',
        dark: 'https://placehold.co/1200x900/1a1010/FF6B5E?text=Build+Together',
    },
    tags: ['Collab', 'Projects', 'Ship It', 'Fun'],
    link: '/docs/intro',
    layout: 'imageRight',
  },
  {
    title: 'Level Up Your Skills',
    description: "We share what we learn — from debugging tricks to system design patterns. Weekly code reviews, pair programming sessions, and friendly competitions keep everyone sharp.",
    imageUrl: {
        light: 'https://placehold.co/1200x900/f0f5ff/4169E1?text=Level+Up',
        dark: 'https://placehold.co/1200x900/10101a/6B8BFF?text=Level+Up',
    },
    tags: ['Learn', 'Grow', 'Share', 'Code'],
    link: '/docs/intro',
    layout: 'imageLeft',
  },
];

export default function Home(): JSX.Element {
  return (
    <Layout noFooter>
      <div className={styles.snapContainer}>
        <HomepageHeader {...homepageHeaderData} />
        <main>
          <FloatingShowcase showcaseItems={floatingShowcaseData} />
          <FadingFeatures features={fadingFeaturesData} />
          <div className={styles.objectTickerGroup}>
            <ObjectTicker
              title="Topics We've Explored"
              objects={docsTickerData.logos}
              direction="left"
            />
            {/* 멤버 소개는 GithubMembersTicker로 대체 */}
            <GithubMembersTicker />
          </div>
        </main>
        <div className={styles.footerContainer}>
          <Footer />
        </div>
      </div>
    </Layout>
  );
}