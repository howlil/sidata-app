const auth = require("./auth/authRoute");
const profile = require("./auth/profileRoute")
const tugasAkhir = require("./tugasAkhir/tugasAkhirRoute")
const bimbinganTa = require("./tugasAkhir/bimbinganTaRoute")
const konsultasiKaprodi = require("./tugasAkhir/konsultasiTARoute")
const bidang = require("./dosen/BidangDosenRoute")
const jabatan = require("./dosen/JabatanRoute")

const server = {};
server.auth = auth;
server.profile = profile;
server.tugasAkhir = tugasAkhir;
server.bimbinganTa = bimbinganTa;
server.konsultasiKaprodi = konsultasiKaprodi;
server.bidang = bidang;
server.jabatan = jabatan;



module.exports = server;
