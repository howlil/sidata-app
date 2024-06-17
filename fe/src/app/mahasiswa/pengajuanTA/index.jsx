import Layout from "@/components/other/layout";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import InputCheck from "@/components/ui/InputCheck";

export default function PengajuanTA() {
  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-6">Pengajuan Ide</h1>
      <form className="space-y-4">
        <div>
          <TextArea label="Ide Tugas Akhir" placeholder="Ide Tugas Akhir" />
          <p className="text-sm mt-2 text-neutral-500">Belum memiliki ide TA ? <Link className="font-semibold text-ijau-300" to={"/ajukanJadwalKonsultasi"}>Disini</Link></p>
        </div>
        <TextArea label="Deskripsi Judul" placeholder="Deskripsi Judul" />
        <Select label="Dosen Pembimbing" />
        <InputCheck item="aul" />
        <div className="flex justify-end">
          <Button>Ajukan Ide</Button>
        </div>
      </form>
    </Layout>
  );
}
