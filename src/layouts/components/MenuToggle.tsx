import { Menu } from "lucide-react";

import Sidebar from "../Sidebar";
import { useMenuToggle } from "../hooks/useLayout";

const MenuToggle = () => {
  const { toggleMenu, isOpen } = useMenuToggle();

  return (
    <div className="block lg:hidden">
      {/* Toggle Button */}
      <div className="cursor-pointer ps-4" onClick={toggleMenu}>
        <Menu />
      </div>

      {/* Drawer Overlay */}
      <div
        onClick={toggleMenu}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} `}
      />

      {/* Drawer Content */}
      <div
        className={`fixed left-0 top-0 z-50 h-full transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <Sidebar />
      </div>
    </div>
  );
};

export default MenuToggle;
