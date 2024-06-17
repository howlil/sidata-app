import SideBarIndex from "../Sidebar";
import NavbarIndex from "../Navbar";

export default function Layout({ children }) {
  return (
    <>
      <aside className="fixed top-0 z-10 left-0 shadow-lg h-screen bg-white shadow-neutral-200">
        <SideBarIndex />
      </aside>
      <div>
        <nav className="fixed top-0 w-full bg-white py-4 pr-14 shadow-sm flex justify-end   right-0">
          <NavbarIndex />
        </nav>
        <main className="h-full my-32 ml-80 mr-14">{children}</main>
      </div>
    </>
  );
}
