import React, { useState, useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from './styles.module.css';
import ThemedImage from '@theme/ThemedImage';

type FeatureItem = {
  title: string;
  description: string;
  imageUrl: {
    light: string;
    dark: string;
  };
  tags: string[];
  link: string;
  layout: 'imageLeft' | 'imageRight' | 'imageOverlay';
};

type FadingFeaturesProps = {
  features: FeatureItem[];
};

export default function FadingFeatures({ features }: FadingFeaturesProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);
  const sizerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  // features prop이 없거나 비어있으면 렌더링하지 않음
  if (!features || features.length === 0) {
    return null;
  }
  
  const currentFeature = features[currentIndex];
  
  // 가장 긴 콘텐츠를 기준으로 높이를 계산하는 로직
  useEffect(() => {
    if (sizerRef.current) {
      const height = sizerRef.current.offsetHeight + 256;
      setSectionHeight(height);
    }
  }, [features]); // features 데이터가 변경될 때 한 번만 실행

  // 자동 전환 로직
  useEffect(() => {
    const scheduleNext = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
          setIsFading(false);
        }, 500);
      }, 5000);
    };

    scheduleNext();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [features.length]);

  const longestFeature = [...features].sort((a, b) => (b.description.length) - (a.description.length))[0];

  return (
    <section 
        className={styles.featureSection}
        style={{ minHeight: sectionHeight ? `${sectionHeight}px` : '100vh' }}
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

      {/* Content Wrapper: 실제 보이는 콘텐츠 */}
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
