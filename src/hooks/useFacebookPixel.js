import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useFacebookPixel = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location.pathname]);
};

export default useFacebookPixel;