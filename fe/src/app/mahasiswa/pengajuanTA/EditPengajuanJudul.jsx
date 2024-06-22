import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import Input from "@/components/ui/Input";
import { getDataFromToken } from "@/utils/getDataToken";
import { useState, useEffect } from "react";
import getTAdetailByIdMahasiswa from "@/apis/dosen/TA/detailTaMhs";
import getBidangById from "@/apis/dosen/bidang/getBidangbyId";
import editJudul from "@/apis/mhs/TA/editJudul";

export default function EditPengajuanJudul() {
  const id = getDataFromToken()?.userId;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidang, setBidang] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getTAdetailByIdMahasiswa(id);
      setData(response.data);
      const ids = response.data.bidangId;
      const responseBidang = await getBidangById(ids);
      setBidang(responseBidang.data.namaBidang);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <>
      <h1 className="font-bold text-2xl mb-6"> Pengajuan Judul</h1>
      <div className="space-y-3">
        <TextArea label="Ide Tugas Akhir" value={data.ideTA} readOnly />
        <TextArea label="Deskripsi Tugas Akhir" value={data.deskripsiIde} readOnly />
        <Input  label="Dosen Pembimbing" value={data.DosenPembimbingTA?.map((item) => item.DosenPembimbing.Dosen.nama)} readOnly />
        <Input  label="Bidang" value={bidang} readOnly />
      </div>

      <form className="mt-4">
        <TextArea label="Judul Tugas Akhir" />
        <div className="flex justify-end">
          <Button custom="mt-8">Submit</Button>
        </div>
      </form>
    </>
  );
}
