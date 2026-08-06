import { Container } from 'react-bootstrap';
import { useTranslation } from '../hooks/hookHelper';
import { transHtml } from '../utils/functionHelper';

const PrivacyPolicy = () => {
  const { trans } = useTranslation();
  return (
    <Container className="my-5">
      <h1 className="mb-4">{trans('my_wiki.privacy_policy.headline')}</h1>

      <p>{trans('my_wiki.privacy_policy.headline_desc')}</p>

      <h4 className="mt-4">{trans('my_wiki.privacy_policy.responsible.headline')}</h4>
      <p>{transHtml(trans('my_wiki.privacy_policy.responsible.text'))}</p>

      <h4 className="mt-4">{trans('my_wiki.privacy_policy.access_data.headline')}</h4>
      <p>{trans('my_wiki.privacy_policy.access_data.text')}</p>

      <h4 className="mt-4">{trans('my_wiki.privacy_policy.personal_data.headline')}</h4>
      <p>{trans('my_wiki.privacy_policy.personal_data.text')}</p>

      <h4 className="mt-4">{trans('my_wiki.privacy_policy.personal_data.headline')}</h4>
      <p>{trans('my_wiki.privacy_policy.personal_data.text')}</p>

      <h4 className="mt-4">{trans('my_wiki.privacy_policy.your_rights.headline')}</h4>
      <ul>{transHtml(trans('my_wiki.privacy_policy.your_rights.text'))}</ul>

      <h4 className="mt-4">{trans('my_wiki.privacy_policy.changes.headline')}</h4>
      <p>{trans('my_wiki.privacy_policy.changes.text')}</p>
    </Container>
  );
};

export default PrivacyPolicy;
