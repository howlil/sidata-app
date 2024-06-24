import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import ajukanJudul from "@/apis/mhs/TA/ajukanJudul";
import Input from "@/components/ui/Input";
import { getDataFromToken } from "@/utils/getDataToken";
import { useState, useEffect } from "react";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import getBidangById from "@/apis/dosen/bidang/getBidangbyId";
import Toast from "@/components/ui/Toast";

export default function PengajuanJudul() {
  const id = getDataFromToken()?.userId;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidang, setBidang] = useState(null);
  const [judulTA, setJudul] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    isSuccess: true,
  });

  const fetchData = async () => {
    try {
      const response = await getTAdetailByIdMahasiswa(id);
      setData(response?.data);
      if (response?.success) {
        setToast({
          isVisible: true,
          message: response?.message,
          isSuccess: true,
        });
        const ids = response?.data.bidangId;
        const responseBidang = await getBidangById(ids);
        setBidang(responseBidang?.data.namaBidang);
      }
    } catch (error) {
      console.log(error);
      setToast({
        isVisible: true,
        message: "Terjadi kesalahan saat mengambil data",
        isSuccess: false,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const idTA = data.idTA;
    try {
      const result = await ajukanJudul(idTA, judulTA);
      if (result?.success) {
        setToast({
          isVisible: true,
          message: result.message,
          isSuccess: true,
        });
      } else {
        setToast({
          isVisible: true,
          message: result.message,
          isSuccess: false,
        });
      }
    } catch (error) {
      setToast({
        isVisible: true,
        message: "Terjadi kesalahan saat mengajukan judul",
        isSuccess: false,
      });
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl mb-6"> Pengajuan Judul</h1>
      <div className="space-y-3">
        <TextArea label="Ide Tugas Akhir" value={data?.ideTA} readOnly />
        <TextArea
          label="Deskripsi Tugas Akhir"
          value={data?.deskripsiIde}
          readOnly
        />
        <Input
          label="Dosen Pembimbing"
          value={data.DosenPembimbingTA?.map(
            (item) => item?.DosenPembimbing.Dosen.nama
          )}
          readOnly
        />
        <Input label="Bidang" value={bidang} readOnly />
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <TextArea
          label="Judul Tugas Akhir"
          value={judulTA}
          onChange={(e) => setJudul(e.target.value)}
        />
        <div className="flex justify-end">
          <Button custom="mt-8">Submit</Button>
        </div>
      </form>
    </>
  );
}
