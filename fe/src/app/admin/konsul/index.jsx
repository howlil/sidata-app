import Layout from "@/components/other/layout";
import Tables from "@/components/ui/Table";

export default function ListKonsul() {
  return (
    <Layout>
       <h1 className="font-bold text-2xl mb-8 ">Daftar Mahasiswa Konsultasi</h1>
      <Tables 
      columns={
        [
          {
            header: "Nama",
            accessor: "nama",
          },
          {
            header: "Nim",
            accessor: "nama",
          },
          {
            header: "Tanggal",
            accessor: "nama",
          },

          {
            header: "Status",
            accessor: "judul",
          },

        ]
      }
      />
    </Layout>    
  );
}
