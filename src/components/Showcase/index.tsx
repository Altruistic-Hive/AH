import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

// 아이템 데이터에 tags 추가
const ShowcaseItems = [
  {
    title: '프로젝트 A',
    description: 'AI를 활용한 사용자 분석 플랫폼. React와 Python으로 개발되었습니다.',
    imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Project+A',
    link: '/docs/intro',
    tags: ['AI', 'React', 'Python'],
  },
  {
    title: '프로젝트 B',
    description: '실시간 협업을 위한 클라우드 기반 문서 편집기입니다.',
    imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Project+B',
    link: '/docs/intro',
    tags: ['Cloud', 'React'],
  },
  {
    title: '블로그 포스트 1',
    description: 'Docusaurus를 활용하여 기술 블로그를 만드는 방법에 대한 포스트입니다.',
    imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Blog+Post',
    link: '/blog',
    tags: ['Blog', 'Docusaurus'],
  },
    {
    title: '프로젝트 C',
    description: '사물인터넷(IoT) 기기 데이터를 시각화하는 대시보드입니다.',
    imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Project+C',
    link: '/docs/intro',
    tags: ['IoT', 'Data'],
  },
  {
    title: '프로젝트 D',
    description: 'Rust로 작성된 고성능 백엔드 API 서버 프로젝트입니다.',
    imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Project+D',
    link: '/docs/intro',
    tags: ['Backend', 'Rust'],
  },
  {
    title: '블로그 포스트 2',
    description: '최신 웹 개발 트렌드에 대한 생각을 정리한 글입니다.',
    imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Blog+Post',
    link: '/blog',
    tags: ['Blog', 'Trend'],
  },
];

const ALL_TAGS = ['All', ...new Set(ShowcaseItems.flatMap(item => item.tags))];

function ShowcaseCard({ title, description, imageUrl, link, tags }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D 틸트 효과를 위한 마우스 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    
    const rotateX = -y / 20;
    const rotateY = x / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

    // 광원 효과
    card.style.setProperty('--mouse-x', `${e.clientX - left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - top}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <a href={link} className={styles.cardLink}>
        <div className={styles.cardImageContainer}>
          <img src={imageUrl} alt={title} className={styles.cardImage} />
        </div>
        <div className={styles.cardBody}>
          <h4>{title}</h4>
          <p>{description}</p>
          <div className={styles.cardTags}>
            {tags.map((tag, i) => <span key={i} className={styles.tag}>{tag}</span>)}
          </div>
        </div>
      </a>
    </div>
  );
}

export default function Showcase(): JSX.Element {
  const [activeFilter, setActiveFilter] = useState('All');
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredItems = activeFilter === 'All'
    ? ShowcaseItems
    : ShowcaseItems.filter(item => item.tags.includes(activeFilter));

  // 스크롤 애니메이션 효과
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.isVisible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = gridRef.current?.querySelectorAll(`.${styles.card}`);
    cards?.forEach((card) => observer.observe(card));

    return () => {
      cards?.forEach((card) => observer.unobserve(card));
    };
  }, [filteredItems]);


  return (
    <section className={styles.showcase}>
      <div className="container">
        {/* 필터 버튼 UI */}
        <div className={styles.filterContainer}>
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              className={`${styles.filterButton} ${activeFilter === tag ? styles.active : ''}`}
              onClick={() => setActiveFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {/* 그리드 */}
        <div className={styles.grid} ref={gridRef}>
          {filteredItems.map((item, idx) => (
            <ShowcaseCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
