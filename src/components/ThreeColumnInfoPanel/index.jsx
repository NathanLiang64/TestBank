import React from 'react';
import uuid from 'react-uuid';

import { ArrowNextIcon, SwitchIcon } from 'assets/images/icons';

import ThreeColumnInfoPanelWrapper from './ThreeColumnInfoPanel.style';

const ThreeColumnInfoPanel = ({ content, children }) => (
  <ThreeColumnInfoPanelWrapper>
    { children ?? content.map((info) => {
      const Component = info.onClick ? 'button' : 'div';
      return (
        <Component key={uuid()} onClick={info.onClick}>
          <h3 className="label">
            {info.label}
            {info.onClick && (info.iconType === 'switch' ? <SwitchIcon /> : <ArrowNextIcon />)}
          </h3>
          <div className="value">{info.value}</div>
        </Component>
      )
    })}
  </ThreeColumnInfoPanelWrapper>
);

export default ThreeColumnInfoPanel;
