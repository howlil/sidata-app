import SideBarIndex from "../Sidebar";
import NavbarIndex from "../Navbar";

export default function Layout({ children }) {
  return (
    <>
      <aside className="fixed top-0 left-0">
        <SideBarIndex />
      </aside>
      <div>
        <nav className="fixed top-0 right-0">
          <NavbarIndex />
        </nav>
        <main className="h-full">{children}</main>
      </div>
    </>
  );
}
