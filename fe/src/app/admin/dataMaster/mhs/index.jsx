import Layout from "@/components/other/layout";
import Button from '@/components/ui/Button'
import Tables from '@/components/ui/Table'
import {useNavigate} from 'react-router-dom'


export default function DataMhs() {
  const navigate = useNavigate()
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
      <section className="flex justify-between items-center">
        <h1 className="font-bold text-2xl ">Daftar Mahasiswa</h1>
        <Button onClick={()=>navigate('/admin/data/dataMhs/tambahAkun')}>Tambah Data</Button>
      </section>
      <section className="mt-8">
        <Tables columns={columns} />

      </section>
    </Layout>
  );
}
