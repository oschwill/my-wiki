import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWhatsapp,
  faFacebook,
  faLinkedin,
  faTwitter,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLink } from '@fortawesome/free-solid-svg-icons';

interface ShareArticleModalProps {
  show: boolean;
  handleClose: () => void;
  articleTitle: string;
  articleUrl: string;
}

const ShareArticleModal: React.FC<ShareArticleModalProps> = ({
  show,
  handleClose,
  articleTitle,
  articleUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
  };

  // Reset copied state when modal closes
  useEffect(() => {
    if (!show) {
      setCopied(false);
    }
  }, [show]);

  const openShareLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Artikel teilen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Link zum Artikel</Form.Label>
          <InputGroup>
            <FormControl readOnly value={articleUrl} />
            <Button variant={copied ? 'success' : 'outline-secondary'} onClick={copyToClipboard}>
              <FontAwesomeIcon icon={faLink} className="me-1" />
              {copied ? 'Kopiert!' : 'Kopieren'}
            </Button>
          </InputGroup>
        </Form.Group>

        <div className="d-flex flex-wrap gap-2">
          <Button
            variant="success"
            onClick={() =>
              openShareLink(
                `https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + ' ' + articleUrl)}`,
              )
            }
          >
            <FontAwesomeIcon icon={faWhatsapp} className="me-1" />
            WhatsApp
          </Button>

          <Button
            variant="primary"
            onClick={() =>
              openShareLink(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
              )
            }
          >
            <FontAwesomeIcon icon={faFacebook} className="me-1" />
            Facebook
          </Button>

          <Button
            variant="info"
            onClick={() =>
              openShareLink(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
              )
            }
          >
            <FontAwesomeIcon icon={faLinkedin} className="me-1" />
            LinkedIn
          </Button>

          <Button
            variant="info"
            onClick={() =>
              openShareLink(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle + ' ' + articleUrl)}`,
              )
            }
          >
            <FontAwesomeIcon icon={faTwitter} className="me-1" />
            Twitter
          </Button>

          <Button
            variant="dark"
            onClick={() => openShareLink(`https://signal.me/#p=${encodeURIComponent(articleUrl)}`)}
          >
            <FontAwesomeIcon icon={faLink} className="me-1" />
            Signal
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              openShareLink(
                `https://www.reddit.com/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}`,
              )
            }
          >
            <FontAwesomeIcon icon={faReddit} className="me-1" />
            Reddit
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              openShareLink(
                `mailto:?subject=${encodeURIComponent(articleTitle)}&body=${encodeURIComponent(articleUrl)}`,
              )
            }
          >
            <FontAwesomeIcon icon={faEnvelope} className="me-1" />
            E-Mail
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Schließen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareArticleModal;
