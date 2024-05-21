import infoProfil from "@/apis/profile/infoProfil";
import Layout from "../other/layout";
import { useState, useEffect } from "react";
export default function InfoProfile() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await infoProfil();
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="">
        <h1 className="text-2xl font-bold">Info Profil</h1>
        <div className="mt-6">
          <h1 className="text-md font-semibold">nama : {data.nama}</h1>
          <h1 className="text-md font-semibold">email : {data.email}</h1>
        </div>
      </div>
    </Layout>
  );
}
