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

// 오타용 문자셋
const KOR = '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호구누두루무부수우주추쿠투푸후기니디리미비시이지치키티피히';
const ENG = 'abcdefghijklmnopqrstuvwxyz';

function getRandomKorChar() {
  return KOR[Math.floor(Math.random() * KOR.length)];
}
function getRandomEngChar() {
  return ENG[Math.floor(Math.random() * ENG.length)];
}
function isKorean(char) {
  return /[가-힣]/.test(char);
}
function isEnglish(char) {
  return /[a-zA-Z]/.test(char);
}

// 오타/지우기/재타이핑 포함 타이핑 훅
const useTypingEffect = (
  text: string,
  start: boolean,
  options: { typingSpeed?: number; typoChance?: number; typoDelay?: number } = {}
) => {
  // 타자 속도 더 빠르게, 오타 시 잠깐 멈춤
  const { typingSpeed = 32, typoChance = 0.08, typoDelay = 120 } = options;
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [typoState, setTypoState] = useState<null | { pos: number; wrongChar: string; phase: 'typo' | 'delete' }>(null);

  useEffect(() => {
    if (!start) {
      setDisplayText('');
      setIsDone(false);
      setTypoState(null);
      return;
    }
    if (displayText.length === text.length && !typoState) {
      setIsDone(true);
      return;
    }
    // 오타 상태
    if (typoState) {
      if (typoState.phase === 'typo') {
        // 오타 보여주기 후 삭제
        const timeout = setTimeout(() => {
          setDisplayText(text.substring(0, typoState.pos));
          setTypoState({ ...typoState, phase: 'delete' });
        }, typoDelay);
        return () => clearTimeout(timeout);
      } else if (typoState.phase === 'delete') {
        // 오타 삭제 후 재타이핑
        const timeout = setTimeout(() => {
          setTypoState(null);
        }, typingSpeed);
        return () => clearTimeout(timeout);
      }
    } else {
      // 오타가 아닐 때
      if (displayText.length < text.length) {
        // 오타 발생 여부 결정
        if (
          displayText.length > 0 &&
          Math.random() < typoChance &&
          displayText.length < text.length - 1 // 마지막 글자엔 오타 X
        ) {
          const nextChar = text[displayText.length];
          let wrongChar = '';
          if (isKorean(nextChar)) {
            // 한글 오타
            do {
              wrongChar = getRandomKorChar();
            } while (wrongChar === nextChar);
          } else if (isEnglish(nextChar)) {
            // 영어 오타
            do {
              wrongChar = getRandomEngChar();
            } while (wrongChar.toLowerCase() === nextChar.toLowerCase());
          } else {
            wrongChar = nextChar;
          }
          setDisplayText(text.substring(0, displayText.length) + wrongChar);
          setTypoState({ pos: displayText.length, wrongChar, phase: 'typo' });
          return;
        }
        // 정상 타이핑
        const timeout = setTimeout(() => {
          setDisplayText(text.substring(0, displayText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      }
    }
  }, [text, displayText, start, typingSpeed, typoChance, typoDelay, typoState]);

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
