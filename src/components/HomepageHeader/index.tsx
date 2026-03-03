import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

type DynamicItem = {
  word: string;
  image?: string;
  keyword?: string;
};
type Button = {
  text: string;
  link: string;
};
type HomepageHeaderProps = {
  titleLines: string[];
  dynamicItems: DynamicItem[];
  subtitle: string;
  button: Button;
};
function useTypingAnimation(dynamicItems: DynamicItem[], pexelsApiKey: string) {
  const [itemIndex, setItemIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isImageFadingOut, setIsImageFadingOut] = useState(false);

  useEffect(() => {
    if (!dynamicItems || dynamicItems.length === 0) return;

    const currentItem = dynamicItems[itemIndex];
    const currentWord = currentItem.word;
    let timeout;

    const fetchImage = async (keyword: string) => {
      if (!pexelsApiKey) {
        return;
      }
      try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${keyword}&per_page=15`, {
          headers: { Authorization: pexelsApiKey },
        });
        if (!response.ok) throw new Error(`Pexels API Error: ${response.statusText}`);
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
          setBackgroundImage(randomPhoto.src.large2x);
        }
      } catch {
        // Pexels API failed silently
      }
    };

    const handleWordComplete = () => {
      // 이미지 경로가 직접 제공되면 그 이미지를 사용
      if (currentItem.image) {
        setBackgroundImage(currentItem.image);
      } 
      // 키워드가 제공되면 API 호출
      else if (currentItem.keyword) {
        fetchImage(currentItem.keyword);
      }

      timeout = setTimeout(() => {
        setIsImageFadingOut(true);
        setTimeout(() => {
          setIsDeleting(true);
          setBackgroundImage('');
          setIsImageFadingOut(false);
        }, 1000);
      }, 4000);
    };

    if (isDeleting) {
      if (typedText === '') {
        setIsDeleting(false);
        setTimeout(() => {
            setItemIndex((prevIndex) => (prevIndex + 1) % dynamicItems.length);
        }, 500);
      } else {
        timeout = setTimeout(() => setTypedText((prev) => prev.slice(0, -1)), 100);
      }
    } else {
      if (typedText === currentWord) {
        handleWordComplete();
      } else {
        timeout = setTimeout(() => {
          setTypedText((prev) => currentWord.slice(0, prev.length + 1));
        }, 150);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, itemIndex, dynamicItems]);

  // isDeleting을 반환 객체에 추가
  return { typedText, backgroundImage, isImageFadingOut, isDeleting };
}

export default function HomepageHeader({ titleLines, dynamicItems, subtitle, button }: HomepageHeaderProps) {
  const { siteConfig } = useDocusaurusContext();
  const pexelsApiKey = (siteConfig.customFields?.pexelsApiKey as string) || '';
  const { typedText, backgroundImage, isImageFadingOut, isDeleting } = useTypingAnimation(dynamicItems, pexelsApiKey);
  const isTyping = typedText.length > 0 && !isDeleting;

  return (
    <header 
      className={clsx('hero', styles.heroBanner, backgroundImage && !isImageFadingOut && styles.hasBg)}
    >
      <div 
        className={styles.heroBg} 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className={styles.heroBgOverlay} />
      <div className={clsx("container", styles.heroContainer)}>
        <Heading as="h1" className={styles.heroTitle}>
          <span className={styles.line}>Welcome to the</span>
          <span className={styles.lineAccent}>Altruistic Hive</span>
          <span className={styles.line}>Where</span>
          <span className={clsx(styles.dynamicWordContainer, isTyping && styles.isTyping)}>
            <span className={styles.dynamicWord}>{typedText}</span>
            <span className={styles.cursor}>|</span>
          </span>
          <span className={styles.line}>Happens!</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          {subtitle}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to={button.link}>
            {button.text}
          </Link>
        </div>
      </div>
      <div className={styles.imageCredit}>
        Photo by Pexels
      </div>
    </header>
  );
}
