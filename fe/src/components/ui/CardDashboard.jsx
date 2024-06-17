import Icon from "./Icon";
export default function CardDashboard({icon,name,data}) {
  return (
    <section className="flex w-full shadow bg-white rounded-md p-4 gap-4">
      <Icon name={icon} size={48} color="#0EA9C5" />
      <figcaption className="">
        <h1 className="font-semibold text-xl ">{name}</h1>
        <p className="font-medium">{data}</p>
      </figcaption>
    </section>
  );
}