import React, { useState, useRef, useEffect, MouseEventHandler } from 'react';
import { Image } from 'react-bootstrap';
import { User } from '../../dataTypes/types';
import { Link } from 'react-router-dom';

interface ProfileDropdownProps {
  user: User;
  onLogout: MouseEventHandler<HTMLButtonElement>;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <Image
        src={user.profileImage || '/images/profileImageDefault.png'}
        width="40px"
        height={'40px'}
        roundedCircle
        role="button"
        className="ms-4 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
        <div
          className="position-absolute end-0 mt-2 p-3 bg-white shadow rounded"
          style={{ zIndex: 1000, minWidth: '150px' }}
        >
          <div className="mb-2 fw-bold">{user.email}</div>
          <Link to="/user/me?tab=profile" className="btn btn-sm btn-outline-primary w-100 mb-2">
            Profil
          </Link>
          {user.role === 'admin' && (
            <Link to="/user/me?tab=admin" className="btn btn-sm btn-outline-secondary w-100 mb-2">
              Adminbereich
            </Link>
          )}
          {(user.role === 'admin' || user.role === 'creator') && (
            <Link to="/insert-article" className="btn btn-sm btn-outline-secondary w-100 mb-2">
              Artikel erstellen
            </Link>
          )}
          <button className="btn btn-sm btn-outline-danger w-100" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
