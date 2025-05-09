// ToastContext.tsx
import React, { createContext, useContext } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Variant = 'success' | 'error' | 'info' | 'warning';

const ToastContext = createContext<(msg: string, variant?: Variant, duration?: number) => void>(
  () => {}
);

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showToast = (message: string, variant: Variant = 'success', duration: number = 5000) => {
    toast[variant](message, {
      position: 'top-right',
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Slide,
    });
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer newestOnTop closeOnClick pauseOnFocusLoss={false} style={{ top: '75px' }} />
    </ToastContext.Provider>
  );
};
