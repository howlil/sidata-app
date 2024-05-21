import SideBarIndex from "../Sidebar";
import NavbarIndex from "../Navbar";

export default function Layout({ children }) {
  return (
    <>
      <aside className="fixed top-0 z-10 left-0 shadow-lg h-screen bg-white shadow-neutral-200">
        <SideBarIndex />
      </aside>
      <div>
        <nav className="fixed top-0 w-full  border-2 py-2 pr-6 flex justify-end   right-0">
          <NavbarIndex />
        </nav>
        <main className="h-full mt-20 ml-72">{children}</main>
      </div>
    </>
  );
}
