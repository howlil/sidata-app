import Layout from "@/components/other/layout";
import Tables from "@/components/ui/Table";
import { useEffect, useState } from "react";
import getAllDaftarTA from "@/apis/admin/ta/getAllDaftarTA";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";

export default function ListTA() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllDaftarTA();
      const daftarTAData = res.data;

      const updatedDataPromises = daftarTAData?.map(async (item) => {
        const res = await getTAdetailByIdMahasiswa(item.idMahasiswa);
        return {
          ...item,
          nama: res.data.Mahasiswa.nama,
          nim: res.data.Mahasiswa.nim,
          bidang: res.data.Bidang.namaBidang,
        };
      });

      const updatedData = await Promise.all(updatedDataPromises);
      setData(updatedData);
    };

    fetchData();
  }, []);

  const handleEdit = (row) => {
    if (row.status === "diproses") {
      window.location.href = `/admin/listPendaftarTA/${row.daftarTAId}`;
    }
  }

  return (
    <Layout>
      <section className="flex justify-between mb-8 items-center">
        <h1 className="font-bold text-2xl">List Pendaftar TA</h1>
      </section>
      <section>
        <Tables
          data={data}
          del="hidden"
          show="hidden"
          down="hidden"
          onEdit={(row) => handleEdit(row)}
          columns={[
            {
              header: "Nama",
              accessor: "nama",
            },
            {
              header: "NIM",
              accessor: "nim",
            },
            {
              header: "Bidang",
              accessor: "bidang",
            },
            {
              header: "Status",
              accessor: "status",
            },
          ]}
        />
      </section>
    </Layout>
  );
}
