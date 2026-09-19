import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PayloadPageContent } from '../dataTypes/types';
import { fetchFromPayload } from '../utils/fetchPayload';
import PayloadRichText from '../components/payload/PayloadRichText';
import LoadSpinner from '../components/loader/LoadSpinner';
import { useTranslation } from '../hooks/hookHelper';

const PayloadPage: React.FC = () => {
  const { pageSlug } = useParams<{ pageSlug: string }>();
  const { language } = useLanguage();
  const { trans } = useTranslation();
  const [page, setPage] = useState<PayloadPageContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const payloadLocale = language?.locale.split('-')[0];

  useEffect(() => {
    if (!pageSlug || !payloadLocale) return;

    const fetchPage = async () => {
      setIsLoading(true);

      try {
        const response = await fetchFromPayload(
          `/api/pages?where[slug][equals]=${pageSlug}&locale=${payloadLocale}`,
        );

        if (response.docs.length > 0) {
          setPage(response.docs[0]);
        } else {
          setPage(null);
        }
      } catch (error) {
        console.error('Error loading Payload page:', error);
        setPage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [pageSlug, payloadLocale]);

  if (isLoading) {
    return (
      <div
        className="container py-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: '300px' }}
      >
        <LoadSpinner text={trans('my_wiki.components.my_user_data.load_payload_content')} />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container py-4">
        <h1>Seite nicht gefunden</h1>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1>{page.title}</h1>
      <PayloadRichText content={page.content} />
    </div>
  );
};

export default PayloadPage;
