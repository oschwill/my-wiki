import { useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { ShieldLockFill } from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TokenForm from './tokenForm/TokenForm';
import TwoFactorTokenInfos from './tokenInfos/TwoFactorTokenInfos';

interface TwoFactorFormProps {
  show2faForm: {
    formData: any;
    hasTwoFactor: boolean;
  };
}

const TwoFactorForm: React.FC<TwoFactorFormProps> = ({ show2faForm }) => {
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken && authToken !== 'null') {
      navigate('/');
    }
  }, [authToken]);

  return (
    <Card className="p-4 shadow-sm">
      <h5 className="mb-4 d-flex align-items-center gap-2">
        <ShieldLockFill /> 2FA Token Validierung
      </h5>
      <Row>
        <Col md={6}>
          <TokenForm userData={show2faForm} fetchUrl="/api/v1/user/check-2fa" />
        </Col>
        <Col md={6}>
          <TwoFactorTokenInfos show2faForm={show2faForm} />
        </Col>
      </Row>
    </Card>
  );
};

export default TwoFactorForm;
