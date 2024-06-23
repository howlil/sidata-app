import React, { useState, useEffect } from "react";
import Layout from "@/components/other/layout";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import accIdeTa from "@/apis/dosen/TA/accIdeTa";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import { getDataFromToken } from "@/utils/getDataToken";
import StatusTA from "@/components/ui/StatusTA";
<<<<<<< HEAD
import accJudul from "@/apis/dosen/TA/accJudul";
=======
>>>>>>> origin/faizz

export default function DospemKelolaTA() {
  const { id } = useParams();
  const [taDetail, setTaDetail] = useState(null);
  const [error, setError] = useState(null);
  const [statusAcc, setStatusAcc] = useState("");
  const [idDosPem, setIdDosPem] = useState(null);
  const navigate = useNavigate();
  const dosenId = getDataFromToken()?.userId;
<<<<<<< HEAD
  const [status, setStatus] = useState({ status: "", statusTA: "" });
  const judul = status.status === "diproses" && status.statusTA === "ide";
  const ide = status.status === "diproses" && status.statusTA === "belumAda";
=======
>>>>>>> origin/faizz

  useEffect(() => {
    const fetchTADetail = async () => {
      try {
        const response = await getTAdetailByIdMahasiswa(id);
<<<<<<< HEAD
        if (response.success) {
          setStatus({
            status: response.data.status,
            statusTA: response.data.statusTA,
          });
        }
=======
>>>>>>> origin/faizz
        response.data.DosenPembimbingTA.find((id) => {
          if (id.DosenPembimbing.Dosen.idDosen === dosenId) {
            setIdDosPem(id.dosenPembimbingID);
          }
        });
        if (response.success) {
          setTaDetail(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil detail TA");
        console.error("Fetch error:", err);
      }
    };

    fetchTADetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const idTA = taDetail.idTA;
    const isApproved = statusAcc === "disetujui" ? true : false;
    const id = idDosPem;
    try {
<<<<<<< HEAD
      if (judul) {
        const response = await accJudul(idTA, isApproved, id);
=======
      const response = await accIdeTa(idTA, isApproved, id);
      console.log(response);
>>>>>>> origin/faizz
        if (response.success) {
          setTaDetail({
            ...taDetail,
            statusTA: response.data.statusTA,
            status: response.data.status,
          });
<<<<<<< HEAD
          navigate("/dosen/kelolaTaMahasiswa");
        } else {
          setError(response.message);
        }
      }
      if (ide) {
        const response = await accIdeTa(idTA, isApproved, id);
        if (response.success) {
          setTaDetail({
            ...taDetail,
            statusTA: response.data.statusTA,
            status: response.data.status,
          });
          navigate("/dosen/kelolaTaMahasiswa");
        } else {
          setError(response.message);
        }
      }
=======
        } else {
          setError(response.message);
        }
>>>>>>> origin/faizz
    } catch (err) {
      setError("Terjadi kesalahan saat mengubah status TA");
      console.error("Update error:", err);
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="text-red-500">{error}</div>
      </Layout>
    );
  }

  if (!taDetail) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-6">Detail Tugas Akhir Mahasiswa</h1>
      <div className="space-y-4">
        <Input
          label="Nama Mahasiswa"
          value={taDetail.Mahasiswa.nama}
          readOnly
        />
<<<<<<< HEAD

=======
>>>>>>> origin/faizz
        <Input label="NIM" value={taDetail.Mahasiswa.nim} readOnly />
        <Input label="Bidang" value={taDetail.Bidang.namaBidang} readOnly />
        <TextArea label="Ide Tugas Akhir" value={taDetail.ideTA} readOnly />
        <TextArea
          label="Deskripsi Ide"
          value={taDetail.deskripsiIde}
          readOnly
        />

        {taDetail.judulTA && (
          <TextArea
            label="Judul Tugas Akhir"
            value={taDetail.judulTA}
            readOnly
          />
        )}
        <div className="space-y-3">
          {taDetail.DosenPembimbingTA.map((pembimbing) => (
            <Input
              key={pembimbing.dosenPembimbingID}
              label={`Pembimbing ${pembimbing.DosenPembimbing.tipePembimbing} `}
              value={pembimbing.DosenPembimbing.Dosen.nama}
              readOnly
            />
          ))}
        </div>
        <StatusTA label={taDetail.statusTA} variant={taDetail.statusTA} />
        <form onSubmit={handleSubmit}>
          <Select
            label="Status"
            value={statusAcc}
            onChange={(e) => setStatusAcc(e.target.value)}
            options={[
              { value: "disetujui", label: "Disetujui" },
              { value: "ditolak", label: "Ditolak" },
            ]}
          />
          <div className="flex justify-end">
<<<<<<< HEAD
            <Button custom="mt-8">Simpan</Button>
=======
            <Button custom="mt-8" >
              Simpan
            </Button>
>>>>>>> origin/faizz
          </div>
        </form>
      </div>
    </Layout>
  );
}
