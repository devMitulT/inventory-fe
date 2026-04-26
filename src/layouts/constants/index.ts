import { Users } from "lucide-react";

import icons from "@/assets/icons";
import { ROUTES } from "@/constants";

export interface SidebarMenuItems {
  title: string;
  icon?: any;
  link: string;
  children?: SidebarMenuItems[];
  superAdminOnly?: boolean;
}

export type SubMenuPorps = {
  activeSubmenu: number | null;
  item: SidebarMenuItems;
  currentMenuIndex: number;
  locationName: string;
};

export const sidebarMenuItems: SidebarMenuItems[] = [
  {
    title: "Home",
    icon: icons.home,
    link: ROUTES.HOME,
  },
  {
    title: "Products",
    icon: icons.productiList,
    link: ROUTES.PRODUCTS,
  },
  {
    title: "Orders",
    icon: icons.order,
    link: ROUTES.ORDERS,
  },
  {
    title: "Users",
    icon: Users,
    link: ROUTES.USERS,
    superAdminOnly: true,
  },
];
