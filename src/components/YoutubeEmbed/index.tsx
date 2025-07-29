import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface YoutubeEmbedProps {
  url: string;
  title?: string;
  aspectRatio?: string; // 예: '16/9' 또는 '4/3'
}

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
};

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ url, title = 'YouTube video', aspectRatio = '16/9' }) => {
  const id = getYoutubeId(url);
  const { siteConfig } = useDocusaurusContext();
  // 라이트/다크 모드 감지
  const isDark = typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';
  const ratio = aspectRatio.split('/');
  const padding = ratio.length === 2 ? `${(Number(ratio[1]) / Number(ratio[0])) * 100}%` : '56.25%';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: padding,
        background: isDark ? '#181818' : '#fff',
        borderRadius: 12,
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.7)'
          : '0 4px 24px rgba(0,0,0,0.12)',
        border: isDark ? '1.5px solid #333' : '1.5px solid #eee',
        overflow: 'hidden',
        margin: '2rem 0',
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      />
    </div>
  );
};

export default YoutubeEmbed; 