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
  const activeClass = isActive ? "bg-ijau-400  " : "";

  return (
    <>
      <section
        className={`${activeClass} py-3 mx-4 px-8 rounded-lg hover:bg-ijau-400 ts flex gap-x-2`}
        onClick={onClick}
      >
        <Icon name={icon} size={24} color="black" />
        <Link className="font-semibold text-base" to={href}>
          {label}
        </Link>
      </section>
    </>
  );
}
