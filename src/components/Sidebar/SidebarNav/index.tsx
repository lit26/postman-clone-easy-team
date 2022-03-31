import React from "react";
import "./SidebarNav.scss";

interface SidebarNavProps {
  Icon: any;
  title: string;
  clickHandle: any;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  Icon,
  title,
  clickHandle,
}) => {
  return (
    <div
      className="sidebarRow d-flex flex-column align-items-center"
      onClick={() => clickHandle(title)}
    >
      <Icon className="sidebarRow__icon" />
      <span className="sidebarRow__title flex-1">{title}</span>
    </div>
  );
};

export default SidebarNav;
