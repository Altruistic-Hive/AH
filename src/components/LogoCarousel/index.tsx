import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

// 로고 객체의 타입을 정의합니다.
type Logo = {
  imgSrc: string; // 이미지 경로
  href: string;   // 클릭 시 이동할 경로
  alt: string;    // 대체 텍스트
};

// 컴포넌트의 props 타입을 정의합니다.
type LogoCarouselProps = {
  title?: string;      // "TRUSTED BY TEAMS AT"과 같은 문구 (선택적)
  logos?: Logo[];      // 로고 객체 배열 (선택적)
};

export default function LogoCarousel({ title, logos = [] }: LogoCarouselProps): JSX.Element {
  // 예외 처리: logos가 배열이 아니거나 비어있으면 컴포넌트 자체를 렌더링하지 않습니다.
  if (!Array.isArray(logos) || logos.length === 0) {
    return null;
  }

  // 끊김 없는 애니메이션을 위해 로고 목록을 복제합니다.
  const duplicatedLogos = [...logos, ...logos];
  // 로고 개수에 따라 동적으로 너비를 계산합니다.
  const trackWidth = `calc(200px * ${logos.length * 2})`;

  return (
    <div className={styles.logoCarouselContainer}>
      {/* title prop이 존재할 경우에만 문구를 렌더링합니다. */}
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
