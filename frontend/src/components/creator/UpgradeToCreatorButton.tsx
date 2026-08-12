import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { fetchFromApi } from '../../utils/fetchData';
import { useTranslation } from '../../hooks/hookHelper';
import ConfirmModal from '../modal/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const UpgradeToCreatorButton: React.FC = () => {
  const { user } = useAuth();
  const { trans } = useTranslation();
  const showToast = useToast();

  const [requestStatus, setRequestStatus] = useState<'pending' | 'rejected' | 'accepted' | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showInfo, setShowInfo] = useState(() => {
    return localStorage.getItem('creator_request_info_closed') !== 'true';
  });

  useEffect(() => {
    if (!user || user.role !== 'visitor') {
      return;
    }

    const loadCreatorRequestStatus = async () => {
      try {
        const response = await fetchFromApi('/api/v1/user/creator-request-status', 'GET', null);

        if (response?.success) {
          setRequestStatus(response.data?.creatorRequestStatus ?? null);
        }
      } catch (error) {
        console.error('Error loading creator request status:', error);
      }
    };

    loadCreatorRequestStatus();
  }, [user]);

  // Nicht eingeloggt oder kein Visitor
  if (!user || user.role !== 'visitor') {
    return null;
  }

  const isPending = requestStatus === 'pending';

  const handleRequest = async () => {
    try {
      setLoading(true);

      const response = await fetchFromApi('/api/v1/user/request-creator', 'POST', null);

      if (response?.success) {
        setRequestStatus('pending');
        setShowConfirmModal(false);

        showToast(trans('my_wiki.components.upgrade_to_creator_button.success'), 'success');
      }
    } catch (error) {
      showToast(trans('my_wiki.components.upgrade_to_creator_button.failed'), 'error');

      console.error('Error requesting creator upgrade:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeInfo = () => {
    setShowInfo(false);
    localStorage.setItem('creator_request_info_closed', 'true');
  };

  return (
    <>
      <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1050 }}>
        {showInfo && (
          <Alert variant="info" className="shadow mb-3" style={{ maxWidth: '380px' }}>
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>{trans('my_wiki.components.upgrade_to_creator_button.info')}</div>

              <Button
                variant="link"
                className="p-0 text-muted"
                onClick={closeInfo}
                aria-label={trans('my_wiki.components.upgrade_to_creator_button.close')}
              >
                <FaTimes />
              </Button>
            </div>
          </Alert>
        )}

        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={() => setShowConfirmModal(true)}
            disabled={loading || isPending}
          >
            {isPending
              ? trans('my_wiki.components.upgrade_to_creator_button.requested')
              : trans('my_wiki.components.upgrade_to_creator_button.request')}
          </Button>
        </div>
      </div>

      <ConfirmModal
        show={showConfirmModal}
        onClose={() => {
          if (!loading) {
            setShowConfirmModal(false);
          }
        }}
        title={trans('my_wiki.components.upgrade_to_creator_button.title')}
        body={trans('my_wiki.components.upgrade_to_creator_button.confirm')}
        cancelText={trans('my_wiki.components.upgrade_to_creator_button.cancel')}
        confirmText={trans('my_wiki.components.upgrade_to_creator_button.confirm_button')}
        confirmVariant="primary"
        onConfirm={handleRequest}
      />
    </>
  );
};

export default UpgradeToCreatorButton;
