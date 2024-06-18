import React, { useState, useEffect } from "react";
import Layout from "@/components/other/layout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import addAkunMhs from "@/apis/admin/datamaster/mhs/addAkunMhs";
import editAkunMhs from "@/apis/admin/datamaster/mhs/editAkunMhs";
import getAkunMhsById from "@/apis/admin/datamaster/mhs/getAkunMhsbyId";
import { useNavigate, useParams } from "react-router-dom";

export default function KelolaAkunMhs() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nim, setNim] = useState("");
  const [alamat, setAlamat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  console.log(id);
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchAkunMhs = async () => {
        try {
          const response = await getAkunMhsById(id);
          if (response.success) {
            const { nama, email, nim, alamat, password } = response.data;
            setNama(nama);
            setEmail(email);
            setNim(nim);
            setPassword(password);
            setAlamat(alamat);
          } else {
            setError(response.message);
          }
        } catch (error) {
          setError("Terjadi kesalahan saat mengambil data mahasiswa");
          console.error("Fetch error:", error);
        }
      };
      fetchAkunMhs();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (isEditing) {
        response = await editAkunMhs(nama, email, password, nim, alamat, id);
      } else {
        response = await addAkunMhs(nama, email, password, nim, alamat);
      }
      if (response.success) {
        setSuccess(
          isEditing
            ? "Data mahasiswa berhasil diperbarui!"
            : "Data mahasiswa berhasil ditambahkan!"
        );
        if (!isEditing) {
          setNama("");
          setEmail("");
          setPassword("");
          setNim("");
          setAlamat("");
        }
        navigate("/admin/data/dataMhs");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menyimpan data mahasiswa");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-8">
        {isEditing ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa"}
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Nama Lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <Input
          label="NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
        />
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
          <Input
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        <Input
          label="Alamat"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
        />
        <div className="flex justify-end">
          <Button custom="mt-8" type="submit" disabled={loading}>
            {loading
              ? isEditing
                ? "Memperbarui..."
                : "Menambahkan..."
              : isEditing
              ? "Perbarui Data"
              : "Tambah Data"}
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
