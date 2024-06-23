import { useState, useEffect } from "react";
import Layout from "@/components/other/layout";
import TextArea from "@/components/ui/TextArea";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ajukanBimbingan from "@/apis/mhs/bimbingan/ajukanBimbingan";
import JadwalBimbingan from "./JadwalBimbingan";
import Toast from "@/components/ui/Toast";
import { getDataFromToken } from "@/utils/getDataToken";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import { useNavigate } from "react-router-dom";

export default function AjukanBimbingan() {
  const id = getDataFromToken()?.userId;
  const [data, setData] = useState([]);
  const [selectedDosPembimbing, setSelectedDosPembimbing] = useState([]);
  const [kendala, setKendala] = useState("");
  const [progresTA, setProgresTA] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTAdetailByIdMahasiswa(id).then((res) => {
      console.log(res);
      if (res.data && Array.isArray(res.data.DosenPembimbingTA)) {
        const pembimbingOptions = res.data.DosenPembimbingTA.map((item) => ({
          value: item.dosenPembimbingID,
          label: item.DosenPembimbing.Dosen.nama,
        }));
        setData(pembimbingOptions);
      } else {
        console.error("Unexpected response data format:", res.data);
      }
    }).catch((error) => {
      console.error("Error fetching TA detail:", error);
    });
  }, [id]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedDosPembimbing(value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const idMahasiswa = id;
    const result = await ajukanBimbingan(
      idMahasiswa,
      selectedDosPembimbing,
      kendala,
      progresTA,
      tanggal,
      waktuMulai,
      waktuSelesai
    );

    if (result.success) {
      setToastMessage(result.message);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/mhs/bimbinganTA");
      }, 1000);
    } else {
      setToastMessage(result.message);
      setIsSuccess(false);
    }
    setIsToastVisible(true);
  };

  return (
    <Layout>
      <section>
        <h1 className="font-bold text-2xl mb-8">Ajukan Jadwal Bimbingan TA</h1>
        <JadwalBimbingan />
      </section>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Select
          label="Dosen Pembimbing"
          value={selectedDosPembimbing}
          onChange={handleSelectChange}
          options={data}
          multiple={true}
          required
        />
        <TextArea
          label="Kendala"
          name="kendala"
          value={kendala}
          onChange={(e) => setKendala(e.target.value)}
          required
        />
        <TextArea
          label="Progres TA"
          name="progresTA"
          value={progresTA}
          onChange={(e) => setProgresTA(e.target.value)}
          required
        />
        <Input
          type="date"
          label="Tanggal"
          name="tanggal"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
        />
        <Input
          type="time"
          label="Waktu Mulai"
          name="waktuMulai"
          value={waktuMulai}
          onChange={(e) => setWaktuMulai(e.target.value)}
          required
        />
        <Input
          type="time"
          label="Waktu Selesai"
          name="waktuSelesai"
          value={waktuSelesai}
          onChange={(e) => setWaktuSelesai(e.target.value)}
          required
        />
        <div className="flex justify-end">
          <Button custom="mt-8" type="submit">Ajukan Bimbingan</Button>
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
