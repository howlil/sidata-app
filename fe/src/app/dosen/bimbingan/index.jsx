import Layout from "@/components/other/layout";
import Tables from "@/components/ui/Table";
import { getDataFromToken } from "@/utils/getDataToken";
import { useEffect, useState } from "react";
import getJadwalBimbinganByDosen from "@/apis/mhs/bimbingan/getJadwalBimbinganByDosen";
import { useNavigate } from "react-router-dom";

export default function BimbingaTA() {
  const id = getDataFromToken()?.userId;
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getJadwalBimbinganByDosen(id).then((res) => {
      const formattedData = res.data.map((item) => ({
        ...item,
        tanggal: item.tanggal.split("T")[0],
        waktuMulai: formatTimeToTimeZone(item.waktuMulai, "Asia/Jakarta"),
        waktuSelesai: formatTimeToTimeZone(item.waktuSelesai, "Asia/Jakarta"),
      }));
      setData(formattedData);
    });
  }, []);

  function formatTimeToTimeZone(time, timeZone) {
    const options = {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timeZone,
        hour12: false,
    };
    return new Intl.DateTimeFormat(undefined, options).format(new Date(time));
}

  function handleEdit(id) {
    console.log(id)
    navigate(`/dosen/bimbinganMahasiswa/${id.id}`);
  }

  return (
    <Layout>
      <section className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Daftar Bimbingan TA Mahasiswa</h1>
      </section>
      <section className="mt-8">
        <Tables
          data={data}
          del="hidden"
          down="hidden"
          show={"hidden"}
          onEdit={(id) =>handleEdit(id)}  
          columns={[
            {
              header: "Progres TA",
              accessor: "progresTA",
            },
            {
              header: "Kendala",
              accessor: "kendala",
            },
            {
              header: "Tanggal",
              accessor: "tanggal",
            },
            {
              header: "Waktu Mulai",
              accessor: "waktuMulai",
            },
            {
              header: "Waktu Selesai",
              accessor: "waktuSelesai",
            },
            {
              header: "Status",
              accessor: "status",
            },
          ]}
        />
      </section>
    </Layout>
  );
}
