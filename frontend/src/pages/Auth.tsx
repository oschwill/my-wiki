import { Container } from 'react-bootstrap';
import RegisterUser from '../components/auth/RegisterUser';
import LoginUser from '../components/auth/LoginUser';
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const Auth: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  const registerSpring = useSpring({
    transform: showRegister ? 'translateX(0%)' : 'translateX(100%)',
    opacity: showRegister ? 1 : 0,
    config: { tension: 220, friction: 25 },
  });

  const loginSpring = useSpring({
    transform: showRegister ? 'translateX(-100%)' : 'translateX(0%)',
    opacity: showRegister ? 0 : 1,
    config: { tension: 220, friction: 25 },
  });

  return (
    <Container
      fluid
      className="mt-4 position-relative p-4"
      style={{ overflow: 'hidden', height: '100vh' }}
    >
      <animated.div
        style={{
          ...registerSpring,
          position: 'absolute',
          width: '100%',
          top: 0,
        }}
      >
        <RegisterUser onSwitch={() => setShowRegister(false)} />
      </animated.div>

      <animated.div
        style={{
          ...loginSpring,
          position: 'absolute',
          width: '100%',
          top: 0,
        }}
      >
        <LoginUser onSwitch={() => setShowRegister(true)} />
      </animated.div>
    </Container>
  );
};

export default Auth;
