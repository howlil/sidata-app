import Layout from "@/components/other/layout"
import Button from "@/components/ui/Button"
import Tables from "@/components/ui/Table"
export default function BimbingaTA() {
  const columns = [
    {
      Header: "No",
      accessor: "no",
    },
    {
      Header: "Tanggal",
      accessor: "tanggal",
    },
    {
      Header: "Dosen Pembimbing",
      accessor: "dosen",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ]
  return (
    <Layout>
      <section className="flex justify-between items-center">
      <h1 className="font-bold text-2xl ">Bimbingan TA</h1>
        <Button>Ajukan Bimbingan</Button>
      </section>
      <section className="mt-8">
        <Tables 
        columns={columns}
        />
      </section>
    </Layout>
  )
}
