import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type Logo = {
  imgSrc: string;
  href: string;   
  alt: string;    
};

type LogoTickerProps = {
  title?: string;
  logos?: Logo[];
};

export default function LogoTicker({ title, logos = [] }: LogoTickerProps): JSX.Element {
  if (!Array.isArray(logos) || logos.length === 0) {
    return null;
  }
  const duplicatedLogos = [...logos, ...logos];
  const trackWidth = `calc(200px * ${logos.length * 2})`;

  return (
    <div className={styles.logoTickerContainer}>
      {title && <p className={styles.carouselTitle}>{title}</p>}
      <div className={styles.logoSlider}>
        <div className={styles.logoTrack} style={{ width: trackWidth }}>
          {duplicatedLogos.map((logo, index) => (
            <Link to={logo.href} key={index} className={styles.logoSlide} title={logo.alt}>
              <img src={logo.imgSrc} alt={logo.alt} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
