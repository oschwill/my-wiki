import { useLoaderData } from 'react-router-dom';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Toast } from 'react-bootstrap';
import CustomToolTip from '../components/general/CustomToolTip';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Area } from '../dataTypes/types';
import { useLanguage } from '../context/LanguageContext';
import { fetchFromApi } from '../utils/fetchData';
import { iconMap } from '../utils/icons';

const Home: React.FC = () => {
  const location = useLocation();
  const showToast = useToast();
  const { language } = useLanguage();
  const initialData = useLoaderData() as { areas: Area[] };
  const [areas, setAreas] = useState<Area[]>(initialData.areas);

  useEffect(() => {
    if (!language) return;

    const fetchAreas = async () => {
      const response = await fetchFromApi(
        `/api/v1/content/public/areas?locale=${language.locale}`,
        'GET',
      );
      if (response.success) {
        setAreas(response.data as Area[]);
      }
    };

    fetchAreas();
  }, [language]);

  useEffect(() => {
    if (location.state?.toastMessage) {
      showToast(location.state.toastMessage, location.state.toastVariant || 'info');
      // Optional: location.state löschen (bei Bedarf)
    }
  }, [location.state, showToast]);

  return (
    <Container fluid className="mt-4">
      <section className="row gap-4">
        <h2>Fachgebiete</h2>
        {areas.map((area) => (
          <article key={area._id} className="col-12 col-md-6 col-lg-3 col-xl-2 card">
            <div className="d-flex justify-content-center border-bottom">
              <div className="bg-info p-4 rounded-5 m-2">
                <FontAwesomeIcon
                  icon={iconMap[area.icon]}
                  style={{ height: '150px', width: '150px' }}
                />
              </div>
            </div>

            <div className="card-body">
              <h5 className="card-title">{area.title}</h5>
              <p className="card-text">{area.description}</p>

              <Link to={`/area/${area.queryPath}`} className="btn btn-primary">
                Browse
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section className="mt-5">
        <h2>Last Articles</h2>
        <article className="d-flex gap-2 flex-wrap">
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip
                text={`Bootstrap und wie das sonst hier nicht angezeigt werden kann und so ne!`}
              />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip
                text={`Bootstrap und wie das sonst hier nicht angezeigt werden kann und so ne!`}
              />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header closeButton={false}>
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <strong className="me-auto">Fachgebiet</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              <CustomToolTip text={`Bootstrap 5 und wie man was macht`} />
              <div className="d-flex justify-content-center m-2">
                <Link to="#" className="btn btn-primary">
                  Browse
                </Link>
              </div>
            </Toast.Body>
          </Toast>
        </article>
      </section>
    </Container>
  );
};

export default Home;
