import React from 'react';
import ConfirmModal from './ConfirmModal';

type ConfirmVariant = 'primary' | 'danger' | 'success' | 'warning';

export interface ConfirmModalConfig {
  show: boolean;
  onClose: () => void;
  title: string;
  body: React.ReactNode | string;
  confirmText?: string;
  confirmVariant?: ConfirmVariant;
  onConfirm?: () => void;
}

interface ConfirmModalRendererProps {
  modals: ConfirmModalConfig[];
}

const ConfirmModalRenderer: React.FC<ConfirmModalRendererProps> = ({ modals }) => {
  return (
    <>
      {modals.map((modal, index) => (
        <ConfirmModal key={index} {...modal} />
      ))}
    </>
  );
};

export default ConfirmModalRenderer;
