import React, { useState, useEffect, RefObject } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';

interface FullscreenButtonProps {
  targetRef: RefObject<HTMLElement>;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({ targetRef }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && targetRef.current) {
      targetRef.current.requestFullscreen();
      // Stil fürs Scrollen
      if (targetRef.current) {
        targetRef.current.style.overflow = 'auto';
        targetRef.current.style.height = '100%';
      }
    } else {
      document.exitFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement === targetRef.current);
    // Reset Style beim Beenden
    if (!document.fullscreenElement && targetRef.current) {
      targetRef.current.style.overflow = '';
      targetRef.current.style.height = '';
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <>
      {/* Vollbild starten */}
      <Button variant="outline-dark" size="sm" onClick={toggleFullscreen}>
        <FontAwesomeIcon icon={faExpand} className="me-1" />
        Vollbild
      </Button>

      {/* Sticky Exit-Button */}
      {isFullscreen && (
        <Button
          variant="dark"
          size="sm"
          onClick={() => document.exitFullscreen()}
          style={{
            position: 'fixed',
            top: '10px',
            right: '20px',
            zIndex: 9999,
          }}
        >
          <FontAwesomeIcon icon={faCompress} className="me-1" />
          Beenden
        </Button>
      )}
    </>
  );
};

export default FullscreenButton;
