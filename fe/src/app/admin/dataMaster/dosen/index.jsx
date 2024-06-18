import React, { useState, useEffect } from 'react'; 
import Layout from "@/components/other/layout";
import Button from '@/components/ui/Button';
import Tables from '@/components/ui/Table';
import { useNavigate } from 'react-router-dom';
import getAllAkunDosen from '@/apis/admin/datamaster/dosen/getAllAkunDosen';

export default function DataDosen() {
  const navigate = useNavigate();
  const [dosenList, setDosenList] = useState([]); 

  useEffect(() => { 
    const fetchDosen = async () => {
      const result = await getAllAkunDosen();
      console.log(result)
      if (result) {
        setDosenList(result.data); 
      }
    };
    fetchDosen();
  }, []);

  const columns = [
    { header: "Nama", accessor: "nama" },
    { header: "NIP", accessor: "nip" },
    { header: "Email", accessor: "email" },
  ];
  const handleEdit = (id) => {
    navigate(`/admin/data/dataDosen/editAkun/${id.idDosen}`); 
  };
  return (
    <Layout>
      <section className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Daftar Dosen</h1>
        <Button onClick={() => navigate('/admin/data/dataDosen/tambahAkun')}>Tambah Data</Button>
      </section>
      <section className="mt-8">
      <Tables columns={columns} data={dosenList} del="hidden" onEdit={(row) => handleEdit(row)} />
      </section>
    </Layout>
  );
}