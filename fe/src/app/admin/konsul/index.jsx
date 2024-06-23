import Layout from "@/components/other/layout";
import Tables from "@/components/ui/Table";
import getAllJadwalKonsul from "@/apis/admin/konsultasi/getAllJadwalKonsul";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListKonsul() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    getAllJadwalKonsul().then((res) => {
      const formattedData = res.data.map((item) => ({
        ...item,
        tanggal: new Intl.DateTimeFormat('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date(item.tanggal)),
      }));
      setData(formattedData);
    });
  }, []);

  const handleEdit= (row) => {
    if(row.id){
      navigate(`/admin/listMhsKonsul/${row.id}`);
    }
  }

  

  return (
    <Layout>
       <h1 className="font-bold text-2xl mb-8 ">Daftar Mahasiswa Konsultasi</h1>
      <Tables 
      data={data}
      del="hidden"
      show="hidden"
      down="hidden"
      onEdit={(row)=>handleEdit(row)}
      columns={
        [
          {
            header: "Nama",
            accessor: "Mahasiswa.nama",
          },
          {
            header: "Nim",
            accessor: "Mahasiswa.nim",
          },
          {
            header: "Tanggal",
            accessor: "tanggal",
          },

          {
            header: "Status",
            accessor: "status",
          },

        ]
      }
      />
    </Layout>    
  );
}
