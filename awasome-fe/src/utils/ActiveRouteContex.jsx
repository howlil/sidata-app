import { createContext, useContext, useState } from "react";


const ActiveRouteContext = createContext();

export const useActiveRoute = () => useContext(ActiveRouteContext);

export const ActiveRouteProvider = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState({
    icon: "",
    href: "",
    label: "",
  });

  return (
    <ActiveRouteContext.Provider value={{ activeRoute, setActiveRoute }}>
      {children}
    </ActiveRouteContext.Provider>
  );
};
