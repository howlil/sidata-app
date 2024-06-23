import Layout from "@/components/other/layout";
import TextArea from "@/components/ui/TextArea";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import updateStatusKonsultasi from "@/apis/admin/konsultasi/updateStatusKonsultasi";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getDetailPengajuanJadwalKonsultasi from "@/apis/admin/konsultasi/getDetailPengajuanJadwalKonsultasi";

const isValidDate = (date) => !isNaN(new Date(date).getTime());

const formatDate = (dateString) => {
  if (!isValidDate(dateString)) return "Invalid Date";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

const formatTime = (timeString) => {
  if (!isValidDate(timeString)) return "Invalid Time";
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function DetailKonsulMhs() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isSuccess: true,
  });

  useEffect(() => {
    getDetailPengajuanJadwalKonsultasi(id).then((res) => {
      setData(res.data);
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStatusKonsultasi(status,id).then((res) => {
      if (res.success) {
        setToast({
          message: res.message,
          isVisible: true,
          isSuccess: true,
        });
        setTimeout(() => {
          navigate("/admin/listMhsKonsul");
        }, 1000);
      } else {
        setToast({
          message: res.message,
          isVisible: true,
          isSuccess: false,
        });
      }
    }).catch((error) => {
      setToast({
        message: error.message ,
        isVisible: true,
        isSuccess: false,
      });
    });
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
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Detail Konsultasi</h1>
        <section className="space-y-3">
          <Input
            label="Nama Mahasiswa"
            value={data?.Mahasiswa?.nama || ""}
            disabled
          />
          <Input label="NIM" value={data?.Mahasiswa?.nim || ""} disabled />
          <Input label="Tanggal" value={formatDate(data?.tanggal)} disabled />
          <Input label="Waktu Mulai" value={formatTime(data?.waktuMulai)} disabled />
          <Input label="Waktu Selesai" value={formatTime(data?.waktuSelesai)} disabled />
          <TextArea label="Kendala" value={data?.kendala || ""} disabled />
        </section>

        <form onSubmit={handleSubmit}>
          <Select
            label="Status"
            value={status}
            options={[
              { value: "disetujui", label: "Disetujui" },
              { value: "ditolak", label: "Ditolak" },
            ]}
            onChange={(e) => setStatus(e.target.value)}
          />
          <div className="flex justify-end">
            <Button custom="mt-10" type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
