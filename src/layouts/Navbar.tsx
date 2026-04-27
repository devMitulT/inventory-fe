import { ChevronDown, ChevronUp, UserCircle } from "lucide-react";

import MenuToggle from "./components/MenuToggle";
import { useNavBar } from "./hooks/useLayout";
import Icons from "@/assets/icons";
import { getCurrentUser, isSuperAdmin } from "@/lib/utils";
import { useGetMyProfile } from "@/services/queries";

const Navbar = () => {
  const {
    overlayClass,
    handleModelOpen,
    handleOverlay,
    dropdownOpen,
    handleProfile,
    handleChangePassword,
    handleMyAccount,
    handleLogout,
  } = useNavBar();
  const isSuper = isSuperAdmin();

  const { data: meData } = useGetMyProfile();
  const cachedUser = getCurrentUser();
  const displayName: string =
    meData?.data?.name || cachedUser?.name || "";
  const [firstName = "", lastName = ""] = displayName.trim().split(" ");

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
                <div className="absolute right-1.5 mt-[40px] w-56 rounded-md border border-slate-100 bg-white p-2 shadow-lg">
                  <div className="flex w-[214px] flex-col">
                    <button
                      id="Profile"
                      onClick={handleProfile}
                      className="flex h-8 w-52 cursor-pointer items-center gap-3 bg-white p-2 text-left text-sm hover:bg-gray-100"
                    >
                      <Icons.profile />{" "}
                      {isSuper ? "Organization Profile" : "Organization"}
                    </button>
                    <button
                      id="myAccount"
                      onClick={handleMyAccount}
                      className="flex h-8 w-52 cursor-pointer items-center gap-3 bg-white p-2 text-left text-sm hover:bg-gray-100"
                    >
                      <UserCircle className="h-4 w-4" /> My Account
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
