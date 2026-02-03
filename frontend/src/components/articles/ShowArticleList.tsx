import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArticleListItem, ViewMode } from '../../dataTypes/types';
import { formatDate } from '../../utils/functionHelper';

interface ShowArticleListProps {
  articles: ArticleListItem[];
  viewMode: ViewMode;
  activeAreaQueryPath: string; //
}

const ShowArticleList: React.FC<ShowArticleListProps> = ({
  articles,
  viewMode,
  activeAreaQueryPath,
}) => {
  return (
    <Row className="g-3 mt-2">
      {articles.map((article) => {
        const updatedAt = article.updatedAt ? formatDate(article.updatedAt) : '-';
        const articleUrl = `/area/${activeAreaQueryPath}/category/${article.category.queryPath}/article/${article._id}`;

        return (
          <Col
            md={viewMode === 'grid' ? 6 : 12}
            lg={viewMode === 'grid' ? 4 : 12}
            key={article._id}
          >
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>

                <Card.Text className="text-muted small mb-1">{article.category.title}</Card.Text>

                <div className="text-muted small mb-2 d-flex justify-content-between">
                  <div>Erstellt: {formatDate(article.createdAt)}</div>
                  <div>Aktualisiert: {updatedAt}</div>
                </div>

                <Button as={Link as any} to={articleUrl} variant="primary" size="sm">
                  Lesen
                </Button>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ShowArticleList;
