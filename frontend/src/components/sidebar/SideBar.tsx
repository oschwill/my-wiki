import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import CustomNavLink from './CustomNavLink';
import { clockFN } from '../../utils/functionHelper';

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>(`${clockFN().time} • ${clockFN().date}`);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { date, time } = clockFN();
      setCurrentTime(`${time} • ${date}` as string);
    }, 1000);

    return () => clearInterval(intervalId);
  });

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <nav className="sidebar overflow-hidden d-flex flex-column">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column justify-content align-content-center ">
          <li className="nav-item" style={{ width: '100%' }}>
            <CustomNavLink to="/" label="Home" />
          </li>
          <li className="nav-item" style={{ width: '100%' }}>
            <div className="d-flex align-content-center">
              <a
                className="nav-link"
                aria-current="page"
                data-bs-toggle="collapse"
                href="#area"
                role="button"
                aria-expanded="false"
                aria-controls="area"
                onClick={toggleDropdown}
              >
                <span className="text-secondary">Fachgebiete</span>{' '}
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ms-2 text-dark"
                  style={{
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                />
              </a>
            </div>

            <div className="collapse ps-4" id="area">
              <div>
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <CustomNavLink to="/area?areaName=programmierung" label="Programmierung" />
                  </li>
                  <li className="nav-item">
                    <CustomNavLink to="/area?areaName=administration" label="Administration" />
                  </li>
                  <li className="nav-item">
                    <CustomNavLink to="/area?areaName=sonstiges" label="Sonstiges" />
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="mt-auto position-absolute bottom-0 border-top-2 w-100 border-info">
        <div className="p-2 bg-light text-dark text-center">{currentTime}</div>
      </div>
    </nav>
  );
};

export default SideBar;
