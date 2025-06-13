import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageHeader from '@site/src/components/HomepageHeader'; // 헤더를 별도 컴포넌트로 분리
import FloatingShowcase from '@site/src/components/FloatingShowcase';
import FadingFeatures from '@site/src/components/FadingFeatures';
import useLayoutClassName from '@site/src/hooks/useLayoutClassName'; // 훅 임포트

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  
  // 이 페이지가 렌더링될 때 <html>에 'scroll-snap-page' 클래스를 추가합니다.
  useLayoutClassName('scroll-snap-page');
import styles from './index.module.css';


export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="We are Altruistic Hive.">
      <HomepageHeader />
      <main>
        <FadingFeatures /> 
        <floating />
      </main>
    </Layout>
  );
}