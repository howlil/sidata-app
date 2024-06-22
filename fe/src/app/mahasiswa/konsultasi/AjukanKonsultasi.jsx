import { useState } from "react";
import Layout from "@/components/other/layout";
import Input from "@/components/ui/Input";
import JadwalKonsul from "./JadwalKonsul";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import ajukanKonsultasi from "@/apis/mhs/konsutasi/ajukanKonsultasi";
import Toast from "@/components/ui/Toast";
import { getDataFromToken } from "@/utils/getDataToken";

export default function AjukanKonsultasi() {
  const idMahasiswa  = getDataFromToken()?.userId;
  const [kendala, setKendala] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState(""); 
  const adminId = "clxmvhd8u0000cyxm7ddwlb2d";

  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await ajukanKonsultasi(
      idMahasiswa,
      kendala,
      tanggal,
      waktuMulai,
      waktuSelesai,
      adminId
    );

  
    if (result.success) {
      setToastMessage(result.message);
      setIsSuccess(true);
    } else {
      setToastMessage(result.message);
      setIsSuccess(false);
    }
    setIsToastVisible(true);
  };

  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-8">
        Ajukan Konsultasi ke KasaAPRODI
      </h1>
      <JadwalKonsul />
      <form className="space-y-3 mt-8" onSubmit={handleSubmit}>
        <TextArea
          label="Kendala"
          placeholder="Tulis kendala..."
          value={kendala}
          onChange={(e) => setKendala(e.target.value)}
        />
        <Input
          type="date"
          label="Tanggal"
          placeholder="Pilih tanggal..."
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />
        <Input
          type="time"
          label="Jam Mulai"
          placeholder="Pilih jam mulai..."
          value={waktuMulai}
          onChange={(e) => setWaktuMulai(e.target.value)}
        />
        <Input
          type="time"
          label="Jam Selesai"
          placeholder="Pilih jam selesai..."
          value={waktuSelesai}
          onChange={(e) => setWaktuSelesai(e.target.value)}
        />
        <div className="flex justify-end">
          <Button custom="mt-8" type="submit">Submit</Button>
        </div>
        
      </form>
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        isSuccess={isSuccess}
      />

    </Layout>
  );
}

