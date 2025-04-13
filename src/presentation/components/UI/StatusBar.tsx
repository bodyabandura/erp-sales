import React from "react";
import "./styles/StatusBar.css";

interface StatusBarItem {
  label: string;
  value?: string;
  width?: string;
}

interface StatusBarProps {
  items: StatusBarItem[];
}

export const StatusBar: React.FC<StatusBarProps> = ({ items }) => {
  return (
    <div className="status-bar">
      {items.map((item, index) => (
        <div key={index} className="status-item" style={{ width: item.width }}>
          <span className="status-label">{item.label}:</span>
          {item.value && <span className="status-value">{item.value}</span>}
        </div>
      ))}
    </div>
  );
};
