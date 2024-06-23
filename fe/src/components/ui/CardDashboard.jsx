import Icon from "./Icon";

export default function CardDashboard({icon, name, status, statusTA,data}) {
  return (
    <section className="flex w-full shadow bg-white rounded-md p-4 gap-4">
      <Icon name={icon} size={48} color="#34D399" />
      <figcaption className="">
        <h1 className="font-semibold text-xl">{name}</h1>
        <section className="flex gap-3">
          {name === "Data TA" && (
            <>
          <p className={`font-medium py-1 px-3 rounded-full ${getStatusColor(status)}`}>{status}</p>
          <p className={`font-medium py-1 px-3 rounded-full ${getStatusTAColor(statusTA)}`}>{statusTA}</p>
            </>
          )}
          <p>{data}</p>
        </section>
      </figcaption>
    </section>
  );
}

const statusColors = {
  ditolak: "bg-red-500",
  diproses: "bg-yellow-500",
  disetujui: "bg-green-500",
};

 const statusTAColors = {
  belumAda: "bg-gray-500",
  ide: "bg-orange-500",
  judul: "bg-purple-500",
  proposal: "bg-pink-500",
};
function getStatusColor(status) {
  return statusColors[status] || "bg-gray-400"; 
}

function getStatusTAColor(statusTA) {
  return statusTAColors[statusTA] || "bg-gray-400";
}