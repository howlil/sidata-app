import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Daftar() {
  return (
    <form className="flex flex-col gap-4">
      <Input
        type="text"
        label="Nama Lengkap"
        placeholder="Inputkan Nama Lengkap"
        onChange="onchae"
      />
      <Input
        type="text"
        label="Email"
        placeholder="Inputkan Email"
        onChange="onchae"
      />
      <Input
        type="text"
        label="NIP/NIM"
        placeholder="Inputkan NIM/NIP"
        onChange="onchae"
      />
      <Input
        type="password"
        label="Kata Sandi"
        placeholder="*********"
        onChange="onchae"
      />
      <p className="text-sm text-neutral-400">
        Sudah memiliki akun?
        <Link to={"/login"} className="text-ijau-100 ml-1 underline">
          Login disini
        </Link>
      </p>
      <Button variant="default">Daftar</Button>
    </form>
  );
}
