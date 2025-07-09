import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import Submenu from "./SubMenu";
import { SidebarMenuItems } from "../constants";
import { useMenuItems } from "../hooks/useLayout";

const MenuItems = ({ menuItems }: { menuItems: SidebarMenuItems[] }) => {
  const { location, locationName, toggleSubmenu, activeSubmenu } = useMenuItems();
  const formatId = (title: string) => `sidebarMenuItem-${title.replace(/\s+/g, "")}`;
  return (
    <>
      <ul className="flex flex-col gap-1">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`rounded-sm ${item.children ? "" : ""} ${location.pathname === item.link ? " " : ""} `}
            // ${activeSubmenu === index ? 'bg-gray-100' : ''}
          >
            {/* single menu with no children */}
            {!item.children && (
              <Link
                id={formatId(item.title)}
                className={`flex items-center justify-center gap-3 rounded-lg p-2 ${
                  location.pathname === item.link
                    ? "bg-[#F2F2F2] font-semibold text-[#000000] [&_path]:stroke-[#000000]"
                    : "text-[#4D4D4D] hover:bg-gray-100"
                }`}
                to={item.link}
              >
                <item.icon
                  size={24}
                  className={location.pathname === item.link ? "font-bold" : ""}
                />
                <div className="flex-grow text-sm">{item.title}</div>
              </Link>
            )}

            {/* sub menu parent */}
            {item.children && (
              <Link
                id={formatId(item.title)}
                to={item.link}
                className={`flex items-center rounded-sm p-2 hover:bg-gray-100 ${activeSubmenu === index ? "bg-gray-200" : " "}`}
                onClick={() => toggleSubmenu(index)}
              >
                <div className="flex flex-1 items-center gap-4">
                  <item.icon size={24} />
                  <div className="text-sm text-[#000000]">{item.title}</div>
                </div>
                <div className="flex-shrink-0">
                  <ChevronRight
                    opacity={0.5}
                    size={20}
                    className={`transform transition-all duration-300 ${activeSubmenu === index ? "rotate-90" : ""}`}
                  />
                </div>
              </Link>
            )}

            <Submenu
              item={item}
              currentMenuIndex={index}
              locationName={locationName}
              activeSubmenu={activeSubmenu}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default MenuItems;
