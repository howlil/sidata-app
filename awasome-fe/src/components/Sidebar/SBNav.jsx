import { datamhs } from "@/data/nav";
import ActiveRoute from "./ActiveRoute";

export default function SidebarNav() {
  return (
    <>
      {datamhs.map((data, i) => (
        <section  key={i}>
          <ActiveRoute href={data.href} icon={data.icon} label={data.label} />
        </section>
      ))}
    </>
  );
}
