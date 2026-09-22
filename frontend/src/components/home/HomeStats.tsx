import { useEffect, useRef, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faFolderTree, faLayerGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import { HomeStats as HomeStatsType } from '../../dataTypes/types';
import { useTranslation } from '../../hooks/hookHelper';

interface HomeStatsProps {
  stats: HomeStatsType;
}

interface CounterProps {
  value: number;
  icon: typeof faBook;
  title: string;
  delay?: number;
}

const Counter = ({ value, icon, title, delay = 0 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let animationFrame: number;
    let timeout: ReturnType<typeof setTimeout>;

    timeout = setTimeout(() => {
      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-Out: am Anfang schnell, zum Ende langsamer
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setCount(Math.floor(easedProgress * value));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, value, delay]);

  return (
    <Col xs={12} md={6} xl={3}>
      <Card
        ref={ref}
        className="h-100 border-0 shadow-sm text-center"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(35px)',
          transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms`,
        }}
      >
        <Card.Body className="py-4">
          <div
            className="bg-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{
              width: '75px',
              height: '75px',
            }}
          >
            <FontAwesomeIcon icon={icon} size="2x" />
          </div>

          <div className="display-5 fw-bold">{count.toLocaleString()}</div>

          <div className="text-muted fs-5 mt-2">{title}</div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const HomeStats = ({ stats }: HomeStatsProps) => {
  const { trans } = useTranslation();

  return (
    <section className="my-5">
      <Row className="g-4">
        <Counter
          value={stats.areas}
          icon={faLayerGroup}
          title={trans('my_wiki.home.stats.areas')}
          delay={0}
        />

        <Counter
          value={stats.categories}
          icon={faFolderTree}
          title={trans('my_wiki.home.stats.categories')}
          delay={100}
        />

        <Counter
          value={stats.articles}
          icon={faBook}
          title={trans('my_wiki.home.stats.articles')}
          delay={200}
        />

        <Counter
          value={stats.users}
          icon={faUsers}
          title={trans('my_wiki.home.stats.users')}
          delay={300}
        />
      </Row>
    </section>
  );
};

export default HomeStats;
