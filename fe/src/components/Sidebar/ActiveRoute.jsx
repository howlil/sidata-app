import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Icon from "../ui/Icon";
import { useActiveRoute } from "@/utils/ActiveRouteContex";

export default function ActiveRoute({ href, icon, label }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveRoute } = useActiveRoute();

  const isActive =
    location.pathname === href || location.pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (isActive) {
      setActiveRoute({ icon, label, href });
    }
  }, [isActive, icon, href, label, setActiveRoute]);

  const onClick = (e) => {
    e.preventDefault();
    navigate(href);
  };
  const activeClass = isActive ? "bg-ijau-400  border-r-4 border-ijau-100" : "";

  return (
    <>
      <section
        className={`${activeClass} py-3 px-12 flex gap-x-2`}
        onClick={onClick}
      >
        <Icon name={icon} size={24} color="black" />
        <Link to={href}>{label}</Link>
      </section>
    </>
  );
}
