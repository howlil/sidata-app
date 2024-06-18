import React, { useEffect, useState } from 'react';
import Layout from "@/components/other/layout";
import Button from '@/components/ui/Button';
import Tables from '@/components/ui/Table';
import { useNavigate } from 'react-router-dom';
import getAllAkunMhs from '@/apis/admin/datamaster/mhs/getAllAkunMhs';

export default function DataMhs() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getAllAkunMhs();
                setData(result.data);
                console.log(result)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const columns = [
        {
            Header: "No",
            accessor: "no",
        },
        {
            Header: "Nama",
            accessor: "nama",
        },
        {
            Header: "NIM",
            accessor: "nim", 
        },
        {
            Header: "Action",
            accessor: "action",
        },
    ];

    return (
        <Layout>
            <section className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">Daftar Mahasiswa</h1>
                <Button onClick={() => navigate('/admin/data/dataMhs/tambahAkun')}>Tambah Data</Button>
            </section>
            <section className="mt-8">
                <Tables columns={columns} data={data} />
            </section>
        </Layout>
    );
}
