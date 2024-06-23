import Layout from "@/components/other/layout";
import CardDashboard from "@/components/ui/CardDashboard";
import getJumlahDosen from "@/apis/admin/datamaster/getJumlahDosen";
import getJumlahMahasiswa from "@/apis/admin/datamaster/getJumlahMahasiswa";
import getJumlahTAterdaftar from "@/apis/admin/datamaster/getJumlahTAterdaftar";
import { useEffect, useState } from "react";

export default function DashboardAdmin() {
  const [jumlahDosen, setJumlahDosen] = useState(0);
  const [jumlahMahasiswa, setJumlahMahasiswa] = useState(0);
  const [jumlahTA, setJumlahTA] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDosen = await getJumlahDosen();
        const responseMahasiswa = await getJumlahMahasiswa();
        const responseTA = await getJumlahTAterdaftar();
        setJumlahDosen(responseDosen.data.jumlahDosen);
        setJumlahMahasiswa(responseMahasiswa.data.jumlahMahasiswa);
        setJumlahTA(responseTA.data.jumlahTAterdaftar);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  },[])
  return (
    <Layout>
      <section className="grid gap-3   grid-cols-3">
        <CardDashboard name="Jumlah Dosen" icon="UsersRound" data={jumlahDosen} />
        <CardDashboard name="Jumlah Mahasiswa" icon="UsersRound" data={jumlahMahasiswa} />
        <CardDashboard name="Jumlah TA terdaftar" icon="BookCheck" data={jumlahTA} />
      </section>
    </Layout>
  );
}
