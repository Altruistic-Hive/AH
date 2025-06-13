import React, { useState, useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from './styles.module.css';
import ThemedImage from '@theme/ThemedImage';

const featuredData = [
  {
    title: 'Explore entire user journeys',
    description: 'Walk through entire user flows, step by step. See how the best apps design their onboarding, editing profiles, and more.',
    imageUrl: {
        light: 'https://placehold.co/1200x900/f0f2f5/000000?text=Light+Flow',
        dark: 'https://placehold.co/1200x900/1a1a1a/ffffff?text=Dark+Flow',
    },
    tags: ['Flows', 'UX'],
    link: '/docs/intro',
    layout: 'imageRight', 
  },
  {
    title: 'Search for specific patterns',
    description: 'Looking for a specific UI element? Search for screens with specific components like cards, bottom sheets, and banners. This description is intentionally made longer to serve as the basis for the fixed height of the section, ensuring that no layout shifts occur during content transitions.',
    imageUrl: {
        light: 'https://placehold.co/1200x900/e9f5f5/000000?text=Light+Patterns',
        dark: 'https://placehold.co/1200x900/1a2a2a/ffffff?text=Dark+Patterns',
    },
    tags: ['Patterns', 'React', 'Component'],
    link: 'https://github.com/facebook/docusaurus',
    layout: 'imageLeft',
  },
  {
    title: 'Analyze visual design',
    description: 'Break down the design of top-tier apps. Understand their use of color, typography, and layout to create stunning user experiences.',
    imageUrl: {
        light: 'https://placehold.co/1200x900/f9f3e7/000000?text=Light+Design',
        dark: 'https://placehold.co/1200x900/2a231a/ffffff?text=Dark+Design',
    },
    tags: ['Design', 'Inspiration'],
    link: '/blog',
    layout: 'imageOverlay',
  },
];

export default function FadingFeatures(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState(0);

  const currentFeature = featuredData[currentIndex];

  useEffect(() => {
    if (sizerRef.current) {
      const height = sizerRef.current.offsetHeight;
      // 섹션의 높이를 Sizer 높이와 동일하게 설정하여, 패딩은 내부에서 처리하도록 함
      setSectionHeight(height);
    }
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredData.length);
          setIsFading(false);
        }, 500);
      }, 5000);
    };

    scheduleNext();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);
  
  const longestFeature = [...featuredData].sort((a, b) => (b.description.length) - (a.description.length))[0];

  return (
    <section 
        className={styles.featureSection}
        style={{ height: sectionHeight ? `${sectionHeight}px` : '100vh' }}
    >
      {/* Sizer Div: 높이 계산의 기준 */}
      <div ref={sizerRef} className={styles.sizer}>
          <div className={clsx(styles.featureContainer, styles[longestFeature.layout])}>
              <div className={styles.textColumn}>
                  <div className={styles.tagContainer}>
                      {longestFeature.tags.map((tag, i) => <span key={i} className={styles.tag}>{tag}</span>)}
                  </div>
                  <Heading as="h2" className={styles.title}>{longestFeature.title}</Heading>
                  <p className={styles.description}>{longestFeature.description}</p>
                  <span className={styles.arrowLink}>Explore More →</span>
              </div>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                   <img src={longestFeature.imageUrl.light} alt="" />
                </div>
              </div>
          </div>
      </div>
      
      {/* 실제 보이는 콘텐츠 */}
      <div className={styles.contentWrapper}>
        <Link to={currentFeature.link} className={styles.containerLink}>
            <div className={clsx(styles.featureContainer, styles[currentFeature.layout], isFading && styles.fading)}>
              <div className={styles.textColumn}>
                <div className={styles.tagContainer}>
                    {currentFeature.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                </div>
                <Heading as="h2" className={styles.title}>
                  {currentFeature.title}
                </Heading>
                <p className={styles.description}>{currentFeature.description}</p>
                <span className={styles.arrowLink}>Explore More →</span>
              </div>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                   <div className={styles.imageGlow}></div>
                   <ThemedImage
                        alt={currentFeature.title}
                        className={styles.featureImage}
                        sources={{
                        light: currentFeature.imageUrl.light,
                        dark: currentFeature.imageUrl.dark,
                        }}
                    />
                </div>
              </div>
            </div>
          </Link>
      </div>
    </section>
  );
}
