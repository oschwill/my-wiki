import { Container } from 'react-bootstrap';
import { useTranslation } from '../hooks/hookHelper';

const TermsAndConditions = () => {
  const { trans } = useTranslation();
  return (
    <Container className="my-5">
      <h1 className="mb-4">{trans('my_wiki.terms_and_conditions.headline')}</h1>

      <h4>{trans('my_wiki.terms_and_conditions.scope_of_application.headline')}</h4>
      <p>{trans('my_wiki.terms_and_conditions.scope_of_application.text')}</p>

      <h4 className="mt-4">{trans('my_wiki.terms_and_conditions.content.headline')}</h4>
      <p>{trans('my_wiki.terms_and_conditions.content.text')}</p>

      <h4 className="mt-4">{trans('my_wiki.terms_and_conditions.user_accounts.headline')}</h4>
      <p>{trans('my_wiki.terms_and_conditions.user_accounts.text')}</p>

      <h4 className="mt-4">{trans('my_wiki.terms_and_conditions.copyright.headline')}</h4>
      <p>{trans('my_wiki.terms_and_conditions.headline.copyright.text')}</p>

      <h4 className="mt-4">{trans('my_wiki.terms_and_conditions.liability.headline')}</h4>
      <p>{trans('my_wiki.terms_and_conditions.liability.text')}</p>

      <h4 className="mt-4">{trans('my_wiki.terms_and_conditions.final_provisions.headline')}</h4>
      <p>{trans('my_wiki.terms_and_conditions.final_provisions.text')}</p>
    </Container>
  );
};

export default TermsAndConditions;
