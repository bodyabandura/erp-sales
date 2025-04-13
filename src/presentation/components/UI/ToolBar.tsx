import React from "react";
import "./styles/ToolBar.css";

interface ToolbarItem {
  icon?: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface ToolBarProps {
  items: ToolbarItem[];
}

export const ToolBar: React.FC<ToolBarProps> = ({ items }) => {
  return (
    <div className="toolbar">
      {items.map((item, index) => (
        <button
          key={index}
          className={`toolbar-button ${item.disabled ? "disabled" : ""}`}
          onClick={item.onClick}
          disabled={item.disabled}
          title={item.label}
        >
          {item.icon ? (
            <img src={item.icon} alt={item.label} className="toolbar-icon" />
          ) : (
            <span className="toolbar-text">{item.label}</span>
          )}
        </button>
      ))}
    </div>
  );
};
