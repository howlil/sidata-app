import Layout from "@/components/other/layout";
import Tables from "@/components/ui/Table";
import generateDoc from "@/apis/mhs/doc/generateDoc";
import { useEffect, useState } from "react";
import { getDataFromToken } from "@/utils/getDataToken";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";

export default function Dokumen() {
  const id = getDataFromToken()?.userId;
  const [data, setData] = useState(null);
  const [idTA, setTa] = useState(null);

  const fetchData = async () => {
    try {
      if (idTA) {
        const response = await generateDoc(idTA);
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setData(url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTa = async () => {
    try {
      const response = await getTAdetailByIdMahasiswa(id);
      setTa(response.data?.idTA);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTa();
  }, []);

  useEffect(() => {
    fetchData();
  }, [idTA]);

  const handleDownload = () => {
    if (data) {
      const link = document.createElement('a');
      link.href = data;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const columns = [
    {
      header: "Nama Dokumen",
      accessor: "no",
    },
  ];

  return (
    <Layout>
      <h1 className="font-bold text-2xl">Dokumen Keperluan TA</h1>
      <section className="mt-8">
        <Tables columns={columns} data={[]} />
        {data && (
          <div>
            <iframe
              src={data}
              width="100%"
              height="600px"
              title="Dokumen Keperluan TA"
            />
            <button onClick={handleDownload} className="mt-4 p-2 bg-blue-500 text-white rounded">
              Download PDF
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
}
