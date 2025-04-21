import { useRef, useState, useEffect, ReactNode } from 'react';
import { Col, Row } from 'react-bootstrap';
import { hoverPrevElement } from '../utils/functionHelper';

interface MainLayoutProps {
  sidebarChildren: ReactNode;
  outletChildren: ReactNode;
  footerChildren: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  sidebarChildren,
  outletChildren,
  footerChildren,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(200);
  const isResizing = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current && containerRef.current) {
        const containerLeft = containerRef.current.getBoundingClientRect().left;
        const newWidth = e.clientX - containerLeft;

        setSidebarWidth(Math.max(175, Math.min(newWidth, 500)));
      }
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <Row className="g-0" ref={containerRef}>
      {/* Sidebar */}
      <Col
        style={{
          width: sidebarWidth,
          minWidth: 180,
          maxWidth: 500,
          flex: '0 0 auto',
        }}
        className="bg-light min-vh-100"
      >
        <div className="position-sticky" style={{ top: '74px' }}>
          {sidebarChildren}
        </div>
      </Col>
      <Col
        style={{
          width: '20px',
          cursor: 'col-resize',
          position: 'relative',
          zIndex: 2,
          flex: '0 0 auto',
          marginLeft: '-10px',
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '100%',
            background: '#ddd',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '20px',
            height: '100%',
          }}
          onMouseEnter={(e) => hoverPrevElement(e, '#bbb')}
          onMouseLeave={(e) => hoverPrevElement(e, '#ddd')}
        />
      </Col>
      <Col style={{ flex: 1 }} className="d-flex flex-column">
        <div className="flex-grow-1">{outletChildren}</div>
        {footerChildren}
      </Col>
    </Row>
  );
};

export default MainLayout;
