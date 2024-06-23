import Layout from "@/components/other/layout";
import TextArea from "@/components/ui/TextArea";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import accDaftarTA from "@/apis/admin/ta/accDaftarTA";
import { useEffect, useState } from "react";
import getDetailDaftarTA from "@/apis/admin/ta/getDetailDaftarTAByMhsiswa";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailTAMhs() {
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
    getDetailDaftarTA(id).then((res) => {
      console.log(res);
      setData(res.data);
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    accDaftarTA(id, status === "disetujui").then((res) => {
      if (res.success) {
        setToast({
          message: res.message,
          isVisible: true,
          isSuccess: true,
        });
        setTimeout(() => {
          navigate("/admin/listPendaftarTA");
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
        message: error.message,
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
        <h1 className="text-2xl font-bold">Detail Pendaftaran TA</h1>
        <section className="space-y-3">
          <Input
            label="Nama Mahasiswa"
            value={data?.Mahasiswa?.nama || ""}
            disabled
          />
          <Input label="NIM" value={data?.Mahasiswa?.nim || ""} disabled />
          <TextArea label="Judul TA" value={data?.TA?.judulTA || ""} disabled />
          <Input label="Transkrip Nilai" value={data?.transkripNilai || ""} disabled />
          <Input label="Bukti Lulus" value={data?.buktiLulus || ""} disabled />
          <Input label="Bukti KRS" value={data?.buktiKRS || ""} disabled />
          <Input label="Surat Penunjukan Dospem" value={data?.suratTugas || ""} disabled />
          <Input label="Form Permohonan Izin Kuliah" value={data?.suratIzinKuliah || ""} disabled />
          <Input label="Bukti Mengambil KP" value={data?.buktiKP || ""} disabled />
          
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
