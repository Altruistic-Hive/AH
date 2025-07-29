import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type Member = {
  name: string;
  imgSrc: string;
  href: string;
  role: string;
};

type MemberTickerProps = {
  title?: string;
  members: Member[];
};

export default function MemberTicker({ title, members }: MemberTickerProps): JSX.Element {
  if (!Array.isArray(members) || members.length === 0) return null;
  const duplicated = [...members, ...members];
  const trackHeight = `calc(90px * ${members.length * 2})`;
  return (
    <div className={styles.memberTickerContainer}>
      {title && <p className={styles.carouselTitle}>{title}</p>}
      <div className={styles.memberSlider}>
        <div className={styles.memberTrack} style={{ height: trackHeight }}>
          {duplicated.map((member, idx) => (
            <Link to={member.href} key={idx} className={styles.memberSlide} title={member.name}>
              <img src={member.imgSrc} alt={member.name} className={styles.memberImg} />
              <div className={styles.memberInfo}>
                <div className={styles.memberName}>{member.name}</div>
                <div className={styles.memberRole}>{member.role}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 