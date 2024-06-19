import Layout from "@/components/other/layout"
import Tables from "@/components/ui/Table"


export default function Dokumen() {
  const columns = [
    {
      header: "Nama Dokumen",
      accessor: "no",
    },
  
  ]
  return (
    <Layout>
      <h1 className="font-bold text-2xl ">Dokumen Keperluan TA</h1>
      <section className="mt-8">
      <Tables columns={columns} />
      </section>
    </Layout>
  )
}
