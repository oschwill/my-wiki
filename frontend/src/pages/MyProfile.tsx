import { useEffect, useReducer, useState } from 'react';
import { Tab, Tabs, Container } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  genericFormReducer,
  initialUserProfileFormState,
  mapUserToFormData,
} from '../utils/stateHelper';
import { UserProfileFormState } from '../dataTypes/types';
import { fetchFromApi } from '../utils/fetchData';
import { PencilSquare, ShieldLock, GraphUp, ChatDots } from 'react-bootstrap-icons';
import { convertToFormData, getFieldError, showImagePreview } from '../utils/functionHelper';
import countries from '../data/data';
import { checkMyUserProfileData } from '../utils/errorHandling';
import { FieldErrorList } from '../dataTypes/baseTypes';
import { useToast } from '../context/ToastContext';
import MyUserData from '../components/profile/MyUserData';
import AdminPanel from '../components/admin/AdminPanel';

const MyProfile: React.FC = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const validTabs = ['profile', 'stats', 'requests', 'admin'];
  const initialTab = searchParams.get('tab');

  const [key, setKey] = useState<string>(
    validTabs.includes(initialTab || '') ? initialTab! : 'profile'
  );

  const [updateUserValues, setUpdateUserValues] = useState({});
  const [generalErrorMessage, setGeneralErrorMessage] = useState<FieldErrorList | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const [formData, dispatch] = useReducer(
    genericFormReducer<UserProfileFormState>,
    initialUserProfileFormState
  );
  const { refreshUser } = useAuth();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
    },
    maxSize: 2 * 1024 * 1024,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        dispatch({
          type: 'SET_FIELD',
          field: 'profileImage',
          value: acceptedFiles[0],
        });

        // Request Form Data Object State
        setUpdateUserValues((currentState) => ({
          ...currentState,
          profileImage: acceptedFiles[0],
        }));
      }
    },
  });

  useEffect(() => {
    if (!user && !loading) {
      navigate('/');
    }
    const getMyData = async () => {
      const response = await fetchFromApi('/api/v1/user/me', 'GET', []);

      if (response.success && response.user) {
        const mappedData = mapUserToFormData(response.user);
        mappedData.originalProfileImage = mappedData.profileImage;
        dispatch({ type: 'SET_MULTIPLE_FIELDS', values: mappedData });
      }
    };

    getMyData();
  }, []);

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && validTabs.includes(currentTab)) {
      setKey(currentTab);
    }
  }, [searchParams.toString()]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setGeneralErrorMessage(null);
    // Hier später: API Call zum Speichern
    const errors = checkMyUserProfileData(formData);

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      setIsSaving(false);
      return;
    }
    // REQUEST
    const formatUserData = convertToFormData(updateUserValues);
    try {
      /* DATA FETCHEN */
      const response = await fetchFromApi('/api/v1/user/changeUserData', 'PATCH', formatUserData);
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);

      if (response.success) {
        // SUCCESS
        await refreshUser();
        showToast('Profil gespeichert', 'success');
      } else {
        // ERROR
        setGeneralErrorMessage(response?.error);
        console.log('General Error', generalErrorMessage);
      }
    } catch (error: any) {
      //
      setGeneralErrorMessage(error.message);
      showToast(error.message, 'error');
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;

    let finalValue: string | boolean | File | HTMLImageElement | null;

    if (e.target instanceof HTMLInputElement && type === 'checkbox') {
      finalValue = e.target.checked;
    } else {
      finalValue = value;
    }

    dispatch({
      type: 'SET_FIELD',
      field: name as keyof UserProfileFormState,
      value: finalValue,
    });

    // Request Form Data Object State
    setUpdateUserValues((currentState) => ({
      ...currentState,
      [name]: finalValue,
    }));
  };

  const handlePasswordChangeRequest = () => {
    console.log('Passwort ändern anfragen');
    // Platzhalter - später Implementierung
  };

  const resetProfileImage = () => {
    const originalValue = formData.originalProfileImage.value;

    if (
      originalValue &&
      typeof originalValue === 'object' &&
      'url' in originalValue &&
      typeof originalValue.url === 'string'
    ) {
      dispatch({
        type: 'SET_FIELD',
        field: 'profileImage',
        value: originalValue.url,
      });
    } else {
      dispatch({
        type: 'SET_FIELD',
        field: 'profileImage',
        value: null,
      });
    }
  };

  const imagePreview = showImagePreview(formData.profileImage);

  return (
    <Container fluid className="my-4">
      <h1 className="mb-4">Willkommen {formData.userName.value}</h1>
      <Tabs
        id="profile-tabs"
        activeKey={key}
        onSelect={(k) => {
          const selectedTab = k || 'profile';
          setKey(selectedTab);
          navigate(`/user/me?tab=${selectedTab}`, { replace: true });
        }}
        className="mb-3"
      >
        <Tab
          eventKey="profile"
          title={
            <span className="d-flex align-items-center gap-2">
              <PencilSquare /> Meine Benutzerdaten
            </span>
          }
        >
          <MyUserData
            imagePreview={imagePreview}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handlePasswordChangeRequest={handlePasswordChangeRequest}
            resetProfileImage={resetProfileImage}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            countries={countries}
            getFieldError={getFieldError}
            generalErrorMessage={generalErrorMessage}
            isSaving={isSaving}
          />
        </Tab>
        <Tab
          eventKey="stats"
          title={
            <span className="d-flex align-items-center gap-2">
              <GraphUp /> Meine Statisitk
            </span>
          }
        >
          <div>
            <h3>Statistiken</h3>
            <p>Hier später Statistiken über Artikel, Kommentare etc.</p>
          </div>
        </Tab>

        <Tab
          eventKey="requests"
          title={
            <span className="d-flex align-items-center gap-2">
              <ChatDots /> Meine Anfragen
            </span>
          }
        >
          <div>
            <h3>Anfragen an Webseitenbetreiber</h3>
            <p>Hier kannst du Supportanfragen oder sonstiges senden (später noch ausbauen).</p>
          </div>
        </Tab>
        {user?.role === 'admin' && (
          <Tab
            eventKey="admin"
            title={
              <span className="d-flex align-items-center gap-2">
                <ShieldLock /> Adminbereich
              </span>
            }
          >
            <AdminPanel user={user} loading={loading} />
          </Tab>
        )}
      </Tabs>
    </Container>
  );
};

export default MyProfile;
