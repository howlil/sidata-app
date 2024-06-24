import { useState, useEffect } from "react";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import { getDataFromToken } from "@/utils/getDataToken";
import EditDaftarTA from "./EditDaftarTA";
import PendaftaranTA from "./DaftarTA";
import Notif from "@/components/ui/Notif";
import Layout from "@/components/other/layout";

export default function PengajuanTA() {
  const id = getDataFromToken()?.userId;
  const [status, setStatus] = useState({ status: "", statusTA: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getTAdetailByIdMahasiswa(id);
      if (response.success) {
        setStatus({
          status: response.data.status,
          statusTA: response.data.statusTA,
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const start = status.statusTA === "" && status.status === "";
  const start1 = status.statusTA === "belumAda" && status.status === "diproses";
  const start3 = status.statusTA === "belumAda" && status.status === "ditolak";
  const start2 = status.statusTA === "ide" && status.status === "diproses";
  const start4 = status.statusTA === "ide" && status.status === "ditolak";


  const baguLogin = status.statusTA === "" && status.status === "";
  const pengajuanIde = status.statusTA === "belumAda" && status.status === "diproses";
  const dosenNotAcc = status.statusTA === "belumAda" && status.status === "ditolak";
  const dosenAcc = status.statusTA === "ide" && status.status === "disetujui";
  const ajuinJudul = status.statusTA === "ide" && status.status === "diproses";
  const dosenTolak = status.statusTA === "ide" && status.status === "ditolak";
  const dosenTerima = status.statusTA === "judul" && status.status === "disetujui";
  const TAditolak = status.statusTA === "judul" && status.status === "ditolak";
  const TAditerima = status.statusTA === "proposal" && status.status === "disetujui";
  return (
    <>
      {baguLogin || pengajuanIde || dosenAcc || dosenNotAcc || ajuinJudul || dosenTolak &&(
        <Layout>
          <Notif text="selesaikan dulu proses pengajuan TA" />
        </Layout>
      )}

      {dosenTerima && <PendaftaranTA />}

      {TAditolak && <EditDaftarTA />}
      
      {TAditerima && (
        <Layout>
          <Notif text="Selamat pendaftaran anda berhasil dan lanjut ke tahap selenjutanya" />
        </Layout>
      )}
  
     
    </>
  );
}
