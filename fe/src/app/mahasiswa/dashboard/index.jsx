import Layout from "@/components/other/layout";
import CardDashboard from "@/components/ui/CardDashboard";
import { getDataFromToken } from "@/utils/getDataToken";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import { useEffect, useState } from "react";
import { Tooltip } from 'react-tooltip'
import RiwayatKonsul from "./RiwayatKonsul";
import {MessageCircleQuestion} from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function DashboardMhs() {
  const navigate = useNavigate();
  const nama = getDataFromToken()?.name;
  const kataKedua = nama.split(" ")[1]|| nama;
  const id = getDataFromToken()?.userId;
  const [status, setStatus] = useState(null);
  const [statusTA, setStatusTA] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTAdetailByIdMahasiswa(id);
        setStatus(response.data.status);
        setStatusTA(response.data.statusTA);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <section>
        <h1 className="font-semibold text-2xl text-neutral-900">Halo, {kataKedua}</h1>
        <p className="text-neutral-500">
          berikut adalah data menganai akademik kamu
        </p>
      </section>
      <section className="grid grid-cols-2 gap-4 mt-4">
        <CardDashboard
          name="Data TA"
          icon="BookType"
          status={status}
          statusTA={statusTA}
        />
        <CardDashboard
          name="Riwayat Bimbingan TA"
          icon="History"
          status={status}
          statusTA={statusTA}
        />
      </section>
        <section className="mt-12">
          <RiwayatKonsul />
      </section>
      <section onClick={()=>navigate("/mhs/ajukanJadwalKonsultasi")} id="tool" className="absolute hover:scale-105 ts bottom-10 bg-white shadow-xl rounded-full p-2 right-10">
       <MessageCircleQuestion size={32} />
      </section>
      <Tooltip anchorSelect="#tool">Konsultasi Prodi</Tooltip>
    </Layout>
  );
}
