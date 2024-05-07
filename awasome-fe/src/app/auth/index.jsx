import Login from "./login";
import img from "/public/ilustrasi.svg";
import Logo from "/public/logosidata.svg";
import Daftar from "./daftar";
import { useLocation } from "react-router-dom";

export default function Auth() {
  const { pathname } = useLocation();
  const isLoginPage = pathname.includes("/login");

  return (
    <div className="grid grid-cols-3 h-screen overflow-hidden">
      <div className="col-span-2 relative">
        <img
          src={img}
          alt="Ilustrasi"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="col-span-1 ml-3 px-8 shadow-left ">
        <section className="flex mt-8 flex-col gap-2 items-center">
          <img src={Logo} alt="logo"  />
          {isLoginPage ? (
            <h1 className="font-bold text-2xl text-center leading-8">
              Selamat Datang di Web Pendaftaran TA
            </h1>
          ) : (
            ""
          )}
        </section>

        <section>
          <h3 className="mt-8 font-semibold text-xl">
            {isLoginPage ? "Login Akun Sidata" : "Daftar Akun Sidata"}
          </h3>
          <hr className="w-1/6 border-b-4 border-ijau-100" />
        </section>
        <section className="mt-4">
          {isLoginPage ? <Login /> : <Daftar />}
        </section>
      </div>
    </div>
  );
}
