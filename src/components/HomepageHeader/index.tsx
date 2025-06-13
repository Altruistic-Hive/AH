
const DYNAMIC_WORDS = ['Creativity', 'Passion', 'Growth', 'Collaboration'];
const PEXELS_API_KEY = 'VFb0BCIXnzIuyv8ggrpPOKhrmUfMrKWasUsAIOSqTgH1WL3Ixr701lR5';

function useTypingAnimation() {
  const [wordIndex, setWordIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isImageFadingOut, setIsImageFadingOut] = useState(false);

  useEffect(() => {
    const currentWord = DYNAMIC_WORDS[wordIndex];
    let timeout;

    const fetchImage = async () => {
      if (!PEXELS_API_KEY || PEXELS_API_KEY === 'YOUR_PEXELS_API_KEY') {
        console.error("Pexels API 키를 입력해주세요.");
        setBackgroundImage(`/img/hero-backgrounds/${currentWord.toLowerCase()}.jpg`);
        return;
      }
      try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${currentWord}&per_page=10`, {
          headers: { Authorization: PEXELS_API_KEY },
        });
        if (!response.ok) throw new Error(`Pexels API 에러: ${response.statusText}`);
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
          setBackgroundImage(randomPhoto.src.large2x);
        }
      } catch (error) {
        console.error("Pexels 이미지 로딩 실패:", error);
        setBackgroundImage(`/img/hero-backgrounds/${currentWord.toLowerCase()}.jpg`);
      }
    };

    if (isDeleting) {
      if (typedText === '') {
        setIsDeleting(false);
        setWordIndex((prevIndex) => (prevIndex + 1) % DYNAMIC_WORDS.length);
      } else {
        timeout = setTimeout(() => setTypedText((prev) => prev.slice(0, -1)), 100);
      }
    } else {
      if (typedText === currentWord) {
        fetchImage();
        timeout = setTimeout(() => {
          setIsImageFadingOut(true);
          setTimeout(() => {
            setIsDeleting(true);
            setBackgroundImage('');
            setIsImageFadingOut(false);
          }, 1000); 
        }, 10000); 
      } else {
        timeout = setTimeout(() => setTypedText((prev) => currentWord.slice(0, prev.length + 1)), 150);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, wordIndex]);

  return { typedText, backgroundImage, isImageFadingOut };
}

export default function HomepageHeader() {
  const { typedText, backgroundImage, isImageFadingOut } = useTypingAnimation();
  
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
          The Altruistic Hive
          <br />
          Where{' '}
          <span className={styles.dynamicWordWrapper}>
            <span className={styles.dynamicWord}>{typedText}</span>
            <span className={styles.cursor}>|</span>
          </span>{' '}
          Thrives.
        </Heading>
        <p className={styles.heroSubtitle}>
          이타적인 집단. Altruistic Hive
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Start Exploring
          </Link>
        </div>
      </div>
      {/* Pexels 출처 표기 */}
      <div className={styles.imageCredit}>
        사진 제공: ©&nbsp;Pexels
      </div>
    </header>
  );
}