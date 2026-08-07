import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArticleListItem, ViewMode } from '../../dataTypes/types';
import { formatDate } from '../../utils/functionHelper';
import { useTranslation } from '../../hooks/hookHelper';

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
  const { trans } = useTranslation();
  return (
    <Row className="g-3 mt-2">
      {articles.map((article) => {
        const createdAt = article.createdAt ? formatDate(article.createdAt) : '-';
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
                  <div>
                    {trans('my_wiki.components.show_article_list.created_at', {
                      createdAt,
                    })}
                  </div>
                  <div>
                    {trans('my_wiki.components.show_article_list.updated_at', {
                      updatedAt,
                    })}
                  </div>
                </div>

                <Button as={Link as any} to={articleUrl} variant="primary" size="sm">
                  {trans('my_wiki.components.show_article_list.button_text')}
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
