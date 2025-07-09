import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccessToken, getUserInfo } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useGetOrgnaztionInfo } from "@/services/queries";

export const useMenuItems = () => {
  const location = useLocation();
  const locationName = location?.pathname?.replace("/", "");

  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(0);

  const toggleSubmenu = (index: number) => {
    if (activeSubmenu === index) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(index);
    }
  };
  return {
    location,
    locationName,
    toggleSubmenu,
    activeSubmenu,
  };
};

export const useMenuToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu function
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Create media query for large screens
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    let wasLargeScreen = mediaQuery.matches;

    // Function to handle screen size changes
    const handleScreenChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isLargeScreen = e.matches;

      // If switching from large to small screen, reset menu state
      if (wasLargeScreen && !isLargeScreen) {
        setIsOpen(false);
      }

      wasLargeScreen = isLargeScreen;
    };

    // Initial check
    handleScreenChange(mediaQuery);

    // Add listener for screen size changes
    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  return {
    toggleMenu,
    isOpen,
  };
};

export const useNavBar = () => {
  const router = useNavigate();
  const { data: userInfo } = useGetOrgnaztionInfo();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const overlayClass = dropdownOpen ? "fixed inset-0 bg-transparate opacity-50 " : "hidden";

  const handleNavigate = (path: string) => {
    setDropdownOpen(false);
    router(path);
  };

  const handleOverlay = () => dropdownOpen && setDropdownOpen(false);
  const handleModelOpen = () => setDropdownOpen(!dropdownOpen);

  const handleProfile = () => {
    handleNavigate(ROUTES.PROFILE);
  };
  const handleChangePassword = () => {
    handleNavigate(ROUTES.CHANGE_PASSWORD);
  };

  const handleLogout = () => {
    localStorage.clear();
    handleNavigate(ROUTES.SIGN_IN);
  };

  return {
    router,
    userInfo,
    overlayClass,
    dropdownOpen,
    handleOverlay,
    setDropdownOpen,
    handleProfile,
    handleChangePassword,
    handleModelOpen,
    handleLogout,
  };
};

export const useAuth = () => {
  const navigate = useNavigate();
  const accessToken = getAccessToken();

  if (!accessToken) {
    navigate(ROUTES.SIGN_IN, { replace: true });
  }
};
