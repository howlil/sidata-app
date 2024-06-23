import Layout from "@/components/other/layout"
import CardDashboard from "@/components/ui/CardDashboard"
import { useEffect,useState } from "react"
import { getDataFromToken } from "@/utils/getDataToken"
import getMahasiswaBimbinganByDosen from "@/apis/dosen/bimbinganTA/getMahasiswaBimbinganByDosen"

export default function Dashboard() {
  const [jumlahMahasiswa, setJumlahMahasiswa] = useState(0)
  const id = getDataFromToken().userId

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMahasiswaBimbinganByDosen(id)
        setJumlahMahasiswa(response.jumlah)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  },[])
  return (
    <Layout>
      <CardDashboard name="Jumlah Mahasiswa Bimbingan" icon="UsersRound" data={jumlahMahasiswa} />
    </Layout>
  )
}
