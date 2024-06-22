import Layout from "@/components/other/layout";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import InputFile from "@/components/ui/InputFIle";
import Input from "@/components/ui/Input";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import Toast from "@/components/ui/Toast";
import { getDataFromToken } from "@/utils/getDataToken";
import { useEffect, useState } from "react";

export default function PendaftaranTA() {
  const id = getDataFromToken()?.userId;
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ status: "", statusTA: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTAdetailByIdMahasiswa(id);
        if (response.success) {
          setData(response.data);
          setStatus({
            status: response.data.status,
            statusTA: response.data.statusTA,
          });
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [id]);

  const eligible = status.status === "disetujui" && status.statusTA === "judul";

  if (!eligible) {
    return (
      <Layout>
         <p>pstika mengajukan judul</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-3 mb-4" >
        <h1 className="font-bold text-2xl mb-8 ">Pendaftaran TA</h1>
        <TextArea label="Ide Tugas Akhir" value={data?.ideTA} readOnly />
        <TextArea label="Deskripsi Ide" value={data?.deskripsiIde} readOnly />
        <TextArea label="Ide Tugas Akhir" value={data?.judulTA} readOnly />
        <Input label="Bidang" value={data?.Bidang.namaBidang} readOnly />
      </div>

      <form className="space-y-4">
        <InputFile label="Transkrip Nilai" placeholder="Transkrip.pdf" />
        <InputFile
          label="Bukti Lulus Matakuliah Bahasa Indosia dan Seminal Proposal"
          placeholder="Bukti.pdf"
        />
        <InputFile
          label="Bukti KRS mengambil matkul  Tugas AKhir"
          placeholder="KRS.pdf"
        />
        <InputFile
          label="Surat Tugas Penunujukan dosen pembimbing Tugas Akhir"
          placeholder="surat_tugas.pdf"
        />
        <InputFile
          label="Surat Izin perkuliahan"
          placeholder="surat_izin.pdf"
        />
        <InputFile
          label="Bukti Mengambil KP dan Matkul Pilihan"
          placeholder="buktikKP.pdf"
        />

        <div className="flex justify-end">
          <Button custom="mt-8">Daftar TA</Button>
        </div>
      </form>
    </Layout>
  );
}
