import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { InputGroup, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../../utils/fetchData';
import { useLanguage } from '../../context/LanguageContext';
import type { ArticleSearchResult } from '../../dataTypes/types';

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background-color: yellow;">$1</mark>');
};

const SearchBar: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ArticleSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetchFromApi(
        `/api/v1/content/search/articles?locale=${language?.locale}`,
        'POST',
        { searchParam: query },
      );

      if (res?.success && res.data?.length) {
        setResults(res.data);
        setOpen(true);
      } else {
        setResults([]);
        setOpen(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, language]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buildLink = (article: ArticleSearchResult) => {
    const areaPath = (article.category?.area as any)?.queryPath || 'area';
    const categoryPath = (article.category as any)?.queryPath || 'category';

    return `/area/${areaPath}/category/${categoryPath}/article/${article._id}`;
  };

  const handleSelect = (article: ArticleSearchResult) => {
    setOpen(false);
    setQuery('');
    navigate(buildLink(article));
  };

  return (
    <div
      ref={wrapperRef}
      className="d-flex align-items-center position-relative"
      style={{ paddingLeft: '5.1%', width: '30%' }}
    >
      <InputGroup>
        <Form.Control
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          className="me-2 border-2 rounded-2"
          aria-label="Search"
        />
        <InputGroup.Text className="position-absolute top-50 end-0 translate-middle-y me-2">
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
      </InputGroup>

      {open && (
        <div
          className="position-absolute w-100 bg-white border rounded shadow mt-1 z-3"
          style={{ top: '90%' }}
        >
          {results.length > 0 ? (
            results.map((article) => (
              <div
                key={article._id}
                className="px-3 py-2 border-bottom text-start"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelect(article)}
              >
                <strong dangerouslySetInnerHTML={{ __html: highlightText(article.title, query) }} />
                {article.category?.title && (
                  <div className="small text-muted">{article.category.title}</div>
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-muted small">Keine Artikel gefunden</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
