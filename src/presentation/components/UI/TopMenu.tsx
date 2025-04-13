import React from "react";
import "./styles/TopMenu.css";

interface MenuItem {
  icon?: string;
  label: string;
  onClick?: () => void;
}

interface TopMenuProps {
  items: MenuItem[];
}

export const TopMenu: React.FC<TopMenuProps> = ({ items }) => {
  return (
    <div className="top-menu">
      <div className="top-menu-container">
        {items.map((item, index) => (
          <div key={index} className="top-menu-item" onClick={item.onClick}>
            {item.icon && (
              <div className="top-menu-icon">
                <img src={item.icon} alt="" />
              </div>
            )}
            <div className="top-menu-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
