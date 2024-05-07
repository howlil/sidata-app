import a from "/public/loga.svg";
import b from "/public/logb.svg";
import logo from "/public/logosidata.svg";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function UbahSandi() {
  return (
    <div className="bg-ijau-100 h-screen flex items-center justify-center overflow-hidden">
      <img src={a} alt="Logo A" className="absolute left-0 top-0 w-8/12" />
      <img
        src={b}
        alt="Background B"
        className="absolute w-full right-0 bottom-0"
      />
      <section className="bg-white z-50 shadow-sm rounded-md relative w-1/3 px-8 py-12">
        <section className="flex justify-center">
          <img src={logo} alt="Logo Sidata" />
        </section>
        <section className="my-3">
          <h3 className="mt-8 font-semibold text-xl">Ubah Sandi</h3>
          <hr className="w-1/6 border-b-4 border-ijau-100" />
        </section>
        <form className="flex flex-col gap-4">
          <Input type="text" label="NIM/NIP" placeholder="Masukan NIM/NIP" />
          <Input type="password" label="Password Lama" placeholder="******" />
          <Input type="password" label="Password Baru" placeholder="******" />
          <Button variant="default">Ubah Sandi</Button>
        </form>
      </section>
    </div>
  );
}
