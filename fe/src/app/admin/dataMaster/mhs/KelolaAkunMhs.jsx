import Layout from "@/components/other/layout";
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'


export default function KelolaAkunMhs() {
  return (
    <Layout>
     <h1 className="font-bold text-2xl mb-8">Tambah Data Mahasiswa</h1>
      <form className=" space-y-4">
      <Input label="Nama Lengkap" />
      <Input label="NIM" />
      <Input label="Email " />
      <Input label="Password" />
      <Input label="Alamat" />
      <div className="flex justify-end ">
        <Button custom="mt-8">Tambah Data</Button>
      </div>
      </form>
    </Layout>
  )
}
