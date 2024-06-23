import Layout from "@/components/other/layout"
import Button from "@/components/ui/Button"
import Tables from "@/components/ui/Table"
import getJadwalBimbinganByMahasiswa from "@/apis/mhs/bimbingan/getJadwalBimbinganByMahasiswa"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getDataFromToken } from "@/utils/getDataToken"


export default function BimbingaTA() {
  const id = getDataFromToken()?.userId
  const [data, setData] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    getJadwalBimbinganByMahasiswa(id).then((res) => {
      const formattedData = res.data?.map(item => ({
        ...item,
        tanggal: item.tanggal.split('T')[0] 
      }));
      setData(formattedData);
    })
  }, [])

  return (
    <Layout>
      <section className="flex justify-between items-center">
      <h1 className="font-bold text-2xl ">Bimbingan TA</h1>
      <Button onClick={() => navigate("/mhs/bimbinganTA/ajukan")}>Ajukan Bimbingan</Button>      </section>
    <section className="mt-8">
        <Tables   
        data={data}   
        del="hidden"
        edit="hidden"
        down="hidden"
        columns={
          [
            {
              header: "Progres TA",
              accessor: "progresTA",
            },
          {
              header: "Kendala",
              accessor: "kendala",
            },
            {
              header: "Dosen",
              accessor: "DosenPembimbing.Dosen.nama",
            },
            {
              header: "Tanggal",
            accessor: "tanggal",
            },
            {
              header: "Status",
              accessor: "status",
            },
          ]
        }
        />
      </section>
    </Layout>
  )
}
