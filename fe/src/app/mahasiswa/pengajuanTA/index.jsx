import Layout from "@/components/other/layout";
import PengajuanIde from "./PengajuanIde";
import { useState, useEffect } from "react";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import { getDataFromToken } from "@/utils/getDataToken";
import EditPengajuanIde from "./EditPengajuanIde";
import PengajuanJudul from "./PengajuanJudul";
import EditPengajuanJudul from "./EditPengajuanJudul";
import Riwayat from "./Riwayat";
import Notif from "@/components/ui/Notif";

export default function PengajuanTA() {
  const id = getDataFromToken()?.userId;
  const [status, setStatus] = useState({ status: "", statusTA: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getTAdetailByIdMahasiswa(id);
      if (response?.success) {
        setStatus({
          status: response?.data.status,
          statusTA: response?.data.statusTA,
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
    <Layout>
      {loading && <p>Loading...</p>}
      { baguLogin && <PengajuanIde />}

      {pengajuanIde &&  <Notif text="Pengajuan Tugas Akhir  Anda sedang di periksa" />}

      {dosenNotAcc &&  <EditPengajuanIde />}

      {dosenAcc &&  <PengajuanJudul />}

      {ajuinJudul  &&   <Notif text="Pengajuan Tugas Akhir  Anda sedang di periksa" />}

      {dosenTolak &&  <EditPengajuanJudul />}

      {dosenTerima &&  <Notif text="Judul Anda di terima untuk tahap selanjutnya" />}

      {TAditerima &&  <Notif text="Selamat pendaftaran anda berhasil dan lanjut ke tahap selenjutanya" />}
      
      {TAditolak &&  <Notif text="Judul Anda di tolak, silahkan ajukan judul yang lain" />}

    </Layout>
  );
}
