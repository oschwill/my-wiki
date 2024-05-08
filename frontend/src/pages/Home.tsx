import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'react-bootstrap';
import CustomToolTip from '../components/general/CustomToolTip';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container fluid className="mt-4">
      <section className="row gap-4">
        <h2>Fachgebiete</h2>
        <article className="col card">
          <div className="d-flex justify-content-center align-content-center border-bottom">
            <div className="bg-info p-4 rounded-5 m-2">
              <FontAwesomeIcon icon={faCode} style={{ height: '150px', width: '150px' }} />
            </div>
          </div>
          <div className="card-body">
            <h5 className="card-title">Programmierung</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the bulk of the card's
              content.
            </p>
            <a href="#" className="btn btn-primary">
              Browse
            </a>
          </div>
        </article>
        <article className="col  card">
          <div className="d-flex justify-content-center align-content-center border-bottom">
            <div className="bg-info p-4 rounded-5 m-2">
              <FontAwesomeIcon icon={faCode} style={{ height: '150px', width: '150px' }} />
            </div>
          </div>
          <div className="card-body">
            <h5 className="card-title">Programmierung</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the bulk of the card's
              content.
            </p>
            <a href="#" className="btn btn-primary">
              Browse
            </a>
          </div>
        </article>
        <article className="col  card">
          <div className="d-flex justify-content-center align-content-center border-bottom">
            <div className="bg-info p-4 rounded-5 m-2">
              <FontAwesomeIcon icon={faCode} style={{ height: '150px', width: '150px' }} />
            </div>
          </div>
          <div className="card-body">
            <h5 className="card-title">Programmierung</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the bulk of the card's
              content.
            </p>
            <a href="#" className="btn btn-primary">
              Browse
            </a>
          </div>
        </article>
      </section>
      <section className="mt-5">
        <h2>Last Articles</h2>
        <article className="d-flex gap-2">
          <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <CustomToolTip
                text={`Bootstrap und wie das sonst hier nicht angezeigt werden kann und so ne!`}
              />
              <small>11 mins ago</small>
            </div>
            <div className="d-flex justify-content-center m-2">
              <Link to="#" className="btn btn-primary">
                Browse
              </Link>
            </div>
          </div>
          <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <CustomToolTip
                text={`Bootstrap und wie das sonst hier nicht angezeigt werden kann und so ne!`}
              />
              <small>11 mins ago</small>
            </div>
            <div className="d-flex justify-content-center m-2">
              <Link to="#" className="btn btn-primary">
                Browse
              </Link>
            </div>
          </div>
          <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <CustomToolTip
                text={`Bootstrap und wie das sonst hier nicht angezeigt werden kann und so ne!`}
              />
              <small>11 mins ago</small>
            </div>
            <div className="d-flex justify-content-center m-2">
              <Link to="#" className="btn btn-primary">
                Browse
              </Link>
            </div>
          </div>
          <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <CustomToolTip
                text={`Bootstrap und wie das sonst hier nicht angezeigt werden kann und so ne!`}
              />
              <small>11 mins ago</small>
            </div>
            <div className="d-flex justify-content-center m-2">
              <Link to="#" className="btn btn-primary">
                Browse
              </Link>
            </div>
          </div>
          <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <div className="bg-info p-1 rounded-2 me-2">
                <FontAwesomeIcon icon={faCode} />
              </div>
              <CustomToolTip
                text={`Bootstrap und wie das sonst hier nicht angezeigt werden kann und so ne!`}
              />
              <small>11 mins ago</small>
            </div>
            <div className="d-flex justify-content-center m-2">
              <Link to="#" className="btn btn-primary">
                Browse
              </Link>
            </div>
          </div>
        </article>
      </section>
    </Container>
  );
};

export default Home;
