const auth = require("./auth/authRoute");
const profile = require("./auth/profileRoute")
const tugasAkhir = require("./mhs/tugasAkhirRoute")
const bimbinganTa = require("./mhs/bimbinganTaRoute")
const konsultasiKaprodi = require("./mhs/konsultasiKaprodiRoute")
const kelolaAkun = require("./admin/kelolaAkunRoute")
const bidang = require("./dosen/BidangDosenRoute")
const jabatan = require("./dosen/JabatanRoute")

const server = {};
server.kelolaAkun= kelolaAkun
server.auth = auth;
server.profile = profile;
server.tugasAkhir = tugasAkhir;
server.bimbinganTa = bimbinganTa;
server.konsultasiKaprodi = konsultasiKaprodi;
server.bidang = bidang;
server.jabatan = jabatan;



module.exports = server;
