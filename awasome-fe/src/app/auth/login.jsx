import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <form className="flex flex-col gap-4">
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
        belum memiliki akun?
        <Link to={"/register"} className="text-ijau-100 ml-1 underline">
          daftar disini
        </Link>
      </p>
      <Button variant="default">Login</Button>
    </form>
  );
}
