import Layout from "@/components/other/layout";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import daftarTA from "@/apis/mhs/TA/daftarTA";
import InputFile from "@/components/ui/InputFIle";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import { getDataFromToken } from "@/utils/getDataToken";
import Toast from "@/components/ui/Toast";
import { useEffect, useState } from "react";

export default function PendaftaranTA() {
  const id = getDataFromToken()?.userId;
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ status: "", statusTA: "" });
  const [formFiles, setFormFiles] = useState({
    transkripNilai: null,
    buktiLulus: null,
    buktiKRS: null,
    suratTugas: null,
    suratIzinKuliah: null,
    buktiKP: null,
  });
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isSuccess: true,
  });

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



 
  const handleFileChange = (name, file) => {
    setFormFiles((prevState) => ({
      ...prevState,
      [name]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await daftarTA(
        id,
        data.idTA,
        formFiles.transkripNilai,
        formFiles.buktiLulus,
        formFiles.buktiKRS,
        formFiles.suratTugas,
        formFiles.suratIzinKuliah,
        formFiles.buktiKP
      );

      if (result.success) {
        setToast({
          message: "Pendaftaran TA berhasil!",
          isVisible: true,
          isSuccess: true,
        });
      } else {
        setToast({
          message: "Pendaftaran TA gagal!",
          isVisible: true,
          isSuccess: false,
        });
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      setToast({
        message: "Terjadi kesalahan!",
        isVisible: true,
        isSuccess: false,
      });
    }
  };

  return (
    <Layout>
      {toast.isVisible && (
        <Toast
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => setToast((prevState) => ({ ...prevState, isVisible: false }))}
          isSuccess={toast.isSuccess}
        />
      )}
      <div className="space-y-3 mb-4">
        <h1 className="font-bold text-2xl mb-8">Pendaftaran TA</h1>
        <TextArea label="Ide Tugas Akhir" value={data?.ideTA} readOnly />
        <TextArea label="Deskripsi Ide" value={data?.deskripsiIde} readOnly />
        <TextArea label="Judul Tugas Akhir" value={data?.judulTA} readOnly />
        <Input label="Bidang" value={data?.Bidang.namaBidang} readOnly />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputFile
          label="Transkrip Nilai"
          placeholder="Transkrip.pdf"
          onChange={(file) => handleFileChange("transkripNilai", file)}
        />
        <InputFile
          label="Bukti Lulus Matakuliah Bahasa Indonesia dan Seminar Proposal"
          placeholder="Bukti.pdf"
          onChange={(file) => handleFileChange("buktiLulus", file)}
        />
        <InputFile
          label="Bukti KRS mengambil matkul Tugas Akhir"
          placeholder="KRS.pdf"
          onChange={(file) => handleFileChange("buktiKRS", file)}
        />
        <InputFile
          label="Surat Tugas Penunjukan dosen pembimbing Tugas Akhir"
          placeholder="surat_tugas.pdf"
          onChange={(file) => handleFileChange("suratTugas", file)}
        />
        <InputFile
          label="Surat Izin perkuliahan"
          placeholder="surat_izin.pdf"
          onChange={(file) => handleFileChange("suratIzinKuliah", file)}
        />
        <InputFile
          label="Bukti Mengambil KP dan Matkul Pilihan"
          placeholder="buktikKP.pdf"
          onChange={(file) => handleFileChange("buktiKP", file)}
        />

        <div className="flex justify-end">
          <Button custom="mt-8" type="submit">Daftar TA</Button>
        </div>
      </form>
    </Layout>
  );
}
