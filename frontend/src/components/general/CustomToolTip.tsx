import React from 'react';
import { Tooltip, OverlayTrigger, TooltipProps } from 'react-bootstrap';

interface ToolTipText {
  text: string;
}

const CustomToolTip: React.FC<ToolTipText> = ({ text }) => {
  const renderTooltip = (props: TooltipProps) => (
    <Tooltip id="tooltip-top" {...props} className="custom-tooltip-bg">
      {text}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={renderTooltip}>
      <strong className="me-auto">{text.substring(0, 25)}...</strong>
    </OverlayTrigger>
  );
};

export default CustomToolTip;
