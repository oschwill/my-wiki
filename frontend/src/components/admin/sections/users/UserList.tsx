import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Alert } from 'react-bootstrap';
import { FaArrowDown, FaArrowUp, FaTrash, FaUserLock, FaUserShield } from 'react-icons/fa';
import { fetchFromApi } from '../../../../utils/fetchData';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import { UserListFromApi } from '../../../../dataTypes/types';
import { sortData } from '../../../../utils/functionHelper';
import ConfirmModal from '../../../modal/ConfirmModal';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserListFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserListFromApi;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserListFromApi | null>(null);
  const showToast = useToast();

  const { user } = useAuth();

  const columns: { label: string; key: keyof UserListFromApi }[] = [
    { label: 'Benutzer', key: 'username' },
    { label: 'Email', key: 'email' },
    { label: 'Vorname', key: 'firstName' },
    { label: 'Nachname', key: 'lastName' },
    { label: 'Ort', key: 'location' },
    { label: 'Rolle', key: 'role' },
    { label: 'Provider', key: 'provider' },
    { label: 'Aktiv', key: 'active' },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchFromApi('/api/v1/admin/allUsers', 'GET');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (e) {
      showToast('Fehler beim Laden der Benutzer!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (key: keyof UserListFromApi) => {
    sortData(key, users, setUsers, sortConfig, setSortConfig);
  };

  const handleBlockToggle = async (email: string, active: boolean) => {
    await fetchFromApi('/api/v1/admin/blockUser', 'PATCH', { email });
    fetchUsers();
    showToast(`Der Benutzer ${email} wurde ${active ? 'blockiert' : 'aktiviert'}.`, 'success');
  };

  const handleRoleToggle = async (email: string) => {
    await fetchFromApi('/api/v1/admin/upgradeUser', 'PATCH', { email });
    fetchUsers();
    showToast(`Die Benutzerrolle für ${email} wurde erfolgreich geändert.`, 'success');
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    await fetchFromApi('/api/v1/admin/deleteUser', 'DELETE', { email: userToDelete.email });
    setUserToDelete(null);
    setShowModal(false);
    fetchUsers();
    showToast('Benutzer wurde erfolgreich gelöscht.', 'success');
  };

  if (loading) return <Spinner animation="border" className="mt-3" />;

  return (
    <>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            {columns.map(({ label, key }) => (
              <th
                key={key}
                onClick={() => handleSort(key as keyof UserListFromApi)}
                style={{ cursor: 'pointer' }}
              >
                {label}{' '}
                {sortConfig?.key === key &&
                  (sortConfig.direction === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
              </th>
            ))}
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) => u.email !== user?.email)
            .map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.location}</td>
                <td>{user.role}</td>
                <td>{user.provider}</td>
                <td>{user.active ? 'Ja' : 'Nein'}</td>
                <td>
                  <Button
                    size="sm"
                    variant={user.active ? 'warning' : 'success'}
                    onClick={() => handleBlockToggle(user.email, user.active)}
                    className="me-2"
                  >
                    <FaUserLock /> {user.active ? 'Blockieren' : 'Freigeben'}
                  </Button>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => handleRoleToggle(user.email)}
                    className="me-2"
                  >
                    <FaUserShield /> Rolle wechseln
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setUserToDelete(user);
                      setShowModal(true);
                    }}
                  >
                    <FaTrash /> Löschen
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* Modal */}
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Benutzer löschen"
        body={
          <>
            Bist du sicher, dass du den Benutzer <strong>{userToDelete?.email}</strong> löschen
            möchtest?
          </>
        }
        confirmText="Löschen"
        cancelText="Abbrechen"
        confirmVariant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
};

export default UserList;
