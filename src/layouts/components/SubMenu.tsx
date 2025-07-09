import React from "react";
import { cn } from "@/lib/utils";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";
import { SubMenuPorps } from "../constants";

const Submenu: React.FC<SubMenuPorps> = ({
  item,
  activeSubmenu,
  currentMenuIndex,
  locationName,
}) => {
  return (
    <Collapse isOpened={activeSubmenu === currentMenuIndex}>
      <ul className="space-y-4 pl-6">
        {item.children?.map((subItem, index) => (
          <li key={index} className="block pl-4 pr-1 text-gray-600 first:pt-4 last:pb-4">
            <Link to={subItem.link}>
              <span
                className={cn(
                  `${
                    locationName === subItem.link ? "font-medium text-gray-600" : ""
                  } flex items-center space-x-3 text-sm transition-all duration-150`
                )}
              >
                <subItem.icon size={18} />
                <span className="flex-1">{subItem.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Collapse>
  );
};

export default Submenu;
