import React from 'react';
import { Tooltip, OverlayTrigger, TooltipProps } from 'react-bootstrap';

interface ToolTipText {
  text: string;
}

const MAX_LENGTH = 70;

const CustomToolTip: React.FC<ToolTipText> = ({ text }) => {
  const renderTooltip = (props: TooltipProps) => (
    <Tooltip id="tooltip-top" {...props} className="custom-tooltip-bg">
      {text}
    </Tooltip>
  );

  const displayText = text.length > MAX_LENGTH ? `${text.substring(0, MAX_LENGTH)}...` : text;

  return (
    <OverlayTrigger placement="top" overlay={renderTooltip}>
      <strong className="me-auto">{displayText}</strong>
    </OverlayTrigger>
  );
};

export default CustomToolTip;
