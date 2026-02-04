import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

interface PrintButtonProps {
  article: {
    title: string;
    content: string;
  };
}

const PrintButton: React.FC<PrintButtonProps> = ({ article }) => {
  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={() => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${article.title}</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { font-size: 24px; margin-bottom: 10px; }
                  .article-content { margin-top: 20px; }
                </style>
              </head>
              <body>
                <h1>${article.title}</h1>
                <div class="article-content">${article.content}</div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }
      }}
    >
      <FontAwesomeIcon icon={faPrint} className="me-1" />
      Drucken
    </Button>
  );
};

export default PrintButton;
