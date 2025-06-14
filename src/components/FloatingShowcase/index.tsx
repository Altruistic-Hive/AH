import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.css';
import ThemedImage from '@theme/ThemedImage';
import Heading from '@theme/Heading';

type ShowcaseItemData = {
  title: string;
  description: string;
  imageUrl: {
    light: string;
    dark: string;
  };
  link: string;
  layout: 'left' | 'right';
};

type FloatingShowcaseProps = {
  showcaseItems: ShowcaseItemData[];
};

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

export default function FloatingShowcase({ showcaseItems }: FloatingShowcaseProps) {
  const [activatedIndices, setActivatedIndices] = useState(new Set<number>());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const animationStyles = useMemo(() => 
    showcaseItems.map(() => {
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
    }), [showcaseItems]);

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
  }, [showcaseItems]);

  if (!showcaseItems || showcaseItems.length === 0) {
      return null;
  }

  return (
    <div className={styles.container}>
      {showcaseItems.map((item, index) => (
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
