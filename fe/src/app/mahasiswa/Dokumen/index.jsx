import Layout from "@/components/other/layout";
import Tables from "@/components/ui/Table";
import generateDoc from "@/apis/mhs/doc/generateDoc";
import { useEffect, useState } from "react";
import Toast from "@/components/ui/Toast";
import { getDataFromToken } from "@/utils/getDataToken";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";

export default function Dokumen() {
  const id = getDataFromToken()?.userId;
  const [data, setData] = useState(null);
  const [idTA, setTa] = useState(null);
  const [status, setStatus] = useState({ status: "", statusTA: "" });
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchData = async () => {
    try {
      if (idTA) {
        const response = await generateDoc(idTA);
        const blob = new Blob([response], { type: "application/pdf" });
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
      if (response.success) {
        setTa(response.data?.idTA);
        setStatus({
          status: response.data.status,
          statusTA: response.data.statusTA,
        });
      } else {
        console.error(response.message);
      }
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

  const eligible =
    (status.status === "disetujui" && status.statusTA === "judul") ||
    (status.status === "disetujui" && status.statusTA === "proposal")||
    (status.status === "ditolak" && status.statusTA === "judul");

  const handleDownload = () => {
    if (!eligible) {
      setToastMessage("Pastikan Anda sudah mendapatkan persetujuan judul TA");
      setIsSuccess(false);
      setIsToastVisible(true);
      return;
    }

    if (data) {
      const link = document.createElement("a");
      link.href = data;
      link.download = "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const columns = [
    {
      header: "Nama Dokumen",
      accessor: "nama_dokumen",
    },
  ];

  return (
    <Layout>
      <h1 className="font-bold text-2xl">Dokumen Keperluan TA</h1>
      <section className="mt-8">
        <Tables
          columns={columns}
          del="hidden"
          edit="hidden"
          show="hidden"
          onDown={handleDownload}
          data={[
            {
              nama_dokumen: "Persetujuan Pembimbing TA",
            },
          ]}
        />
      </section>
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        isSuccess={isSuccess}
      />
    </Layout>
  );
}
