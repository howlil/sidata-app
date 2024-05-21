import { datamhs, dataDosen, dataAdmin } from "@/data/nav";
import ActiveRoute from "./ActiveRoute";
import { jwtDecode } from "jwt-decode";

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
  const role = getRoleFromToken();

  let navData;
  if (role === "DOSEN") {
    navData = dataDosen;
  } else if (role === "ADMIN") {
    navData = dataAdmin;
  }else if (role === "MAHASISWA") {   
    navData = datamhs;
  }

  return (
    <>
      {navData.map((data, i) => (
        <section key={i}>
          <ActiveRoute href={data.href} icon={data.icon} label={data.label} />
        </section>
      ))}
    </>
  );
}
