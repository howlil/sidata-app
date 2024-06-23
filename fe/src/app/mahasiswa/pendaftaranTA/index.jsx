import { useState, useEffect } from "react";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import { getDataFromToken } from "@/utils/getDataToken";
import EditDaftarTA from "./EditDaftarTA";
import PendaftaranTA from "./DaftarTA";

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
  return (
    <>
      {loading && <p>Loading...</p>}
      {status.statusTA === "ide" && status.status === "disetujui" && (
        <PendaftaranTA />
      )}
      {status.statusTA === "judul" && status.status === "ditolak" && (
        <EditDaftarTA />
      )}
      {start && start1 || start2 || start3 || start4 && (
        <p>Ajukan judul lebih dulu</p>
      )}

    </>
  );
}