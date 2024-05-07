import { NavLink, useLocation } from 'react-router-dom';

interface CustomLink {
  to: string;
  label: string;
}

const CustomNavLink: React.FC<CustomLink> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname + location.search === to;

  return (
    <NavLink to={to} className={`nav-link text-secondary ${isActive ? 'text-info fw-bold' : ''}`}>
      {label}
    </NavLink>
  );
};

export default CustomNavLink;
