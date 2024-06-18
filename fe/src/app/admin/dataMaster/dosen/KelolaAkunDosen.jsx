import Layout from "@/components/other/layout";
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import InputCheck from '@/components/ui/InputCheck'
import Select from '@/components/ui/Select'

export default function KelolaAkunDosen() {
  return (
    <Layout>
      <h1 className="font-bold text-2xl mb-8">Tambah Data Dosen</h1>
      <form className=" space-y-4">
      <Input label="Nama Lengkap" />
      <Input label="NIP" />
      <Input label="Email " />
      <Input label="Password" />
      <Select label="Jabatan"  />
      <InputCheck label="Bidang"  />
      <div className="flex justify-end ">
        <Button custom="mt-8">Tambah Data</Button>
      </div>
      </form>
    </Layout>
  )
}
