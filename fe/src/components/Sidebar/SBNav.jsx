import { useState } from "react";
import { datamhs, dataDosen, dataAdmin } from "@/data/nav";
import ActiveRoute from "./ActiveRoute";
import { jwtDecode } from "jwt-decode"; 
import Icon from "../ui/Icon";

const getRoleFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("decoded", decoded);
    return decoded?.role || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export default function SidebarNav() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const role = getRoleFromToken();

  let navData;
  if (role === "dosen") {
    navData = dataDosen;
  } else if (role === "admin") {
    navData = dataAdmin;
  } else if (role === "mahasiswa") {
    navData = datamhs;
  }

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const links = [
    {
      href: "/admin/data/dataMhs",
      label: "Mahasiswa",
      icon: "ChevronRight",
    },
    {
      href: "/admin/data/dataDosen",
      label: "Dosen",
      icon: "ChevronRight",
    },
  ];

  return (
    <>
      {navData?.map((data, i) => (
        <section key={i} className="mb-2">
          {role === "admin" && data.label === "Data Master" ? (
            <div className="relative">
              <button
                onClick={handleDropdownToggle}
                className="flex items-center px-12 gap-2 p-2   rounded w-full text-left"
              >
                <Icon name={data.icon} className="w-6 h-6 mr-2" />
                {data.label}
                <Icon
                  name={isDropdownOpen ? "ChevronUp" : "ChevronDown"}
                  className="w-6 h-6 ml-auto"/>
              </button>
              {isDropdownOpen && (
                <div className="absolute left-10 mt-2  ts  rounded z-10">
                  {links.map((link) => (
                     <ActiveRoute  href={link.href} icon={link.icon} label={link.label} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <ActiveRoute href={data.href} icon={data.icon} label={data.label} />
          )}
        </section>
      ))}
    </>
  );
}
