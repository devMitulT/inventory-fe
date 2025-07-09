import { ChevronDown, ChevronUp, Loader } from "lucide-react";

import MenuToggle from "./components/MenuToggle";
import { useNavBar } from "./hooks/useLayout";
import Icons from "@/assets/icons";

const Navbar = () => {
  const {
    userInfo,
    overlayClass,
    handleModelOpen,
    handleOverlay,
    dropdownOpen,
    handleProfile,
    handleChangePassword,
    handleLogout,
  } = useNavBar();

  if (!userInfo) {
    return (
      <header className="sticky top-0 z-10 border-b">
        <div className="shadow-base mr-5 flex h-[56px] items-center justify-end bg-white px-4">
          <div className="items-bottom mr-1 flex justify-end">Loading</div>
          <Loader />
        </div>
      </header>
    );
  }

  const isUserName: string[] = userInfo?.data?.ownerName?.split(" ") ?? [];
  const firstName = isUserName[0] || "";
  const lastName = isUserName[1] || "";

  return (
    <header className="sticky top-0 z-10 border-b">
      <div className="shadow-base h-[56px] bg-white px-4">
        <div className="flex h-full items-center justify-end">
          {/* User info and profile picture */}
          <div className="flex items-center">
            <div className={overlayClass} onClick={handleOverlay} id="navbar-overlay"></div>

            <div className="relative flex flex-row gap-1">
              <div onClick={handleModelOpen} className="flex cursor-pointer items-center gap-1.5">
                <p className="h-5 text-[14px]">
                  Hi, {firstName} {lastName}
                </p>
                {dropdownOpen ? (
                  <ChevronUp id="upOption" className="mt-0 h-6 w-6 text-gray-700" />
                ) : (
                  <ChevronDown id="downOption" className="mt-0 h-6 w-6 text-gray-700" />
                )}
              </div>
              {dropdownOpen && (
                <div className="absolute right-1.5 mt-[40px] h-28 w-56 rounded-md border border-slate-100 bg-white p-2 shadow-lg">
                  <div className="absolute flex w-[214px] flex-col">
                    <button
                      id="Profile"
                      onClick={handleProfile}
                      className="flex h-8 w-52 cursor-pointer items-center gap-3 bg-white p-2 text-left text-sm hover:bg-gray-100"
                    >
                      <Icons.profile /> Profile
                    </button>
                    <button
                      id="changePassword"
                      onClick={handleChangePassword}
                      className="flex h-8 w-52 cursor-pointer items-center gap-3 bg-white p-2 text-left text-sm hover:bg-gray-100"
                    >
                      <Icons.changePassword /> Change Password
                    </button>
                    <button
                      id="logout"
                      onClick={handleLogout}
                      className="flex h-8 w-52 cursor-pointer items-center gap-3 bg-white p-2 text-left text-sm hover:bg-gray-100"
                    >
                      <Icons.logout /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Menu toggle only shows on mobile/tablet */}
            <MenuToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
