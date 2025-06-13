import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.css';
import ThemedImage from '@theme/ThemedImage';

const showcaseData = [
  {
    title: "실제 앱 디자인을 탐색하세요.",
    description: "최고의 제품 팀들이 앱을 어떻게 디자인하는지 알아보세요. 실제 앱의 UI/UX 플로우를 광범위하게 제공하여 당신의 프로젝트에 영감을 더합니다.",
    imageUrl: {
        light: 'https://placehold.co/800x600/f0f2f5/000000?text=Light+1',
        dark: 'https://placehold.co/800x600/1a1a1a/ffffff?text=Dark+1',
    },
    link: '/docs/intro',
    layout: 'right',
  },
  {
    title: "인터랙티브한 사용자 플로우.",
    description: "정적인 화면만 보지 마세요. 인터랙티브 프로토타입 모드와 비디오를 통해 전체 사용자 여정을 단계별로 경험할 수 있습니다.",
    imageUrl: {
        light: 'https://placehold.co/800x600/e9f5f5/000000?text=Light+2',
        dark: 'https://placehold.co/800x600/1a2a2a/ffffff?text=Dark+2',
    },
    link: 'https://github.com/facebook/docusaurus',
    layout: 'left',
  },
  {
    title: "영감에서 실제 창작까지.",
    description: "당신의 워크플로우와 완벽하게 통합됩니다. 디자인을 Figma로 복사하고, 컬렉션에 저장하고, 팀과 손쉽게 공유하세요.",
    imageUrl: {
        light: 'https://placehold.co/800x600/f9f3e7/000000?text=Light+3',
        dark: 'https://placehold.co/800x600/2a231a/ffffff?text=Dark+3',
    },
    link: '/blog',
    layout: 'right',
  }
];

// Typing effect Hook
const useTypingEffect = (text: string, start: boolean, options: { typingSpeed?: number; } = {}) => {
  const { typingSpeed = 50 } = options;
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!start) {
      setDisplayText('');
      setIsDone(false);
      return;
    }

    if (displayText.length === text.length) {
      setIsDone(true);
      return;
    }
    
    const intervalId = setInterval(() => {
      setDisplayText(text.substring(0, displayText.length + 1));
    }, typingSpeed);

    return () => clearInterval(intervalId);
  }, [text, displayText, start, typingSpeed]);

  return { displayText, isDone };
};

const ShowcaseItem = ({ item, isVisible, animationStyle }) => {
  const { displayText: title, isDone: titleDone } = useTypingEffect(item.title, isVisible);
  const { displayText: description, isDone: descriptionDone } = useTypingEffect(item.description, titleDone, { typingSpeed: 20 });
  const isTyping = isVisible && !(titleDone && descriptionDone);

  return (
    <Link to={item.link} className={styles.itemLink}>
      <div className={clsx(styles.showcaseItem, styles[`layout--${item.layout}`])}>
        <div className={clsx(styles.textContainer, isTyping && styles.typingActive)}>
          <h2 className={styles.title}>{isVisible ? title : ''}<span className={styles.cursor}>|</span></h2>
          <p className={styles.description}>{isVisible ? description : ''}<span className={styles.cursor}>|</span></p>
          <span className={styles.arrowLink}>Explore More →</span>
        </div>
        <div className={styles.imageContainer} style={animationStyle}>
          <div className={styles.imageGlow}></div>
          <ThemedImage
            alt={item.title}
            className={styles.showcaseImage}
            sources={{
              light: item.imageUrl.light,
              dark: item.imageUrl.dark,
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default function FloatingShowcase() {
  const [activatedIndices, setActivatedIndices] = useState(new Set<number>());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  // 각 아이템에 대한 랜덤 애니메이션 스타일 생성
  const animationStyles = useMemo(() => 
    showcaseData.map(() => {
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      return {
        '--duration': `${randomInRange(20, 30)}s`,
        '--delay': `-${randomInRange(0, 10)}s`,
        '--x1': `${randomInRange(-10, 10)}px`,
        '--y1': `${randomInRange(-15, 15)}px`,
        '--r1': `${randomInRange(-2, 2)}deg`,
        '--x2': `${randomInRange(-12, 12)}px`,
        '--y2': `${randomInRange(-10, 10)}px`,
        '--r2': `${randomInRange(-2, 2)}deg`,
        '--x3': `${randomInRange(-8, 8)}px`,
        '--y3': `${randomInRange(-12, 12)}px`,
        '--r3': `${randomInRange(-2, 2)}deg`,
      } as React.CSSProperties;
    }), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = refs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setActivatedIndices(prev => new Set(prev).add(index));
            }
          }
        });
      },
      { threshold: 0.6, rootMargin: "-15% 0px -15% 0px" }
    );

    const currentRefs = refs.current;
    currentRefs.forEach(ref => { if (ref) observer.observe(ref); });
    return () => { currentRefs.forEach(ref => { if (ref) observer.unobserve(ref); }); };
  }, []);

  return (
    <div className={styles.container}>
      {showcaseData.map((item, index) => (
        <section key={index} ref={el => refs.current[index] = el} className={styles.section}>
          <ShowcaseItem 
            item={item} 
            isVisible={activatedIndices.has(index)} 
            animationStyle={animationStyles[index]} 
          />
        </section>
      ))}
    </div>
  );
}
