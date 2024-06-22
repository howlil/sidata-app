import Tables from "@/components/ui/Table";
import { useEffect, useState } from "react";
import getriwayatKonsultasiByMhs from "@/apis/mhs/konsutasi/getriwayatKonsultasiByMhs";
import { getDataFromToken } from "@/utils/getDataToken";

export default function RiwayatKonsul() {
    const [data, setData] = useState([]);
    const id = getDataFromToken()?.userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getriwayatKonsultasiByMhs(id);
                const formattedData = response.data.map(item => ({
                    ...item,
                    tanggal: item.tanggal.split('T')[0], 
                }));
                setData(formattedData); 
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    return (
        <>
            <h1 className="font-medium mb-4 text-2xl">Riwayat Konsultasi Prodi</h1>
            <Tables
                data={data} 
                del="hidden" 
                down={"hidden"}
                edit="hidden"
                columns={[
                    {
                        header: "Kendala",
                        accessor: "kendala",
                    },
                    {
                        header: "Tanggal",
                        accessor: "tanggal",
                    },
                    {
                        header: "Status",
                        accessor: "status",
                    },
                ]}
            />
        </>
    );
}