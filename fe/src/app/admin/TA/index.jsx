import Layout from "@/components/other/layout";
import Tables from '@/components/ui/Table'

export default function ListTA() {
  const columns = [
    {
      Header: "No",
      accessor: "no",
    },
    {
      Header: "Nama",
      accessor: "nama",
    },
    {
      Header: "NIDN",
      accessor: "nidn",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ]
  return (
    <Layout>
      <section className="flex justify-between mb-8 items-center">
        <h1 className="font-bold text-2xl ">List Pendaftar TA  </h1>
      </section>
      <section>
        <Tables columns={columns} />
      </section>
    </Layout>
  );
}
