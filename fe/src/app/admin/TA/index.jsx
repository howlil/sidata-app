import Layout from "@/components/other/layout";
import Tables from '@/components/ui/Table'

export default function ListTA() {
  const columns = [

    {
      header: "Nama",
      accessor: "nama",
    },
    {
      header: "NIM",
      accessor: "nidn",
    },
    {
      header: "Bidang",
      accessor: "nidn",
    },
    {
      header: "Status",
      accessor: "nidn",
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
