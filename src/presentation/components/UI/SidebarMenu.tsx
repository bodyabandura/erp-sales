import React from "react";
import "./styles/SidebarMenu.css";

interface MenuItem {
  icon?: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface SidebarMenuProps {
  groups: MenuGroup[];
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ groups }) => {
  return (
    <div className="sidebar-menu">
      <div className="sidebar-container">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="menu-group">
            <div className="menu-group-header">{group.title}</div>
            <ul className="menu-list">
              {group.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className={`menu-item ${item.isActive ? "active" : ""}`}
                  onClick={item.onClick}
                >
                  {item.icon && (
                    <div className="menu-item-icon">
                      <img src={item.icon} alt="" />
                    </div>
                  )}
                  <div className="menu-item-label">{item.label}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
