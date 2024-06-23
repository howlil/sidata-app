
import auth from "./auth/authRoute.js";
import profile from "./auth/profileRoute.js";
import tugasAkhir from "./tugasAkhir/tugasAkhirRoute.js";
import bimbinganTa from "./tugasAkhir/bimbinganTARoute.js";
import konsultasiKaprodi from "./tugasAkhir/konsultasiTARoute.js";
import bidang from "./dosen/BidangDosenRoute.js";
import jabatan from "./dosen/JabatanRoute.js";
import vectorize from "./mhs/vectoreRoute.js";
import genertePdf from "./admin/GenerateDocRoute.js";
import konsulProdi from './mhs/KonsultasiProdiRoute.js'
import dashboard from './dashboard/dashboardRoute.js'

const server = {
  auth,
  profile,
  tugasAkhir,
  bimbinganTa,
  konsultasiKaprodi,
  bidang,
  vectorize,
  konsulProdi,
  jabatan,
  dashboard,
  genertePdf,
};

export default server;

