import React, { useEffect, useState } from 'react';
import Layout from "@/components/other/layout";
import Button from '@/components/ui/Button';
import Tables from '@/components/ui/Table';
import { useNavigate } from 'react-router-dom';
import getAllAkunMhs from '@/apis/admin/datamaster/mhs/getAllAkunMhs';

export default function DataMhs() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    async function fetchData() {
        try {
            const result = await getAllAkunMhs();
            setData(result.data);
            console.log(result.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    useEffect(() => {
        fetchData();
    }, []);
    const handleEdit = (id) => {
        console.log(id)
        navigate(`/admin/data/dataMhs/editAkun/${id.idMahasiswa}`);
    };

    const columns = [

        {
            header: "Nama",
            accessor: "nama",
        },
        {
            header: "NIM",
            accessor: "nim", 
        },
        {
            header: "Email",
            accessor: "email", 
        },

    ];

    return (
        <Layout>
            <section className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">Daftar Mahasiswa</h1>
                <Button onClick={() => navigate('/admin/data/dataMhs/tambahAkun')}>Tambah Data</Button>
            </section>
            <section className="mt-8">
                <Tables columns={columns} data={data} del="hidden" onEdit={(row)=>handleEdit(row)} />
            </section>
        </Layout>
    );
}
