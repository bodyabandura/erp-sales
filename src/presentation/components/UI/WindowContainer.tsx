import React, { ReactNode } from "react";
import "./styles/WindowContainer.css";

interface WindowContainerProps {
  title: string;
  children: ReactNode;
  icon?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const WindowContainer: React.FC<WindowContainerProps> = ({
  title,
  children,
  icon,
  onClose = () => {},
  onMinimize = () => {},
  onMaximize = () => {},
}) => {
  return (
    <div className="window-container">
      <div className="window-titlebar">
        {icon && <img src={icon} alt="" className="window-icon" />}
        <span className="window-title">{title}</span>
        <div className="window-controls">
          <button className="window-button minimize" onClick={onMinimize}>
            ─
          </button>
          <button className="window-button maximize" onClick={onMaximize}>
            □
          </button>
          <button className="window-button close" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
};
