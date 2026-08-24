import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowDown, FaArrowUp, FaTrash, FaUserLock, FaUserShield } from 'react-icons/fa';
import { fetchFromApi } from '../../../../utils/fetchData';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import { UserListFromApi } from '../../../../dataTypes/types';
import { sortData } from '../../../../utils/functionHelper';
import ConfirmModal from '../../../modal/ConfirmModal';
import { useTranslation } from '../../../../hooks/hookHelper';
import { transHtml } from '../../../../utils/functionHelper';

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
  const { trans } = useTranslation();

  const columns: { label: string; key: keyof UserListFromApi }[] = [
    { label: trans('my_wiki.components.user_list.table.user'), key: 'username' },
    { label: trans('my_wiki.components.user_list.table.email'), key: 'email' },
    { label: trans('my_wiki.components.user_list.table.firstname'), key: 'firstName' },
    { label: trans('my_wiki.components.user_list.table.lastname'), key: 'lastName' },
    { label: trans('my_wiki.components.user_list.table.location'), key: 'location' },
    { label: trans('my_wiki.components.user_list.table.role'), key: 'role' },
    { label: trans('my_wiki.components.user_list.table.provider'), key: 'provider' },
    { label: trans('my_wiki.components.user_list.table.active'), key: 'active' },
    {
      label: trans('my_wiki.components.user_list.table.create_request_status.label'),
      key: 'creatorRequestStatus',
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchFromApi('/api/v1/admin/allUsers', 'GET');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (e) {
      showToast(trans('my_wiki.components.user_list.load_user_error'), 'error');
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
    showToast(
      trans('my_wiki.components.user_list.login_status_success', {
        email,
        status: active
          ? trans('my_wiki.components.user_list.blocked')
          : trans('my_wiki.components.user_list.activated'),
      }),
      'success',
    );
  };

  const handleRoleToggle = async (email: string) => {
    await fetchFromApi('/api/v1/admin/upgradeUser', 'PATCH', { email });
    fetchUsers();
    showToast(
      trans('my_wiki.components.user_list.role_status_success', {
        email,
      }),
      'success',
    );
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    await fetchFromApi('/api/v1/admin/deleteUser', 'DELETE', { email: userToDelete.email });
    setUserToDelete(null);
    setShowModal(false);
    fetchUsers();
    showToast(trans('my_wiki.components.user_list.delete_user_message.delete_success'), 'success');
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
                <td>
                  <Link
                    to={`/user/${user.username}/${user.userHash}`}
                    className="text-decoration-none"
                  >
                    {user.username}
                  </Link>
                </td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.location}</td>
                <td>{user.role}</td>
                <td>{user.provider}</td>
                <td>
                  {user.active
                    ? trans('my_wiki.components.user_list.table.is_user_active')
                    : trans('my_wiki.components.user_list.table.is_user_not_active')}
                </td>
                <td>
                  {user.creatorRequestStatus === 'pending' && (
                    <Badge bg="warning" text="dark">
                      {trans('my_wiki.components.user_list.table.create_request_status.pending')}
                    </Badge>
                  )}
                  {user.creatorRequestStatus === 'accepted' && (
                    <Badge bg="success">
                      {trans('my_wiki.components.user_list.table.create_request_status.accepted')}
                    </Badge>
                  )}
                  {user.creatorRequestStatus === 'rejected' && (
                    <Badge bg="danger">
                      {trans('my_wiki.components.user_list.table.create_request_status.rejected')}
                    </Badge>
                  )}

                  {!user.creatorRequestStatus && (
                    <span className="text-muted">
                      {trans('my_wiki.components.user_list.table.create_request_status.none')}
                    </span>
                  )}
                </td>
                <td>
                  <div className="d-flex flex-nowrap gap-2">
                    <Button
                      size="sm"
                      variant={user.active ? 'warning' : 'success'}
                      onClick={() => handleBlockToggle(user.email, user.active)}
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: '125px' }}
                    >
                      <FaUserLock className="me-1" />
                      {user.active
                        ? trans('my_wiki.components.user_list.call_to_action.login_status_disable')
                        : trans('my_wiki.components.user_list.call_to_action.login_status_enable')}
                    </Button>

                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleRoleToggle(user.email)}
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: '125px' }}
                    >
                      <FaUserShield className="me-1" />
                      {trans('my_wiki.components.user_list.call_to_action.change_role')}
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setUserToDelete(user);
                        setShowModal(true);
                      }}
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: '125px' }}
                    >
                      <FaTrash className="me-1" />
                      {trans('my_wiki.components.user_list.call_to_action.delete')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* Modal */}
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={trans('my_wiki.components.user_list.delete_user_message.title')}
        body={
          <>
            {transHtml(
              trans('my_wiki.components.user_list.delete_user_message.message', {
                userToDelete: userToDelete?.email ?? '',
              }),
            )}
          </>
        }
        confirmText={trans('my_wiki.components.user_list.delete_user_message.confirm_text')}
        cancelText={trans('my_wiki.components.user_list.delete_user_message.cancel_text')}
        confirmVariant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
};

export default UserList;
