import infoProfil from "@/apis/profile/infoProfil";
import Layout from "../other/layout";
import { useState, useEffect } from "react";
import Input from "../ui/Input";
import { getDataFromToken } from "@/utils/getDataToken";

export default function InfoProfile() {
  const [data, setData] = useState([]);
  const role = getDataFromToken()?.role;

  useEffect(() => {
    const fetchData = async () => {
      const result = await infoProfil();
      console.log(result);
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="">
        <h1 className="text-2xl font-bold">Info Profil</h1>
        <div >
          {role === 'dosen' ? (
            <div className="mt-6 space-y-3">
              <Input label="Nama" value={data.nama} />
              <Input label="Email" value={data.email} />
              <Input label="NIP" value={data.nip} />
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <Input label="Nama" value={data.nama} />
              <Input label="Email" value={data.email} />
              <Input label="NIM" value={data.nim} />
              <Input label="Alamat" value={data.alamat} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
