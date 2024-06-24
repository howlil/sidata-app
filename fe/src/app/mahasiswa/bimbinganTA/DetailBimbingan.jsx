import Layout from "@/components/other/layout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import getJadwalBimbinganById from "@/apis/dosen/bimbinganTA/getJadwalBimbinganById";
import TextArea from "@/components/ui/TextArea";

export default function DetailBimbingan() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getJadwalBimbinganById(id);
      if (result.success) {
        setData(result?.data);
      } else {
        console.error("Gagal mengambil data jadwal bimbingan");
      }
    }
    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const time = new Date(timeString);
    return time.toLocaleTimeString();
  };

  return (
    <Layout>
      <section>
        <h1 className="font-bold text-2xl">Detail Bimbingan</h1>
        <div className="mt-8 space-y-3">
          <TextArea label="Progres TA" value={data?.progresTA} readOnly />
          <TextArea label="Kendala" value={data?.kendala} readOnly />
          <Input label="Dosen" value={data?.DosenPembimbing?.Dosen?.nama} readOnly />
          <Input label="Tanggal" value={formatDate(data?.tanggal)} readOnly />
          <Input label="Jam Mulai" value={formatTime(data?.waktuMulai)} readOnly />
          <Input label="Jam Selesai" value={formatTime(data?.waktuSelesai)} readOnly />
          <Input label="Status" value={data?.status} readOnly />
        </div>
      </section>
    </Layout>
  );
}
