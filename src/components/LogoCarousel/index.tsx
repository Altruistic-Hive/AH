import React from 'react';
import styles from './styles.module.css';

const logos = [
  '/img/logos/airbnb.svg',
  '/img/logos/uber.svg',
  '/img/logos/notion.svg',
  '/img/logos/spotify.svg',
  '/img/logos/dropbox.svg',
  '/img/logos/twitch.svg',
  '/img/logos/shopify.svg',
  '/img/logos/pinterest.svg',
  '/img/logos/wise.svg',
];

// 로고 목록을 두 번 반복하여 끊김 없는 효과를 만듭니다.
const duplicatedLogos = [...logos, ...logos];

export default function LogoCarousel(): JSX.Element {
  return (
    <div className={styles.logoCarouselContainer}>
      <p className={styles.carouselTitle}>TRUSTED BY TEAMS AT</p>
      <div className={styles.logoSlider}>
        <div className={styles.logoTrack}>
          {duplicatedLogos.map((logo, index) => (
            <div className={styles.logoSlide} key={index}>
              <img src={logo} alt={`logo ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
