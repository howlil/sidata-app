import logo from "/public/logosidata.svg";
import SidebarNav from "./SBNav";

export default function SideBarIndex() {
  return (
    <div className="w-[240px] shadow-lg h-screen shadow-neutral-200">
      <section className="mt-6 flex justify-center">
        <img src={logo} alt="a" />
      </section>
      <section className="mt-12">
        <SidebarNav />
      </section>
    </div>
  );
}
