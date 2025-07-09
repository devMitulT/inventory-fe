import { sidebarMenuItems } from "./constants";
import NavBarMenuItems from "./components/MenuItems";
import decloneLogo from "@/assets/images/declone.png";

function ProductSideBar() {
  return (
    <>
      <div className="sticky top-0 w-[248px] border-r bg-white">
        <div className="flex h-[80px] items-center justify-center">
          <img
            id="logo"
            src={decloneLogo}
            height={32}
            width={32}
            alt="logo"
            className="rounded-[100px]"
          />
        </div>
        <div className="h-[calc(100vh_-_80px)] overflow-auto p-3">
          <NavBarMenuItems menuItems={sidebarMenuItems} />
        </div>
      </div>
    </>
  );
}

export default ProductSideBar;
