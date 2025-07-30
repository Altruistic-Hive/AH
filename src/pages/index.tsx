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
  titleLines: ['The', 'Altruistic', 'Hive', 'Where', 'Thrives.'],
  dynamicItems: [
    { word: 'Collaboration', keyword: 'collaboration' },
    { word: 'Synergy', keyword: 'synergy' },
    { word: 'Teamwork', keyword: 'teamwork' },
    { word: 'Unity', keyword: 'unity' },
    { word: 'Partnership', keyword: 'partnership' },
    { word: 'Innovation', keyword: 'innovation' },
    { word: 'Creativity', keyword: 'creativity' },
    { word: 'Growth', keyword: 'growth' },
    { word: 'Potential', keyword: 'potential' },
    { word: 'Excellence', keyword: 'excellence' },
    { word: 'Progress', keyword: 'progress' },
    { word: 'Community', keyword: 'community' },
    { word: 'Support', keyword: 'support' },
    { word: 'Kindness', keyword: 'kindness' },
    { word: 'Trust', keyword: 'trust' },
    { word: 'Knowledge', keyword: 'knowledge' },
    { word: 'Passion', keyword: 'passion' },
    { word: 'Purpose', keyword: 'purpose' },
    { word: 'Impact', keyword: 'impact' },
    { word: 'Solutions', keyword: 'solutions' },
    { word: 'Code', keyword: 'code' },
  ],
  subtitle: "A Developer & Researcher's journey through code and data.",
  button: { text: 'View My Work', link: '/docs/intro' },
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
    title: "Generative Models for Complex Data Synthesis",
    description: "Published at NeurIPS 2024, this paper explores novel diffusion-based architectures for generating high-fidelity tabular data, achieving state-of-the-art results.",
    imageUrl: {
        light: 'https://placehold.co/800x600/e9f5f5/000000?text=NeurIPS+2024+Paper',
        dark: 'https://placehold.co/800x600/1a2a2a/ffffff?text=NeurIPS+2024+Paper',
    },
    link: '/docs/paper/generative-models',
    layout: 'right',
  },
  {
    title: "Real-time Anomaly Detection System",
    description: "An open-source streaming platform that processes millions of events per second to detect anomalies using Isolation Forests and autoencoders. Built with Go and Kafka.",
    imageUrl: {
        light: 'https://placehold.co/800x600/f9f3e7/000000?text=Open+Source+Project',
        dark: 'https://placehold.co/800x600/2a231a/ffffff?text=Open+Source+Project',
    },
    link: 'https://github.com/your-username/anomaly-detection',
    layout: 'left',
  },
  {
    title: "Interactive Clinical Trial Data Dashboard",
    description: "A web-based dashboard for visualizing and exploring complex clinical trial data, enabling researchers to uncover insights faster. Developed with React and D3.js.",
    imageUrl: {
        light: 'https://placehold.co/800x600/f0f2f5/000000?text=Data+Dashboard',
        dark: 'https://placehold.co/800x600/1a1a1a/ffffff?text=Data+Dashboard',
    },
    link: '/docs/project/clinical-dashboard',
    layout: 'right',
  }
];

// 4. FadingFeatures 데이터
const fadingFeaturesData = [
    {
    title: 'Scalable Backend Engineering',
    description: 'Designing and implementing high-performance, resilient microservices architectures using Go, gRPC, and Kubernetes. Focused on clean code and cloud-native principles.',
    imageUrl: {
        light: 'https://placehold.co/1200x900/f0f2f5/000000?text=Backend+Systems',
        dark: 'https://placehold.co/1200x900/1a1a1a/ffffff?text=Backend+Systems',
    },
    tags: ['Go', 'Kubernetes', 'Microservices', 'gRPC'],
    link: '/docs/skills/backend',
    layout: 'imageRight', 
  },
  {
    title: 'Deep Learning & AI Research',
    description: "Exploring the frontiers of AI, with a focus on Large Language Models (LLMs) and Computer Vision. Proficient with PyTorch, TensorFlow, and JAX for rapid prototyping and large-scale training.",
    imageUrl: {
        light: 'https://placehold.co/1200x900/e9f5f5/000000?text=AI+Research',
        dark: 'https://placehold.co/1200x900/1a2a2a/ffffff?text=AI+Research',
    },
    tags: ['PyTorch', 'LLM', 'AI', 'JAX'],
    link: '/docs/skills/ai-research',
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
          <FadingFeatures featureItems={fadingFeaturesData} />
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