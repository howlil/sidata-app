// const auth = require("./auth/authRoute");
// const profile = require("./auth/profileRoute")
// const tugasAkhir = require("./tugasAkhir/tugasAkhirRoute")
// const bimbinganTa = require("./tugasAkhir/bimbinganTaRoute")
// const konsultasiKaprodi = require("./tugasAkhir/konsultasiTARoute")
// const bidang = require("./dosen/BidangDosenRoute")
// const jabatan = require("./dosen/JabatanRoute")
// const vectorize=require("./mhs/vectoreRoute")

// const server = {};
// server.auth = auth;
// server.profile = profile;
// server.tugasAkhir = tugasAkhir;
// server.bimbinganTa = bimbinganTa;
// server.konsultasiKaprodi = konsultasiKaprodi;
// server.bidang = bidang;
// server.vectorize=vectorize
// server.jabatan = jabatan;



// module.exports = server;
import auth from "./auth/authRoute.js";
import profile from "./auth/profileRoute.js";
import tugasAkhir from "./tugasAkhir/tugasAkhirRoute.js";
import bimbinganTa from "./tugasAkhir/bimbinganTaRoute.js";
import konsultasiKaprodi from "./tugasAkhir/konsultasiTARoute.js";
import bidang from "./dosen/BidangDosenRoute.js";
import jabatan from "./dosen/JabatanRoute.js";
import vectorize from "./mhs/vectoreRoute.js";

const server = {
  auth,
  profile,
  tugasAkhir,
  bimbinganTa,
  konsultasiKaprodi,
  bidang,
  vectorize,
  jabatan
};

export default server;

