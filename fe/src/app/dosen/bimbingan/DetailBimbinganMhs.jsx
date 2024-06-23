import Layout from "@/components/other/layout";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Toast from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import accBimbingan from "@/apis/dosen/bimbinganTA/accBimbingan";
import getJadwalBimbinganById from "@/apis/dosen/bimbinganTA/getJadwalBimbinganById";

export default function DetailBimbinganMhs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [status, setStatus] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getJadwalBimbinganById(id);
      if (result.success) {
        setData(result.data);
        setStatus(result.data.status);
      } else {
        setToastMessage(result.message);
        setIsSuccess(false);
        setIsToastVisible(true);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await accBimbingan(status, id);
    if (result.success) {
      setToastMessage(result.message);
      setIsSuccess(true);
      setIsToastVisible(true);
      setTimeout(() => {
        navigate(-1); 
      }, 2000);
    } else {
      setToastMessage(result.message);
      setIsSuccess(false);
      setIsToastVisible(true);
    }
  };

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
        <h1 className="font-bold text-2xl mb-8">Detail Bimbingan Mahasiswa</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Nama Mahasiswa"
            value={data.Mahasiswa?.nama || ""}
            readOnly
          />
          <Input
            label="NIM"
            value={data.Mahasiswa?.nim || ""}
            readOnly
          />
          <TextArea
            label="Kendala"
            value={data.kendala || ""}
            readOnly
          />
          <TextArea
            label="Progres TA"
            value={data.progresTA || ""}
            readOnly
          />
          <Input
            type="text"
            label="Tanggal"
            value={formatDate(data.tanggal) || ""}
            readOnly
          />
          <Input
            type="text"
            label="Waktu Mulai"
            value={formatTime(data.waktuMulai) || ""}
            readOnly
          />
          <Input
            type="text"
            label="Waktu Selesai"
            value={formatTime(data.waktuSelesai) || ""}
            readOnly
          />
          <Select
            label="Status"
            value={status}
            onChange={handleStatusChange}
            options={[
              { value: "disetujui", label: "Disetujui" },
              { value: "ditolak", label: "Ditolak" },
            ]}
            required
          />
          <div className="flex justify-end">
            <Button custom="mt-8" type="submit">Update Status</Button>
          </div>
        </form>
        <Toast
          message={toastMessage}
          isVisible={isToastVisible}
          onClose={() => setIsToastVisible(false)}
          isSuccess={isSuccess}
        />
      </section>
    </Layout>
  );
}
