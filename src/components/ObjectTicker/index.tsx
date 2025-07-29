import React, { useRef } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type ObjectItem = {
  imgSrc: string;
  href: string;
  alt: string;
};

type ObjectTickerProps = {
  title?: string;
  objects?: ObjectItem[];
  direction?: 'left' | 'right';
};

export default function ObjectTicker({ title, objects = [], direction = 'left' }: ObjectTickerProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);
  if (!Array.isArray(objects) || objects.length === 0) {
    return null;
  }
  const slideWidth = 160;
  const minTrackLength = 4000; // px, 더 자연스럽게
  const numSlides = objects.length;
  const repeatCount = Math.max(2, Math.ceil(minTrackLength / (slideWidth * numSlides)));
  const duplicatedObjects = Array(repeatCount).fill(objects).flat();
  const trackLength = slideWidth * duplicatedObjects.length;
  const baseSpeed = 120; // px/sec, 더 느리게
  const duration = trackLength / baseSpeed;
  const trackWidth = `${trackLength}px`;
  const animDirection = direction === 'right' ? 'scrollReverse' : 'scroll';
  const animation = `${animDirection} ${duration}s linear infinite`;
  return (
    <div className={styles.objectTickerContainer}>
      {title && <p className={styles.carouselTitle}>{title}</p>}
      <div className={styles.objectSlider}>
        <div
          className={styles.objectTrack}
          ref={trackRef}
          style={{ width: trackWidth, animation }}
          onMouseEnter={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'; }}
          onMouseLeave={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running'; }}
        >
          {duplicatedObjects.map((obj, index) => (
            <Link to={obj.href} key={index} className={styles.objectSlide} title={obj.alt} style={{ width: slideWidth }}>
              <img src={obj.imgSrc} alt={obj.alt} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
