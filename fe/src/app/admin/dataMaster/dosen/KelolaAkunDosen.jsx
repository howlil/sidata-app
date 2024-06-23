import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/other/layout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import InputCheckList from "@/components/ui/InputCheckList";
import Select from "@/components/ui/Select";
import Toast from "@/components/ui/Toast";
import addAkunDosen from "@/apis/admin/datamaster/dosen/addAkunDosen";
import editAkunDosen from "@/apis/admin/datamaster/dosen/editAkunDosen";
import getAkunDosenById from "@/apis/admin/datamaster/dosen/getAkunDosenbyId";
import getAllBidang from "@/apis/dosen/bidang/getAllBidang";
import getAllJabatan from "@/apis/dosen/jabatan/getAllJabatan";

export default function KelolaAkunDosen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jabatanId, setJabatanId] = useState("");
  const [bidangDosen, setBidangDosen] = useState([]);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [bidangOptions, setBidangOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchAkunDosen = async () => {
        try {
          const response = await getAkunDosenById(id);
          if (response.success) {
            const { nama, nip, email,password, jabatanId, BidangDosen } = response.data;
            setNama(nama);
            setNip(nip);
            setEmail(email);
            setPassword(password);
            setJabatanId(jabatanId);
            setBidangDosen(BidangDosen?.map((bidang) => bidang.bidangId) || []);
          } else {
            setError(response.message);
          }
        } catch (error) {
          setError("Terjadi kesalahan saat mengambil data dosen");
          console.error("Fetch error:", error);
        }
      };
      fetchAkunDosen();
    }

    const fetchJabatanOptions = async () => {
      try {
        const response = await getAllJabatan();
        if (response.success) {
          setJabatanOptions(
            response.data?.map((jabatan) => ({
              value: jabatan.jabatanId,
              label: jabatan.namaJabatan,
            }))
          );
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("Terjadi kesalahan saat mengambil data jabatan");
        console.error("Fetch error:", error);
      }
    };

    const fetchBidangOptions = async () => {
      try {
        const response = await getAllBidang();
        if (response.success) {
          setBidangOptions(
            response.data?.map((bidang) => ({
              value: bidang.bidangId,
              name: bidang.namaBidang,
            }))
          );
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("Terjadi kesalahan saat mengambil data bidang");
        console.error("Fetch error:", error);
      }
    };

    fetchJabatanOptions();
    fetchBidangOptions();
  }, [id]);
  const handleSelectBidang = (selectedBidang) => {
    setBidangDosen((prev) => {
      if (prev.includes(selectedBidang.value)) {
        return prev.filter((bidang) => bidang !== selectedBidang.value);
      } else {
        return [...prev, selectedBidang.value];
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {

      let response;
      if (isEditing) {
        response = await editAkunDosen(
          nama,
          nip,
          email,
          password,
          jabatanId,
          bidangDosen,
          id
        );
      } else {
        response = await addAkunDosen(
          nama,
          nip,
          email,
          password,
          jabatanId,
          bidangDosen
        );
      }

      if (response.success) {
        setSuccess("Data dosen berhasil disimpan!");
        setTimeout(() => {
          navigate("/admin/data/dataDosen");
        }, 1000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Gagal menyimpan data dosen. Silakan coba lagi.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-8">
        {isEditing ? "Edit" : "Tambah"} Data Dosen
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Nama Lengkap"
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <Input
          label="NIP"
          type="text"
          value={nip}
          onChange={(e) => setNip(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
          <Input
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        <Select
          label="Jabatan"
          options={jabatanOptions}
          value={jabatanId}
          onChange={(e) => setJabatanId(e.target.value)}
        />
        <InputCheckList
          label="Bidang"
          items={bidangOptions}
          selectedItems={bidangDosen}
          onSelect={handleSelectBidang}
        />
        <div className="flex justify-end">
          <Button custom="mt-8" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </div>
      </form>
      {error && (
        <Toast
          message={error}
          isVisible={!!error}
          onClose={() => setError(null)}
          isSuccess={false}
        />
      )}
      {success && (
        <Toast
          message={success}
          isVisible={!!success}
          onClose={() => setSuccess(null)}
          isSuccess={true}
        />
      )}
    </Layout>
  );
}
