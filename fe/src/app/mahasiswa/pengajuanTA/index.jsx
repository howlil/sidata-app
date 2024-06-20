import Layout from "@/components/other/layout";
import PengajuanIde from "./PengajuanIde";
import { useState, useEffect } from "react";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import { getDataFromToken } from "@/utils/getDataToken";
import EditPengajuanIde from "./EditPengajuanIde";
import PengajuanJudul from "./PengajuanJudul";

export default function PengajuanTA() {
  const id = getDataFromToken()?.userId;
  const [status, setStatus] = useState({ status: "", statusTA: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log(status)
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

  return (
    <Layout>
      {loading && <p>Loading...</p>}
      {status.statusTA === "belumAda" && (
        <PengajuanIde />
      )}
        
      {status.statusTA === "belumAda" && status.status === "diproses" && (
        <p>Tugas Akhir Anda sedang diproses</p>
      )}
      {status.statusTA === "belumAda" && status.status === "ditolak" && (
       <EditPengajuanIde />
      )}
      {status.statusTA === "ide" && status.status === "disetujui" || <PengajuanJudul />}


    </Layout>
  );
}